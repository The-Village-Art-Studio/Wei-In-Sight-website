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
    enableKeyboard: isOpen,
  })

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

  // Layout Constants
  const IMAGE_WIDTH = 650;
  const INFO_WIDTH = 500;
  const GAP = 48;
  const TOTAL_WIDTH = IMAGE_WIDTH + INFO_WIDTH + GAP;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[1999] bg-black/20 backdrop-blur-sm"
      />

      {/* Modal Panel - MainNav Style */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-4 md:inset-8 lg:inset-12 z-[2000] overflow-hidden rounded-2xl flex flex-col"
        style={{
          background: 'rgba(15, 6, 30, 0.4)',
          backdropFilter: 'blur(32px) saturate(250%)',
          WebkitBackdropFilter: 'blur(32px) saturate(250%)',
          border: '1px solid rgba(255, 105, 180, 0.4)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 40px rgba(255, 105, 180, 0.2) inset'
        }}
      >
        {/* Animated ambient background (Subtle) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${currentColors[0]}33 0%, transparent 70%)`,
            }}
          />
        </AnimatePresence>

        {/* Header / Actions */}
        <header className="relative z-30 flex items-center justify-end p-8 md:p-10">
          <div className="flex items-center gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 rounded-full border border-white/10 bg-white/5 px-8 py-3 backdrop-blur-xl shadow-lg"
            >
              <span className="text-sm font-medium text-white/80">{String(currentIndex + 1).padStart(2, "0")}</span>
              <span className="text-white/20">/</span>
              <span className="text-sm text-white/40">{String(items.length).padStart(2, "0")}</span>
            </motion.div>
            <button 
              onClick={onClose}
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-xl transition-all hover:bg-pink-500/20 active:scale-95 shadow-[0_0_15px_rgba(255,105,180,0.2)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500 group-hover:text-pink-400">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
          
          {/* Centered Content Wrapper (Locks Image + Info together) */}
          <div className="relative w-full max-w-[1400px] h-full mx-auto flex items-center px-8 md:px-12">
            
            {/* Slider Layer */}
            <div
              ref={sliderRef}
              className="absolute inset-0 flex items-center cursor-grab active:cursor-grabbing z-10"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <motion.div
                className="flex items-center gap-32"
                animate={{
                  // Offset calculation to keep the active image exactly in its side-by-side spot
                  // Spot = (Total Container Width / 2) - (Total Pair Width / 2)
                  x: (typeof window !== 'undefined' ? (window.innerWidth * 0.5) - (TOTAL_WIDTH * 0.5) : 0) 
                     - currentIndex * (IMAGE_WIDTH + 128) + dragX,
                }}
                transition={isDragging ? { duration: 0 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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

            {/* Info Panel Layer (Pinned beside the center point) */}
            <div 
              className="absolute z-20 pointer-events-none"
              style={{
                left: `calc(50% + ${IMAGE_WIDTH / 2 - (TOTAL_WIDTH / 2) + IMAGE_WIDTH + GAP}px)`,
                transform: 'translateX(-100%)', // Align right edge to the calculated spot? No.
                // Let's just use a simpler center-based offset:
                left: `calc(50% + ${TOTAL_WIDTH/2 - INFO_WIDTH}px)`,
                width: `${INFO_WIDTH}px`
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-pink-500/40 pointer-events-auto p-12 md:p-16 flex flex-col items-center justify-center text-center min-h-[500px] md:min-h-[650px]"
                  style={{
                    background: 'rgba(15, 6, 30, 0.5)',
                    backdropFilter: 'blur(32px) saturate(250%)',
                    WebkitBackdropFilter: 'blur(32px) saturate(250%)',
                    boxShadow: '0 32px 80px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 60px rgba(255, 105, 180, 0.2) inset'
                  }}
                >
                  <div className="flex flex-col items-center gap-12">
                    <div className="space-y-8 flex flex-col items-center">
                      <h2 
                        className="text-4xl md:text-5xl tracking-tight leading-tight uppercase" 
                        style={{ 
                          fontFamily: 'var(--font-poetic)',
                          textShadow: '0 0 20px rgba(255,255,255,0.2)',
                          color: 'var(--white)'
                        }}
                      >
                        {currentItem?.title}
                      </h2>
                      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs tracking-[0.3em] font-medium uppercase" style={{ fontFamily: 'var(--font-main)' }}>
                        <span className="text-pink-500 font-bold" style={{ textShadow: '0 0 10px var(--neon-pink)' }}>{currentItem?.year}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span className="text-white/40">{currentItem?.medium}</span>
                      </div>
                    </div>
                    
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />
                    
                    <p 
                      className="text-white/60 leading-relaxed text-base md:text-lg font-light italic max-w-sm"
                      style={{ fontFamily: 'var(--font-main)' }}
                    >
                      "{currentItem?.description}"
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <footer className="relative z-30 p-12 flex items-center justify-center">
          <NavigationDots total={items.length} current={currentIndex} onSelect={goToSlide} colors={currentColors} />
        </footer>
      </motion.div>
    </AnimatePresence>
  )
}
