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
  // We only show up to 3-5 images in the stack
  const stackImages = images.slice(0, 5);

  return (
    <Link href={href} className="project-folder-link">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        whileHover="hover"
        className="project-folder"
      >
        <div className="folder-stack">
          {stackImages.map((img, i) => (
            <motion.div
              key={i}
              className="stack-image-wrapper"
              variants={{
                hover: {
                  y: -10 * (stackImages.length - i),
                  rotate: (i - Math.floor(stackImages.length / 2)) * 5,
                  scale: 1.05,
                  transition: { duration: 0.4, ease: "easeOut" }
                }
              }}
              style={{
                zIndex: i,
                transform: `translateY(${i * 4}px) rotate(${(i - Math.floor(stackImages.length / 2)) * 2}deg)`,
              }}
            >
              <img src={img} alt={`${title} preview ${i}`} className="stack-image" />
              <div className="image-overlay" />
            </motion.div>
          ))}
        </div>

        <div className="folder-info">
          <h4 className="folder-title text-base">{title}</h4>
          {description && <p className="folder-description text-xs opacity-50">{description}</p>}
          <span className="item-count text-xs opacity-30">{images.length} works</span>
        </div>
      </motion.div>

      <style jsx>{`
        .project-folder-link {
          display: block;
          text-decoration: none;
          color: inherit;
        }
        .project-folder {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 24px;
          cursor: pointer;
        }
        .folder-stack {
          position: relative;
          height: 320px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
        }
        .stack-image-wrapper {
          position: absolute;
          width: 80%;
          height: 100%;
          border-radius: 4px;
          overflow: hidden;
          background: #111;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.05);
          transition: transform 0.4s ease;
        }
        .stack-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.8;
          transition: opacity 0.4s ease;
        }
        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5));
        }
        .project-folder:hover .stack-image {
          opacity: 1;
        }
        .folder-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .folder-title {
          font-weight: 500;
          letter-spacing: 0.05em;
          color: var(--white);
          transition: color 0.3s ease;
        }
        .project-folder:hover .folder-title {
          color: var(--neon-pink);
          text-shadow: 0 0 10px var(--neon-pink-glow);
        }
        .folder-description {
          line-height: 1.4;
        }
        .item-count {
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      `}</style>
    </Link>
  );
}
