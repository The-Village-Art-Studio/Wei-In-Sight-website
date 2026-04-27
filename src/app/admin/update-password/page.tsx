'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    
    // Redirect to login after a delay
    setTimeout(() => {
      router.push('/admin/login');
    }, 3000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'var(--font-inter)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '44px 36px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: '#ff69b4',
            marginBottom: '6px',
          }}>
            UPDATE PASSWORD
          </div>
          <div style={{
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
          }}>
            Set your new security credentials
          </div>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle size={48} color="#34d399" style={{ marginBottom: '16px' }} />
            <div style={{ color: '#fff', fontSize: '15px', marginBottom: '8px' }}>Password Updated!</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
              Redirecting you to the login page...
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: 'rgba(239,68,68,0.8)',
                fontSize: '12px',
                marginBottom: '20px',
              }}>
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '7px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '7px' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '13px',
                  borderRadius: '10px',
                  background: '#ff69b4',
                  border: 'none',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '8px',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={14} />}
                {loading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
