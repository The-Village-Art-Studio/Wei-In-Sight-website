-- WEI IN SIGHT: Schema Expansion v2
-- Adds pages table, exhibitions table, inquiries (CRM) table

-- 1. PAGES (metadata for every sub-route, e.g., sight/paintings)
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key section_key_enum REFERENCES sections(section_key) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    hero_image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(section_key, slug)
);

-- 2. ALBUMS (nested folder groupings within pages, e.g., "Atmospheric Studies" under paintings)
CREATE TABLE IF NOT EXISTS albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(page_id, slug)
);

-- 3. ALBUM ITEMS (individual images/videos within albums)
CREATE TABLE IF NOT EXISTS album_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    title TEXT,
    year TEXT,
    medium TEXT,
    description TEXT,
    link TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PAGE GALLERY ITEMS (flat gallery items not inside an album, e.g., music-archive, poems, journey)
CREATE TABLE IF NOT EXISTS page_gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    title TEXT,
    year TEXT,
    medium TEXT,
    description TEXT,
    link TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. EXHIBITIONS (Exhibitions & Features page content)
CREATE TABLE IF NOT EXISTS exhibitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    is_award BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. INQUIRIES (CRM for contact + commission forms)
CREATE TYPE inquiry_type_enum AS ENUM ('contact', 'commission');
CREATE TYPE inquiry_status_enum AS ENUM ('new', 'read', 'replied', 'archived');

CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    type inquiry_type_enum DEFAULT 'contact',
    status inquiry_status_enum DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for new tables
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Admin write pages" ON pages FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read albums" ON albums FOR SELECT USING (true);
CREATE POLICY "Admin write albums" ON albums FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read album_items" ON album_items FOR SELECT USING (true);
CREATE POLICY "Admin write album_items" ON album_items FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read page_gallery_items" ON page_gallery_items FOR SELECT USING (true);
CREATE POLICY "Admin write page_gallery_items" ON page_gallery_items FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read exhibitions" ON exhibitions FOR SELECT USING (true);
CREATE POLICY "Admin write exhibitions" ON exhibitions FOR ALL USING (auth.role() = 'authenticated');

-- Inquiries: public can INSERT (form submissions), only admins can read/update
CREATE POLICY "Public submit inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage inquiries" ON inquiries FOR ALL USING (auth.role() = 'authenticated');
