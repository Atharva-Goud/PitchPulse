import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fetchLiveMatches, fetchUpcomingMatches, fetchRecentResults, FootballMatch, getApiRequestCount, resetApiRequestCount, clearFixturesCache } from './fetchers/football-api';

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
  resetApiRequestCount();
  clearFixturesCache();
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
    if (live.length > 0) {
      const output = live.map(m => normalizeMatch(m, timestamp));
      await atomicallyWrite(join(dataDir, 'live.json'), output, errors);
      console.log(`✅ Live matches: ${live.length}`);
    } else {
      console.warn('⚠️  Live fetch returned 0 matches — keeping existing live.json');
    }
  }

  if (mode === 'upcoming' || mode === 'all') {
    const upcoming = await fetchUpcomingMatches();
    if (upcoming.length > 0) {
      const output = upcoming.map(m => normalizeMatch(m, timestamp));
      await atomicallyWrite(join(dataDir, 'upcoming.json'), output, errors);
      console.log(`✅ Upcoming matches: ${upcoming.length}`);
    } else {
      console.warn('⚠️  Upcoming fetch returned 0 matches — keeping existing upcoming.json');
    }
  }

  if (mode === 'results' || mode === 'all') {
    const results = await fetchRecentResults();
    if (results.length > 0) {
      const output = results.map(m => normalizeMatch(m, timestamp));
      await atomicallyWrite(join(dataDir, 'results.json'), output, errors);
      console.log(`✅ Results: ${results.length}`);
    } else {
      console.warn('⚠️  Results fetch returned 0 matches — keeping existing results.json');
    }
  }

  console.log(`ℹ️  Football API requests used this run: ${getApiRequestCount()}`);

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
      shortName: competitionShortName(match.league.name, match.league.id),
      logo: match.league.logo || '',
      country: match.league.country,
      type: match.league.id === 2 ? 'cup' : 'league',
    },
    homeTeam: {
      id: `team-${match.homeTeam.id}`,
      name: match.homeTeam.name,
      shortName: teamShortName(match.homeTeam.name),
      logo: match.homeTeam.logo || '',
      country: 'Unknown',
      league: match.league.name,
    },
    awayTeam: {
      id: `team-${match.awayTeam.id}`,
      name: match.awayTeam.name,
      shortName: teamShortName(match.awayTeam.name),
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

const COMPETITION_SHORT_NAMES: Record<number, string> = {
  39: 'Premier League',
  140: 'La Liga',
  78: 'Bundesliga',
  135: 'Serie A',
  61: 'Ligue 1',
  2: 'Champions League',
};

function competitionShortName(name: string, id: number): string {
  return COMPETITION_SHORT_NAMES[id] || name;
}

function teamShortName(name: string): string {
  // Drop leading ordinals like "1. ", drop dots/commas, then take the
  // first alphabetic token and abbreviate sensibly.
  const cleaned = name.replace(/^\d+\.\s*/, '').replace(/[.,]/g, ' ');
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return name.substring(0, 3).toUpperCase();
  const first = tokens[0];
  if (first.length <= 3) return first.toUpperCase();
  return first.substring(0, 3).toUpperCase();
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