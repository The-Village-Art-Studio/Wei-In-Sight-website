'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { useHomepageState } from '@/context/HomepageContext';
import { NAV_SECTIONS } from '@/lib/constants';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Html } from '@react-three/drei';

import BodyModel from './BodyModel';
import CameraController from './CameraController';

function AnchorPoint({ section }: { section: typeof NAV_SECTIONS[0] }) {
  const { hoveredSection, selectedSection, setSelectedSection, setIsFocused } = useHomepageState();
  const isHovered = hoveredSection === section.id;
  const isSelected = selectedSection === section.id;
  const isVisible = isHovered || isSelected;

  return (
    <Html 
      position={new THREE.Vector3(...section.anchorPos3D)} 
      center 
      distanceFactor={10}
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
              className="emerging-submenu"
            >
              <div className="submenu-title text-xs text-neon">{section.label}</div>
              <ul className="submenu-items">
                {section.submenus.map((sub, i) => (
                  <motion.li 
                    key={sub.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={sub.href} className="submenu-item-link text-small">
                      {sub.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .anchor-point-container {
          pointer-events: auto;
          position: relative;
        }
        
        .anchor-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--white);
          border: 2px solid var(--neon-pink);
          cursor: pointer;
          transition: var(--transition-medium);
          opacity: 0.2;
        }
        
        .anchor-point-container.visible .anchor-dot {
          opacity: 1;
          box-shadow: 0 0 15px var(--neon-pink);
          transform: scale(2);
        }
        
        .anchor-point-container.selected .anchor-dot {
          background: var(--neon-pink);
        }
        
        .emerging-submenu {
          position: absolute;
          left: 40px;
          top: 50%;
          transform: translateY(-50%);
          min-width: 180px;
          padding: var(--spacing-s);
          background: rgba(5, 5, 5, 0.9);
          backdrop-filter: blur(20px);
          border-left: 1px solid var(--neon-pink);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-s);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
          z-index: 100;
        }
        
        .submenu-items {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .submenu-item-link {
          color: var(--white);
          opacity: 0.7;
          transition: var(--transition-medium);
          white-space: nowrap;
          text-decoration: none;
          display: block;
        }
        
        .submenu-item-link:hover {
          opacity: 1;
          color: var(--neon-pink);
          padding-left: 8px;
        }
        
        .submenu-title {
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .text-neon {
          color: var(--neon-pink);
          text-shadow: 0 0 10px var(--neon-pink-glow);
        }
        
        .text-small {
          font-size: 0.8rem;
        }
      `}</style>
    </Html>
  );
}

export default function BodyScene() {
  console.log("BodyScene is rendering!");
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
          <AnchorPoint key={section.id} section={section} />
        ))}
      </Canvas>
    </div>
  );
}
