'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LogoItem {
  logoUrl: string;
  title: string;
  description: string;
  link?: string;
  preserveColor?: boolean;
}

interface LogoGridProps {
  items: LogoItem[];
  columns?: number;
}

export default function LogoGrid({ items, columns = 3 }: LogoGridProps) {
  return (
    <div className={`logo-grid-container cols-${columns}`}>
      {items.map((item, index) => {
        const content = (
          <>
            <div className="logo-square glass">
              <div className="logo-wrapper">
                <Image 
                  src={item.logoUrl} 
                  alt={`${item.title} logo`} 
                  fill
                  unoptimized
                  className="logo-image"
                  style={{ 
                    objectFit: 'contain', 
                    padding: '20%',
                    filter: item.preserveColor ? 'none' : 'brightness(0) invert(1) contrast(1.2)'
                  }}
                />
              </div>
            </div>
            
            <div className="logo-info">
              <h4 className="logo-title text-base">{item.title}</h4>
              <p className="logo-description text-xs opacity-60">{item.description}</p>
            </div>
          </>
        );

        return (
          <motion.div 
            key={item.title + index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.1,
              ease: [0.16, 1, 0.3, 1] 
            }}
            className={`logo-item ${item.link ? 'clickable' : ''}`}
          >
            {item.link ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="logo-link">
                {content}
              </a>
            ) : (
              content
            )}
          </motion.div>
        );
      })}

      <style jsx>{`
        .logo-grid-container {
          display: grid;
          gap: var(--spacing-l);
          margin-bottom: var(--spacing-xl);
          grid-template-columns: repeat(${columns}, 1fr);
        }

        .logo-item {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-s);
          cursor: default;
        }

        .logo-item.clickable {
          cursor: pointer;
        }

        .logo-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-s);
          width: 100%;
          height: 100%;
        }

        .logo-square {
          aspect-ratio: 1 / 1;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        /* Ambient Glow behind logo */
        .logo-square::after {
          content: '';
          position: absolute;
          width: 50%;
          height: 50%;
          background: radial-gradient(circle, var(--neon-pink-glow) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .logo-item:hover .logo-square {
          background: rgba(255, 105, 180, 0.08);
          border-color: rgba(255, 105, 180, 0.4);
          transform: translateY(-8px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(255, 105, 180, 0.2);
        }

        .logo-item:hover .logo-square::after {
          opacity: 0.3;
        }

        .logo-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .logo-item:hover .logo-wrapper {
          transform: scale(1.1);
        }

        .logo-link:hover .logo-wrapper {
          transform: scale(1.1);
        }

        .logo-image {
          opacity: 0.85;
          transition: all 0.5s ease;
        }

        .logo-item:hover .logo-image {
          opacity: 1;
        }

        .logo-info {
          padding: 4px 8px;
        }

        .logo-title {
          margin-bottom: 6px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: color 0.4s ease;
        }

        .logo-item:hover .logo-title {
          color: var(--neon-pink);
        }

        .logo-description {
          line-height: 1.5;
          letter-spacing: 0.02em;
        }

        @media (max-width: 1024px) {
          .logo-grid-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .logo-grid-container {
            grid-template-columns: 1fr;
            gap: var(--spacing-m);
          }
          .logo-square {
            padding: 30px;
          }
        }
      `}</style>
    </div>
  );
}
