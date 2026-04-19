'use client';

import { motion } from 'framer-motion';

interface ProseBlockProps {
  content: string;
  type?: 'standard' | 'quote' | 'narrative';
}

export default function ProseBlock({ content, type = 'standard' }: ProseBlockProps) {
  const renderContent = (text: string) => {
    return text.split('\n\n').map((paragraph, pIdx) => {
      // Handle Headers (###)
      if (paragraph.startsWith('### ')) {
        const headerText = paragraph.replace('### ', '');
        return <h3 key={pIdx} className="prose-header">{headerText}</h3>;
      }
      
      // Handle Standard Paragraphs
      return (
        <p key={pIdx} className={type === 'narrative' ? 'text-large' : 'text-base'}>
          {paragraph}
        </p>
      );
    });
  };

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
        <div className="prose-inner">
          {renderContent(content)}
        </div>
      )}

      <style jsx>{`
        .prose-block {
          margin-bottom: var(--spacing-m);
          max-width: 680px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .prose-header {
          font-family: var(--font-poetic);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--neon-pink);
          text-shadow: 0 0 10px rgba(255, 46, 115, 0.3);
          margin-bottom: 12px;
          margin-top: 24px;
        }

        .prose-header:first-child {
          margin-top: 0;
        }

        .prose-inner {
          display: flex;
          flex-direction: column;
        }

        .type-standard {
          font-family: var(--font-main);
          opacity: 0.9;
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
