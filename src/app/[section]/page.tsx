'use client';

import { useParams, notFound } from 'next/navigation';
import { NAV_SECTIONS } from '@/lib/constants';
import { motion } from 'framer-motion';

export default function SectionPage() {
  const { section: sectionId } = useParams();
  const section = NAV_SECTIONS.find(s => s.id === sectionId);

  if (!section) {
    notFound();
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="section-page"
    >
      <header className="section-hero">
        <h1 className="text-display">{section.label}</h1>
        <p className="text-large text-neon">{section.poeticLabel}</p>
        <div className="section-meta">
          <span className="text-xs">BODY ANCHOR: {section.bodyAnchor}</span>
        </div>
      </header>

      <div className="section-content">
        <div className="placeholder-grid">
          {section.submenus.map((sub) => (
            <div key={sub.id} className="placeholder-card">
              <h3 className="text-base">{sub.label}</h3>
              <p className="text-small text-gray-subtle">Content scaffolding for {sub.label}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .section-page {
          padding: var(--spacing-xl) var(--spacing-m);
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-hero {
          margin-bottom: var(--spacing-xl);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-s);
        }
        .section-meta {
          margin-top: var(--spacing-s);
          opacity: 0.5;
        }
        .section-content {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: var(--spacing-xl);
        }
        .placeholder-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-m);
        }
        .placeholder-card {
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: var(--spacing-m);
          background: rgba(255, 255, 255, 0.02);
          transition: var(--transition-medium);
        }
        .placeholder-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--neon-pink-glow);
        }
      `}</style>
    </motion.div>
  );
}
