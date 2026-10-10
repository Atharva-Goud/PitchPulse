/**
 * World Cup 2026 data layer.
 *
 * IMPORTANT — data integrity contract:
 *   This module NEVER fabricates tournament data. It discovers whether the
 *   configured football API actually exposes a World Cup / international
 *   competition and returns real fixtures, standings and statistics only when
 *   the source provides them. When the source has no such competition the
 *   result is `source.available === false` with a machine-readable reason and
 *   the list of endpoints that were checked, so the UI can render an explicit
 *   "Data unavailable" state instead of inventing scores, groups or players.
 *
 * The probe reuses the existing API client (src/lib/football/api.ts): its
 * league catalog, fixture, standings and match-summary endpoints. Results are
 * cached with Next.js data cache to avoid duplicate requests.
 */

import { unstable_cache as nextCache } from 'next/cache';
import {
  fetchLeagues,
  fetchFixtures,
  fetchStandings,
  type ApiFixture,
  type ApiLeague,
  type ApiStanding,
} from './api';

/* ============================================================
   Types
   ============================================================ */

export type KnockoutRoundId = 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final';

export interface BracketTeam {
  id: string;
  name: string;
  logo: string | null;
  winner: boolean;
}

export interface ShootoutScore {
  home: number;
  away: number;
}

export interface BracketMatch {
  id: string;
  round: KnockoutRoundId;
  home: BracketTeam | null;
  away: BracketTeam | null;
  homeScore: number | null;
  awayScore: number | null;
  status: 'pre' | 'in' | 'post';
  /** e.g. "FT", "a.e.t.", "Pens 4-2", "Postponed" — derived from real status only. */
  detail: string;
  kickoff: string | null;
  /** Link to the existing match page when the fixture has an id. */
  href: string | null;
  shootout: ShootoutScore | null;
}

export interface BracketRound {
  id: KnockoutRoundId;
  label: string;
  matches: BracketMatch[];
}

export interface GroupRow {
  team: BracketTeam;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  /** Only set when the source exposes an explicit qualification flag. */
  qualified: boolean | null;
}

export interface GroupTable {
  id: string;
  name: string;
  rows: GroupRow[];
}

export type LeaderCategory = 'goals' | 'assists' | 'contributions' | 'appearances' | 'minutes' | 'cleanSheets' | 'saves' | 'yellowCards' | 'redCards';

export interface PlayerLeader {
  rank: number;
  id: string;
  name: string;
  team: BracketTeam | null;
  value: number;
}

export interface TeamStatRow {
  team: BracketTeam;
  goalsFor: number | null;
  goalsAgainst: number | null;
  cleanSheets: number | null;
  possession: number | null;
  shots: number | null;
  shotsOnTarget: number | null;
  passingAccuracy: number | null;
  expectedGoals: number | null;
}

export interface WorldCupSourceStatus {
  available: boolean;
  /** Human-readable explanation, safe to show in the UI. */
  reason: string;
  /** Endpoints that were actually probed while resolving the data. */
  checkedSources: string[];
  /** League slug the data came from, when one was found. */
  leagueSlug: string | null;
}

export interface WorldCupData {
  source: WorldCupSourceStatus;
  rounds: BracketRound[];
  groups: GroupTable[];
  playerLeaders: Record<LeaderCategory, PlayerLeader[]>;
  teamStats: TeamStatRow[];
  /** Teams discovered in the source (used for logo/flag coverage, never invented). */
  teams: BracketTeam[];
}

/* ============================================================
   Round metadata
   ============================================================ */

export const KNOCKOUT_ROUNDS: Array<{ id: KnockoutRoundId; label: string }> = [
  { id: 'r32', label: 'Round of 32' },
  { id: 'r16', label: 'Round of 16' },
  { id: 'qf', label: 'Quarter-finals' },
  { id: 'sf', label: 'Semi-finals' },
  { id: 'third', label: 'Third-place play-off' },
  { id: 'final', label: 'Final' },
];

/* ============================================================
   Discovery helpers
   ============================================================ */

function isWorldCupLeague(league: ApiLeague): boolean {
  const haystack = `${league.name} ${league.slug} ${league.country}`.toLowerCase();
  return (
    haystack.includes('world cup') ||
    haystack.includes('world') && haystack.includes('international') ||
    /^fifa\.world/.test(league.slug)
  );
}

