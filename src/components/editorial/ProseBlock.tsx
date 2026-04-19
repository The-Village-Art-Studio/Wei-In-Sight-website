'use client';

import { motion } from 'framer-motion';

interface ProseBlockProps {
  content: string;
  type?: 'standard' | 'quote' | 'narrative';
}

export default function ProseBlock({ content, type = 'standard' }: ProseBlockProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`prose-block type-${type}`}
    >
      {type === 'quote' ? (
        <blockquote className="text-xl">
          {content}
        </blockquote>
      ) : (
        <p className={type === 'narrative' ? 'text-large' : 'text-base'}>
          {content}
        </p>
      )}

      <style jsx>{`
        .prose-block {
          margin-bottom: var(--spacing-m);
          max-width: 680px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .type-standard {
          font-family: var(--font-main);
          opacity: 0.8;
        }

        .type-quote {
          font-family: var(--font-poetic);
          border-left: 2px solid var(--neon-pink);
          padding-left: var(--spacing-m);
          margin: var(--spacing-l) 0;
          color: var(--white);
          font-style: italic;
        }

        .type-narrative {
          font-family: var(--font-poetic);
          letter-spacing: 0.02em;
          opacity: 1;
        }

        @media (max-width: 768px) {
          .prose-block {
            max-width: 100%;
          }
        }
      `}</style>
    </motion.div>
  );
}
