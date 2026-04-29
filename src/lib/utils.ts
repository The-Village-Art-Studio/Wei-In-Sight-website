/**
 * Formats a URL to ensure it has a protocol (http/https).
 * If it starts with www. or just a domain name, https:// is prepended.
 */
export function formatExternalLink(url: string | null | undefined): string {
  if (!url) return '';
  
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Check if it already has a protocol
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Prepend https://
  return `https://${trimmed}`;
}
