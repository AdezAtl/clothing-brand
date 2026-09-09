import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, Database, Sparkles } from 'lucide-react';
import { AuthService } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabaseClient';

export default function AdminLogin({ onLoginSuccess, onBackToStore }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const supabaseReady = isSupabaseConfigured();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await AuthService.login({ email, password });
      if (res.success) {
        if (onLoginSuccess) {
          onLoginSuccess(res.session);
        }
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please verify your password.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during sign-in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-linen)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)'
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 600,
              color: 'var(--color-evergreen)'
            }}
          >
            Lola's Hub
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span className="badge badge-terracotta" style={{ fontSize: '0.7rem' }}>
            Challenge Boutique Backoffice
          </span>
          <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>
            39 Oladoyinbo St, Ibadan
          </span>
        </div>
      </div>

      {/* Login Card Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          padding: 'var(--space-8)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(27, 56, 43, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-evergreen)'
            }}
          >
            <Lock size={18} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600 }}>
              Admin Verification
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
              Authenticate to manage inventory, fulfill orders, and view inquiries.
            </p>
          </div>
        </div>

        {/* Database Status Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: supabaseReady ? '#E8EFEA' : 'var(--bg-subtle)',
            border: `1px solid ${supabaseReady ? '#C3D5C7' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={13} color={supabaseReady ? 'var(--color-evergreen)' : 'var(--color-ink-muted)'} />
            <span style={{ fontWeight: 500, color: supabaseReady ? 'var(--color-evergreen)' : 'var(--color-ink)' }}>
              {supabaseReady ? 'Supabase PostgreSQL Linked' : 'Local Storage Mode'}
            </span>
          </div>
          <span
            className="mono"
            style={{
              fontSize: '0.7rem',
              color: supabaseReady ? 'var(--color-evergreen)' : 'var(--color-terracotta)',
              fontWeight: 600
            }}
          >
            {supabaseReady ? '● Active' : '● Standby'}
          </span>
        </div>

        {/* Error Notification Alert */}
        {errorMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px 12px',
              background: '#FDF2EC',
              border: '1px solid #F6D2BF',
              borderRadius: 'var(--radius-sm)',
              color: '#9C3D12',
              fontSize: '0.82rem',
              lineHeight: 1.4,
              marginBottom: '16px'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email input (optional or required if using Supabase Auth) */}
          <div>
            <label
              htmlFor="admin-email"
              style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, marginBottom: '6px' }}
            >
              Admin Email {supabaseReady ? '*' : '(Optional)'}
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              placeholder={supabaseReady ? "admin@lolashub.com" : "admin@lolashub.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-dark)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                outline: 'none',
                background: '#FFFFFF'
              }}
            />
          </div>

          {/* Password input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label
                htmlFor="admin-password"
                style={{ fontSize: '0.82rem', fontWeight: 500 }}
              >
                Access Password *
              </label>
              {!supabaseReady && (
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)' }}>
                  Default: lolas-challenge-2026
                </span>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-dark)',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: '#FFFFFF'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-ink-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="btn btn-primary btn-full"
            style={{
              padding: '12px 18px',
              fontSize: '0.92rem',
              fontWeight: 600,
              marginTop: '8px',
              opacity: isSubmitting || !password.trim() ? 0.7 : 1,
              cursor: isSubmitting || !password.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Unlock Backoffice</span>
              </>
            )}
          </button>
        </form>

        {/* Footnote / Guidance */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <button
            type="button"
            onClick={onBackToStore}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--color-ink-muted)', padding: '4px 8px', fontSize: '0.8rem' }}
          >
            <ArrowLeft size={13} />
            <span>Return to Boutique</span>
          </button>

          <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--color-ink-faint)' }}>
            Session Secured
          </span>
        </div>
      </div>
    </div>
  );
}
