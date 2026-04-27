-- WEI IN SIGHT: Initial Supabase Schema
-- This schema supports dynamic editing of page covers/titles, and full CRUD for nested albums, galleries, and videos.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE section_key_enum AS ENUM ('sight', 'sound', 'touch', 'voice', 'dream', 'heart', 'pulse');
CREATE TYPE user_role_enum AS ENUM ('owner', 'editor');

-- 2. ADMIN USERS
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role_enum DEFAULT 'editor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SITE SETTINGS (Global config)
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_title TEXT NOT NULL DEFAULT 'WEI IN SIGHT',
    site_subtitle TEXT,
    primary_email TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SECTIONS (Dynamic Page Metadata: Covers, Titles, Subtitles)
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key section_key_enum UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    hero_image_url TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ALBUMS / GALLERIES (Nested Collections for arrays of images/videos)
-- Maps to things like "Watchmaking", "Mixed Media", "Audio-Visual Work", "Music Archive"
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key section_key_enum REFERENCES sections(section_key) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    cover_image_url TEXT,
    collection_type TEXT NOT NULL DEFAULT 'gallery', -- 'gallery', 'album', 'video-gallery'
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. COLLECTION ITEMS (The individual images or YouTube videos inside the arrays)
CREATE TABLE collection_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL, -- Cloudinary/Supabase Image URL or YouTube Embed URL
    title TEXT,
    year TEXT,
    medium TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. WORKS (Physical/Visual standalone art pieces)
CREATE TABLE works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    section_key section_key_enum DEFAULT 'sight',
    year_created INTEGER,
    medium TEXT,
    description TEXT,
    cover_image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. WRITING ENTRIES (Poems, Lyrics, Novel Excerpts)
CREATE TABLE writing_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    section_key section_key_enum DEFAULT 'voice',
    body_text TEXT,
    cover_image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. ROW LEVEL SECURITY (RLS)
-- Force all tables to require authentication for writes, but allow public reads.

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_entries ENABLE ROW LEVEL SECURITY;

-- Create policies (Example for Sections: Public Read, Authenticated Write)
CREATE POLICY "Allow public read-only access to sections" ON sections FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to sections" ON sections FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read-only access to collections" ON collections FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to collections" ON collections FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read-only access to collection_items" ON collection_items FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to collection_items" ON collection_items FOR ALL USING (auth.role() = 'authenticated');

-- We can add similar policies for works, writing_entries, etc.
CREATE POLICY "Allow public read-only access to works" ON works FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to works" ON works FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read-only access to writing_entries" ON writing_entries FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to writing_entries" ON writing_entries FOR ALL USING (auth.role() = 'authenticated');
