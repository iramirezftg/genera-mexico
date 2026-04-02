import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client.
 * Uses the publishable (anon) key — safe for server components and API routes.
 */
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient(supabaseUrl, supabaseKey);
}
