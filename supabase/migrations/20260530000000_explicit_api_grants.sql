-- ============================================================
-- WEI IN SIGHT: Explicit Data API Grants
-- Required for Supabase breaking change (May 30, 2026):
--   New projects no longer auto-expose public schema tables
--   via PostgREST / supabase-js without explicit GRANTs.
-- Rollout to all existing projects: October 30, 2026.
-- Reference: https://supabase.com/docs/guides/database/postgres/roles
--
-- Uses conditional DO blocks so this migration is safe to run
-- regardless of which tables exist on the target database.
-- ============================================================

DO $$
DECLARE
  tbl text;
  -- Tables with public read access (anon SELECT + authenticated/service_role full)
  public_tables text[] := ARRAY[
    'sections',
    'collections',
    'collection_items',
    'works',
    'writing_entries',
    'pages',
    'albums',
    'album_items',
    'page_gallery_items',
    'exhibitions',
    'buy_art_items'
  ];
  -- Tables with admin-only access (no anon access at all)
  admin_only_tables text[] := ARRAY[
    'site_settings',
    'admin_users'
  ];
BEGIN
  -- ── Public-readable tables ──────────────────────────────────
  FOREACH tbl IN ARRAY public_tables LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = tbl
    ) THEN
      EXECUTE format('GRANT SELECT ON public.%I TO anon', tbl);
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', tbl);
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO service_role', tbl);
      RAISE NOTICE 'Granted public read + admin write on public.%', tbl;
    ELSE
      RAISE NOTICE 'Skipped % — table does not exist on this database', tbl;
    END IF;
  END LOOP;

  -- ── Admin-only tables (no anon access) ─────────────────────
  FOREACH tbl IN ARRAY admin_only_tables LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = tbl
    ) THEN
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', tbl);
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO service_role', tbl);
      RAISE NOTICE 'Granted admin-only access on public.%', tbl;
    ELSE
      RAISE NOTICE 'Skipped % — table does not exist on this database', tbl;
    END IF;
  END LOOP;

  -- ── Inquiries: anon INSERT only (form submissions) ──────────
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'inquiries'
  ) THEN
    EXECUTE 'GRANT INSERT ON public.inquiries TO anon';
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO authenticated';
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO service_role';
    RAISE NOTICE 'Granted anon INSERT + admin full access on public.inquiries';
  ELSE
    RAISE NOTICE 'Skipped inquiries — table does not exist on this database';
  END IF;

END $$;
