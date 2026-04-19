'use client';

import { motion, AnimatePresence } from 'framer-motion';
import BodyScene from '@/components/home/BodyScene';
import { useHomepageState } from '@/context/HomepageContext';
import { IDENTITY } from '@/lib/constants';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { isFocused, selectedSection } = useHomepageState();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Artificial delay to ensure "ceremonial" reveal
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      className="home-wrapper"
    >
      <div className={`home-layout ${isFocused ? 'focused' : ''}`}>
        <div className="scene-area">
          <BodyScene />
        </div>

        {/* Repositioned Intro Manifesto */}
        <AnimatePresence>
          {!selectedSection && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="stage-intro glass"
            >
              <p className="text-small" style={{ margin: 0 }}>
                A multidisciplinary artist building worlds through <br />
                image, sound, craft, poetry, and memory.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Subtle atmospheric overlays */}
        <div className="vignette" />
        <div className="grain" />
      </div>

      <style jsx global>{`
        .home-wrapper {
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: var(--midnight);
          position: relative;
        }
        
        .stage-intro {
          position: absolute !important;
          max-width: fit-content !important;
          top: 160px;
          left: 80px;
          z-index: 100 !important;
          pointer-events: none !important;
          line-height: 1.6 !important;
          letter-spacing: 0.05em !important;
          padding: 24px 32px !important;
          border-radius: 16px !important;
          color: rgba(255, 255, 255, 0.95) !important;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6) !important;
          background: rgba(15, 6, 30, 0.8) !important;
          border: 1px solid rgba(255, 105, 180, 0.4) !important;
          backdrop-filter: blur(32px) saturate(200%) !important;
          -webkit-backdrop-filter: blur(32px) saturate(200%) !important;
          transition: all 0.5s ease;
        }
        
        .home-layout {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .home-layout.focused {
          /* Subtle shift when an anchor is selected */
          transform: scale(1.02);
        }
        
        .scene-area {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        .vignette {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, transparent 20%, var(--midnight) 100%);
          pointer-events: none;
          z-index: 2;
          opacity: 0.6;
        }
        
        .grain {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.03;
          pointer-events: none;
          z-index: 3;
        }

        @media (max-width: 768px) {
          .home-layout.focused {
            transform: none;
          }
          
          .stage-intro {
            top: 320px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: calc(100% - 48px) !important;
            max-width: 400px !important;
            text-align: center !important;
            padding: 20px 24px !important;
          }

          .stage-intro p br {
            display: none;
          }
        }
      `}</style>
    </motion.div>
  );
}
