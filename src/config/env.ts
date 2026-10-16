import { Env } from '../types';

export const env = (): Env => {
  const raw = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_STORE_SLUG: import.meta.env.VITE_STORE_SLUG,
  };

  // Validation
  if (!raw.VITE_SUPABASE_URL) {
    throw new Error('VITE_SUPABASE_URL is required');
  }
  if (!raw.VITE_SUPABASE_ANON_KEY) {
    throw new Error('VITE_SUPABASE_ANON_KEY is required');
  }
  if (!raw.VITE_STORE_SLUG) {
    throw new Error('VITE_STORE_SLUG is required');
  }

  // Validaciones adicionales
  if (!raw.VITE_SUPABASE_URL.startsWith('https://')) {
    throw new Error('VITE_SUPABASE_URL must start with https://');
  }

  return raw as Env;
};

export type Env = {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_STORE_SLUG: string;
};