import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.trim() !== '' &&
    supabaseAnonKey.trim() !== '' &&
    !supabaseUrl.includes('placeholder') &&
    (supabaseUrl.startsWith('https://') || supabaseUrl.startsWith('http://'))
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: window.sessionStorage // Session storage as specified
      }
    })
  : null;

/**
 * Perform a light ping to check PostgreSQL table connectivity.
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export const checkSupabaseHealth = async () => {
  if (!isSupabaseConfigured() || !supabase) {
    return { ok: false, error: 'Supabase credentials not configured in environment.' };
  }

  try {
    const { error } = await supabase.from('lh_products').select('id').limit(1);
    if (error) {
      // Table might not exist yet if migration hasn't been run
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err?.message || 'Network error connecting to Supabase.' };
  }
};
