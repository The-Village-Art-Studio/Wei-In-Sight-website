'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/admin/login');
      } else {
        setAuthed(true);
      }
      setChecking(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/admin/login');
        setAuthed(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isLoginPage, router]);

  // Login page gets its own bare layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while checking auth
  if (checking) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#050505',
      }}>
        <Loader2 size={28} color="#ff69b4" className="animate-spin" />
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050505', color: '#fff' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '48px 48px 48px 36px', background: '#080808' }}>
        {children}
      </main>
    </div>
  );
}
