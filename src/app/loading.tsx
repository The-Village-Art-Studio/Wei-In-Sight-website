'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="global-loader">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="loader-content"
      >
        <div className="loader-ring">
          <motion.div 
            animate={{ 
              rotate: 360,
              boxShadow: [
                '0 0 20px var(--neon-pink)',
                '0 0 40px var(--neon-pink)',
                '0 0 20px var(--neon-pink)'
              ]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="ring-inner"
          />
        </div>
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="loader-text"
        >
          <span className="atlas-sync">Synchronizing Atlas</span>
          <span className="coherence">COHERENCE SEEKING</span>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .global-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
        }

        .loader-ring {
          position: relative;
          width: 60px;
          height: 60px;
        }

        .ring-inner {
          width: 100%;
          height: 100%;
          border: 1px solid var(--neon-pink);
          border-top-color: transparent;
          border-radius: 50%;
        }

        .loader-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
        }

        .atlas-sync {
          font-family: var(--font-poetic);
          font-size: 1.25rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #fff;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .coherence {
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          color: var(--neon-pink);
          opacity: 0.8;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
