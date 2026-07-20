import { createBrowserClient } from "@supabase/ssr";

/** Browser-side Supabase client for 'use client' components (e.g. admin auth forms). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
