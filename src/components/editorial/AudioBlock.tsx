'use client';

import { motion } from 'framer-motion';

interface AudioBlockProps {
  url?: string;
  title: string;
  duration?: string;
  platform?: string;
}

export default function AudioBlock({ url, title, duration, platform }: AudioBlockProps) {
  return (
    <div className="audio-block">
      <div className="audio-info">
        <div className="play-btn">
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
            <path d="M1 1L11 7L1 13V1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="details">
          <h4 className="text-base">{title}</h4>
          <span className="text-xs opacity-50">{duration} • {platform}</span>
        </div>
      </div>
      
      <div className="waveform-mock">
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i} 
            className="bar" 
            style={{ 
              height: `${10 + Math.random() * 80}%`,
              opacity: 0.2 + Math.random() * 0.5
            }} 
          />
        ))}
      </div>

      <style jsx>{`
        .audio-block {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: var(--spacing-m);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-m);
          margin-bottom: var(--spacing-s);
          transition: var(--transition-medium);
        }
        .audio-block:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--neon-pink-glow);
        }
        .audio-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-m);
        }
        .play-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .play-btn:hover {
          background: var(--white);
          color: var(--midnight);
          transform: scale(1.05);
        }
        .details h4 {
          text-transform: none;
          letter-spacing: 0.02em;
        }
        .waveform-mock {
          height: 40px;
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 0 4px;
        }
        .bar {
          flex: 1;
          background: var(--white);
          border-radius: 1px;
        }
      `}</style>
    </div>
  );
}
