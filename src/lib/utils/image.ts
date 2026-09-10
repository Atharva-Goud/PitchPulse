/**
 * Image normalization utilities.
 *
 * The data layer may expose image URLs under different field names
 * (image, imageUrl, thumbnail, urlToImage, etc.). These helpers normalize
 * whatever the source provides into a single safe URL without modifying
 * the original data.
 */

type ImageLike = { image?: string | null; imageUrl?: string | null; thumbnail?: string | null; urlToImage?: string | null } | null | undefined;

/**
 * Resolve the best available image URL from an object that may expose
 * image fields under multiple names. Returns a trimmed string or null.
 */
export function getImageUrl(source: ImageLike): string | null {
  if (!source) return null;

  const candidates = [
    source.image,
    source.imageUrl,
    source.thumbnail,
    source.urlToImage,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }

  return null;
}

/**
 * Normalize a raw image URL string.
 * - Strips whitespace
 * - Ensures the URL is a valid http(s) URL
 * - Returns null for invalid/relative URLs
 */
export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const trimmed = url.trim();
  if (trimmed.length === 0) return null;

  // Reject relative URLs — images must be absolute.
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Resolve and normalize an image URL in one step.
 */
export function resolveImageUrl(source: ImageLike): string | null {
  return normalizeImageUrl(getImageUrl(source));
}