import { useEffect, useSyncExternalStore } from "react";
import { EVENTS } from "../data/events";
import { getClient, readEnv } from "./supabaseClient";

const STORAGE_KEY = "lemonclub.spots.v1";

export interface WaitEntry {
  eventId: string;
  memberCode: string;
  joinedAt: string;
}

interface SpotState {
  /** Plazas restantes por evento (fallback = carta estática). */
  spots: Record<string, number>;
  /** Entradas de lista de espera. */
  waitlist: WaitEntry[];
}

/** Plazas por defecto tomadas de la carta (fuente de verdad inicial). */
const BASE_SPOTS: Record<string, number> = Object.fromEntries(
  EVENTS.map((e) => [e.id, e.spots])
);

let state: SpotState = { spots: { ...BASE_SPOTS }, waitlist: [] };
let hydrated = false;
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getSnapshot(): SpotState {
  return state;
}

function writeLocal(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* modo privado o cuota llena: solo memoria */
  }
}

function readLocal(): SpotState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SpotState>;
    if (parsed && typeof parsed === "object") {
      const spots =
        parsed.spots && typeof parsed.spots === "object"
          ? { ...BASE_SPOTS, ...parsed.spots }
          : { ...BASE_SPOTS };
      const waitlist = Array.isArray(parsed.waitlist) ? parsed.waitlist : [];
      return { spots, waitlist };
    }
  } catch {
    /* corrupto: se ignora */
  }
  return null;
}

/* ---------------- sincronización opcional con Supabase ---------------- */

async function pullRemote(): Promise<void> {
  if (!readEnv().enabled) return;
  const client = await getClient();
  if (!client) return;
  try {
    const { data, error } = await client.from("lemon_events").select("id,spots");
    if (error || !Array.isArray(data)) return;
    const remote: Record<string, number> = {};
    for (const row of data as Array<{ id?: unknown; spots?: unknown }>) {
      if (typeof row.id === "string" && typeof row.spots === "number") {
        remote[row.id] = Math.max(0, row.spots);
      }
    }
    if (Object.keys(remote).length > 0) {
      state = { ...state, spots: { ...state.spots, ...remote } };
      writeLocal();
      emit();
    }
    const { data: wl } = await client
      .from("lemon_reservations")
      .select("event_id,member_code,created_at")
      .eq("status", "waitlist");
    if (Array.isArray(wl)) {
      const entries: WaitEntry[] = (wl as Array<Record<string, unknown>>)
        .filter((r) => typeof r.event_id === "string" && typeof r.member_code === "string")
        .map((r) => ({
          eventId: r.event_id as string,
          memberCode: r.member_code as string,
          joinedAt: typeof r.created_at === "string" ? r.created_at : "",
        }));
      const seen = new Set(state.waitlist.map((w) => `${w.eventId}|${w.memberCode}`));
      const merged = entries.filter((e) => !seen.has(`${e.eventId}|${e.memberCode}`));
      if (merged.length > 0) {
        state = { ...state, waitlist: [...state.waitlist, ...merged] };
        writeLocal();
        emit();
      }
    }
  } catch {
    /* sin red: el estado local sigue siendo válido */
  }
}

async function pushSpots(eventId: string, spots: number): Promise<void> {
  if (!readEnv().enabled) return;
  const client = await getClient();
  if (!client) return;
  try {
    await client
      .from("lemon_events")
      .update({ spots, updated_at: new Date().toISOString() } as never)
      .eq("id", eventId);
  } catch {
    /* silencioso */
  }
}

async function pushWait(entry: WaitEntry): Promise<void> {
  if (!readEnv().enabled) return;
  const client = await getClient();
  if (!client) return;
  try {
    await client
      .from("lemon_reservations")
      .upsert(
        {
          event_id: entry.eventId,
          member_code: entry.memberCode,
          status: "waitlist",
        } as never,
        { onConflict: "event_id,member_code,status" }
      );
  } catch {
    /* silencioso */
  }
}

function ensureHydrated(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const local = readLocal();
  if (local) {
    state = local;
    emit();
  }
  if (readEnv().enabled) void pullRemote();
}

/* ---------------- API pública ---------------- */

/** Plazas restantes en vivo de un evento (hook SSR-safe). */
export function useSpots(eventId: string): number {
  useEffect(() => {
    ensureHydrated();
  }, []);
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const base = BASE_SPOTS[eventId] ?? 0;
  const v = snap.spots[eventId];
  return typeof v === "number" ? Math.max(0, v) : base;
}

/** ¿Está el código en la lista de espera de este evento? */
export function useWaitlisted(eventId: string, memberCode: string | null): boolean {
  useEffect(() => {
    ensureHydrated();
  }, []);
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  if (!memberCode) return false;
  return snap.waitlist.some(
    (w) =>
      w.eventId === eventId &&
      w.memberCode.toUpperCase() === memberCode.toUpperCase()
  );
}

/** Posición reactiva en la lista de espera (1 = cabeza). */
export function useWaitPosition(eventId: string, memberCode: string | null): number {
  useEffect(() => {
    ensureHydrated();
  }, []);
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  if (!memberCode) return 0;
  const list = snap.waitlist.filter((w) => w.eventId === eventId);
  const idx = list.findIndex(
    (w) => w.memberCode.toUpperCase() === memberCode.toUpperCase()
  );
  return idx >= 0 ? idx + 1 : 0;
}

/**
 * Descuenta 1 plaza en tiempo real (optimista, persistido en localStorage
 * y sincronizado con Supabase si hay credenciales).
 * Devuelve false si no quedan plazas (debe abrirse lista de espera).
 */
export function reserveSpot(eventId: string): boolean {
  ensureHydrated();
  const current = state.spots[eventId] ?? BASE_SPOTS[eventId] ?? 0;
  if (current <= 0) return false;
  const next = current - 1;
  state = { ...state, spots: { ...state.spots, [eventId]: next } };
  writeLocal();
  emit();
  void pushSpots(eventId, next);
  return true;
}

/** Registra en la lista de espera (idempotente por evento+código). */
export function joinWaitlist(eventId: string, memberCode: string): void {
  ensureHydrated();
  const code = memberCode.toUpperCase();
  const exists = state.waitlist.some(
    (w) => w.eventId === eventId && w.memberCode.toUpperCase() === code
  );
  if (exists) return;
  const entry: WaitEntry = {
    eventId,
    memberCode: code,
    joinedAt: new Date().toISOString(),
  };
  state = { ...state, waitlist: [entry, ...state.waitlist] };
  writeLocal();
  emit();
  void pushWait(entry);
}


