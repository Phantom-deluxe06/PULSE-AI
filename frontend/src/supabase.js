import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
    console.warn("⚠️ Supabase env vars missing. Running in local/demo mode with localStorage auth.");
}

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
