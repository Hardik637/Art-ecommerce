import { createBrowserClient } from '@supabase/ssr';

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project') &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-anon-key')
  );
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !isSupabaseConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[Supabase Client] Missing or placeholder NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY in environment. Set up credentials in .env.local to enable full cloud persistence.'
      );
    }
    // Return standard client with empty values rather than fake mock domain
    return createBrowserClient(
      supabaseUrl || 'https://unconfigured.supabase.co',
      supabaseAnonKey || 'unconfigured-anon-key'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
