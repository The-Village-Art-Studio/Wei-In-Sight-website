'use client';

import { motion } from 'framer-motion';
import { useAudio } from '@/context/AudioContext';

export default function BackgroundMusic() {
  const { isPlaying, togglePlay } = useAudio();

  return (
    <div className="audio-control-wrapper">
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
        <span className="audio-status-text">
          {isPlaying ? "Ambient On" : "Audio Silenced"}
        </span>
      </button>

      <style jsx>{`
        .audio-control-wrapper {
          padding-top: 8px;
          margin-top: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .audio-toggle-btn {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          color: var(--white);
          opacity: 0.6;
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
        }

        .sound-bar {
          width: 2px;
          background: var(--neon-pink);
          box-shadow: 0 0 8px var(--neon-pink-glow);
          border-radius: 1px;
        }

        .audio-status-text {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-family: var(--font-outfit);
        }

        @media (max-width: 768px) {
          .audio-status-text {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
