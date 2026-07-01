import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Supabase is optional. When the env vars aren't set (e.g. local-only dev, or
// before the project is provisioned) the whole app still works against
// localStorage — see AppStateContext's offline fallback.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
