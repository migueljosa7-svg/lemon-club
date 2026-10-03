import type { createClient } from "@supabase/supabase-js";

export interface LemonEnv {
  url: string;
  anonKey: string;
  enabled: boolean;
}

/** Lee la configuración de Supabase desde variables de entorno de Vite. */
export function readEnv(): LemonEnv {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? "";
  return { url, anonKey, enabled: url.length > 0 && anonKey.length > 0 };
}

type SupabaseClient = ReturnType<typeof createClient>;

let client: SupabaseClient | null = null;

/**
 * Import perezoso: el SDK de Supabase solo se carga si hay credenciales.
 * Mantiene el bundle inicial ligero y evita llamadas de red en fallback.
 */
export async function getClient(): Promise<SupabaseClient | null> {
  const env = readEnv();
  if (!env.enabled) return null;
  if (client) return client;
  const mod = await import("@supabase/supabase-js");
  client = mod.createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
