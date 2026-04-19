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

        {/* Dynamic Layout based on section type */}
        {section.editorial.layoutType === 'gallery' || section.editorial.layoutType === 'process' ? (
          <MediaGrid items={featuredImages} columns={section.editorial.layoutType === 'gallery' ? 3 : 2} />
        ) : null}

        <div className="section-navigator">
          <h3 className="nav-title text-xs">Deep Destinations</h3>
          <div className="sub-nav-grid">
            {section.submenus.map((sub, index) => (
              <Link key={sub.id} href={sub.href}>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="sub-nav-item"
                >
                  <span className="index">0{index + 1}</span>
                  <span className="label text-base">{sub.label}</span>
                  <span className="arrow">→</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .section-page {
          padding: calc(var(--spacing-xl) * 2) var(--spacing-m) var(--spacing-xl);
          max-width: 1200px;
          margin: 0 auto;
        }
        .editorial-intro {
          margin-bottom: var(--spacing-xl);
          max-width: 600px;
          opacity: 0.8;
          line-height: 1.6;
        }
        .section-navigator {
          margin-top: var(--spacing-xl);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: var(--spacing-l);
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
          padding: var(--spacing-m);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          gap: var(--spacing-m);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sub-nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: ${section.editorial.accentColor || 'var(--neon-pink)'};
          transform: translateX(10px);
        }
        .index {
          font-family: var(--font-main);
          font-size: 0.7rem;
          opacity: 0.4;
        }
        .arrow {
          margin-left: auto;
          opacity: 0;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }
        .sub-nav-item:hover .arrow {
          opacity: 1;
          transform: translateX(5px);
        }
      `}</style>
    </motion.div>
  );
}
