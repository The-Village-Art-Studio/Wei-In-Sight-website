import type { MetadataRoute } from 'next';
import { NAV_SECTIONS } from '@/lib/constants';

/**
 * Dynamic sitemap generator for SEO.
 * Next.js serves this at /sitemap.xml automatically.
 *
 * Covers: homepage, all section landing pages, and all sub-pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://weiinsight.com';
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  /* ── Homepage ── */
  entries.push({
    url: SITE_URL,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 1,
  });

  /* ── Section landing pages + sub-pages ── */
  for (const section of NAV_SECTIONS) {
    // Section landing page (e.g. /sight)
    entries.push({
      url: `${SITE_URL}${section.href}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    });

    // Sub-pages (e.g. /sight/paintings)
    for (const sub of section.submenus) {
      entries.push({
        url: `${SITE_URL}${sub.href}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
