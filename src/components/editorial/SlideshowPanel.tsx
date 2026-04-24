'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryItem } from '@/lib/mockContent';

interface SlideshowPanelProps {
  items: GalleryItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function SlideshowPanel({ items, initialIndex, isOpen, onClose }: SlideshowPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, initialIndex]);

  const paginate = useCallback((newDirection: number) => {
    const nextIndex = (currentIndex + newDirection + items.length) % items.length;
    setDirection(newDirection);
    setCurrentIndex(nextIndex);
  }, [currentIndex, items.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') paginate(1);
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, paginate, onClose]);

  const currentItem = items[currentIndex];

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="slideshow-overlay"
      >
        <div className="slideshow-content glass">
          <button className="close-button" onClick={onClose}>✕</button>

          <div className="slideshow-layout">
            {/* Left Side: Image */}
            <div className="image-section">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="image-wrapper"
                >
                  <img src={currentItem.url} alt={currentItem.title} className="main-image" />
                </motion.div>
              </AnimatePresence>

              <div className="nav-controls">
                <button onClick={() => paginate(-1)} className="nav-btn">←</button>
                <span className="counter text-xs">
                  {currentIndex + 1} / {items.length}
                </span>
                <button onClick={() => paginate(1)} className="nav-btn">→</button>
              </div>
            </div>

            {/* Right Side: Info */}
            <div className="info-section">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="info-content"
                >
                  <h3 className="art-title text-xl">{currentItem.title}</h3>
                  <div className="art-meta text-xs">
                    <span className="year">{currentItem.year}</span>
                    <span className="sep">•</span>
                    <span className="medium">{currentItem.medium}</span>
                  </div>
                  <div className="art-description text-base opacity-70">
                    <p>{currentItem.description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="info-footer">
                <p className="text-xs opacity-30 uppercase tracking-widest">Wei In Sight Archive</p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .slideshow-overlay {
            position: fixed;
            inset: 0;
            background: rgba(5, 5, 5, 0.95);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
          }
          .slideshow-content {
            width: 100%;
            max-width: 1400px;
            height: 80vh;
            background: #0a0a0a;
            border-radius: 12px;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          .close-button {
            position: absolute;
            top: 24px;
            right: 24px;
            z-index: 10;
            font-size: 24px;
            opacity: 0.5;
            transition: 0.3s;
          }
          .close-button:hover {
            opacity: 1;
            color: var(--neon-pink);
          }
          .slideshow-layout {
            display: flex;
            height: 100%;
          }
          .image-section {
            flex: 1.5;
            position: relative;
            background: #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .image-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
          }
          .main-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8);
          }
          .nav-controls {
            position: absolute;
            bottom: 30px;
            display: flex;
            align-items: center;
            gap: 24px;
            background: rgba(0,0,0,0.5);
            padding: 8px 20px;
            border-radius: 100px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
          }
          .nav-btn {
            font-size: 20px;
            opacity: 0.6;
            transition: 0.3s;
          }
          .nav-btn:hover {
            opacity: 1;
            color: var(--neon-pink);
          }
          .info-section {
            flex: 1;
            padding: 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-left: 1px solid rgba(255, 255, 255, 0.05);
            background: #0a0a0a;
          }
          .info-content {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .art-title {
            letter-spacing: 0.05em;
            color: var(--white);
          }
          .art-meta {
            display: flex;
            gap: 12px;
            opacity: 0.5;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .art-description {
            line-height: 1.8;
            max-width: 500px;
          }
          .info-footer {
            margin-top: auto;
            padding-top: 40px;
          }

          @media (max-width: 1024px) {
            .slideshow-layout {
              flex-direction: column;
            }
            .info-section {
              padding: 30px;
              border-left: none;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
            }
            .slideshow-content {
              height: 95vh;
            }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
