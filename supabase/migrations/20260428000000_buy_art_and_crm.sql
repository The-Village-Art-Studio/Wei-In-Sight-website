-- WEI IN SIGHT: Schema Expansion v3
-- Buy Art items, Inquiry notes/outcome, and Site Settings expansion

-- 1. BUY ART ITEMS (Logo Grid for the Buy Art page)
CREATE TABLE IF NOT EXISTS buy_art_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    logo_url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    link TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Expand INQUIRIES with notes and outcome tracking
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS outcome TEXT; -- 'won', 'lost', 'pending' for commissions; 'replied', 'need_follow_up' for contact

-- 3. Expand SITE SETTINGS for full admin config
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS notification_email TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS spotify_url TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS apple_music_url TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS seo_keywords TEXT;

-- RLS for buy_art_items
ALTER TABLE buy_art_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read buy_art_items" ON buy_art_items FOR SELECT USING (true);
CREATE POLICY "Admin write buy_art_items" ON buy_art_items FOR ALL USING (auth.role() = 'authenticated');

-- Seed Buy Art items from mockContent.ts
INSERT INTO buy_art_items (logo_url, title, description, link, sort_order) VALUES
('/assets/artrewards-logo.png', 'ArtRewards', 'Discover curated physical editions and exclusive prints of my visual works available for collectors.', NULL, 0),
('/assets/artsy-logo.png', 'Artsy', 'Access my larger fine art pieces and high-end works through global gallery partners and auctions.', NULL, 1),
('/assets/helloart-logo.png', 'HelloArt', 'Encounter my work in person at various high-traffic professional venues and galleries across North America.', NULL, 2),
('/assets/righttime-logo.png', 'Right Time', 'Explore my horological collaborations where art meets precision in exclusive Swiss-made collections.', NULL, 3);

-- Seed default site settings
INSERT INTO site_settings (site_title, site_subtitle, primary_email, notification_email, instagram_url, youtube_url)
VALUES ('WEI IN SIGHT', 'The creative atlas of Jacky Ho', 'jackyho@weiinsight.com', 'jackyho@weiinsight.com', NULL, NULL)
ON CONFLICT DO NOTHING;
