/**
 * Team logo normalization utilities.
 *
 * Team data may expose the logo under different field names
 * (logo, crest, logoUrl, image, badge). These helpers normalize
 * whatever the source provides into a single safe URL without
 * modifying the original data.
 */

type TeamLike = {
  logo?: string | null;
  crest?: string | null;
  logoUrl?: string | null;
  image?: string | null;
  badge?: string | null;
  name?: string;
  shortName?: string;
} | null | undefined;

/**
 * Resolve the best available logo URL from a team-like object.
 */
export function getTeamLogo(source: TeamLike): string | null {
  if (!source) return null;

  const candidates = [
    source.logo,
    source.crest,
    source.logoUrl,
    source.image,
    source.badge,
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
 * Normalize a raw logo URL string.
 */
export function normalizeTeamLogo(url: string | null | undefined): string | null {
  if (!url) return null;

  const trimmed = url.trim();
  if (trimmed.length === 0) return null;

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
 * Resolve and normalize a team logo URL in one step.
 */
export function resolveTeamLogo(source: TeamLike): string | null {
  return normalizeTeamLogo(getTeamLogo(source));
}

/**
 * Produce a stable fallback label for a team (used when no logo is
 * available or the logo fails to load).
 */
export function getTeamInitials(name?: string, shortName?: string): string {
  if (shortName && shortName.length <= 4) {
    return shortName.toUpperCase();
  }

  if (name) {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      return words[0].slice(0, 3).toUpperCase();
    }
    return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  return 'FC';
}