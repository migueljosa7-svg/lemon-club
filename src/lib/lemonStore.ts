import { useEffect, useSyncExternalStore } from "react";
import { getClient, readEnv } from "./supabaseClient";

export interface Attendance {
  id: string;
  eventId: string;
  title: string;
  date: string;
  coins: number;
}

export interface LemonProfile {
  id: string;
  name: string;
  memberSince: string;
  coins: number;
  attendance: Attendance[];
  memberCode: string;
}

const STORAGE_KEY = "lemonclub.profile.v1";

function randomCode(len = 8): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const buf = new Uint32Array(len);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < len; i++) buf[i] = Math.floor(Math.random() * chars.length);
  }
  return Array.from(buf, (n) => chars[n % chars.length]).join("");
}

export function newProfile(): LemonProfile {
  const code = randomCode(8);
  return {
    id: `lc-${code.toLowerCase()}`,
    name: "Limonero/a anónimo",
    memberSince: new Date().toISOString(),
    coins: 0,
    attendance: [],
    memberCode: code,
  };
}

/* ---------------- estado reactivo (sin prop-drilling) ---------------- */

let profile: LemonProfile | null = null;
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

function getSnapshot(): LemonProfile | null {
  return profile;
}

function readLocal(): LemonProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LemonProfile;
      if (parsed && typeof parsed.coins === "number" && Array.isArray(parsed.attendance)) {
        return { ...newProfile(), ...parsed };
      }
    }
  } catch {
    /* almacenamiento no disponible: perfil en memoria */
  }
  return newProfile();
}

function writeLocal(p: LemonProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* modo privado o cuota llena: se mantiene solo en memoria */
  }
}

async function pullRemote(p: LemonProfile): Promise<LemonProfile> {
  const client = await getClient();
  if (!client) return p;
  try {
    const { data, error } = await client
      .from("lemon_profiles")
      .select("id,name,coins,attendance,member_code,created_at")
      .eq("id", p.id)
      .maybeSingle();
    const row = data as {
      name?: unknown;
      coins?: unknown;
      attendance?: unknown;
      member_code?: unknown;
      created_at?: unknown;
    } | null;
    if (error || !row) return p;
    return {
      ...p,
      name: typeof row.name === "string" ? row.name : p.name,
      coins: typeof row.coins === "number" ? row.coins : p.coins,
      attendance: Array.isArray(row.attendance) ? (row.attendance as Attendance[]) : [],
      memberCode: typeof row.member_code === "string" ? row.member_code : p.memberCode,
      memberSince: typeof row.created_at === "string" ? row.created_at : p.memberSince,
    };
  } catch {
    return p;
  }
}

async function pushRemote(p: LemonProfile): Promise<void> {
  const client = await getClient();
  if (!client) return;
  try {
    const payload = {
      id: p.id,
      name: p.name,
      coins: p.coins,
      attendance: p.attendance as unknown as Record<string, unknown>[],
      member_code: p.memberCode,
    };
    await client
      .from("lemon_profiles")
      .upsert(payload as never, { onConflict: "id" });
  } catch {
    /* silencioso: el local sigue siendo la fuente de verdad */
  }
}

function ensureHydrated(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const local = readLocal();
  profile = local;
  emit();
  if (readEnv().enabled) {
    void pullRemote(local).then((remote) => {
      profile = remote;
      writeLocal(remote);
      emit();
    });
  }
}

function setProfile(next: LemonProfile): void {
  profile = next;
  writeLocal(next);
  emit();
  if (readEnv().enabled) void pushRemote(next);
}

/* ---------------- API pública ---------------- */

/** Hook SSR-safe con el perfil reactivo (una única suscripción por componente). */
export function useLemonProfile(): LemonProfile | null {
  useEffect(() => {
    ensureHydrated();
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Suma asistencia (idempotente por evento+fecha) y devuelve el perfil. */
export function addAttendance(input: {
  eventId: string;
  title: string;
  date: string;
  coins: number;
}): LemonProfile {
  const base = profile ?? readLocal();
  const key = `${input.eventId}|${input.date}`;
  const exists = base.attendance.some((a) => `${a.eventId}|${a.date}` === key);
  if (exists) {
    profile = base;
    return base;
  }
  const record: Attendance = {
    id: `${key}|${Date.now()}`,
    eventId: input.eventId,
    title: input.title,
    date: input.date,
    coins: input.coins,
  };
  const next: LemonProfile = {
    ...base,
    coins: base.coins + input.coins,
    attendance: [record, ...base.attendance].slice(0, 60),
  };
  setProfile(next);
  return next;
}

/** Cambia el nombre visible del miembro. */
export function renameMember(name: string): void {
  const base = profile ?? readLocal();
  const clean = name.trim().slice(0, 40) || base.name;
  setProfile({ ...base, name: clean });
}

export function backendLabel(): "Supabase" | "Dispositivo" {
  return readEnv().enabled ? "Supabase" : "Dispositivo";
}
