"use client"

import { useState, useEffect } from "react"
import { extractColors } from "@/lib/slider/color-extractor"
import { GalleryItem } from "@/lib/mockContent"

const DEFAULT_COLORS = ["#1a1a2e", "#16213e", "#0f3460"]

export function useColorExtraction(artworks: GalleryItem[]): Record<string, string[]> {
  const [colors, setColors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    artworks.forEach((artwork) => {
      extractColors(artwork.url).then((extractedColors) => {
        setColors((prev) => ({ ...prev, [artwork.id]: extractedColors }))
      })
    })
  }, [artworks])

  return colors
}

export function useCurrentColors(colors: Record<string, string[]>, artworkId: string | undefined): string[] {
  return colors[artworkId ?? ''] || [...DEFAULT_COLORS]
}
