"use client"

import React, { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArtworkCard } from "./slider/artwork-card"
import { NavigationDots } from "./slider/navigation-dots"
import { useSliderNavigation } from "@/hooks/use-slider-navigation"
import { useSliderDrag } from "@/hooks/use-slider-drag"
import { useSliderWheel } from "@/hooks/use-slider-wheel"
import { useColorExtraction, useCurrentColors } from "@/hooks/use-color-extraction"
import { GalleryItem } from "@/lib/mockContent"

interface SlideshowPanelProps {
  items: GalleryItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function SlideshowPanel({ items, initialIndex, isOpen, onClose }: SlideshowPanelProps) {
  const sliderRef = useRef<HTMLDivElement>(null)

  const { currentIndex, goToNext, goToPrev, goToSlide } = useSliderNavigation({
    totalSlides: items.length,
    enableKeyboard: isOpen, // only when open
  })

  // Sync initialIndex when opening
  useEffect(() => {
    if (isOpen) {
      goToSlide(initialIndex)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen, initialIndex, goToSlide])

  const { isDragging, dragX, handleDragStart, handleDragMove, handleDragEnd } = useSliderDrag({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
  })

  useSliderWheel({
    sliderRef,
    onScrollLeft: goToNext,
    onScrollRight: goToPrev,
  })

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const colors = useColorExtraction(items)
  const currentColors = useCurrentColors(colors, items[currentIndex]?.id)
  const currentItem = items[currentIndex]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] overflow-hidden bg-black/90"
      >
        {/* Animated ambient background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 30% 20%, ${currentColors[0]}66 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, ${currentColors[1]}66 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, ${currentColors[2]}44 0%, transparent 70%),
                linear-gradient(180deg, #0a0a0a 0%, #111111 100%)
              `,
            }}
          />
        </AnimatePresence>

        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-[60px]" />

        {/* Header / Close Button */}
        <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="font-serif text-2xl tracking-widest text-white/90 uppercase" style={{ color: 'var(--neon-pink)' }}>Gallery</h1>
          </motion.div>
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md"
            >
              <span className="text-sm text-white/60">{String(currentIndex + 1).padStart(2, "0")}</span>
              <span className="text-white/30">/</span>
              <span className="text-sm text-white/40">{String(items.length).padStart(2, "0")}</span>
            </motion.div>
            <motion.button 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 p-2 px-4 backdrop-blur-md hover:bg-white/10 transition-colors"
            >
              Close
            </motion.button>
          </div>
        </header>

        {/* Main Layout: Slider (Left/Center) + Info Panel (Right) */}
        <div className="absolute inset-0 flex items-center z-10 pt-20 pb-20">
          
          {/* Slider Area */}
          <div
            ref={sliderRef}
            className="relative flex h-full flex-1 cursor-grab items-center active:cursor-grabbing overflow-hidden"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <motion.div
              className="flex items-center gap-8 px-[calc(40vw-200px)] md:gap-16 md:px-[calc(40vw-250px)]"
              animate={{
                x: -currentIndex * (typeof window !== 'undefined' && window.innerWidth > 768 ? 564 : 432) + dragX,
              }}
              transition={isDragging ? { duration: 0 } : { duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            >
              {items.map((item, index) => (
                <ArtworkCard
                  key={item.id}
                  artwork={item}
                  isActive={index === currentIndex}
                  dragOffset={dragX}
                  index={index}
                  currentIndex={currentIndex}
                />
              ))}
            </motion.div>
          </div>

          {/* Info Panel (Right Side) */}
          <div className="w-[400px] h-full flex items-center pr-12 hidden lg:flex relative z-20 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 pointer-events-auto"
                style={{
                  boxShadow: `0 20px 40px -10px ${currentColors[0]}44`
                }}
              >
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-3xl font-serif text-white mb-2 leading-tight">{currentItem?.title}</h2>
                    <div className="flex gap-3 text-sm tracking-widest uppercase opacity-60">
                      <span>{currentItem?.year}</span>
                      <span>•</span>
                      <span>{currentItem?.medium}</span>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-white/10" />
                  
                  <p className="text-white/70 leading-relaxed text-sm">
                    {currentItem?.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation dots */}
        <NavigationDots total={items.length} current={currentIndex} onSelect={goToSlide} colors={currentColors} />

        {/* Keyboard hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-8 hidden items-center gap-3 text-white/30 md:flex z-20"
        >
          <kbd className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs">←</kbd>
          <kbd className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs">→</kbd>
          <span className="text-xs">navigate</span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
