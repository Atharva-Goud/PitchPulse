import { config } from '../../config/app-config';

// Track API usage so sync runs don't silently burn through the daily
// request budget (free plan: 100 req/day).
let requestCount = 0;
export function getApiRequestCount(): number {
  return requestCount;
}
export function resetApiRequestCount(): void {
  requestCount = 0;
}

export interface FootballMatch {
  id: number;
  homeTeam: { id: number; name: string; logo: string };
  awayTeam: { id: number; name: string; logo: string };
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  statusShort: string;
  league: { id: number; name: string; logo: string; country: string };
  kickoff: string;
  venue: string | null;
  referee: string | null;
}

export interface FootballStanding {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  played: number;
  won: number;
  draw: number;
  lost: number;
}

async function apiFetch(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  requestCount++;
  if (!config.football.apiKey || config.football.apiKey === 'your_api_key_here') {
    console.warn('Football API key not configured. Using mock data.');
    return { response: [] };
  }

  const url = new URL(`${config.football.baseUrl}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      'x-rapidapi-key': config.football.apiKey,
      'x-rapidapi-host': config.football.apiHost,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// The free API plan only exposes seasons 2022-2024, and date-range queries
// return 0 results on it. So we fetch the full season for each league and
// filter by date client-side instead.
const FREE_PLAN_SEASONS = [2024, 2023, 2022];
const LEAGUE_IDS = {
  premierLeague: 39,
  laLiga: 140,
  bundesliga: 78,
  serieA: 135,
  ligue1: 61,
  championsLeague: 2,
};

export async function fetchLiveMatches(): Promise<FootballMatch[]> {
  try {
    const data = await apiFetch('/fixtures', { live: 'all' });
    return (data.response || []).map(normalizeMatch);
  } catch (error) {
    console.error('Failed to fetch live matches:', error);
    return [];
  }
}

export async function fetchUpcomingMatches(leagueId?: number, days: number = 7): Promise<FootballMatch[]> {
  try {
    const dateTo = Date.now() + days * 86400000;
    const matches = await fetchFixturesBySeason(leagueId);
    return matches
      .filter(m => new Date(m.kickoff).getTime() > Date.now())
      .filter(m => new Date(m.kickoff).getTime() <= dateTo)
      .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  } catch (error) {
    console.error('Failed to fetch upcoming matches:', error);
    return [];
  }
}

export async function fetchRecentResults(leagueId?: number, days: number = 3): Promise<FootballMatch[]> {
  try {
    const dateFrom = Date.now() - days * 86400000;
    const matches = await fetchFixturesBySeason(leagueId);
    return matches
      .filter(m => new Date(m.kickoff).getTime() >= dateFrom)
      .filter(m => new Date(m.kickoff).getTime() <= Date.now())
      .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime());
  } catch (error) {
    console.error('Failed to fetch recent results:', error);
    return [];
  }
}

/**
 * Fetch fixtures for the given league across all free-plan seasons.
 * Returns matches already normalized to FootballMatch.
 *
 * Results are cached in-memory for the lifetime of the process so that
 * upcoming + results syncs share one 36-request fetch instead of each
 * re-querying the API.
 */
let fixturesCache: { matches: FootballMatch[]; ts: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

async function fetchFixturesBySeason(leagueId?: number): Promise<FootballMatch[]> {
  const now = Date.now();
  if (fixturesCache && now - fixturesCache.ts < CACHE_TTL_MS) {
    return fixturesCache.matches;
  }

  const ids = leagueId ? [leagueId] : Object.values(LEAGUE_IDS);
  const matches: FootballMatch[] = [];

  for (const id of ids) {
    for (const season of FREE_PLAN_SEASONS) {
      try {
        const data = await apiFetch('/fixtures', { league: String(id), season: String(season) });
        const batch = (data.response || []).map(normalizeMatch);
        matches.push(...batch);
      } catch (e) {
        // Skip seasons the plan doesn't cover for this league.
      }
    }
  }

  fixturesCache = { matches, ts: now };
  return matches;
}

export function clearFixturesCache(): void {
  fixturesCache = null;
}

export async function fetchStandings(leagueId: number, season: number = new Date().getFullYear()): Promise<FootballStanding[]> {
  try {
    const data = await apiFetch('/standings', {
      league: String(leagueId),
      season: String(season),
    });

    const standings = data.response?.[0]?.league?.standings?.[0];
    return (standings || []).map((s: any) => ({
      rank: s.rank,
      team: { id: s.team.id, name: s.team.name, logo: s.team.logo },
      points: s.points,
      goalsDiff: s.goalsDiff,
      played: s.all.played,
      won: s.all.win,
      draw: s.all.draw,
      lost: s.all.lose,
    }));
  } catch (error) {
    console.error('Failed to fetch standings:', error);
    return [];
  }
}

function normalizeMatch(raw: any): FootballMatch {
  const fixture = raw.fixture || {};
  const teams = raw.teams || {};
  const goals = raw.goals || {};
  const league = raw.league || {};

  return {
    id: fixture.id || 0,
    homeTeam: {
      id: teams.home?.id || 0,
      name: teams.home?.name || 'Unknown',
      logo: teams.home?.logo || '',
    },
    awayTeam: {
      id: teams.away?.id || 0,
      name: teams.away?.name || 'Unknown',
      logo: teams.away?.logo || '',
    },
    homeScore: goals.home,
    awayScore: goals.away,
    status: fixture.status?.long || 'Unknown',
    statusShort: fixture.status?.short || 'TBD',
    league: {
      id: league.id || 0,
      name: league.name || 'Unknown League',
      logo: league.logo || '',
      country: league.country || '',
    },
    kickoff: fixture.date || new Date().toISOString(),
    venue: fixture.venue?.name || null,
    referee: fixture.referee || null,
  };
}
