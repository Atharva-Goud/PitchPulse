import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fetchLiveMatches, fetchUpcomingMatches, fetchRecentResults, FootballMatch } from './fetchers/football-api';

export interface SyncResult {
  itemsFound: number;
  itemsAdded: number;
  errors: string[];
  timestamp: string;
  source: string;
}

// League IDs used by API-Football
// 39 = Premier League, 140 = La Liga, 78 = Bundesliga, 135 = Serie A, 61 = Ligue 1, 2 = Champions League
const LEAGUE_IDS = {
  premierLeague: 39,
  laLiga: 140,
  bundesliga: 78,
  serieA: 135,
  ligue1: 61,
  championsLeague: 2,
};

export async function syncMatches(mode: 'live' | 'upcoming' | 'results' | 'all' = 'all'): Promise<SyncResult> {
  const errors: string[] = [];
  const timestamp = new Date().toISOString();
  const dataDir = join(process.cwd(), 'src', 'data', 'matches');

  try {
    await mkdir(dataDir, { recursive: true });
  } catch (e) {
    errors.push(`Failed to create data dir: ${e}`);
  }

  if (mode === 'live' || mode === 'all') {
    const live = await fetchLiveMatches();
    const output = live.map(m => normalizeMatch(m, timestamp));
    await atomicallyWrite(join(dataDir, 'live.json'), output, errors);
    console.log(`✅ Live matches: ${live.length}`);
  }

  if (mode === 'upcoming' || mode === 'all') {
    const upcoming = await fetchUpcomingMatches();
    const output = upcoming.map(m => normalizeMatch(m, timestamp));
    await atomicallyWrite(join(dataDir, 'upcoming.json'), output, errors);
    console.log(`✅ Upcoming matches: ${upcoming.length}`);
  }

  if (mode === 'results' || mode === 'all') {
    const results = await fetchRecentResults();
    const output = results.map(m => normalizeMatch(m, timestamp));
    await atomicallyWrite(join(dataDir, 'results.json'), output, errors);
    console.log(`✅ Results: ${results.length}`);
  }

  return {
    itemsFound: 0,
    itemsAdded: 0,
    errors,
    timestamp,
    source: 'football-api',
  };
}

function normalizeMatch(match: FootballMatch, timestamp: string): any {
  const statusMap: Record<string, string> = {
    'Match Finished': 'FINISHED',
    'Match Postponed': 'POSTPONED',
    'Match Cancelled': 'CANCELLED',
    'Match Suspended': 'POSTPONED',
    'Not Started': 'SCHEDULED',
    'First Half': 'LIVE',
    'Halftime': 'HALFTIME',
    'Second Half': 'LIVE',
    'Extra Time': 'LIVE',
    'Penalty Shootout': 'LIVE',
  };

  const status = statusMap[match.statusShort] || statusMap[match.status] || 'SCHEDULED';

  return {
    id: `match-${match.id}`,
    competition: {
      id: match.league.id ? `league-${match.league.id}` : 'premier-league',
      name: match.league.name,
      shortName: match.league.name.split(' ').map(w => w[0]).join('').substring(0, 4).toUpperCase(),
      logo: match.league.logo || '',
      country: match.league.country,
      type: match.league.id === 2 ? 'cup' : 'league',
    },
    homeTeam: {
      id: `team-${match.homeTeam.id}`,
      name: match.homeTeam.name,
      shortName: match.homeTeam.name.substring(0, 3).toUpperCase(),
      logo: match.homeTeam.logo || '',
      country: 'Unknown',
      league: match.league.name,
    },
    awayTeam: {
      id: `team-${match.awayTeam.id}`,
      name: match.awayTeam.name,
      shortName: match.awayTeam.name.substring(0, 3).toUpperCase(),
      logo: match.awayTeam.logo || '',
      country: 'Unknown',
      league: match.league.name,
    },
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    status,
    kickoff: match.kickoff,
    venue: match.venue || undefined,
    referee: match.referee || undefined,
    freshness: {
      status: 'fresh',
      ageMinutes: 0,
      lastUpdated: timestamp,
    },
    lastUpdated: timestamp,
    source: {
      provider: 'API-Football',
      type: 'football_api',
    },
  };
}

async function atomicallyWrite(path: string, data: any[], errors: string[]): Promise<void> {
  const tempPath = `${path}.tmp`;
  try {
    await writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    // rename is atomic on same filesystem
    const { rename } = await import('fs/promises');
    await rename(tempPath, path);
  } catch (e) {
    errors.push(`Failed to write ${path}: ${e}`);
  }
}