'use client';

import { motion } from 'framer-motion';
import { Section } from '@/lib/constants';

interface SectionHeroProps {
  section: Section;
  compact?: boolean;
}

export default function SectionHero({ section, compact = false }: SectionHeroProps) {
  const { editorial, label, poeticLabel } = section;

  return (
    <header className={`section-hero ${compact ? 'compact' : ''} layout-${editorial.layoutType}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hero-content"
      >
        <div className="hero-meta">
          <span className="accent-line" style={{ backgroundColor: editorial.accentColor }} />
          <span className="text-xs uppercase tracking-widest opacity-50">{label}</span>
        </div>
        <h1 className="text-display hero-title">{label}</h1>
        <p className="text-large hero-subtitle text-neon" style={{ textShadow: `0 0 10px ${editorial.accentColor}66` }}>
          {poeticLabel}
        </p>
      </motion.div>

      <style jsx>{`
        .section-hero {
          padding: var(--spacing-m) 0;
          margin-bottom: var(--spacing-l);
          position: relative;
          z-index: 10;
        }
        .section-hero.compact {
          padding: 0;
          margin-bottom: var(--spacing-m);
        }
        .hero-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-s);
          margin-bottom: var(--spacing-s);
        }
        .accent-line {
          width: 40px;
          height: 1px;
        }
        .hero-title {
          margin-bottom: var(--spacing-xs);
          line-height: 0.9;
        }
        .hero-subtitle {
          font-family: var(--font-poetic);
          opacity: 0.9;
        }

        /* Layout specific adjustments (Simplified to ensure consistency) */
        .layout-prose .hero-content, 
        .layout-narrative .hero-content {
          max-width: 800px;
          margin: 0;
          text-align: left;
        }
        .layout-prose .hero-meta,
        .layout-narrative .hero-meta {
          justify-content: flex-start;
        }
        
        @media (max-width: 768px) {
          .section-hero {
            padding: var(--spacing-m) 0;
          }
        }
      `}</style>
    </header>
  );
}
