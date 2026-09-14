/**
 * Standings data access.
 *
 * Wraps the worldcup26.ir /{league}/standings endpoint and normalizes the
 * response into a simple, sortable table model.
 *
 * League discovery is driven entirely by the API: fetchAvailableLeagues()
 * calls /leagues?kind=club&available=true and returns the slugs the server
 * actually exposes. Nothing about which leagues exist is hard-coded here.
 */

import { fetchStandings, fetchAvailableLeagues, type ApiLeague, type ApiStanding } from '@/lib/football/api';

export interface StandingRow {
  rank: number;
  teamId: string;
  teamName: string;
  teamLogo: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string;
  note: { color: string; description: string; rank: number } | null;
}

function statValue(stats: any[], name: string): number {
  const s = stats.find((x: any) => x.name === name);
  if (!s) return 0;
  const n = Number(s.displayValue);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Fetch and normalize standings for a single league slug (e.g. 'eng.1').
 * Returns an empty array when the API has no data for that league — the
 * caller is responsible for distinguishing "no data" from "API failure".
 */
export async function getStandingsBySlug(
  leagueSlug: string,
  season?: number
): Promise<StandingRow[]> {
  const raw = await fetchStandings(leagueSlug);

  return raw
    .map(s => {
      const stats = s.stats || [];
      const played = statValue(stats, 'gamesPlayed');
      const won = statValue(stats, 'wins');
      const lost = statValue(stats, 'losses');
      const ties = statValue(stats, 'ties');
      const pointsFor = statValue(stats, 'pointsFor');
      const pointsAgainst = statValue(stats, 'pointsAgainst');
      const points = statValue(stats, 'points');
      return {
        rank: statValue(stats, 'rank') || s.rank || 0,
        teamId: s.team.id,
        teamName: s.team.name,
        teamLogo: s.team.logo,
        played,
        won,
        draw: ties,
        lost,
        goalsFor: pointsFor,
        goalsAgainst: pointsAgainst,
        goalDifference: statValue(stats, 'pointDifferential'),
        points,
        form: '',
        note: s.note,
      };
    })
    .sort((a, b) => a.rank - b.rank);
}

/** Backwards-compatible alias used by the existing match pages. */
export async function getStandings(
  competition: string,
  season?: number
): Promise<StandingRow[]> {
  return getStandingsBySlug(competition, season);
}

/**
 * Discover the leagues the API actually exposes. The result is the single
 * source of truth for the league selector — no display names or slugs are
 * hard-coded in the UI.
 */
export async function getAvailableLeagues(): Promise<ApiLeague[]> {
  return fetchAvailableLeagues();
}

/**
 * Seasons the worldcup26.ir API exposes for club competitions.
 *
 * The standings response itself carries a `season` field, so callers can
 * fall back to that when the league metadata does not provide one.
 */
export async function getAvailableSeasons(): Promise<number[]> {
  // worldcup26.ir exposes the current season (2026-27) for club competitions.
  return [2026];
}

export type { ApiLeague, ApiStanding };