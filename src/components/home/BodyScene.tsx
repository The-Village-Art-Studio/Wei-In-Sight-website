'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { useHomepageState } from '@/context/HomepageContext';
import { NAV_SECTIONS } from '@/lib/constants';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Html, useProgress } from '@react-three/drei';

import BodyModel from './BodyModel';
import CameraController from './CameraController';

function AnchorPoint({ section, isMobile }: { section: typeof NAV_SECTIONS[0], isMobile: boolean }) {
  const router = useRouter();
  const { hoveredSection, selectedSection, setSelectedSection, setIsFocused } = useHomepageState();
  const isHovered = hoveredSection === section.id;
  const isSelected = selectedSection === section.id;
  const isVisible = isHovered || isSelected;

  return (
    <Html 
      position={new THREE.Vector3(...section.anchorPos3D)} 
      center 
      zIndexRange={[100, 0]}
    >
      <div className={`anchor-point-container ${isVisible ? 'visible' : ''} ${isSelected ? 'selected' : ''}`}>
        <button 
          className="anchor-dot"
          aria-label={`Select ${section.label} perspective`}
          aria-pressed={isSelected}
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSection(isSelected ? null : section.id);
            setIsFocused(!isSelected);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSelectedSection(isSelected ? null : section.id);
              setIsFocused(!isSelected);
            }
          }}
        />
        
        <AnimatePresence>
          {isSelected && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: section.id === 'touch' ? -20 : 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: section.id === 'touch' ? -20 : 20 }}
              className={`emerging-submenu ${isMobile ? 'mobile' : ''} ${['touch', 'heart', 'sound'].includes(section.id) ? 'align-left' : ''} ${isMobile && ['sound', 'heart', 'pulse'].includes(section.id) ? 'align-bottom' : ''}`}
            >
              <div className="submenu-title">{section.label}</div>
              <ul className="submenu-items">
                {section.submenus.map((sub, i) => (
                  <motion.li 
                    key={sub.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => {
                      if (isMobile) {
                        router.push(sub.href);
                      }
                    }}
                  >
                    <Link href={sub.href} className="submenu-item-link">
                      {sub.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .anchor-point-container {
          pointer-events: auto;
          position: relative;
        }
        
        .anchor-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 1.5px solid var(--neon-pink);
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0.25;
          box-shadow: 0 0 6px rgba(255, 105, 180, 0.3);
          position: relative; /* For tap target */
        }

        /* Expanded tap target for mobile */
        .anchor-dot::after {
          content: '';
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
        }
        
        .anchor-point-container.visible .anchor-dot {
          opacity: 1;
          box-shadow: 0 0 18px var(--neon-pink), 0 0 40px rgba(255, 105, 180, 0.4);
          transform: scale(2.2);
        }

        .anchor-dot:hover {
          transform: scale(2.8) !important;
          background: #fff !important;
          box-shadow: 0 0 25px var(--neon-pink), 0 0 50px var(--neon-pink) !important;
          border-color: #fff !important;
          z-index: 50;
        }
        
        .anchor-point-container.selected .anchor-dot {
          background: var(--neon-pink);
          box-shadow: 0 0 20px var(--neon-pink), 0 0 50px rgba(255, 105, 180, 0.5);
        }
        
        .emerging-submenu {
          position: absolute;
          left: 24px;
          top: 50%;
          transform: translateY(-50%);
          min-width: 240px;
          max-width: 280px;
          width: max-content;
          padding: 19px 24px;
          background: rgba(15, 6, 30, 0.85); /* Much stronger glass background */
          backdrop-filter: blur(24px) saturate(200%);
          -webkit-backdrop-filter: blur(24px) saturate(200%);
          border: 1px solid rgba(255, 105, 180, 0.6); /* Very visible border */
          border-radius: 12px;
          box-shadow:
            0 16px 48px rgba(0, 0, 0, 0.9),
            0 0 0 1px rgba(255, 255, 255, 0.15) inset,
            0 0 32px rgba(255, 105, 180, 0.3) inset;
          display: flex;
          flex-direction: column;
          gap: 13px;
          z-index: 100;
          pointer-events: auto; /* Fully force hover reception */
        }

        .emerging-submenu.align-left {
          left: auto !important;
          right: 24px !important;
          transform: translateY(-50%) !important;
        }

        .emerging-submenu.mobile {
          left: 50%;
          top: -40px;
          transform: translateX(-50%) translateY(-100%);
          min-width: 200px;
          padding: 12px 16px;
          gap: 8px;
        }

        /* Specific alignment for Sound and Heart sections on mobile to move panels below the dots */
        .emerging-submenu.mobile.align-bottom {
          top: 40px !important;
          bottom: auto !important;
          left: 50% !important;
          right: auto !important;
          transform: translateX(-50%) translateY(0) !important;
        }

        .emerging-submenu.mobile .submenu-title {
          font-size: 0.9rem;
          padding-bottom: 6px;
          margin-bottom: 2px;
        }

        .emerging-submenu.mobile .submenu-item-link {
          font-size: 1rem;
          padding: 8px 10px;
        }
        
        .submenu-items {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 3px;
          margin: 0;
          padding: 0;
        }
        
        .submenu-item-link {
          color: rgba(255, 255, 255, 0.75);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          text-decoration: none;
          display: block;
          font-size: 1.6rem; 
          letter-spacing: 0.05em;
          padding: 6px 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          white-space: normal;
          line-height: 1.2;
        }
        
        .submenu-item-link:hover {
          opacity: 1;
          color: #fff;
          background: rgba(255, 105, 180, 0.2);
          padding-left: 15px;
          border-bottom-color: transparent;
          text-shadow: 0 0 10px #ff69b4, 0 0 20px #ff69b4;
          box-shadow: inset 4px 0 0 #ff69b4;
        }
        
        .submenu-title {
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 1.56rem; 
          font-weight: 800;
          color: #ff69b4;
          text-shadow: 0 0 16px rgba(255, 105, 180, 0.9);
          margin-bottom: 3px;
          padding-bottom: 10px;
          border-bottom: 2px solid rgba(255, 105, 180, 0.3);
        }
      `}</style>
    </Html>
  );
}

function SceneLoader() {
  const { progress } = useProgress();
  return (
    <Html center zIndexRange={[1000, 0]}>
      <div className="scene-loader glass">
        <div className="loader-content">
          <div className="loader-title">Synchronizing Atlas</div>
          <div className="loader-bar-container">
            <div className="loader-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="loader-label text-xs">{Math.round(progress)}% — COHERENCE SEEKING</div>
        </div>
        <style>{`
          .scene-loader {
            padding: 40px;
            min-width: 320px;
            background: rgba(15, 6, 30, 0.9);
            backdrop-filter: blur(40px);
            border: 1px solid rgba(255, 105, 180, 0.2);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
          }
          .loader-content {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .loader-title {
            font-family: var(--font-poetic);
            font-size: 1.5rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--neon-pink);
            text-shadow: 0 0 15px var(--neon-pink-glow);
          }
          .loader-bar-container {
            width: 100%;
            height: 2px;
            background: rgba(255, 255, 255, 0.05);
            overflow: hidden;
            border-radius: 1px;
          }
          .loader-bar {
            height: 100%;
            background: var(--neon-pink);
            box-shadow: 0 0 10px var(--neon-pink);
            transition: width 0.4s ease-out;
          }
          .loader-label {
            opacity: 0.5;
            letter-spacing: 0.1em;
          }
        `}</style>
      </div>
    </Html>
  );
}

export default function BodyScene() {
  console.log("BodyScene is rendering!");
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return (
    <div 
      className="scene-wrapper"
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        background: 'radial-gradient(circle at 70% 50%, var(--magenta-depth) 0%, transparent 70%)'
      }}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ff69b4" />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ffffff" />
        
        <Suspense fallback={<SceneLoader />}>
          <group scale={isMobile ? (1.1 / 1.5) : 1}>
            <BodyModel />
            
            {/* 3D-Anchored navigation points */}
            {NAV_SECTIONS.map((section) => (
              <AnchorPoint key={section.id} section={section} isMobile={isMobile} />
            ))}
          </group>
        </Suspense>
        
        <CameraController />
      </Canvas>
    </div>
  );
}
