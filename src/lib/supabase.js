import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function validSupabaseUrl(value) {
  if (!value) return false;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

if (url && !validSupabaseUrl(url)) {
  console.error('Supabase is disabled because VITE_SUPABASE_URL must be a valid HTTP or HTTPS URL.');
}

export const supabase = validSupabaseUrl(url) && anonKey
  ? createClient(url.trim(), anonKey.trim())
  : null;
