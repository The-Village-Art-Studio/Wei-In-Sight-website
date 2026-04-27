'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/admin');
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
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: '#ff69b4',
            marginBottom: '6px',
          }}>
            WEI IN SIGHT
          </div>
          <div style={{
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
          }}>
            Control Room Access
          </div>
        </div>

        {/* Error */}
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

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '10px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '7px',
              marginLeft: '2px',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jackyho@weiinsight.com"
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '14px',
                fontFamily: 'var(--font-inter)',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,105,180,0.4)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '10px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '7px',
              marginLeft: '2px',
            }}>
              Password
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
                fontFamily: 'var(--font-inter)',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,105,180,0.4)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
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
              fontFamily: 'var(--font-outfit)',
              letterSpacing: '0.12em',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 0 24px rgba(255,105,180,0.25)',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={14} />}
            {loading ? 'Authenticating…' : 'Authenticate'}
          </button>
        </form>
      </div>
    </div>
  );
}
