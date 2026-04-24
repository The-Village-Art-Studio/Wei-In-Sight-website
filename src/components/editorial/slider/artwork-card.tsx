"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { GalleryItem } from "@/lib/mockContent"

interface ArtworkCardProps {
  artwork: GalleryItem
  isActive: boolean
  dragOffset: number
  index: number
  currentIndex: number
}

export function ArtworkCard({ artwork, isActive, dragOffset, index, currentIndex }: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const distance = index - currentIndex
  const parallaxOffset = dragOffset * (0.1 * (distance + 1))

  return (
    <motion.div
      className="relative flex-shrink-0"
      animate={{
        scale: isActive ? 1 : 0.85,
        opacity: isActive ? 1 : 0.5,
        rotateY: distance * 5,
      }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      style={{
        x: parallaxOffset,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="group relative overflow-hidden rounded-2xl"
        animate={{
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Glassmorphism frame */}
        <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm" />

        {/* Image container */}
        <div className="relative h-[500px] w-[500px] overflow-hidden rounded-2xl p-3 md:h-[650px] md:w-[650px]">
          <motion.img
            src={artwork.url}
            alt={artwork.title}
            className="h-full w-full rounded-xl object-cover"
            crossOrigin="anonymous"
            draggable={false}
          />
        </div>
      </motion.div>

      {/* Reflection effect */}
      <motion.div
        className="absolute -bottom-20 left-3 right-3 h-20 overflow-hidden rounded-2xl opacity-10 blur-sm"
        style={{
          background: `linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)`,
          transform: "scaleY(-1)",
        }}
        animate={{ opacity: isActive ? 0.1 : 0.02 }}
      />
    </motion.div>
  )
}
