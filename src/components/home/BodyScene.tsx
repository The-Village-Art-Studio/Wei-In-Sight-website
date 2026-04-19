'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useHomepageState } from '@/context/HomepageContext';
import { NAV_SECTIONS } from '@/lib/constants';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Html } from '@react-three/drei';

import BodyModel from './BodyModel';
import CameraController from './CameraController';

function AnchorPoint({ section, isMobile }: { section: typeof NAV_SECTIONS[0], isMobile: boolean }) {
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
        <div 
          className="anchor-dot"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSection(isSelected ? null : section.id);
            setIsFocused(!isSelected);
          }}
        />
        
        <AnimatePresence>
          {isSelected && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className={`emerging-submenu ${isMobile ? 'mobile' : ''}`}
            >
              <div className="submenu-title">{section.label}</div>
              <ul className="submenu-items">
                {section.submenus.map((sub, i) => (
                  <motion.li 
                    key={sub.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
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
        }
        
        .anchor-point-container.visible .anchor-dot {
          opacity: 1;
          box-shadow: 0 0 18px var(--neon-pink), 0 0 40px rgba(255, 105, 180, 0.4);
          transform: scale(2.2);
        }
        
        .anchor-point-container.selected .anchor-dot {
          background: var(--neon-pink);
          box-shadow: 0 0 20px var(--neon-pink), 0 0 50px rgba(255, 105, 180, 0.5);
        }
        
        .emerging-submenu {
          position: absolute;
          left: 30px;
          top: 50%;
          transform: translateY(-50%);
          min-width: 300px;
          width: max-content;
          padding: 24px 32px;
          background: rgba(15, 6, 30, 0.85); /* Much stronger glass background */
          backdrop-filter: blur(24px) saturate(200%);
          -webkit-backdrop-filter: blur(24px) saturate(200%);
          border: 1px solid rgba(255, 105, 180, 0.6); /* Very visible border */
          border-radius: 16px;
          box-shadow:
            0 16px 48px rgba(0, 0, 0, 0.9),
            0 0 0 1px rgba(255, 255, 255, 0.15) inset,
            0 0 32px rgba(255, 105, 180, 0.3) inset;
          display: flex;
          flex-direction: column;
          gap: 16px;
          z-index: 100;
          pointer-events: auto; /* Fully force hover reception */
        }

        .emerging-submenu.mobile {
          left: 50%;
          top: 25px;
          transform: translateX(-50%);
          min-width: 140px;
          padding: 10px 12px;
        }
        
        .submenu-items {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin: 0;
          padding: 0;
        }
        
        .submenu-item-link {
          color: rgba(255, 255, 255, 0.75);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          text-decoration: none;
          display: block;
          font-size: 2.34rem; /* 3x of 0.78rem */
          letter-spacing: 0.05em;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
        }
        
        .submenu-item-link:hover {
          opacity: 1;
          color: #fff;
          background: rgba(255, 105, 180, 0.2);
          padding-left: 20px;
          border-bottom-color: transparent;
          text-shadow: 0 0 10px #ff69b4, 0 0 20px #ff69b4;
          box-shadow: inset 4px 0 0 #ff69b4;
        }
        
        .submenu-title {
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 1.95rem; /* 3x of 0.65rem */
          font-weight: 800;
          color: #ff69b4;
          text-shadow: 0 0 16px rgba(255, 105, 180, 0.9);
          margin-bottom: 4px;
          padding-bottom: 12px;
          border-bottom: 2px solid rgba(255, 105, 180, 0.3);
        }
      `}</style>
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
        <pointLight position={[5, 5, 5]} intensity={1} color="#ff00ff" />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ffffff" />
        
        <BodyModel />
        <CameraController />
        
        {/* 3D-Anchored navigation points */}
        {NAV_SECTIONS.map((section) => (
          <AnchorPoint key={section.id} section={section} isMobile={isMobile} />
        ))}
      </Canvas>
    </div>
  );
}
