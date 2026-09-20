import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project') &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role')
  );
}

export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error('FATAL: createAdminClient must never be invoked in client-side code.');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || !isSupabaseAdminConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY is not configured in .env.local. Server-side admin operations will use local fallbacks.'
      );
    }
    return null;
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
