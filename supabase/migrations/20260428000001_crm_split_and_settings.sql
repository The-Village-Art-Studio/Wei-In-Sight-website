-- WEI IN SIGHT: Schema Expansion v4
-- CRM Split (won/lost + follow-up) and Site Settings identity expansion

-- 1. Expand INQUIRIES for split CRM views
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS won_lost BOOLEAN;          -- TRUE=Won, FALSE=Lost, NULL=Pending (commissions)
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS follow_up_needed BOOLEAN DEFAULT false;  -- Contact follow-up flag

-- 2. Expand SITE SETTINGS for identity / branding
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS favicon_url TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS brand_wordmark_url TEXT;
