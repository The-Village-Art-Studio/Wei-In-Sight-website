-- Migration: Add size column to album_items and page_gallery_items
ALTER TABLE album_items ADD COLUMN IF NOT EXISTS size TEXT;
ALTER TABLE page_gallery_items ADD COLUMN IF NOT EXISTS size TEXT;
