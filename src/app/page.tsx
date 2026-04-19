'use client';

import { motion, AnimatePresence } from 'framer-motion';
import BodyScene from '@/components/home/BodyScene';
import { useHomepageState } from '@/context/HomepageContext';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { isFocused } = useHomepageState();
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
        
        {/* Subtle atmospheric overlays */}
        <div className="vignette" />
        <div className="grain" />
      </div>

      <style jsx>{`
        .home-wrapper {
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: var(--midnight);
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
        }
      `}</style>
    </motion.div>
  );
}
