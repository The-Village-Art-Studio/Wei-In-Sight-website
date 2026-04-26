'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { GalleryItem } from '@/lib/mockContent';
import SlideshowPanel from './SlideshowPanel';

interface MediaGridProps {
  items: (string | GalleryItem)[];
  columns?: number;
}

export default function MediaGrid({ items, columns = 4 }: MediaGridProps) {
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Normalize items to GalleryItem objects for the SlideshowPanel
  const galleryItems: GalleryItem[] = items.map((item, idx) => {
    if (typeof item === 'string') {
      return {
        id: `img-${idx}`,
        url: item,
        title: 'Untitled',
        year: '',
        medium: '',
        description: ''
      };
    }
    return item;
  });

  const openSlideshow = (index: number) => {
    setActiveIndex(index);
    setSlideshowOpen(true);
  };

  return (
    <>
      <div className={`media-grid cols-${columns}`}>
        {galleryItems.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.05,
              ease: [0.16, 1, 0.3, 1] 
            }}
            whileHover={{ 
              y: -10,
              scale: 1.02,
              borderColor: 'rgba(255, 105, 180, 0.8)',
              boxShadow: `
                0 32px 80px rgba(0, 0, 0, 0.9),
                0 0 0 1px rgba(255, 255, 255, 0.25) inset,
                0 0 50px rgba(255, 105, 180, 0.3) inset
              `
            }}
            onClick={() => openSlideshow(index)}
            className="grid-item"
            style={{
              background: 'rgba(15, 6, 30, 0.85)',
              backdropFilter: 'blur(32px) saturate(250%)',
              WebkitBackdropFilter: 'blur(32px) saturate(250%)',
              border: '1px solid rgba(255, 105, 180, 0.4)',
              borderRadius: '16px',
              padding: '16px',
              cursor: 'pointer',
              boxShadow: `
                0 24px 48px rgba(0, 0, 0, 0.8),
                0 0 0 1px rgba(255, 255, 255, 0.15) inset,
                0 0 30px rgba(255, 105, 180, 0.2) inset
              `
            }}
          >
            <div className="image-container">
              <Image 
                src={item.url} 
                alt={item.title || `Gallery item ${index}`} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="grid-image"
              />
              <div className="item-overlay">
                <div className="item-info">
                  <span className="item-title text-[10px] uppercase tracking-widest">{item.title}</span>
                  {item.year && <span className="item-year text-[9px] opacity-60">{item.year}</span>}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <SlideshowPanel 
        items={galleryItems}
        initialIndex={activeIndex}
        isOpen={slideshowOpen}
        onClose={() => setSlideshowOpen(false)}
      />

      <style jsx>{`
        .media-grid {
          display: grid;
          gap: 24px;
          margin-bottom: var(--spacing-xl);
        }
        .cols-4 {
          grid-template-columns: repeat(4, 1fr);
        }
        .cols-3 {
          grid-template-columns: repeat(3, 1fr);
        }
        .cols-2 {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .image-container {
          width: 100%;
          aspect-ratio: 1;
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          background: #000;
        }

        .grid-image {
          object-fit: cover;
          opacity: 0.9;
          transition: opacity 0.4s ease;
        }

        .item-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15, 6, 30, 0.9) 0%, transparent 40%);
          opacity: 0;
          transition: opacity 0.4s ease;
          display: flex;
          align-items: flex-end;
          padding: 12px;
        }

        .grid-item:hover .item-overlay {
          opacity: 1;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .item-title {
          color: var(--white);
          font-weight: 600;
        }

        @media (max-width: 1200px) {
          .media-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 900px) {
          .media-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .media-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
