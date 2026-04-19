'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="back-to-top glass"
          title="Back to Top"
        >
          <span className="arrow">↑</span>
          <span className="text">Top</span>
          
          <style jsx global>{`
            .back-to-top {
              position: fixed !important;
              bottom: 40px !important;
              right: 24px !important;
              width: 56px !important;
              height: 56px !important;
              border-radius: 50% !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              z-index: 9999 !important;
              color: #ffffff !important;
              cursor: pointer !important;
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
              border: 1px solid rgba(255, 0, 255, 0.5) !important;
              background: rgba(15, 6, 30, 0.8) !important;
              backdrop-filter: blur(12px) !important;
              -webkit-backdrop-filter: blur(12px) !important;
            }
            
            .back-to-top:hover {
              transform: translateY(-8px) scale(1.1) !important;
              border-color: #ff00ff !important;
              box-shadow: 0 0 30px rgba(255, 0, 255, 0.6) !important;
            }
            
            .back-to-top .arrow {
              font-size: 1.4rem !important;
              line-height: 1 !important;
            }
            
            .back-to-top .text {
              font-size: 0.6rem !important;
              text-transform: uppercase !important;
              letter-spacing: 0.12em !important;
              margin-top: -2px !important;
            }

            @media (max-width: 768px) {
              .back-to-top {
                bottom: 24px !important;
                right: 24px !important;
                width: 48px !important;
                height: 48px !important;
              }
            }
          `}</style>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
