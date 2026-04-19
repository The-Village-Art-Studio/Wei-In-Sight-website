'use client';

import { useParams, notFound } from 'next/navigation';
import { NAV_SECTIONS } from '@/lib/constants';
import { motion } from 'framer-motion';
import SectionHero from '@/components/editorial/SectionHero';
import MediaGrid from '@/components/editorial/MediaGrid';
import Link from 'next/link';

export default function SectionPage() {
  const { section: sectionId } = useParams();
  const section = NAV_SECTIONS.find(s => s.id === sectionId);

  if (!section) {
    notFound();
  }

  // Mock featured images for the gallery/landing pages
  const featuredImages = [
    'https://images.unsplash.com/photo-1549490349-8643362247b5',
    'https://images.unsplash.com/photo-1554188248-986adbb73be4',
    'https://images.unsplash.com/photo-1515405299443-8b0bb401ec51',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1511300633959-d9eec73b137a',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
  ].slice(0, section.editorial.layoutType === 'gallery' ? 6 : 3);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`section-page mood-${section.id}`}
    >
      <SectionHero section={section} />

      <div className="section-content">
        <div className="editorial-intro">
          <p className="text-large">
            Exploring the boundaries of {section.label.toLowerCase()} through 
            sculpted narratives and digital resonance. This collection represents 
            a deep dive into {section.practicalMeaning.toLowerCase()}.
          </p>
        </div>

        <div className="section-navigator">
          <h3 className="nav-title text-xs">Deep Destinations</h3>
          <div className="sub-nav-grid">
            {section.submenus.map((sub, index) => (
              <Link key={sub.id} href={sub.href} className="sub-nav-link">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  transition={{ delay: index * 0.1 }}
                  className="sub-nav-item"
                >
                  <motion.span 
                    className="index"
                    variants={{
                      hover: { 
                        color: section.editorial.accentColor || '#ff69b4', 
                        opacity: 1, 
                        scale: 1.2,
                        textShadow: `0 0 10px ${section.editorial.accentColor || '#ff69b4'}`,
                        transition: { duration: 0.3 }
                      }
                    }}
                  >
                    0{index + 1}
                  </motion.span>
                  <motion.span 
                    className="label text-base"
                    variants={{
                      hover: { 
                        color: '#ffffff', 
                        x: 10,
                        textShadow: `0 0 15px #fff, 0 0 30px ${section.editorial.accentColor || '#ff69b4'}, 0 0 50px ${section.editorial.accentColor || '#ff69b4'}`,
                        transition: { duration: 0.3 }
                      }
                    }}
                  >
                    {sub.label}
                  </motion.span>
                  <motion.span 
                    className="arrow"
                    variants={{
                      hover: { 
                        opacity: 1, 
                        x: 15, 
                        color: section.editorial.accentColor || '#ff69b4',
                        textShadow: `0 0 10px ${section.editorial.accentColor || '#ff69b4'}`,
                        transition: { duration: 0.3 }
                      }
                    }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Dynamic Layout based on section type */}
        {section.editorial.layoutType === 'gallery' || section.editorial.layoutType === 'process' ? (
          <MediaGrid items={featuredImages} columns={section.editorial.layoutType === 'gallery' ? 3 : 2} />
        ) : null}
      </div>

      <style jsx>{`
        .section-page {
          /* Layout managed globally in globals.css */
        }
        .editorial-intro {
          margin-bottom: var(--spacing-xl);
          max-width: 600px;
          opacity: 0.8;
          line-height: 1.6;
        }
        .section-navigator {
          margin-top: var(--spacing-l);
          margin-bottom: var(--spacing-xl);
          padding-top: 0;
        }
        .nav-title {
          margin-bottom: var(--spacing-m);
          opacity: 0.4;
          letter-spacing: 0.2em;
        }
        .sub-nav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-s);
        }
        .sub-nav-item {
          padding: 12px 10px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          gap: 24px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          position: relative;
        }
        .sub-nav-item:hover {
          transform: translateX(10px);
        }
        .sub-nav-item:hover .label {
          color: #fff;
          text-shadow: 
            0 0 10px #fff,
            0 0 20px ${section.editorial.accentColor || 'var(--neon-pink)'},
            0 0 40px ${section.editorial.accentColor || 'var(--neon-pink)'};
        }
        .sub-nav-item:hover .index {
          opacity: 1;
          color: ${section.editorial.accentColor || 'var(--neon-pink)'};
          text-shadow: 0 0 10px ${section.editorial.accentColor || 'var(--neon-pink)'};
        }
        .index {
          font-family: var(--font-main);
          font-size: 0.7rem;
          font-weight: 800;
          opacity: 0.3;
          transition: all 0.4s ease;
        }
        .label {
          transition: all 0.4s ease;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.7);
        }
        .arrow {
          margin-left: 10px;
          opacity: 0;
          color: ${section.editorial.accentColor || 'var(--neon-pink)'};
          transition: all 0.4s ease;
          transform: translateX(-10px);
        }
        .sub-nav-item:hover .arrow {
          opacity: 1;
          transform: translateX(0);
          text-shadow: 0 0 10px ${section.editorial.accentColor || 'var(--neon-pink)'};
        }
      `}</style>
    </motion.div>
  );
}
