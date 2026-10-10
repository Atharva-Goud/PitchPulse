/**
 * OpenFootball World Cup loader.
 *
 * Fetches the public-domain dataset and caches it for the whole app:
 *   https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json
 *
 * The dataset needs no API key. All normalization and derived statistics live
 * in ./normalize (pure, unit-testable). This module only handles transport and
 * caching, so the page fetches the dataset exactly once per revalidation
 * window regardless of how many components consume it.
 */

import { unstable_cache as nextCache } from 'next/cache';
import { buildTournament, type RawWorldCup, type WorldCupTournament } from './normalize';

export const WORLDCUP_2026_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';

function isRawWorldCup(value: unknown): value is RawWorldCup {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.name === 'string' && Array.isArray(v.matches);
}

async function loadTournament(): Promise<WorldCupTournament | null> {
  let raw: RawWorldCup;
  try {
    const res = await fetch(WORLDCUP_2026_URL, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error('openfootball worldcup: fetch failed with status', res.status);
      return null;
    }
    const json: unknown = await res.json();
    if (!isRawWorldCup(json)) {
      console.error('openfootball worldcup: unexpected payload shape');
      return null;
    }
    raw = json;
  } catch (error) {
    console.error('openfootball worldcup: request error', error);
    return null;
  }

  return buildTournament(raw, WORLDCUP_2026_URL);
}

/** Cached tournament loader — one fetch shared by the whole page. */
export const getWorldCupTournament = nextCache(loadTournament, ['openfootball-worldcup-2026'], {
  revalidate: 300,
  tags: ['worldcup-2026'],
});

export {
  buildTournament,
  classifyRound,
  computeGroups,
  computeScorers,
  computeTeamStats,
  normalizeMatch,
  normalizeTeam,
  parseKickoff,
  validateBracketProgression,
  KNOCKOUT_ROUNDS,
} from './normalize';
export type {
  GroupRow,
  GroupTable,
  KnockoutRoundId,
  PairScore,
  RawMatch,
  RawScore,
  RawWorldCup,
  ScorerRow,
  TeamStatRow,
  WorldCupGoal,
  WorldCupMatch,
  WorldCupTeam,
  WorldCupTournament,
} from './normalize';
