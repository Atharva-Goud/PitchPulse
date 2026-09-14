/**
 * Standings data access.
 *
 * Wraps the worldcup26.ir /{league}/standings endpoint and normalizes the
 * response into a simple, sortable table model.
 */

import { fetchStandings, COMPETITIONS, type CompetitionKey } from '@/lib/football/api';

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

export async function getStandings(
  competition: CompetitionKey,
  season?: number
): Promise<StandingRow[]> {
  const league = COMPETITIONS[competition];
  const raw = await fetchStandings(league);

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

export async function getAvailableSeasons(): Promise<number[]> {
  // worldcup26.ir exposes the current season (2026-27) for club competitions.
  return [2026];
}

export { COMPETITIONS, type CompetitionKey };