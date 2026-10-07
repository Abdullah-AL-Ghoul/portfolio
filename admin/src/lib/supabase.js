import { createClient } from '@supabase/supabase-js';

// Public (anon) key only — every write is authorized by RLS, never by the UI.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fail loudly in dev; in prod the app shows the configuration notice.
  console.warn('[admin] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(url || 'http://localhost', anonKey || 'missing', {
  auth: { persistSession: true, autoRefreshToken: true }
});
