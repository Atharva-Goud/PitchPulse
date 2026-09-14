/**
 * Supported competitions.
 *
 * Centralized so no component hard-codes league IDs. Only competitions
 * actually supported by the worldcup26.ir API are listed here.
 */

import { COMPETITIONS, type CompetitionKey } from '@/lib/football/api';

export interface CompetitionConfig {
  key: CompetitionKey;
  name: string;
  shortName: string;
  country: string;
  type: 'league' | 'cup';
}

const COMPETITION_META: Record<CompetitionKey, Omit<CompetitionConfig, 'key'>> = {
  premierLeague: { name: 'Premier League', shortName: 'PL', country: 'England', type: 'league' },
  championship: { name: 'EFL Championship', shortName: 'Championship', country: 'England', type: 'league' },
  laLiga: { name: 'La Liga', shortName: 'LaLiga', country: 'Spain', type: 'league' },
};

export function getCompetitionConfig(key: CompetitionKey): CompetitionConfig {
  return { key, ...COMPETITION_META[key] };
}

export function getAllCompetitions(): CompetitionConfig[] {
  return (Object.keys(COMPETITIONS) as CompetitionKey[]).map(getCompetitionConfig);
}

export function getCompetitionShortName(key: CompetitionKey): string {
  return COMPETITION_META[key].shortName;
}

/**
 * Resolve a worldcup26.ir league slug (e.g. 'esp.1') back to a
 * CompetitionKey. Returns null when the slug is not one of the supported
 * competitions — callers should fall back to the raw league metadata in that
 * case instead of assuming a known competition.
 */
export function getCompetitionKeyFromSlug(slug: string): CompetitionKey | null {
  for (const [key, value] of Object.entries(COMPETITIONS) as [CompetitionKey, string][]) {
    if (value === slug) return key;
  }
  return null;
}

export { COMPETITIONS, type CompetitionKey };