'use client';

import { useParams, notFound } from 'next/navigation';
import { NAV_SECTIONS } from '@/lib/constants';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ContentPage() {
  const { section: sectionId, slug } = useParams();
  const section = NAV_SECTIONS.find(s => s.id === sectionId);
  const submenu = section?.submenus.find(m => m.href.endsWith(`/${slug}`));

  if (!section || !submenu) {
    notFound();
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="content-page"
    >
      <nav className="breadcrumb text-xs">
        <Link href="/">Home</Link> / <Link href={section.href}>{section.label}</Link> / <span>{submenu.label}</span>
      </nav>

      <article className="content-article">
        <header className="article-header">
          <h1 className="text-xl">{submenu.label}</h1>
          <p className="text-small text-gray-subtle">A subsection of {section.label}</p>
        </header>

        <section className="article-body">
          <div className="placeholder-content">
            <p className="text-base">
              This is a placeholder for the deep content associated with **{submenu.label}**.
              In Stage 2 and beyond, this will be wired to the Supabase CMS to pull 
              structured content, media assets, and related creative works.
            </p>
            
            <div className="mock-text-block" />
            <div className="mock-text-block" style={{ width: '80%' }} />
            <div className="mock-text-block" style={{ width: '90%' }} />
          </div>
        </section>
      </article>

      <style jsx>{`
        .content-page {
          padding: var(--spacing-xl) var(--spacing-m);
          max-width: 800px;
          margin: 0 auto;
        }
        .breadcrumb {
          margin-bottom: var(--spacing-l);
          opacity: 0.5;
        }
        .breadcrumb span {
          color: var(--neon-pink);
        }
        .article-header {
          margin-bottom: var(--spacing-l);
        }
        .article-body {
          line-height: 1.8;
        }
        .placeholder-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-m);
        }
        .mock-text-block {
          height: 1rem;
          background: rgba(255, 255, 255, 0.05);
          width: 100%;
        }
      `}</style>
    </motion.div>
  );
}
