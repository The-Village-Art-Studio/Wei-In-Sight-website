'use client';

import { usePathname } from 'next/navigation';
import MainNav from '@/components/shared/MainNav';
import BackToTop from '@/components/shared/BackToTop';
import { HomepageProvider } from '@/context/HomepageContext';
import { AudioProvider } from '@/context/AudioContext';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    // Admin routes: render bare — no MainNav, no providers, no site-wrapper
    return <>{children}</>;
  }

  return (
    <HomepageProvider>
      <AudioProvider>
        <div className="site-wrapper">
          <header className="site-header">
            <MainNav />
          </header>
          <main className="site-main">
            {children}
          </main>
          <BackToTop />
        </div>
      </AudioProvider>
    </HomepageProvider>
  );
}
