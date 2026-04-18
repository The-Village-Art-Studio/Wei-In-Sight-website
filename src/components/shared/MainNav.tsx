'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_SECTIONS } from '@/lib/constants';
import { motion } from 'framer-motion';

export default function MainNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link href="/" className="nav-brand">
          <h1 className={isHome ? 'text-xl' : 'text-base'}>WEI IN SIGHT</h1>
          <span className="text-xs text-gray-subtle">JACKY HO</span>
        </Link>
        
        <ul className="nav-list">
          {NAV_SECTIONS.map((section) => {
            const isActive = pathname.startsWith(section.href);
            return (
              <li key={section.id} className="nav-item">
                <Link href={section.href} className={`nav-link ${isActive ? 'active' : ''}`}>
                  <span className="poetic-label">{section.label}</span>
                  <span className="practical-label">{section.poeticLabel}</span>
                </Link>
                
                {/* Subsection visibility (mobile or active section) */}
                {isActive && !isHome && (
                  <motion.ul 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="submenu-list"
                  >
                    {section.submenus.map((sub) => (
                      <li key={sub.id}>
                        <Link href={sub.href} className="submenu-link">
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <style jsx>{`
        .main-nav {
          padding: var(--spacing-m);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .nav-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-l);
        }
        .nav-brand {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-m);
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        .nav-link {
          display: flex;
          flex-direction: column;
          transition: var(--transition-medium);
          opacity: 0.6;
        }
        .nav-link:hover, .nav-link.active {
          opacity: 1;
          color: var(--neon-pink);
        }
        .poetic-label {
          font-family: var(--font-poetic);
          font-size: 1.25rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .practical-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.7;
        }
        .submenu-list {
          list-style: none;
          padding-left: var(--spacing-s);
          border-left: 1px solid var(--neon-pink-glow);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          margin-top: var(--spacing-xs);
        }
        .submenu-link {
          font-size: 0.8rem;
          opacity: 0.7;
          transition: var(--transition-medium);
        }
        .submenu-link:hover {
          opacity: 1;
          color: var(--neon-pink);
          padding-left: 4px;
        }
      `}</style>
    </nav>
  );
}
