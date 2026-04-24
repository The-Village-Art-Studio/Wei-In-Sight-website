'use client';

import { useParams, notFound } from 'next/navigation';
import { NAV_SECTIONS } from '@/lib/constants';
import { getContent } from '@/lib/mockContent';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionHero from '@/components/editorial/SectionHero';
import MediaGrid from '@/components/editorial/MediaGrid';
import AudioBlock from '@/components/editorial/AudioBlock';
import ProseBlock from '@/components/editorial/ProseBlock';
import LogoGrid from '@/components/editorial/LogoGrid';
import PulseForm from '@/components/editorial/PulseForm';

import ProjectFolder from '@/components/editorial/ProjectFolder';

export default function ContentPage() {
  const { section: sectionId, slug } = useParams();
  const section = NAV_SECTIONS.find(s => s.id === sectionId);
  const content = getContent(sectionId as string, slug as string);

  // Fallback for sub-pages not yet in mockContent
  const activeSubmenu = section?.submenus.find(m => m.href.endsWith(`/${slug}`));

  if (!section || !activeSubmenu) {
    notFound();
  }

  // Check if we should use the album folder layout
  const useAlbumLayout = content?.albums && content.albums.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="content-page"
    >
      <nav className="breadcrumb text-xs">
        <Link href="/">Home</Link> 
        <span className="sep">/</span> 
        <Link href={section.href}>{section.label}</Link> 
        <span className="sep">/</span> 
        <span className="current">{activeSubmenu.label}</span>
      </nav>

      {/* Reusing SectionHero in compact mode for sub-pages */}
      <SectionHero section={section} compact />

      <article className="content-container">
        {content?.heroImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="page-hero"
          >
            <div className="hero-image-container">
              <img 
                src={content.heroImage} 
                alt={content.title} 
                className="hero-image"
              />
            </div>
          </motion.div>
        )}

        <header className="page-header">
          <h2 className="text-xl">{content?.title || activeSubmenu.label}</h2>
          {content?.subtitle && <p className="text-small opacity-50">{content.subtitle}</p>}
        </header>

        <div className="content-blocks">
          {useAlbumLayout ? (
            <div className="album-grid">
              {content!.albums!.map((album, idx) => (
                <ProjectFolder 
                  key={album.id}
                  id={album.id}
                  title={album.title}
                  description={album.description}
                  images={album.items.map(item => item.url)}
                  href={`/${sectionId}/${slug}/${album.id}`}
                  index={idx}
                />
              ))}
            </div>
          ) : content ? (
            content.blocks.map((block, idx) => {
              switch (block.type) {
                case 'text':
                  return <ProseBlock key={idx} content={block.content!} />;
                case 'quote':
                  return <ProseBlock key={idx} content={block.content!} type="quote" />;
                case 'gallery':
                  return <MediaGrid key={idx} items={block.items as string[]} columns={3} />;
                case 'audio':
                  return (
                    <AudioBlock 
                      key={idx} 
                      title={block.caption || 'Untitled Track'} 
                      duration={block.metadata?.duration}
                      platform={block.metadata?.platform}
                    />
                  );
                case 'logo-grid':
                  return (
                    <LogoGrid 
                      key={idx} 
                      items={block.logoItems || []} 
                    />
                  );
                case 'form':
                  return (
                    <PulseForm 
                      key={idx} 
                      formType={block.formType || 'contact'} 
                    />
                  );
                default:
                  return null;
              }
            })
          ) : (
            <div className="placeholder-message glass" style={{ padding: '40px', borderRadius: '12px', textAlign: 'center', opacity: 0.8 }}>
              <ProseBlock content={`### THE ARCHIVE IS AWAKENING\n\nThe documentation for **${activeSubmenu.label}** is currently being processed and curated. Please check back as the atlas expands.`} />
            </div>
          )}
        </div>

        <footer className="page-footer">
          <Link href={section.href} className="back-link">
            <span className="arrow">←</span> Back to {section.label}
          </Link>
        </footer>
      </article>

      <style jsx>{`
        .album-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 40px;
          margin-top: var(--spacing-m);
        }
        @media (min-width: 1200px) {
          .album-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .page-hero {
          margin-bottom: var(--spacing-l);
          width: 100%;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.02);
        }
        .hero-image-container {
          width: 100%;
          max-height: 400px;
          overflow: hidden;
          position: relative;
        }
        .hero-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
        }
        
        .content-page {
          /* Layout managed globally in globals.css */
        }
        .breadcrumb {
          margin-bottom: var(--spacing-l);
          opacity: 0.5;
          display: flex;
          gap: 0.5rem;
        }
        .breadcrumb .sep { opacity: 0.3; }
        .breadcrumb .current { color: var(--neon-pink); }
        
        .page-header {
          margin-bottom: var(--spacing-l);
        }
        .page-header h2 {
          text-transform: none;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        
        .content-blocks {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-m);
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
