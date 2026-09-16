/**
 * Runtime match data access.
 *
 * Thin layer over the worldcup26.ir client in lib/football/api.ts that
 * produces NormalizedMatch lists split by status. This module is the only
 * place the match pages import from — it keeps fetching logic in one spot
 * and isolates the football API from the news system entirely.
 */

import {
  fetchFixtures,
  COMPETITIONS,
  getAllLeagueSlugs,
  getMajorLeagueSlugs,
  type CompetitionKey,
  type ApiFixture,
} from '@/lib/football/api';
import {
  normalizeApiFixture,
  isLive,
  isFinished,
  isScheduled,
  type NormalizedMatch,
} from '@/lib/football/types';

/**
 * Convert an ApiFixture (from api.ts) into the shape expected by
 * normalizeApiFixture in types.ts (homeTeam/awayTeam/kickoff).
 */
function toNormalizable(f: ApiFixture): {
  id: string;
  homeTeam: { id: string; name: string; logo: string; abbreviation?: string };
  awayTeam: { id: string; name: string; logo: string; abbreviation?: string };
  homeScore: number | null;
  awayScore: number | null;
  status: { type?: string; state?: string; description?: string; detail?: string };
  league: { id: string; name: string; logo: string; country: string };
  kickoff: string;
  venue: string | null;
  referee: string | null;
  statusClock?: number | null;
  statusDisplayClock?: string | null;
} {
  return {
    id: f.id,
    homeTeam: f.home,
    awayTeam: f.away,
    homeScore: f.homeScore,
    awayScore: f.awayScore,
    status: {
      type: f.status.type,
      state: f.status.state,
      description: f.status.description,
      detail: f.status.detail,
    },
    league: {
      id: f.league.id,
      name: f.league.name,
      logo: f.league.logo,
      country: f.league.country,
    },
    kickoff: f.date,
    venue: f.venue,
    referee: f.referee,
    statusClock: f.status.clock ?? null,
    statusDisplayClock: f.status.displayClock ?? null,
  };
}

export async function getLiveMatchList(
  competition?: CompetitionKey
): Promise<NormalizedMatch[]> {
  let leagues: string[];
  if (competition) {
    const league = COMPETITIONS[competition];
    leagues = league ? [league] : [];
  } else {
    leagues = await getMajorLeagueSlugs();
  }
  if (typeof window !== 'undefined') {
    console.log('[getLiveMatchList] querying', leagues.length, 'leagues:', leagues);
  }

  const results: NormalizedMatch[] = [];
  for (const l of leagues) {
    const raw = await fetchFixtures(l, 'live');
    results.push(...raw.map(f => normalizeApiFixture(toNormalizable(f))).filter(isLive));
  }
  return results;
}

export async function getUpcomingMatchList(
  competition?: CompetitionKey,
  days: number = 14
): Promise<NormalizedMatch[]> {
  let leagues: string[];
  if (competition) {
    const league = COMPETITIONS[competition];
    leagues = league ? [league] : [];
  } else {
    leagues = await getMajorLeagueSlugs();
  }
  if (typeof window !== 'undefined') {
    console.log('[getUpcomingMatchList] querying', leagues.length, 'leagues:', leagues);
  }

  const now = Date.now();
  const horizon = now + days * 24 * 60 * 60 * 1000;
  const results: NormalizedMatch[] = [];

  for (const l of leagues) {
    const raw = await fetchFixtures(l, 'all');
    results.push(
      ...raw
        .map(f => normalizeApiFixture(toNormalizable(f)))
        .filter(isScheduled)
        .filter(m => {
          const t = new Date(m.kickoff).getTime();
          return !isNaN(t) && t > now && t <= horizon;
        })
    );
  }

  return results.sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  );
}

export async function getRecentMatchList(
  competition?: CompetitionKey,
  limit: number = 20
): Promise<NormalizedMatch[]> {
  let leagues: string[];
  if (competition) {
    const league = COMPETITIONS[competition];
    leagues = league ? [league] : [];
  } else {
    leagues = await getMajorLeagueSlugs();
  }
  if (typeof window !== 'undefined') {
    console.log('[getRecentMatchList] querying', leagues.length, 'leagues:', leagues);
  }

  const results: NormalizedMatch[] = [];
  for (const l of leagues) {
    const raw = await fetchFixtures(l, 'all');
    results.push(
      ...raw
        .map(f => normalizeApiFixture(toNormalizable(f)))
        .filter(isFinished)
        .filter(m => new Date(m.kickoff).getTime() <= Date.now())
    );
  }

  return results
    .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime())
    .slice(0, limit);
}

export async function getMatchById(id: string): Promise<NormalizedMatch | null> {
  const result = await getMatchWithLeague(id);
  return result ? result.match : null;
}

export async function getMatchWithLeague(
  id: string
): Promise<{ match: NormalizedMatch; league: string } | null> {
  const leagues = await getAllLeagueSlugs();
  for (const l of leagues) {
    const raw = await fetchFixtures(l, 'all');
    const match = raw.find(m => m.id === id);
    if (match) return { match: normalizeApiFixture(toNormalizable(match)), league: l };
  }
  return null;
}

/**
 * Fetch the raw ApiFixture for a match, which carries the home/away team ids
 * needed to attribute events and statistics to the correct side.
 */
export async function getRawFixtureById(
  id: string
): Promise<{ fixture: ApiFixture; league: string } | null> {
  const leagues = await getAllLeagueSlugs();
  for (const l of leagues) {
    const raw = await fetchFixtures(l, 'all');
    const match = raw.find(m => m.id === id);
    if (match) return { fixture: match, league: l };
  }
  return null;
}

export async function getMatchesByCompetition(
  competition: CompetitionKey
): Promise<NormalizedMatch[]> {
  const league = COMPETITIONS[competition];
  const raw = await fetchFixtures(league, 'all');
  return raw.map(f => normalizeApiFixture(toNormalizable(f)));
}

/**
 * Fetch recent finished matches for a specific team to show form.
 * Searches across all competitions since team IDs are global.
 */
export async function getRecentMatchesByTeam(
  teamId: string,
  limit: number = 5
): Promise<NormalizedMatch[]> {
  const leagues = await getAllLeagueSlugs();
  const results: NormalizedMatch[] = [];

  for (const l of leagues) {
    const raw = await fetchFixtures(l, 'all');
    const teamMatches = raw
      .map(f => normalizeApiFixture(toNormalizable(f)))
      .filter(isFinished)
      .filter(m => m.homeTeam.id === teamId || m.awayTeam.id === teamId);
    results.push(...teamMatches);
  }

  return results
    .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime())
    .slice(0, limit);
}

export { COMPETITIONS, type CompetitionKey };