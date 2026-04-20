'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { NAV_SECTIONS, IDENTITY, FOOTER_LINKS } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHomepageState } from '@/context/HomepageContext';
import BackgroundMusic from './BackgroundMusic';

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 769);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleMouseEnter = (id: string) => {
    if (isHome) setHoveredSection(id);
  };

  const handleMouseLeave = () => {
    if (isHome) setHoveredSection(null);
  };

  const handleClick = (id: string, href: string) => {
    if (isMenuOpen) setIsMenuOpen(false); // Close menu on click
    
    if (isHome) {
      if (selectedSection === id) {
        setSelectedSection(null);
        setIsFocused(false);
      } else {
        setSelectedSection(id);
        setIsFocused(true);
      }
    } else {
      router.push(href);
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="mobile-header-bar">
        <Link 
          href="/" 
          className="mobile-brand"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="brand-content-sm">
            <Image src="/assets/logo-white.png" alt="" width={32} height={32} className="brand-logo-sm" />
            <span className="wordmark-sm">WEI IN SIGHT</span>
          </div>
        </Link>
        <button 
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle Navigation Menu"
        >
          <div className="hamburger-box">
            <div className="hamburger-inner"></div>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {(isMenuOpen || !isMobile) && (
          <motion.nav 
            initial={isMobile ? { x: '-100%', opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`main-nav glass ${isMenuOpen ? 'mobile-open' : ''}`}
            role="navigation"
            aria-label="Main Portfolio Navigation"
          >
            <div className="nav-top">
              <Link 
                href="/" 
                className="nav-brand" 
                aria-label="Wei In Sight - Home"
                onClick={() => {
                  setSelectedSection(null);
                  setIsFocused(false);
                  setIsMenuOpen(false);
                }}
              >
                <div className="brand-content" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img 
                    src="/assets/logo-white.png" 
                    alt="Wei In Sight Logo" 
                    style={{ width: '48px', height: '48px', objectFit: 'contain', flexShrink: 0 }}
                  />
                  <div className="brand-text">
                    <h1 className="wordmark" style={{ margin: 0 }}>{IDENTITY.wordmark}</h1>
                    <span className="subtitle">{IDENTITY.subtitle}</span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="nav-middle">
              <ul className="nav-list" role="list">
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
                        role="button"
                        tabIndex={0}
                        aria-pressed={isPersistentlyActive || isHomeSelected}
                        aria-label={`View ${section.label} section: ${section.poeticLabel}`}
                        onClick={() => handleClick(section.id, section.href)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleClick(section.id, section.href);
                          }
                        }}
                        className={`nav-link-wrapper ${isPersistentlyActive || isHomeSelected ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                      >
                        <div className="nav-link-main">
                          <span className="poetic-label">{section.label}</span>
                          <span className="practical-label">— {section.poeticLabel}</span>
                        </div>
                      </div>
                      
                      {/* Subsection visibility */}
                      {(isPersistentlyActive && !isHome) && (
                        <motion.ul 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="sidebar-submenu"
                          role="list"
                          aria-label={`${section.label} sub-navigation`}
                        >
                          {section.submenus.map((sub) => {
                            const isActive = pathname === sub.href;
                            return (
                              <li key={sub.id}>
                                <Link 
                                  href={sub.href} 
                                  className={`submenu-link ${isActive ? 'active' : ''}`}
                                  aria-current={isActive ? 'page' : undefined}
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {sub.label}
                                </Link>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="nav-bottom">
              <div className="social-bar">
                <a 
                  href="https://www.instagram.com/weiinsight/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon-link"
                  aria-label="Follow on Instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a 
                  href="https://www.tiktok.com/@weiinsight?_r=1&_t=ZP-95gL2kgWQmt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon-link"
                  aria-label="Follow on TikTok"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31 0 2.59.18 3.82.51V5a7.33 7.33 0 0 1-3.82-1.07v11.53a5.52 5.52 0 1 1-5.52-5.52c.28 0 .54.02.81.07V12.1a3.42 3.42 0 1 0 2.61 3.32V1.07C10.43.38 11.45 0 12.525 0z"/>
                  </svg>
                </a>
              </div>
              <ul className="footer-links" role="list">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="footer-link text-xs"
                      aria-label={`Visit my ${link.label}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <BackgroundMusic />
              <div className="identity-note text-xs text-gray-subtle" aria-hidden="true">
                {IDENTITY.manifesto}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <style jsx global>{`
        .main-nav {
          padding: 32px 24px;
          height: calc(100vh - 40px);
          margin: 20px;
          display: flex;
          flex-direction: column;
          
          /* Enable scrolling for deep menus */
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-gutter: stable;
          
          /* Premium Glass Panel Effect */
          background: rgba(15, 6, 30, 0.85);
          backdrop-filter: blur(32px) saturate(250%);
          -webkit-backdrop-filter: blur(32px) saturate(250%);
          border: 1px solid rgba(255, 105, 180, 0.4);
          border-radius: 16px;
          box-shadow:
            0 24px 64px rgba(0, 0, 0, 0.9),
            0 0 0 1px rgba(255, 255, 255, 0.15) inset,
            0 0 40px rgba(255, 105, 180, 0.2) inset;
          
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: auto;
          display: flex;
          flex-direction: column;
        }

        @media (max-height: 850px) {
          .main-nav {
            padding: 24px 20px !important;
          }
        }
        
        .main-nav:hover {
          border-color: rgba(255, 105, 180, 0.6);
          box-shadow:
            0 32px 80px rgba(0, 0, 0, 0.95),
            0 0 0 1px rgba(255, 255, 255, 0.2) inset,
            0 0 60px rgba(255, 105, 180, 0.3) inset;
        }
        
        .nav-top {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-m);
        }
        
        .nav-brand {
          text-decoration: none;
          transition: var(--transition-medium);
        }

        .brand-content {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 16px !important;
          width: 100%;
        }

        .brand-logo {
          flex-shrink: 0;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }
        
        .wordmark {
          font-family: var(--font-poetic);
          font-size: 1.25rem;
          font-weight: 400;
          letter-spacing: 0.15em;
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
          margin-top: var(--spacing-l);
          margin-bottom: var(--spacing-m);
        }

        @media (max-height: 850px) {
          .nav-middle {
            margin-top: var(--spacing-m) !important;
            margin-bottom: var(--spacing-s) !important;
          }
        }
        
        .nav-list {
          list-style: none !important;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .nav-link-wrapper {
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.5;
          display: flex;
          flex-direction: column;
          padding: 6px 12px;
          border-radius: 8px;
          border-left: 2px solid transparent;
        }
        
        .nav-link-wrapper.hovered,
        .nav-link-wrapper.active {
          opacity: 1;
          background: rgba(255, 105, 180, 0.15);
          border-left-color: var(--neon-pink);
          transform: translateX(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        
        .nav-link-main {
          display: flex;
          flex-direction: column;
        }
        
        .poetic-label {
          font-family: var(--font-poetic);
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          transition: var(--transition-medium);
        }
        
        .nav-link-wrapper.hovered .poetic-label,
        .nav-link-wrapper.active .poetic-label {
          color: var(--neon-pink);
          text-shadow: 0 0 15px var(--neon-pink);
        }
        
        .practical-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.6;
        }
        
        .sidebar-submenu {
          list-style: none !important;
          margin: 12px 0 8px 16px !important;
          padding: 0 !important;
          border-left: 1px solid rgba(255, 105, 180, 0.3);
          display: flex;
          flex-direction: column;
          gap: 6px !important;
        }
        
        .sidebar-submenu li {
          list-style: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .submenu-link {
          font-family: var(--font-main);
          font-size: 0.9rem !important;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.7) !important;
          text-decoration: none;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          gap: 15px;
          position: relative;
          padding: 4px 0;
        }
        
        .submenu-link::before {
          content: '';
          width: 8px;
          height: 8px;
          border: 1.5px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transition: all 0.4s ease;
          flex-shrink: 0;
        }
        
        .submenu-link:hover,
        .submenu-link.active {
          opacity: 1 !important;
          color: var(--neon-pink) !important;
          transform: translateX(12px);
          text-shadow: 0 0 15px rgba(255, 105, 180, 0.8);
        }

        .submenu-link:hover::before,
        .submenu-link.active::before {
          background: var(--neon-pink);
          border-color: var(--neon-pink);
          box-shadow: 0 0 15px var(--neon-pink);
          transform: scale(1.5);
        }
        
        .nav-bottom {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: var(--spacing-m);
        }

        @media (max-height: 850px) {
          .nav-bottom {
            margin-top: var(--spacing-s) !important;
            gap: 4px !important;
          }
        }
        
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .footer-link {
          opacity: 0.5;
          transition: var(--transition-medium);
          font-size: 0.8rem;
        }
        
        .footer-link:hover {
          opacity: 1;
          color: var(--neon-pink);
          transform: translateX(4px);
        }

        .social-bar {
          display: flex;
          gap: 20px;
          margin-bottom: 0px;
          padding-left: 4px;
        }

        .social-icon-link {
          color: white;
          opacity: 0.5;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .social-icon-link:hover {
          opacity: 1;
          color: var(--neon-pink);
          transform: scale(1.15) translateY(-2px);
          filter: drop-shadow(0 0 8px var(--neon-pink));
        }
        
        /* Premium Scrollbar */
        .main-nav::-webkit-scrollbar {
          width: 4px;
        }
        .main-nav::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .main-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 105, 180, 0.2);
          border-radius: 4px;
        }
        .main-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 105, 180, 0.4);
        }

        @media (max-width: 768px) {
          .mobile-header-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            height: 70px;
            width: 100%;
            background: rgba(5, 5, 5, 0.4);
            backdrop-filter: blur(8px);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1100;
            pointer-events: auto;
          }

          .brand-content-sm {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .brand-logo-sm {
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2));
          }

          .wordmark-sm {
            font-family: var(--font-poetic);
            font-size: 0.9rem;
            letter-spacing: 0.2em;
            color: var(--white);
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
          }

          .menu-toggle {
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            cursor: pointer;
            z-index: 1200;
          }

          .hamburger-box {
            width: 24px;
            height: 24px;
            position: relative;
          }

          .hamburger-inner,
          .hamburger-inner::before,
          .hamburger-inner::after {
            width: 24px;
            height: 1px;
            background-color: var(--white);
            position: absolute;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease;
          }

          .hamburger-inner {
            top: 50%;
            transform: translateY(-50%);
          }

          .hamburger-inner::before {
            content: '';
            top: -8px;
          }

          .hamburger-inner::after {
            content: '';
            top: 8px;
          }

          .menu-toggle.open .hamburger-inner {
            background-color: transparent;
          }

          .menu-toggle.open .hamburger-inner::before {
            transform: translateY(8px) rotate(45deg);
            background-color: var(--neon-pink);
          }

          .menu-toggle.open .hamburger-inner::after {
            transform: translateY(-8px) rotate(-45deg);
            background-color: var(--neon-pink);
          }

          .main-nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 85px 24px 40px !important;
            border-radius: 0 !important;
            border: none !important;
            border-bottom: 2px solid var(--neon-pink-glow) !important;
            z-index: 1050;
            display: flex !important;
            flex-direction: column;
            background: rgba(15, 6, 30, 0.98) !important;
            backdrop-filter: blur(40px) saturate(200%) !important;
            pointer-events: auto !important;
          }

          .nav-link-wrapper {
            padding: 15px 20px;
            opacity: 0.8;
          }

          .nav-link-wrapper.active {
            transform: translateX(5px);
          }

          .sidebar-submenu {
            margin: 15px 0 10px 20px !important;
            gap: 12px !important;
          }

          .submenu-link {
            font-size: 1.1rem !important;
          }

          .intro-copy {
            display: none;
          }

          .nav-brand .wordmark {
            display: none;
          }

          .nav-brand .subtitle {
            margin-top: 0;
            font-size: 0.8rem;
            opacity: 1;
            color: var(--neon-pink);
            text-shadow: 0 0 10px var(--neon-pink-glow);
          }
        }

        @media (min-width: 769px) {
          .mobile-header-bar {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
