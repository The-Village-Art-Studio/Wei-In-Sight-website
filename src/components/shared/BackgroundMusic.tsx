'use client';

import { motion } from 'framer-motion';
import { useAudio } from '@/context/AudioContext';

export default function BackgroundMusic() {
  const { isPlaying, togglePlay } = useAudio();

  return (
    <div className="audio-control-wrapper">
      <div className="audio-control-row">
        <button 
          onClick={togglePlay}
          className="audio-toggle-btn"
          aria-label={isPlaying ? "Pause background music" : "Play background music"}
        >
          <div className="sound-visualizer">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="sound-bar"
                animate={isPlaying ? {
                  height: [4, 12, 6, 14, 4],
                } : { height: 2 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          <div className={`audio-switch ${isPlaying ? 'on' : 'off'}`}>
            <span className="switch-label">{isPlaying ? 'ON' : 'OFF'}</span>
            <motion.div 
              className="switch-thumb"
              initial={false}
              animate={{ x: isPlaying ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>

          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
        </button>
      </div>

      <style jsx>{`
        .audio-control-wrapper {
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .audio-control-row {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .audio-toggle-btn {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          color: var(--white);
          opacity: 0.8;
          transition: all 0.3s ease;
          padding: 8px 0;
        }

        .audio-toggle-btn:hover {
          opacity: 1;
        }

        .sound-visualizer {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 16px;
          width: 20px;
          opacity: ${isPlaying ? 1 : 0.3};
        }

        .sound-bar {
          width: 2px;
          background: var(--neon-pink);
          box-shadow: 0 0 8px var(--neon-pink-glow);
          border-radius: 1px;
        }

        .audio-switch {
          width: 52px;
          height: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          position: relative;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: all 0.4s ease;
        }

        .audio-switch.on {
          background: rgba(255, 105, 180, 0.1);
          border-color: rgba(255, 105, 180, 0.4);
          box-shadow: 0 0 15px rgba(255, 105, 180, 0.1);
        }

        .switch-label {
          position: absolute;
          font-size: 0.5rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: white;
          width: 100%;
          text-align: center;
          left: 0;
          opacity: 0.5;
          z-index: 1;
          pointer-events: none;
          font-family: var(--font-main);
        }

        .switch-thumb {
          width: 18px;
          height: 18px;
          background: ${isPlaying ? 'var(--neon-pink)' : 'white'};
          border-radius: 50%;
          z-index: 2;
          box-shadow: ${isPlaying ? '0 0 10px var(--neon-pink)' : 'none'};
        }

        @media (max-width: 768px) {
          .audio-switch {
            width: 60px;
            height: 28px;
          }
          .switch-thumb {
            width: 22px;
            height: 22px;
          }
        }
      `}</style>
    </div>
  );
}
