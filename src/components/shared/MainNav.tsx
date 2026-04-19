'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { NAV_SECTIONS, IDENTITY, FOOTER_LINKS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useHomepageState } from '@/context/HomepageContext';

export default function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const { 
    hoveredSection, 
    setHoveredSection, 
    selectedSection, 
    setSelectedSection,
    setIsFocused 
  } = useHomepageState();

  const handleMouseEnter = (id: string) => {
    if (isHome) setHoveredSection(id);
  };

  const handleMouseLeave = () => {
    if (isHome) setHoveredSection(null);
  };

  const handleClick = (id: string, href: string) => {
    if (isHome) {
      if (selectedSection === id) {
        setSelectedSection(null);
        setIsFocused(false);
      } else {
        setSelectedSection(id);
        setIsFocused(true);
      }
    } else {
      // If not on home, clicking a section should navigate to its landing page
      router.push(href);
    }
  };

  return (
    <nav className={`main-nav glass`}>
      <div className="nav-top">
        <Link href="/" className="nav-brand" onClick={() => {
          setSelectedSection(null);
          setIsFocused(false);
        }}>
          <h1 className="wordmark">{IDENTITY.wordmark}</h1>
          <span className="subtitle">{IDENTITY.subtitle}</span>
        </Link>
        
        <AnimatePresence>
          {isHome && !selectedSection && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="intro-copy"
            >
              <p className="text-small">{IDENTITY.intro}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="nav-middle">
        <ul className="nav-list">
          {NAV_SECTIONS.map((section) => {
            const isPersistentlyActive = pathname.startsWith(section.href);
            const isHomeSelected = selectedSection === section.id;
            const isHovered = hoveredSection === section.id;
            
            return (
              <li 
                key={section.id} 
                className="nav-item"
                onMouseEnter={() => handleMouseEnter(section.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div 
                  onClick={() => handleClick(section.id, section.href)}
                  className={`nav-link-wrapper ${isPersistentlyActive || isHomeSelected ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                >
                  <div className="nav-link-main">
                    <span className="poetic-label">{section.label}</span>
                    <span className="practical-label">— {section.poeticLabel}</span>
                  </div>
                </div>
                
                {/* Subsection visibility (on dedicated pages only for now) */}
                {isPersistentlyActive && !isHome && (
                  <motion.ul 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="sidebar-submenu"
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

      <div className="nav-bottom">
        <ul className="footer-links">
          {FOOTER_LINKS.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="footer-link text-xs">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="identity-note text-xs text-gray-subtle">
          {IDENTITY.manifesto}
        </div>
      </div>

      <style jsx>{`
        .main-nav {
          padding: 40px 32px;
          height: calc(100vh - 40px);
          margin: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          
          /* Premium Glass Panel Effect */
          background: rgba(15, 6, 30, 0.8);
          backdrop-filter: blur(24px) saturate(200%);
          -webkit-backdrop-filter: blur(24px) saturate(200%);
          border: 1px solid rgba(255, 0, 255, 0.3);
          border-radius: 16px;
          box-shadow:
            0 16px 48px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 0 24px rgba(255, 0, 255, 0.1) inset;
          
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .main-nav:hover {
          border-color: rgba(255, 0, 255, 0.5);
          box-shadow:
            0 24px 64px rgba(0, 0, 0, 0.9),
            0 0 0 1px rgba(255, 255, 255, 0.15) inset,
            0 0 32px rgba(255, 0, 255, 0.2) inset;
        }
        
        .nav-top {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-m);
        }
        
        .wordmark {
          font-family: var(--font-poetic);
          font-size: 1.5rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          color: var(--white);
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
        }
        
        .subtitle {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--gray-subtle);
          margin-top: 4px;
          display: block;
        }
        
        .intro-copy {
          max-width: 240px;
          line-height: 1.5;
          opacity: 0.7;
        }
        
        .nav-middle {
          margin: var(--spacing-l) 0;
        }
        
        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .nav-link-wrapper {
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.5;
          display: flex;
          flex-direction: column;
          padding: 10px 16px;
          border-radius: 8px;
          border-left: 2px solid transparent;
        }
        
        .nav-link-wrapper.hovered,
        .nav-link-wrapper.active {
          opacity: 1;
          background: rgba(255, 0, 255, 0.1);
          border-left-color: var(--neon-pink);
          transform: translateX(8px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .nav-link-main {
          display: flex;
          flex-direction: column;
        }
        
        .poetic-label {
          font-family: var(--font-poetic);
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: var(--transition-medium);
        }
        
        .nav-link-wrapper.hovered .poetic-label,
        .nav-link-wrapper.active .poetic-label {
          color: var(--neon-pink);
          text-shadow: 0 0 10px var(--neon-pink);
        }
        
        .practical-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.6;
        }
        
        .sidebar-submenu {
          list-style: none;
          margin-top: 12px;
          padding-left: 16px;
          border-left: 1px solid rgba(255, 0, 255, 0.2);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .submenu-link {
          font-size: 0.75rem;
          opacity: 0.5;
          transition: all 0.3s ease;
          display: block;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .submenu-link:hover {
          opacity: 1;
          color: var(--neon-pink);
          background: rgba(255, 0, 255, 0.05);
          transform: translateX(4px);
        }
        
        .nav-bottom {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-m);
        }
        
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .footer-link {
          opacity: 0.5;
          transition: var(--transition-medium);
        }
        
        .footer-link:hover {
          opacity: 1;
          color: var(--neon-pink);
        }
        
        @media (max-width: 768px) {
          .main-nav {
            margin: 0;
            height: auto;
            padding: var(--spacing-m);
            border-radius: 0;
            border-bottom: 1px solid rgba(255, 0, 255, 0.2);
          }
          .intro-copy {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
