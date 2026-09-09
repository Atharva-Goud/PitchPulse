import { config } from '../../config/app-config';

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
    const dateFrom = new Date().toISOString().split('T')[0];
    const dateTo = new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
    const params: Record<string, string> = { dateFrom, dateTo };
    if (leagueId) params.league = String(leagueId);

    const data = await apiFetch('/fixtures', params);
    return (data.response || []).map(normalizeMatch);
  } catch (error) {
    console.error('Failed to fetch upcoming matches:', error);
    return [];
  }
}

export async function fetchRecentResults(leagueId?: number, days: number = 3): Promise<FootballMatch[]> {
  try {
    const dateTo = new Date().toISOString().split('T')[0];
    const dateFrom = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
    const params: Record<string, string> = { dateFrom, dateTo };
    if (leagueId) params.league = String(leagueId);

    const data = await apiFetch('/fixtures', params);
    return (data.response || []).map(normalizeMatch);
  } catch (error) {
    console.error('Failed to fetch recent results:', error);
    return [];
  }
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
