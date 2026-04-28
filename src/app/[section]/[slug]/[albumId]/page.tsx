'use client';

import { useParams, notFound } from 'next/navigation';
import { NAV_SECTIONS } from '@/lib/constants';
import { getContent } from '@/lib/mockContent';
import { useContent, useAlbum } from '@/hooks/use-content';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionHero from '@/components/editorial/SectionHero';
import { useState } from 'react';
import SlideshowPanel from '@/components/editorial/SlideshowPanel';


export default function AlbumGalleryPage() {
  const { section: sectionId, slug, albumId } = useParams();
  const section = NAV_SECTIONS.find(s => s.id === sectionId);
  
  // Fetch dynamic content
  const { content: dbContent, loading: dbLoading } = useContent(sectionId as string, slug as string);
  const { album: dbAlbum, loading: albumLoading } = useAlbum(albumId as string);

  // Fallback to mock
  const mockContent = getContent(sectionId as string, slug as string);
  const content = dbContent || mockContent;
  const album = dbAlbum || content?.albums?.find(a => a.id === albumId);

  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!section || !content || (!dbLoading && !albumLoading && !album)) {
    notFound();
  }

  if (dbLoading || albumLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const openSlideshow = (index: number) => {
    setActiveIndex(index);
    setSlideshowOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="album-gallery-page page-container"
    >
      <nav className="breadcrumb text-xs">
        <Link href="/">Home</Link> 
        <span className="sep">/</span> 
        <Link href={section.href}>{section.label}</Link> 
        <span className="sep">/</span> 
        <Link href={`/${sectionId}/${slug}`}>{content.title}</Link>
        <span className="sep">/</span> 
        <span className="current">{album.title}</span>
      </nav>

      <SectionHero section={section} compact />

      <header className="gallery-header">
        <div className="header-meta">
          <h2 className="text-xl">{album.title}</h2>
          {album.description && <p className="text-base opacity-50">{album.description}</p>}
        </div>
        <div className="item-count text-xs opacity-30">
          {album.items.length} works in this collection
        </div>
      </header>

        <div className="gallery-grid">
          {album.items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.8 }}
              whileHover={{ 
                y: -12,
                scale: 1.02,
                borderColor: 'rgba(255, 105, 180, 0.8)',
                boxShadow: `
                  0 32px 80px rgba(0, 0, 0, 0.9),
                  0 0 0 1px rgba(255, 255, 255, 0.25) inset,
                  0 0 50px rgba(255, 105, 180, 0.3) inset
                `
              }}
              className="gallery-item-wrapper"
              onClick={() => openSlideshow(idx)}
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
              <div className="gallery-item-image-container">
                <img src={item.url} alt={item.title} className="gallery-item-image" />
                <div className="item-overlay">
                  <div className="item-info">
                    <span className="item-title text-small">{item.title}</span>
                    <span className="item-year text-xs opacity-60">{item.year}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      <footer className="page-footer">
        <Link href={`/${sectionId}/${slug}`} className="back-link">
          <span className="arrow">←</span> Back to {content.title}
        </Link>
      </footer>

      <SlideshowPanel 
        items={album.items}
        initialIndex={activeIndex}
        isOpen={slideshowOpen}
        onClose={() => setSlideshowOpen(false)}
      />

      <style jsx>{`
        .album-gallery-page {
          /* Layout handled by globals */
        }
        .breadcrumb {
          margin-bottom: var(--spacing-l);
          opacity: 0.5;
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .breadcrumb .sep { opacity: 0.3; }
        .breadcrumb .current { color: var(--neon-pink); }

        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--spacing-l);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 24px;
        }
        .header-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1200px) {
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 900px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 500px) {
          .gallery-grid {
            grid-template-columns: 1fr;
          }
        }
        .gallery-item-wrapper {
          cursor: pointer;
          position: relative;
          aspect-ratio: 1;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .gallery-item-wrapper:hover {
          transform: translateY(-10px);
          border-color: rgba(255, 105, 180, 1) !important;
        }

        .gallery-item-image-container {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          border-radius: 8px;
        }
        .gallery-item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .gallery-item-wrapper:hover .gallery-item-image {
          transform: scale(1.05);
        }
        .item-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%);
          opacity: 0;
          transition: opacity 0.4s ease;
          display: flex;
          align-items: flex-end;
          padding: 20px;
        }
        .gallery-item-wrapper:hover .item-overlay {
          opacity: 1;
        }
        .item-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .item-title {
          font-weight: 500;
          color: white;
        }

        .page-footer {
          margin-top: var(--spacing-xl);
          padding-top: var(--spacing-m);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .back-link {
          font-size: 0.875rem;
          opacity: 0.6;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: var(--transition-medium);
        }
        .back-link:hover {
          opacity: 1;
          color: var(--neon-pink);
          transform: translateX(-5px);
        }
      `}</style>
    </motion.div>
  );
}
