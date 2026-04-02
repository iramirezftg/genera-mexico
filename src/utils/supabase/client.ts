import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client (singleton).
 * Import this in 'use client' components.
 */
let client: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  client = createSupabaseClient(supabaseUrl, supabaseKey);
  return client;
}
