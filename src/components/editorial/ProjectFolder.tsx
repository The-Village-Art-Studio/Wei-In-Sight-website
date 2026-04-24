'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface ProjectFolderProps {
  id: string;
  title: string;
  description?: string;
  images: string[];
  href: string;
  index: number;
}

export default function ProjectFolder({ id, title, description, images, href, index }: ProjectFolderProps) {
  const stackImages = images.slice(0, 3); // Keep it cleaner with 3 images

  return (
    <Link href={href} className="project-folder-link">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        whileHover="hover"
        className="project-folder-container"
      >
        {/* The "Back Panel" (Glass Folder Body) */}
        <div className="folder-back-panel">
          {/* Folder Tab Effect */}
          <div className="folder-tab" />
          
          <div className="folder-content">
            <div className="folder-stack">
              {stackImages.map((img, i) => (
                <motion.div
                  key={i}
                  className="stack-image-wrapper"
                  variants={{
                    hover: {
                      y: -15 * (stackImages.length - i),
                      rotate: (i - 1) * 4,
                      scale: 1.02,
                      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                    }
                  }}
                  style={{
                    zIndex: i + 1,
                    transform: `translateY(${i * 8}px) rotate(${(i - 1) * 2}deg)`,
                  }}
                >
                  <img src={img} alt="" className="stack-image" />
                  <div className="image-overlay" />
                </motion.div>
              ))}
            </div>

            <div className="folder-info">
              <motion.h4 
                className="folder-title"
                variants={{
                  hover: { color: 'var(--neon-pink)', x: 5 }
                }}
              >
                {title}
              </motion.h4>
              {description && <p className="folder-description">{description}</p>}
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .project-folder-link {
          display: block;
          text-decoration: none;
          color: inherit;
        }
        
        .project-folder-container {
          position: relative;
          padding-top: 20px; /* Space for the tab */
          cursor: pointer;
        }

        .folder-back-panel {
          position: relative;
          background: rgba(15, 6, 30, 0.85);
          backdrop-filter: blur(32px) saturate(250%);
          -webkit-backdrop-filter: blur(32px) saturate(250%);
          border: 1px solid rgba(255, 105, 180, 0.3);
          border-radius: 0 20px 20px 20px;
          padding: 32px;
          box-shadow:
            0 24px 64px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 0 40px rgba(255, 105, 180, 0.15) inset;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .folder-tab {
          position: absolute;
          top: -20px;
          left: -1px;
          width: 120px;
          height: 21px;
          background: rgba(15, 6, 30, 0.85);
          backdrop-filter: blur(32px) saturate(250%);
          -webkit-backdrop-filter: blur(32px) saturate(250%);
          border: 1px solid rgba(255, 105, 180, 0.3);
          border-bottom: none;
          border-radius: 12px 12px 0 0;
          box-shadow: 0 -5px 15px rgba(0,0,0,0.2);
          z-index: 1;
        }

        .project-folder-container:hover .folder-back-panel {
          border-color: rgba(255, 105, 180, 0.6);
          box-shadow:
            0 32px 80px rgba(0, 0, 0, 0.95),
            0 0 0 1px rgba(255, 255, 255, 0.15) inset,
            0 0 60px rgba(255, 105, 180, 0.25) inset;
        }

        .folder-content {
          display: flex;
          flex-direction: column;
          gap: 32px;
          position: relative;
        }

        .folder-stack {
          position: relative;
          height: 320px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
          border-radius: 12px;
          overflow: hidden; /* Contain the images here */
          background: rgba(0,0,0,0.2);
        }

        .stack-image-wrapper {
          position: absolute;
          inset: 0; /* Fill the stack container exactly */
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: #111;
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.4s ease;
        }

        .stack-image {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          opacity: 0.9;
          transition: opacity 0.4s ease;
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.6));
        }

        .folder-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          z-index: 5; /* Ensure text is always on top */
        }

        .folder-title {
          font-family: var(--font-main);
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--white);
          text-transform: uppercase;
          transition: all 0.4s ease;
        }

        .folder-description {
          font-size: 0.8rem;
          line-height: 1.6;
          opacity: 0.5;
          font-weight: 300;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .folder-stack {
            height: 200px;
          }
        }
      `}</style>
    </Link>
  );
}
