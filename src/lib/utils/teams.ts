/**
 * Team logo normalization utilities.
 *
 * Team data may expose the logo under different field names
 * (logo, crest, logoUrl, image, badge). These helpers normalize
 * whatever the source provides into a single safe URL without
 * modifying the original data.
 */

import { getLocalTeamLogoPath } from './team-logos';

type TeamLike = {
  logo?: string | null;
  crest?: string | null;
  logoUrl?: string | null;
  image?: string | null;
  badge?: string | null;
  name?: string;
  shortName?: string;
  id?: string;
  apiId?: string;
} | null | undefined;

/**
 * Resolve the best available logo URL from a team-like object.
 *
 * Looks for a matching local SVG first (public/assets/logos/), then the
 * API-provided logo. The TeamLogo component re-checks the API logo at load
 * time, so a missing local file degrades to the API logo instead of breaking.
 */
export function getTeamLogo(source: TeamLike): string | null {
  if (!source) return null;

  const apiLogo = firstString([source.logo, source.crest, source.logoUrl, source.image, source.badge]);
  const localLogo = getLocalTeamLogoPath(source);

  return localLogo ?? apiLogo;
}

function firstString(candidates: Array<string | null | undefined>): string | null {
  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      if (trimmed.length > 0) return trimmed;
    }
  }
  return null;
}

/**
 * Normalize a raw logo URL string.
 *
 * Absolute http(s) URLs are canonicalized. Root-relative paths such as
 * "/assets/logos/..." (our local SVG fallbacks) are passed through unchanged.
 * Anything else (protocol-relative junk, javascript:, data:) is rejected.
 */
export function normalizeTeamLogo(url: string | null | undefined): string | null {
  if (!url) return null;

  const trimmed = url.trim();
  if (trimmed.length === 0) return null;

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  // Local bundled assets under public/ are valid logo sources.
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
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
 * This is the main entry point - tries API logo first, then local fallback.
 */
export function resolveTeamLogo(source: TeamLike): string | null {
  const apiLogo = getTeamLogo(source);
  return normalizeTeamLogo(apiLogo);
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