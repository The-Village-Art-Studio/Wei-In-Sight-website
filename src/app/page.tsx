'use client';

import { motion } from 'framer-motion';
import BodyScene from '@/components/home/BodyScene';

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="gateway-content">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="hero-text"
        >
          <h2 className="text-display line-1">WEI IN</h2>
          <h2 className="text-display line-2 text-neon">SIGHT</h2>
          
          <div className="manifesto">
            <p className="text-base">
              A cinematic universe of multidiscipliary arts. Exploring the intersections 
              of sight, sound, and the human form.
            </p>
          </div>
        </motion.div>
      </div>
      
      <div className="scene-container">
        <BodyScene />
      </div>

      <style jsx>{`
        .home-container {
          display: flex;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }
        .gateway-content {
          flex: 1;
          display: flex;
          align-items: center;
          padding: var(--spacing-xl) var(--spacing-m);
          z-index: 2;
          pointer-events: none;
        }
        .hero-text {
          pointer-events: auto;
        }
        .manifesto {
          margin-top: var(--spacing-m);
          max-width: 400px;
          opacity: 0.8;
        }
        .scene-container {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        .line-1 { font-family: var(--font-main); }
        .line-2 { font-family: var(--font-poetic); }

        @media (max-width: 768px) {
          .home-container {
            flex-direction: column;
            overflow: auto;
          }
          .gateway-content {
            height: 100vh;
            padding: var(--spacing-m);
          }
          .scene-container {
            position: relative;
            height: 60vh;
          }
        }
      `}</style>
    </div>
  );
}
