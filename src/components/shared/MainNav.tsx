'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_SECTIONS, IDENTITY, FOOTER_LINKS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useHomepageState } from '@/context/HomepageContext';

export default function MainNav() {
  const pathname = usePathname();
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

  const handleClick = (id: string) => {
    if (isHome) {
      if (selectedSection === id) {
        setSelectedSection(null);
        setIsFocused(false);
      } else {
        setSelectedSection(id);
        setIsFocused(true);
      }
    }
  };

  return (
    <nav className="main-nav">
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
                  onClick={() => handleClick(section.id)}
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
          padding: var(--spacing-l) var(--spacing-m);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: var(--midnight);
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
          gap: var(--spacing-s);
        }
        
        .nav-link-wrapper {
          cursor: pointer;
          transition: var(--transition-medium);
          opacity: 0.4;
          display: flex;
          flex-direction: column;
        }
        
        .nav-link-wrapper.hovered,
        .nav-link-wrapper.active {
          opacity: 1;
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
        }
        
        .practical-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.6;
        }
        
        .sidebar-submenu {
          list-style: none;
          margin-top: var(--spacing-xs);
          padding-left: var(--spacing-s);
          border-left: 1px solid var(--neon-pink-glow);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .submenu-link {
          font-size: 0.75rem;
          opacity: 0.5;
          transition: var(--transition-medium);
        }
        
        .submenu-link:hover {
          opacity: 1;
          color: var(--neon-pink);
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
            padding: var(--spacing-m);
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
          .intro-copy {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
