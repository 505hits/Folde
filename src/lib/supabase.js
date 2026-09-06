import { createClient } from '@supabase/supabase-js';

// Keep the public UI runnable in local development even before Supabase is configured.
// Production uses the supplied environment variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://local-test.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'local-test-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
