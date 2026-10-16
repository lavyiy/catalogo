import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';

export const supabase: SupabaseClient = createClient({
  auth: {
    autoSignUp: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-annotate': 'true',
    },
  },
});

export { env };