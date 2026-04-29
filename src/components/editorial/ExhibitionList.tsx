'use client';

import { motion } from 'framer-motion';
import { ExhibitionItem } from '@/lib/mockContent';

interface ExhibitionListProps {
  items: ExhibitionItem[];
}

export default function ExhibitionList({ items }: ExhibitionListProps) {
  return (
    <div className="exhibition-list-wrapper py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel rounded-[24px] overflow-hidden mx-auto max-w-[1400px]"
        style={{
          background: 'rgba(15, 6, 30, 0.85)',
          backdropFilter: 'blur(40px) saturate(250%)',
          WebkitBackdropFilter: 'blur(40px) saturate(250%)',
          border: '1px solid rgba(255, 105, 180, 0.4)',
          boxShadow: `
            0 24px 64px rgba(0, 0, 0, 0.9),
            0 0 0 1px rgba(255, 255, 255, 0.15) inset,
            0 0 40px rgba(255, 105, 180, 0.2) inset
          `
        }}
      >
        {/* EXPLICIT INLINE PADDING TO FORCE SPACE ON ALL 4 SIDES */}
        <div style={{ padding: '120px 100px' }}>
          <div className="flex flex-col gap-10">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.6 }}
                className="group relative grid grid-cols-[100px_1fr_220px] items-center gap-12 py-8 px-10 rounded-xl transition-all hover:bg-white/[0.03]"
              >
                {/* Year (Left) */}
                <div className="text-base font-bold text-pink-500 tracking-widest uppercase">
                  {item.year}
                </div>

                {/* Title (Middle) */}
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-base text-white/90 group-hover:text-white transition-colors tracking-wide leading-relaxed flex items-center gap-4">
                      {item.title}
                      {item.isAward && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-pink-500/10 border border-pink-500/30 rounded-full text-[10px] text-pink-500 font-bold uppercase tracking-widest">
                          Award / Feature
                        </span>
                      )}
                    </h4>
                  </div>
                </div>
                
                {/* Location (Right) */}
                <div className="text-base tracking-wider uppercase opacity-40 group-hover:opacity-100 transition-opacity text-right">
                  {item.location}
                </div>

                {/* Subtle Hover Glow Accent */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-pink-500 rounded-full blur-[1px]"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .glass-panel {
          position: relative;
        }
      `}</style>
    </div>
  );
}