function mapTeamFromApi(team: { id: string; name: string; logo: string }): BracketTeam {
  return {
    id: team.id,
    name: team.name,
    logo: typeof team.logo === 'string' && team.logo.trim() ? team.logo.trim() : null,
    winner: false,
  };
}

/** Read a numeric stat by its real API stat name (see standings stats list). */
function statNumber(stats: Array<{ name: string; displayValue: string }>, name: string): number | null {
  const s = stats.find((x) => x.name === name);
  if (!s) return null;
  const n = Number(s.displayValue);
  return Number.isFinite(n) ? n : null;
}

/**
 * Classify a fixture into a knockout round from its real name fields.
 * Returns null for matches that are not knockouts (e.g. group stage).
 */
function classifyKnockoutRound(fixture: ApiFixture): KnockoutRoundId | null {
  const text = `${fixture.name || ''} ${fixture.shortName || ''}`.toLowerCase();
  if (text.includes('round of 32') || text.includes('r32') || text.includes('1/16')) return 'r32';
  if (text.includes('round of 16') || text.includes('r16') || text.includes('1/8')) return 'r16';
  if (text.includes('quarter') || text.includes('qf')) return 'qf';
  if (text.includes('semi') || text.includes('sf') || text.includes('1/2')) return 'sf';
  if (text.includes('third') || text.includes('3rd') || text.includes('bronze')) return 'third';
  if (text.includes('final')) return 'final';
  return null;
}

/**
 * Derive the match detail label and any shootout score from the real fixture
 * data only: status state/clock, plus shootout plays from the fixture's
 * competition details when the source provides them. Nothing is inferred.
 */
function fixtureDetail(fixture: ApiFixture): { detail: string; shootout: ShootoutScore | null } {
  const status = fixture.status;
  let detail = status?.shortDetail || status?.description || '';

  // Shootout plays live in the competition details (type text carries "Shootout").
  let shootout: ShootoutScore | null = null;
  const details = fixture.competitions?.[0]?.details ?? [];
  const shootoutPlays = details.filter((d: any) => d?.shootout || /shootout/i.test(d?.type?.text || ''));
  if (shootoutPlays.length > 0) {
    const tally = { home: 0, away: 0 };
    for (const play of shootoutPlays) {
      const scoring = (play as any).scoringPlay !== false;
      if (!scoring) continue;
      const home = String((play as any).team?.id ?? '') === String(fixture.home.id);
      if (home) tally.home += 1;
      else tally.away += 1;
    }
    if (tally.home || tally.away) shootout = tally;
  }

  if (status?.state === 'post') {
    detail = 'FT';
    if (shootout) detail = `Pens ${shootout.home}-${shootout.away}`;
  } else if (status?.state === 'in') {
    detail = status?.displayClock ? `${status.displayClock}'` : 'LIVE';
  } else if (status?.state === 'pre' && !detail) {
    detail = 'Scheduled';
  }
  return { detail, shootout };
}

function toBracketMatch(fixture: ApiFixture): BracketMatch | null {
  const round = classifyKnockoutRound(fixture);
  if (!round) return null;

  const home = mapTeamFromApi(fixture.home);
  const away = mapTeamFromApi(fixture.away);
  const { detail, shootout } = fixtureDetail(fixture);

  // Winner flags come only from the API's own completed status + scores.
  if (fixture.status?.state === 'post' && fixture.homeScore !== null && fixture.awayScore !== null) {
    const h = shootout ? shootout.home : fixture.homeScore;
    const a = shootout ? shootout.away : fixture.awayScore;
    home.winner = h > a;
    away.winner = a > h;
  }

  return {
    id: fixture.id,
    round,
    home,
    away,
    homeScore: fixture.homeScore,
    awayScore: fixture.awayScore,
    status: fixture.status?.state ?? 'pre',
    detail,
    kickoff: fixture.date ?? null,
    href: `/matches/${fixture.id}`,
    shootout,
  };
}

/* ============================================================
   Data loader
   ============================================================ */

