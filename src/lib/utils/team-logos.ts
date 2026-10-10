/**
 * Team logo fallback mapping.
 *
 * Thin, backward-compatible wrapper over the centralized mapping in
 * logo-mapping.ts, which declares exact local SVG paths under
 * public/assets/logos/ (organized by competition).
 *
 * Resolution order in the UI (see components/ui/TeamLogo.tsx and
 * components/football/TeamLogo.tsx):
 *   1. Local SVG from public/assets/logos/ when a mapping exists
 *   2. API-provided logo
 *   3. Team initials badge
 *
 * Filenames are lowercase kebab-case matching the team id, e.g.:
 *   arsenal.svg, real-madrid.svg, bayern-munich.svg
 */

import {
  resolveLocalLogoPath,
  findLogoEntry,
  LOGO_MAPPINGS,
  type LogoMappingEntry,
  type CompetitionKey,
} from './logo-mapping';

export type { LogoMappingEntry, CompetitionKey };
export { LOGO_MAPPINGS };

/**
 * Resolve a team's exact local logo path, or null when unmapped.
 *
 * Only the competition-organized structure under public/assets/logos/ is
 * consulted. Teams without a mapping fall back to the API logo, so this is
 * always safe to return null.
 */
export function getLocalTeamLogoPath(team: {
  id?: string | null;
  apiId?: string | null;
  name?: string | null;
  shortName?: string | null;
}): string | null {
  return resolveLocalLogoPath(team);
}

/**
 * Get the local logo filename for a team, or null when unmapped.
 * Kept for backward compatibility with existing call sites.
 */
export function getLocalTeamLogo(team: {
  id?: string | null;
  apiId?: string | null;
  name?: string | null;
  shortName?: string | null;
}): string | null {
  const path = getLocalTeamLogoPath(team);
  if (!path) return null;
  return path.split('/').pop() || null;
}

/** Check whether a mapping exists for this team. */
export function hasLocalTeamLogo(team: {
  id?: string | null;
  apiId?: string | null;
  name?: string | null;
  shortName?: string | null;
}): boolean {
  return findLogoEntry(team) !== null;
}

/** Every team that has a mapping registered. */
export function getTeamsWithLocalLogos(): string[] {
  return LOGO_MAPPINGS.map(m => m.id);
}

/** Registered teams under a competition. */
export function getTeamsByCompetition(competition: CompetitionKey): LogoMappingEntry[] {
  return LOGO_MAPPINGS.filter(e => e.competition === competition);
}

/**
 * Report teams from `teams` that have no registered mapping.
 * Useful for spotting teams that need a mapping entry before a logo can resolve.
 */
export function getMissingLocalLogos(
  teams: Array<{ id?: string | null; name?: string | null; shortName?: string | null }>
): string[] {
  const missing: string[] = [];
  for (const team of teams) {
    if (!hasLocalTeamLogo(team)) {
      missing.push(team.id || team.name || team.shortName || 'unknown');
    }
  }
  return missing;
}

/**
 * Documented mapping template for adding new logos.
 *
 * Copy this shape into LOGO_MAPPINGS (src/lib/utils/logo-mapping.ts) when
 * registering a new team, then paste the SVG into the matching folder.
 */
export const LOGO_MAPPING_TEMPLATE = `{
  id: 'team-slug',                  // kebab-case id, matches data/teams/teams.json
  name: 'Official Team Name',
  shortName: 'ABC',                 // 3-letter abbreviation
  country: 'England',               // club country or national team country
  competition: 'premier-league',    // one of the CompetitionKey values
  type: 'club',                     // 'club' | 'national'
  apiId: '359',                     // optional stable API team id
}`;
