'use client';

import { motion } from 'framer-motion';
import { GalleryItem } from '@/lib/mockContent';

interface VideoGridProps {
  items: GalleryItem[];
  columns?: number;
}

export default function VideoGrid({ items, columns = 3 }: VideoGridProps) {
  // Helper to extract YouTube ID and convert to embed URL if needed
  const getEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return url; // already embed format
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <>
      <div className={`media-grid cols-${columns}`}>
        {items.map((item, index) => (
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
            className="grid-item"
            style={{
              background: 'rgba(15, 6, 30, 0.85)',
              backdropFilter: 'blur(32px) saturate(250%)',
              WebkitBackdropFilter: 'blur(32px) saturate(250%)',
              border: '1px solid rgba(255, 105, 180, 0.4)',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: `
                0 24px 48px rgba(0, 0, 0, 0.8),
                0 0 0 1px rgba(255, 255, 255, 0.15) inset,
                0 0 30px rgba(255, 105, 180, 0.2) inset
              `
            }}
          >
            <div className="video-container">
              <iframe 
                src={getEmbedUrl(item.url)} 
                title={item.title || `Video item ${index}`} 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="grid-video"
              />
              <div className="item-info-below mt-4">
                <h4 className="item-title text-pink-500 font-bold uppercase tracking-widest text-sm mb-1">{item.title}</h4>
                {item.year && <span className="item-year text-[10px] opacity-60 block mb-2">{item.year}</span>}
                {item.description && <p className="text-white/70 text-xs leading-relaxed">{item.description}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
        
        .video-container {
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .grid-video {
          width: 100%;
          aspect-ratio: 16 / 9;
          border: none;
          border-radius: 8px;
          background: #000;
        }

        @media (max-width: 1200px) {
          .media-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .media-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
