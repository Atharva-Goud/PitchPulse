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

import { fetchStandings, fetchAvailableLeagues, fetchFixtures, fetchAllFixtures, type ApiLeague, type ApiStanding, type ApiFixture } from '@/lib/football/api';

export interface TeamRecord {
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

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
  rankChange: number;
  homeRecord: TeamRecord;
  awayRecord: TeamRecord;
  note: { color: string; description: string; rank: number } | null;
}

function statValue(stats: any[], name: string): number {
  const s = stats.find((x: any) => x.name === name);
  if (!s) return 0;
  const n = Number(s.displayValue);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Calculate home/away records and recent form from fixtures.
 */
function calculateRecordsAndForm(
  teamId: string,
  fixtures: ApiFixture[]
): { homeRecord: TeamRecord; awayRecord: TeamRecord; form: string } {
  const homeRecord: TeamRecord = { played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 };
  const awayRecord: TeamRecord = { played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 };
  const recentResults: Array<{ date: number; result: 'W' | 'D' | 'L' }> = [];

  for (const fixture of fixtures) {
    const comp = fixture.competitions?.[0];
    if (!comp) continue;
    
    const competitors = comp.competitors || [];
    const homeCompetitor = competitors.find((c: any) => c.homeAway === 'home');
    const awayCompetitor = competitors.find((c: any) => c.homeAway === 'away');
    
    if (!homeCompetitor || !awayCompetitor) continue;

    const isHome = homeCompetitor.team.id === teamId;
    const isAway = awayCompetitor.team.id === teamId;
    
    if (!isHome && !isAway) continue;

    const status = fixture.status?.state;
    const completed = fixture.status?.completed || status === 'post';
    
    if (!completed) continue;

    const homeScore = homeCompetitor.score ? Number(homeCompetitor.score) : 0;
    const awayScore = awayCompetitor.score ? Number(awayCompetitor.score) : 0;

    let result: 'W' | 'D' | 'L';
    if (homeScore > awayScore) {
      result = isHome ? 'W' : 'L';
    } else if (homeScore < awayScore) {
      result = isHome ? 'L' : 'W';
    } else {
      result = 'D';
    }

    const matchDate = new Date(fixture.date).getTime();
    recentResults.push({ date: matchDate, result });

    if (isHome) {
      homeRecord.played++;
      homeRecord.goalsFor += homeScore;
      homeRecord.goalsAgainst += awayScore;
      if (result === 'W') homeRecord.won++;
      else if (result === 'D') homeRecord.draw++;
      else homeRecord.lost++;
    } else {
      awayRecord.played++;
      awayRecord.goalsFor += awayScore;
      awayRecord.goalsAgainst += homeScore;
      if (result === 'W') awayRecord.won++;
      else if (result === 'D') awayRecord.draw++;
      else awayRecord.lost++;
    }
  }

  // Sort by date descending (most recent first) and take last 5
  recentResults.sort((a, b) => b.date - a.date);
  const form = recentResults.slice(0, 5).map(r => r.result).join(' ');

  return { homeRecord, awayRecord, form };
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
  const [rawStandings, fixtures] = await Promise.all([
    fetchStandings(leagueSlug),
    fetchAllFixtures(leagueSlug),
  ]);

  const standingsWithRecords = rawStandings
    .map(s => {
      const stats = s.stats || [];
      const played = statValue(stats, 'gamesPlayed');
      const won = statValue(stats, 'wins');
      const lost = statValue(stats, 'losses');
      const ties = statValue(stats, 'ties');
      const pointsFor = statValue(stats, 'pointsFor');
      const pointsAgainst = statValue(stats, 'pointsAgainst');
      const points = statValue(stats, 'points');
      const rankChange = statValue(stats, 'rankChange');
      
      const { homeRecord, awayRecord, form } = calculateRecordsAndForm(s.team.id, fixtures);

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
        form,
        rankChange,
        homeRecord,
        awayRecord,
        note: s.note,
      };
    })
    .sort((a, b) => a.rank - b.rank);

  return standingsWithRecords;
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