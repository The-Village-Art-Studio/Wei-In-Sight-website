'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface MediaGridProps {
  items: string[];
  columns?: 2 | 3;
}

export default function MediaGrid({ items, columns = 3 }: MediaGridProps) {
  return (
    <div className={`media-grid cols-${columns}`}>
      {items.map((url, index) => (
        <motion.div 
          key={url + index}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.1,
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="grid-item"
        >
          <div className="image-container">
            <img src={url} alt={`Gallery item ${index}`} loading="lazy" />
          </div>
        </motion.div>
      ))}

      <style jsx>{`
        .media-grid {
          display: grid;
          gap: var(--spacing-m);
          margin-bottom: var(--spacing-xl);
        }
        .cols-2 {
          grid-template-columns: repeat(2, 1fr);
        }
        .cols-3 {
          grid-template-columns: repeat(3, 1fr);
        }
        .grid-item {
          aspect-ratio: 4/5;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: border-color 0.4s ease;
        }
        .grid-item:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }
        .image-container {
          width: 100%;
          height: 100%;
          position: relative;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .grid-item:hover img {
          transform: scale(1.05);
        }

        @media (max-width: 1024px) {
          .cols-3 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .media-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
