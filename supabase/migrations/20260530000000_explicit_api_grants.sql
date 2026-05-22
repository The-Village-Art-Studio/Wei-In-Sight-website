-- ============================================================
-- WEI IN SIGHT: Explicit Data API Grants
-- Required for Supabase breaking change (May 30, 2026):
--   New projects no longer auto-expose public schema tables
--   via PostgREST / supabase-js without explicit GRANTs.
-- Rollout to all existing projects: October 30, 2026.
-- Reference: https://supabase.com/docs/guides/database/postgres/roles
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. SITE SETTINGS
--    Read: admin (authenticated) only
--    Write: admin only
-- ─────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO service_role;
-- anon intentionally excluded: site_settings is admin-only data

-- ─────────────────────────────────────────────
-- 2. ADMIN USERS
--    Read/Write: admin (authenticated) only
-- ─────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO service_role;
-- anon intentionally excluded: never expose user records publicly

-- ─────────────────────────────────────────────
-- 3. SECTIONS
--    Read: public (anon)
--    Write: admin (authenticated)
-- ─────────────────────────────────────────────
GRANT SELECT ON public.sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sections TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sections TO service_role;

-- ─────────────────────────────────────────────
-- 4. COLLECTIONS
--    Read: public (anon)
--    Write: admin (authenticated)
-- ─────────────────────────────────────────────
GRANT SELECT ON public.collections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collections TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collections TO service_role;

-- ─────────────────────────────────────────────
-- 5. COLLECTION ITEMS
--    Read: public (anon)
--    Write: admin (authenticated)
-- ─────────────────────────────────────────────
GRANT SELECT ON public.collection_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collection_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collection_items TO service_role;

-- ─────────────────────────────────────────────
-- 6. WORKS
--    Read: public (anon)
--    Write: admin (authenticated)
-- ─────────────────────────────────────────────
GRANT SELECT ON public.works TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.works TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.works TO service_role;

-- ─────────────────────────────────────────────
-- 7. WRITING ENTRIES
--    Read: public (anon)
--    Write: admin (authenticated)
-- ─────────────────────────────────────────────
GRANT SELECT ON public.writing_entries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.writing_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.writing_entries TO service_role;

-- ─────────────────────────────────────────────
-- 8. PAGES
--    Read: public (anon)
--    Write: admin (authenticated)
-- ─────────────────────────────────────────────
GRANT SELECT ON public.pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO service_role;

-- ─────────────────────────────────────────────
-- 9. ALBUMS
--    Read: public (anon)
--    Write: admin (authenticated)
-- ─────────────────────────────────────────────
GRANT SELECT ON public.albums TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.albums TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.albums TO service_role;

-- ─────────────────────────────────────────────
-- 10. ALBUM ITEMS
--    Read: public (anon)
--    Write: admin (authenticated)
-- ─────────────────────────────────────────────
GRANT SELECT ON public.album_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.album_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.album_items TO service_role;

-- ─────────────────────────────────────────────
-- 11. PAGE GALLERY ITEMS
--    Read: public (anon)
--    Write: admin (authenticated)
-- ─────────────────────────────────────────────
GRANT SELECT ON public.page_gallery_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_gallery_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_gallery_items TO service_role;

-- ─────────────────────────────────────────────
-- 12. EXHIBITIONS
--    Read: public (anon)
--    Write: admin (authenticated)
-- ─────────────────────────────────────────────
GRANT SELECT ON public.exhibitions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exhibitions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exhibitions TO service_role;

-- ─────────────────────────────────────────────
-- 13. INQUIRIES
--    Insert: public (anon) — contact/commission form submissions
--    Read/Update/Delete: admin only
-- ─────────────────────────────────────────────
GRANT INSERT ON public.inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO service_role;

-- ─────────────────────────────────────────────
-- 14. BUY ART ITEMS
--    Read: public (anon)
--    Write: admin (authenticated)
-- ─────────────────────────────────────────────
GRANT SELECT ON public.buy_art_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.buy_art_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.buy_art_items TO service_role;