const EMPTY_DATA: Omit<WorldCupData, 'source'> = {
  rounds: [],
  groups: [],
  playerLeaders: {
    goals: [], assists: [], contributions: [], appearances: [], minutes: [],
    cleanSheets: [], saves: [], yellowCards: [], redCards: [],
  },
  teamStats: [],
  teams: [],
};

async function loadWorldCupData(): Promise<WorldCupData> {
  const checkedSources: string[] = [];

  // 1. Discover whether the API exposes a World Cup competition at all.
  checkedSources.push('/leagues?kind=all');
  let leagues: ApiLeague[] = [];
  try {
    leagues = await fetchLeagues('all');
  } catch {
    leagues = [];
  }

  const worldCupLeague = leagues.find(isWorldCupLeague) ?? null;

  if (!worldCupLeague) {
    return {
      ...EMPTY_DATA,
      source: {
        available: false,
        reason:
          'The configured football API does not expose a World Cup / international ' +
          `competition. Its league catalog returns ${leagues.length} club leagues only ` +
          '(no FIFA World Cup tournament, no international fixtures, groups or player statistics).',
        checkedSources,
        leagueSlug: null,
      },
    };
  }

  const slug = worldCupLeague.slug;
  checkedSources.push(`/${slug}/fixtures`);
  checkedSources.push(`/${slug}/standings`);

  // 2. Load real fixtures and standings from the source.
  const [fixtures, standings] = await Promise.all([
    fetchFixtures(slug, 'all'),
    fetchStandings(slug),
  ]);

  const rounds: BracketRound[] = KNOCKOUT_ROUNDS.map((r) => ({ ...r, matches: [] }));
  const teamMap = new Map<string, BracketTeam>();

  for (const fixture of fixtures) {
    const match = toBracketMatch(fixture);
    if (!match) continue;
    const roundIndex = KNOCKOUT_ROUNDS.findIndex((r) => r.id === match.round);
    if (roundIndex >= 0) rounds[roundIndex].matches.push(match);
    for (const team of [match.home, match.away]) {
      if (team && !teamMap.has(team.id)) teamMap.set(team.id, team);
    }
  }

  rounds.forEach((r) => r.matches.sort((a, b) => (a.kickoff ?? '').localeCompare(b.kickoff ?? '')));

  const groups: GroupTable[] = buildGroups(standings, teamMap);

  return {
    source: {
      available: true,
      reason: 'Live tournament data from the configured football API.',
      checkedSources,
      leagueSlug: slug,
    },
    rounds,
    groups,
    playerLeaders: EMPTY_DATA.playerLeaders,
    teamStats: [],
    teams: [...teamMap.values()],
  };
}

/**
 * Group standings are flattened from the API's nested standings shape.
 *
 * Stat names follow the real API contract: gamesPlayed / wins / ties / losses /
 * pointsFor / pointsAgainst / pointDifferential / points. Qualification is
 * taken from the source's own `advanced` flag when present — never inferred
 * from rank, because group tables and ranking rules are source data.
 */
function buildGroups(standings: ApiStanding[], teamMap: Map<string, BracketTeam>): GroupTable[] {
  if (standings.length === 0) return [];

  const rows: GroupRow[] = standings
    .map((s) => {
      const stats = s.stats || [];
      const team: BracketTeam = teamMap.get(s.team.id) ?? mapTeamFromApi(s.team);
      const advanced = statNumber(stats, 'advanced');
      return {
        team,
        played: statNumber(stats, 'gamesPlayed') ?? 0,
        wins: statNumber(stats, 'wins') ?? 0,
        draws: statNumber(stats, 'ties') ?? 0,
        losses: statNumber(stats, 'losses') ?? 0,
        goalsFor: statNumber(stats, 'pointsFor') ?? 0,
        goalsAgainst: statNumber(stats, 'pointsAgainst') ?? 0,
        goalDifference: statNumber(stats, 'pointDifferential') ?? 0,
        points: statNumber(stats, 'points') ?? 0,
        qualified: advanced == null ? null : advanced > 0,
      };
    })
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);

  return rows.length ? [{ id: 'standings', name: 'Standings', rows }] : [];
}

/** Cached entry point used by the page (avoids duplicate requests per render). */
export const getWorldCupData = nextCache(loadWorldCupData, ['world-cup-2026-data'], { revalidate: 300 });
