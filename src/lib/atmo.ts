import { useSyncExternalStore } from "react";

/** Tonos de atmósfera disponibles para el halo global de la Bento Grid. */
export type AtmoTone = "lemon" | "wine" | "mint";

let tone: AtmoTone | null = null;
const listeners = new Set<() => void>();

/** Cambia el tono global. Sin re-render si el valor no cambia. */
export function setAtmo(t: AtmoTone | null): void {
  if (t === tone) return;
  tone = t;
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getSnapshot(): AtmoTone | null {
  return tone;
}

/** Hook SSR-safe: solo el componente atmósfera se suscribe (0 re-renders en la grid). */
export function useAtmo(): AtmoTone | null {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
