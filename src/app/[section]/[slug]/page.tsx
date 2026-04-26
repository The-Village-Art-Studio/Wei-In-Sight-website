'use client';

import { useParams, notFound } from 'next/navigation';
import { NAV_SECTIONS } from '@/lib/constants';
import { getContent } from '@/lib/mockContent';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import SectionHero from '@/components/editorial/SectionHero';
import MediaGrid from '@/components/editorial/MediaGrid';
import AudioBlock from '@/components/editorial/AudioBlock';
import ProseBlock from '@/components/editorial/ProseBlock';
import LogoGrid from '@/components/editorial/LogoGrid';
import PulseForm from '@/components/editorial/PulseForm';
import ExhibitionList from '@/components/editorial/ExhibitionList';

import ProjectFolder from '@/components/editorial/ProjectFolder';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

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
      className="content-page page-container"
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
                alt={content?.title || 'Cover Image'} 
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
                  return <MediaGrid key={idx} items={block.items as any[]} columns={4} />;
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
                case 'pillar-grid':
                  return (
                    <motion.div
                      key={idx}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={itemVariants}
                      className="pillar-grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 my-20"
                    >
                      {block.pillarItems?.map((pillar, pIdx) => (
                        <div key={pIdx} className="pillar-card p-10 glass rounded-2xl border border-white/5 hover:border-pink-500/20 transition-all group">
                          <h4 className="text-pink-500 font-bold uppercase tracking-widest text-sm mb-4 group-hover:text-pink-400 transition-colors">
                            {pillar.title}
                          </h4>
                          <p className="text-white/60 text-base leading-relaxed group-hover:text-white/80 transition-colors">
                            {pillar.content}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  );

                case 'dna-section':
                  return (
                    <motion.div
                      key={idx}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={itemVariants}
                      className="dna-section-container my-16 p-12 glass rounded-3xl text-center border-y border-white/10"
                    >
                      <span className="block text-[10px] tracking-[0.3em] uppercase text-white/30 mb-8">{block.caption || 'CREATIVE DNA'}</span>
                      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                        {block.dnaItems?.map((item, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-8">
                            <span className="text-base md:text-lg tracking-wide uppercase text-white/80 hover:text-pink-500 transition-colors cursor-default">{item}</span>
                            {dIdx < (block.dnaItems?.length || 0) - 1 && (
                              <span className="h-1 w-1 rounded-full bg-pink-500/40"></span>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );

                case 'exhibition-list':
                  return (
                    <ExhibitionList 
                      key={idx} 
                      items={block.exhibitionItems || []} 
                    />
                  );
                case 'profile-photo':
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className="profile-photo-container"
                    >
                      <div className="profile-photo-ring">
                        <img
                          src={block.url || ''}
                          alt="Artist Portrait"
                          className="profile-photo-img"
                        />
                      </div>
                    </motion.div>
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


      </article>

      <style jsx>{`
        .album-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 48px;
          margin-top: var(--spacing-l);
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

        .profile-photo-container {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          margin-bottom: var(--spacing-l);
          padding-top: var(--spacing-m);
        }
        .profile-photo-ring {
          width: 440px;
          height: 440px;
          margin: 0 auto !important;
          border-radius: 50%;
          padding: 4px;
          background: linear-gradient(135deg, rgba(255, 105, 180, 0.6), rgba(123, 104, 238, 0.6), rgba(255, 105, 180, 0.3));
          box-shadow:
            0 0 40px rgba(255, 105, 180, 0.2),
            0 0 80px rgba(123, 104, 238, 0.1),
            0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .profile-photo-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          border: 3px solid rgba(15, 6, 30, 0.9);
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
