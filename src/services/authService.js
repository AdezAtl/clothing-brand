import { supabase, isSupabaseConfigured } from './supabaseClient';

const SESSION_KEY = 'lolashub_admin_session';
const DEFAULT_MASTER_PASSWORD = 'lolas-challenge-2026';

export const AuthService = {
  /**
   * Check if an admin is currently authenticated in the current browser session.
   */
  isAuthenticated() {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (!stored) return false;
      const session = JSON.parse(stored);
      return Boolean(session && session.timestamp);
    } catch {
      return false;
    }
  },

  /**
   * Retrieve the active admin session metadata.
   */
  getSession() {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Attempt admin authentication using Supabase Auth or Master Password fallback.
   * @param {{ email?: string, password: string }} credentials
   */
  async login({ email = '', password }) {
    const configuredMasterPassword = import.meta.env.VITE_ADMIN_PASSWORD || DEFAULT_MASTER_PASSWORD;
    const cleanPassword = (password || '').trim();
    const cleanEmail = (email || '').trim();

    // 1. If Supabase is configured, try Supabase Auth first
    if (isSupabaseConfigured() && supabase) {
      try {
        if (cleanEmail) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword
          });

          if (!error && data?.user) {
            const sessionData = {
              mode: 'supabase',
              email: data.user.email,
              userId: data.user.id,
              timestamp: Date.now()
            };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            window.dispatchEvent(new Event('lolashub_auth_changed'));
            return { success: true, mode: 'supabase', session: sessionData };
          }
        }
      } catch (err) {
        console.warn('Supabase auth attempt failed, checking master password fallback...', err);
      }
    }

    // 2. Fallback / Master Password mode
    if (cleanPassword === configuredMasterPassword) {
      const sessionData = {
        mode: 'master',
        email: cleanEmail || 'admin@lolashub.com',
        timestamp: Date.now()
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      window.dispatchEvent(new Event('lolashub_auth_changed'));
      return { success: true, mode: 'master', session: sessionData };
    }

    // 3. Credential mismatch
    if (isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Invalid email or password. Please verify your Supabase admin credentials or master access code.'
      };
    } else {
      return {
        success: false,
        error: 'Incorrect admin password. Please try again.'
      };
    }
  },

  /**
   * Terminate active admin session.
   */
  async logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      if (isSupabaseConfigured() && supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.error('Error during logout', e);
    } finally {
      window.dispatchEvent(new Event('lolashub_auth_changed'));
    }
  }
};
