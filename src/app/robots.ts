import type { MetadataRoute } from 'next';

/**
 * Generates robots.txt for search engine crawlers.
 * Next.js serves this at /robots.txt automatically.
 *
 * - Allows all crawlers on public pages
 * - Blocks /admin routes from indexing
 * - Points crawlers to the sitemap
 * - Explicitly allows AI/LLM crawlers (Googlebot, GPTBot, ClaudeBot, etc.)
 */
export default function robots(): MetadataRoute.Robots {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://weiinsight.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
