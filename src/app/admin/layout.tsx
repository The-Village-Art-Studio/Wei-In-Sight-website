import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'WEI IN SIGHT — Control Room',
  description: 'Admin CMS',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050505', color: '#fff' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '48px 48px 48px 36px', background: '#080808' }}>
        {children}
      </main>
    </div>
  );
}
