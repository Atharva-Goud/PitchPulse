import { config } from '../../config/app-config';

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

function leagueToApiId(league: string): number {
  const map: Record<string, number> = {
    'eng.1': 39,
    'esp.1': 140,
    'bundesliga': 78,
    'ita.1': 135,
    'fra.1': 61,
  };
  return map[league] || 0;
}

async function apiFetch(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  requestCount++;
  const url = new URL(config.football.baseUrl + endpoint);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const maxAttempts = 3;
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url.toString(), {
        headers: { Accept: 'application/json' },
      });

      if (res.status === 429 || res.status >= 500) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      return res.json();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 4000);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  throw lastError || new Error('API request failed');
}

import { COMPETITIONS } from '../../lib/football/api';

const LEAGUE_SLUGS = Object.values(COMPETITIONS) as string[];

export async function fetchLiveMatches(): Promise<FootballMatch[]> {
  try {
    const matches: FootballMatch[] = [];
    for (const league of LEAGUE_SLUGS) {
      const data = await apiFetch('/' + league + '/fixtures', { status: 'in' });
      const events = data.events || [];
      matches.push(...events.map(normalizeEvent, league));
    }
    return matches;
  } catch (error) {
    console.error('Failed to fetch live matches:', error);
    return [];
  }
}

export async function fetchUpcomingMatches(leagueSlug?: string, days: number = 7): Promise<FootballMatch[]> {
  try {
    const leagues = leagueSlug ? [leagueSlug] : LEAGUE_SLUGS;
    const dateTo = Date.now() + days * 86400000;
    const matches: FootballMatch[] = [];
    for (const league of leagues) {
      const data = await apiFetch('/' + league + '/fixtures', { status: 'scheduled' });
      const events = data.events || [];
      const normalized = events.map(normalizeEvent, league) as FootballMatch[];
      const filtered = normalized.filter(m => {
        const t = new Date(m.kickoff).getTime();
        return !isNaN(t) && t > Date.now() && t <= dateTo;
      });
      matches.push(...filtered);
    }
    return matches.sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  } catch (error) {
    console.error('Failed to fetch upcoming matches:', error);
    return [];
  }
}

export async function fetchRecentResults(leagueSlug?: string, limit: number = 20): Promise<FootballMatch[]> {
  try {
    const leagues = leagueSlug ? [leagueSlug] : LEAGUE_SLUGS;
    const matches: FootballMatch[] = [];
    for (const league of leagues) {
      const data = await apiFetch('/' + league + '/fixtures', { status: 'finished' });
      const events = data.events || [];
      const normalized = events.map(normalizeEvent, league) as FootballMatch[];
      matches.push(...normalized);
    }
    return matches
      .filter(m => new Date(m.kickoff).getTime() <= Date.now())
      .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch recent results:', error);
    return [];
  }
}

let fixturesCache: { matches: FootballMatch[]; ts: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

async function fetchFixturesByLeague(leagueSlug?: string): Promise<FootballMatch[]> {
  const now = Date.now();
  if (fixturesCache && now - fixturesCache.ts < CACHE_TTL_MS) {
    return fixturesCache.matches;
  }

  const leagues = leagueSlug ? [leagueSlug] : LEAGUE_SLUGS;
  const matches: FootballMatch[] = [];

  for (const league of leagues) {
    const data = await apiFetch('/' + league + '/fixtures', { status: 'all' });
    const events = data.events || [];
    matches.push(...events.map(normalizeEvent, league) as FootballMatch[]);
  }

  fixturesCache = { matches, ts: now };
  return matches;
}

export function clearFixturesCache(): void {
  fixturesCache = null;
}

export async function fetchStandings(leagueSlug: string): Promise<FootballStanding[]> {
  try {
    const data = await apiFetch('/' + leagueSlug + '/standings');
    const groups = data.children || [];
    const standings: FootballStanding[] = [];
    for (const g of groups) {
      const entries = g.standings && Array.isArray(g.standings.entries)
        ? g.standings.entries
        : Array.isArray(g.standings) ? g.standings : [];
      for (const s of entries) {
        standings.push({
          rank: s.rank || 0,
          team: {
            id: s.team?.id || 0,
            name: s.team?.displayName || s.team?.name || 'Unknown',
            logo: s.team?.logo || '',
          },
          points: s.stats?.find((st: any) => st.name === 'points')?.displayValue || '0',
          goalsDiff: 0,
          played: 0,
          won: 0,
          draw: 0,
          lost: 0,
        });
      }
    }
    return standings;
  } catch (error) {
    console.error('Failed to fetch standings:', error);
    return [];
  }
}

function normalizeEvent(this: string, raw: any): FootballMatch {
  const comp = (raw.competitions && raw.competitions[0]) || {};
  const competitors = comp.competitors || [];
  const homeC = competitors.find((c: any) => c.homeAway === 'home') || competitors[0];
  const awayC = competitors.find((c: any) => c.homeAway === 'away') || competitors[1];
  const homeScore = num(homeC?.score);
  const awayScore = num(awayC?.score);

  return {
    id: raw.id || 0,
    homeTeam: {
      id: homeC?.team?.id || homeC?.id || 0,
      name: homeC?.team?.displayName || homeC?.team?.name || 'Unknown',
      logo: homeC?.team?.logo || '',
    },
    awayTeam: {
      id: awayC?.team?.id || awayC?.id || 0,
      name: awayC?.team?.displayName || awayC?.team?.name || 'Unknown',
      logo: awayC?.team?.logo || '',
    },
    homeScore,
    awayScore,
    status: raw.status?.type?.description || 'Unknown',
    statusShort: raw.status?.state || 'TBD',
    league: {
      id: leagueToApiId(this),
      name: comp.name || 'Unknown League',
      logo: comp.logo || '',
      country: comp.country || '',
    },
    kickoff: raw.date || new Date().toISOString(),
    venue: comp.venue?.fullName || null,
    referee: null,
  };
}

function num(value: any): number | null {
  if (value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
