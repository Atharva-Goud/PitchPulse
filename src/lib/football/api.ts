/**
 * PitchIntel Football API client.
 *
 * Thin, dependency-free wrapper around the worldcup26.ir REST endpoints
 * (https://worldcup26.ir/get/soccer/*) used at runtime by the match pages.
 * The public API requires no key and is CORS-enabled.
 *
 * Verified against the live API:
 *   - /leagues, /{league}/fixtures, /{league}/standings work.
 *   - /{league}/summary?event={eventId} and
 *     /{league}/events/{eventId}/plays return real play-by-play data.
 *   - /{league}/clubs and /{league}/clubs/{clubId} return club rosters.
 *
 * Rate limit: the public endpoint enforces a fair-use cap. When exceeded
 * it returns HTTP 429; we retry with exponential backoff.
 */

export const FOOTBALL_API_BASE = process.env.NEXT_PUBLIC_FOOTBALL_API_URL || 'http://localhost:3050';

export type ApiTeam = {
  id: string;
  name: string;
  logo: string;
  abbreviation?: string;
};

export type ApiLeague = {
  id: string;
  name: string;
  slug: string;
  country: string;
  logo: string;
};

export type ApiFixture = {
  id: string;
  uid: string;
  date: string;
  name: string;
  shortName: string;
  home: ApiTeam;
  away: ApiTeam;
  homeScore: number | null;
  awayScore: number | null;
  status: {
    type: string;
    state: 'pre' | 'in' | 'post';
    description: string;
    detail: string;
    shortDetail: string;
    completed: boolean;
    clock?: number;
    displayClock?: string;
    period?: number;
  };
  league: ApiLeague;
  venue: string | null;
  referee: string | null;
  competitions: Array<{
    id: string;
    name: string;
    status?: any;
    competitors?: Array<{
      id: string;
      homeAway: 'home' | 'away';
      score: string;
      winner: boolean;
      team: ApiTeam;
      statistics?: Array<{ name: string; abbreviation: string; displayValue: string }>;
    }>;
    details?: Array<{
      type: { id: string; text: string };
      clock: { value: number; displayValue: string };
      team: { id: string };
      scoreValue: number;
      scoringPlay: boolean;
      redCard: boolean;
      yellowCard: boolean;
      penaltyKick: boolean;
      ownGoal: boolean;
      shootout: boolean;
      athletesInvolved?: Array<{
        id: string;
        displayName: string;
        shortName: string;
        fullName: string;
        jersey: string;
        position: string;
      }>;
    }>;
  }>;
};

export type ApiStanding = {
  rank: number;
  team: ApiTeam;
  stats: Array<{ name: string; abbreviation: string; displayValue: string }>;
  note: { color: string; description: string; rank: number } | null;
};

export type ApiPlay = {
  id: string;
  type: { id: string; text: string; type?: string };
  text: string;
  alternativeText: string;
  awayScore: number | null;
  homeScore: number | null;
  period: number | null;
  clock: { value: number; displayValue: string } | null;
  addedClock: { value: number; displayValue: string } | null;
  valid: boolean;
  scoringPlay: boolean;
  scoreValue: number;
  substitution: boolean;
  wallclock: string | null;
  redCard: boolean;
  yellowCard: boolean;
  penaltyKick: boolean;
  ownGoal: boolean;
  shootout: boolean;
  modified: string | null;
  team: { source_id?: string; side?: string; name?: string } | null;
  athletesInvolved: Array<{
    id: string;
    displayName: string;
    shortName: string;
    fullName: string;
    jersey: string;
    position: string;
  }>;
};

export type ApiSummary = {
  header: {
    id: string;
    uid: string;
    season: any;
    league: ApiLeague;
    competitions: ApiFixture[];
  };
  boxscore: { teams: ApiFixture[] };
  keyEvents: Array<{
    type: { id: string; text: string };
    clock: { value: number; displayValue: string };
    team: { id: string };
    scoreValue: number;
    scoringPlay: boolean;
    redCard: boolean;
    yellowCard: boolean;
    penaltyKick: boolean;
    ownGoal: boolean;
    shootout: boolean;
    athletesInvolved?: Array<{
      id: string;
      displayName: string;
      shortName: string;
      fullName: string;
      jersey: string;
      position: string;
    }>;
  }>;
  rosters: any[];
  gameInfo: any[];
  commentary: any[];
  broadcasts: any[];
  odds: any[];
  leaders: any[];
  news: any[];
  videos: any[];
  format: any;
  meta: any;
};

export type ApiStatistic = {
  name: string;
  abbreviation: string;
  displayValue: string;
};

export type ApiEvent = {
  minute: number | null;
  displayMinute: string;
  type: string;
  team: 'home' | 'away' | null;
  player: string | null;
  assist: string | null;
};


/**
 * ---------------------------------------------------------------------------
 * Fetch helpers
 * ---------------------------------------------------------------------------
 */

function num(value: any): number | null {
  if (value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function teamFromCompetitor(c: any): ApiTeam {
  const t = c?.team || {};
  return {
    id: String(t.id || c?.id || ''),
    name: t.displayName || t.name || c?.name || 'Unknown',
    logo: t.logo || '',
    abbreviation: t.abbreviation,
  };
}

function leagueFromEvent(ev: any): ApiLeague {
  const comp = (ev.competitions && ev.competitions[0]) || {};
  return {
    id: String(comp.id || ev.id || ''),
    name: comp.name || ev.name || 'Unknown League',
    slug: '',
    country: '',
    logo: '',
  };
}

export function normalizeApiFixture(raw: any): ApiFixture {
  const comp = (raw.competitions && raw.competitions[0]) || {};
  const competitors = comp.competitors || [];
  const homeC = competitors.find((c: any) => c.homeAway === 'home') || competitors[0];
  const awayC = competitors.find((c: any) => c.homeAway === 'away') || competitors[1];
  const st = raw.status || {};
  const stType = st.type || {};

  const homeScore = num(homeC?.score);
  const awayScore = num(awayC?.score);

  return {
    id: String(raw.id || ''),
    uid: raw.uid || '',
    date: raw.date || new Date().toISOString(),
    name: raw.name || '',
    shortName: raw.shortName || '',
    home: homeC ? teamFromCompetitor(homeC) : { id: '', name: 'Unknown', logo: '' },
    away: awayC ? teamFromCompetitor(awayC) : { id: '', name: 'Unknown', logo: '' },
    homeScore,
    awayScore,
    status: {
      type: stType.name || 'STATUS_UNKNOWN',
      state: stType.state || 'pre',
      description: stType.description || '',
      detail: stType.detail || '',
      shortDetail: stType.shortDetail || '',
      completed: !!stType.completed,
      clock: num(st.clock) ?? undefined,
      displayClock: st.displayClock,
      period: num(st.period) ?? undefined,
    },
    league: leagueFromEvent(raw),
    venue: comp.venue?.fullName || raw.venue?.displayName || null,
    referee: null,
    competitions: [comp],
  };
}

export function normalizeApiStanding(raw: any): ApiStanding {
  return {
    rank: num(raw.rank) || 0,
    team: {
      id: String(raw.team?.id || ''),
      name: raw.team?.displayName || raw.team?.name || 'Unknown',
      logo: raw.team?.logo || '',
      abbreviation: raw.team?.abbreviation,
    },
    stats: Array.isArray(raw.stats) ? raw.stats : [],
    note: raw.note || null,
  };
}

export function normalizeApiPlay(raw: any): ApiPlay {
  return {
    id: String(raw.id || ''),
    type: raw.type || { id: '', text: '' },
    text: raw.text || '',
    alternativeText: raw.alternativeText || '',
    awayScore: num(raw.awayScore),
    homeScore: num(raw.homeScore),
    period: num(raw.period),
    clock: raw.clock || null,
    addedClock: raw.addedClock || null,
    valid: !!raw.valid,
    scoringPlay: !!raw.scoringPlay,
    scoreValue: num(raw.scoreValue) || 0,
    substitution: !!raw.substitution,
    wallclock: raw.wallclock || null,
    redCard: !!raw.redCard,
    yellowCard: !!raw.yellowCard,
    penaltyKick: !!raw.penaltyKick,
    ownGoal: !!raw.ownGoal,
    shootout: !!raw.shootout,
    modified: raw.modified || null,
    team: raw.team || null,
    athletesInvolved: Array.isArray(raw.athletesInvolved) ? raw.athletesInvolved : [],
  };
}

export function normalizeApiEvent(raw: any, homeTeamId?: string, awayTeamId?: string): ApiEvent {
  const clock = raw.clock || {};
  const rawTeamId = raw.team?.id || null;
  const rawTeamSide = raw.team?.side || null;
  let team: 'home' | 'away' | null = null;
  if (rawTeamSide === 'home') team = 'home';
  else if (rawTeamSide === 'away') team = 'away';
  else if (rawTeamId) {
    if (homeTeamId && String(rawTeamId) === String(homeTeamId)) team = 'home';
    else if (awayTeamId && String(rawTeamId) === String(awayTeamId)) team = 'away';
  }
  const player = raw.athletesInvolved && raw.athletesInvolved[0]
    ? raw.athletesInvolved[0].displayName
    : null;
  return {
    minute: num(clock.value),
    displayMinute: clock.displayValue || (num(clock.value) != null ? String(num(clock.value)) : ''),
    type: raw.type?.text || raw.text || 'Event',
    team,
    player,
    assist: null,
  };
}

/** Map the worldcup26 state to a normalized LiveStatus. */
export function mapStatus(state: string, name?: string): 'pre' | 'in' | 'post' {
  if (state === 'in') return 'in';
  if (state === 'post') return 'post';
  if (name && / halftime | half-time | ht /i.test(name)) return 'in';
  return 'pre';
}

/**
 * ---------------------------------------------------------------------------
 * Low-level fetch with retry
 * ---------------------------------------------------------------------------
 */

let requestCount = 0;
export function getApiRequestCount(): number {
  return requestCount;
}
export function resetApiRequestCount(): void {
  requestCount = 0;
}

/** Simple in-memory cache to avoid hammering the rate-limited public API. */
const cache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 30_000; // 30 seconds

function cacheKey(url: string): string {
  return url;
}

async function apiFetch(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  requestCount++;
  const url = new URL(FOOTBALL_API_BASE + endpoint);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const key = cacheKey(url.toString());
  if (typeof window !== 'undefined') {
    console.log('[apiFetch]', url.toString());
  }
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expires) {
    return cached.data;
  }

  const maxAttempts = 3;
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url.toString(), {
        headers: { Accept: 'application/json' },
      });

      if (res.status === 429 || res.status >= 500) {
        throw new Error('API error: ' + res.status + ' ' + res.statusText);
      }
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error('API error: ' + res.status + ' ' + res.statusText + ' ' + text.slice(0, 200));
      }
      const data = await res.json();
      if (data && typeof data === 'object' && data.error) {
        throw new Error('API error: ' + (data.error.message || JSON.stringify(data.error)));
      }
      cache.set(key, { data, expires: Date.now() + CACHE_TTL });
      return data;
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

/**
 * ---------------------------------------------------------------------------
 * Endpoint helpers
 * ---------------------------------------------------------------------------
 */

export async function fetchLeagues(kind: 'club' | 'all' = 'club'): Promise<ApiLeague[]> {
  try {
    const data = await apiFetch('/leagues', { kind, available: 'true' });
    return (data.leagues || []).map((l: any) => ({
      id: String(l.id || ''),
      name: l.name || 'Unknown',
      slug: l.slug || '',
      country: l.country || '',
      logo: l.logo || '',
    }));
  } catch (error) {
    console.error('football-api: failed to fetch leagues:', error);
    return [];
  }
}

/**
 * Fetch the available leagues from the API with full raw data including coverage.
 */
export async function fetchAvailableLeaguesRaw(): Promise<Array<ApiLeague & { coverage: any }>> {
  try {
    const data = await apiFetch('/leagues', { kind: 'club', available: 'true' });
    return (data.leagues || []).map((l: any) => ({
      id: String(l.id || ''),
      name: l.name || 'Unknown',
      slug: l.slug || '',
      country: l.country || '',
      logo: l.logo || '',
      coverage: l.coverage || {},
    }));
  } catch (error) {
    console.error('football-api: failed to fetch leagues:', error);
    return [];
  }
}

/**
 * Fetch the available leagues from the API and return them as a slug → league
 * map. This is the single source of truth for which competitions can be
 * displayed — nothing is hard-coded here.
 */
export async function fetchAvailableLeagues(): Promise<ApiLeague[]> {
  const leagues = await fetchAvailableLeaguesRaw();
  return leagues.map(({ coverage, ...l }) => l);
}

export async function fetchFixtures(
  league: string,
  status: 'all' | 'scheduled' | 'live' | 'finished' = 'all'
): Promise<ApiFixture[]> {
  try {
    const data = await apiFetch('/' + league + '/fixtures', { status });
    return (data.events || []).map(normalizeApiFixture);
  } catch (error) {
    console.error('football-api: failed to fetch fixtures:', error);
    return [];
  }
}

/**
 * Fetch all fixtures for a league across all pages (handles pagination).
 */
export async function fetchAllFixtures(league: string): Promise<ApiFixture[]> {
  try {
    const firstPageData = await apiFetch('/' + league + '/fixtures', { status: 'all', pageIndex: '1' });
    const firstPageEvents = (firstPageData.events || []).map(normalizeApiFixture);
    const pageCount = firstPageData.pageCount || 1;
    
    const allFixtures = [...firstPageEvents];
    
    for (let pageIndex = 2; pageIndex <= pageCount; pageIndex++) {
      try {
        const data = await apiFetch('/' + league + '/fixtures', { status: 'all', pageIndex: String(pageIndex) });
        const events = (data.events || []).map(normalizeApiFixture);
        if (events.length === 0) break;
        allFixtures.push(...events);
      } catch {
        break;
      }
    }
    
    return allFixtures;
  } catch (error) {
    console.error('football-api: failed to fetch all fixtures:', error);
    return [];
  }
}

export async function fetchStandings(league: string): Promise<ApiStanding[]> {
  try {
    const data = await apiFetch('/' + league + '/standings');
    // Response shape: { season, children: [{ standings: { entries: [...] } }] }
    const groups = data.children || [];
    const rows: ApiStanding[] = [];
    for (const g of groups) {
      const entries = g.standings && Array.isArray(g.standings.entries)
        ? g.standings.entries
        : Array.isArray(g.standings) ? g.standings : [];
      for (const s of entries) {
        rows.push(normalizeApiStanding(s));
      }
    }
    return rows;
  } catch (error) {
    console.error('football-api: failed to fetch standings:', error);
    return [];
  }
}

export async function fetchMatchSummary(league: string, eventId: string): Promise<ApiSummary | null> {
  try {
    const data = await apiFetch('/' + league + '/summary', { event: eventId });
    return data as ApiSummary;
  } catch (error) {
    console.error('football-api: failed to fetch summary:', error);
    return null;
  }
}

export async function fetchMatchPlays(
  league: string,
  eventId: string,
  importantOnly: boolean = true
): Promise<ApiPlay[]> {
  try {
    const data = await apiFetch('/' + league + '/events/' + eventId + '/plays', {
      importantOnly: String(importantOnly),
    });
    return (data.items || []).map(normalizeApiPlay);
  } catch (error) {
    console.error('football-api: failed to fetch plays:', error);
    return [];
  }
}

/**
 * Fetch the match statistics (box score) for a single event.
 *
 * The worldcup26.ir summary boxscore is empty for the competitions we use,
 * so we read the statistics off the fixture's competitors instead. Each
 * competitor carries its own statistics array keyed by home/away.
 */
export async function fetchMatchStatistics(
  league: string,
  eventId: string
): Promise<Array<{ side: 'home' | 'away'; team: ApiTeam; statistics: ApiStatistic[] }>> {
  try {
    const fixture = await fetchFixtureById(league, eventId);
    if (!fixture) return [];
    const comp = (fixture.competitions && fixture.competitions[0]) || {};
    const competitors = comp.competitors || [];
    const result: Array<{ side: 'home' | 'away'; team: ApiTeam; statistics: ApiStatistic[] }> = [];
    for (const c of competitors) {
      const stats = Array.isArray(c.statistics) ? c.statistics.map((s: any) => ({
        name: s.name,
        abbreviation: s.abbreviation,
        displayValue: s.displayValue,
      })) : [];
      result.push({
        side: c.homeAway === 'away' ? 'away' : 'home',
        team: teamFromCompetitor(c),
        statistics: stats,
      });
    }
    return result;
  } catch (error) {
    console.error('football-api: failed to fetch statistics:', error);
    return [];
  }
}

/**
 * Fetch the key events (goals, cards, substitutions, VAR) for a match.
 *
 * The /events/{eventId}/plays endpoint returns a full play-by-play feed
 * (hundreds of passes, touches, etc.). The summary's keyEvents array is the
 * curated list of match-defining moments, which is what the UI should show.
 *
 * The plays feed uses seconds on the clock; we convert to a minute display
 * (e.g. 874 -> 14'34") so the timeline reads naturally.
 */
export async function fetchMatchKeyEvents(
  league: string,
  eventId: string
): Promise<ApiEvent[]> {
  try {
    const summary = await fetchMatchSummary(league, eventId);
    if (!summary) return [];
    const keyEvents = summary.keyEvents || [];
    if (keyEvents.length === 0) return [];

    // Resolve team ids from the fixture so events attribute to the right side.
    const fixture = await fetchFixtureById(league, eventId);
    const comp: any = (fixture?.competitions && fixture.competitions[0]) || {};
    const competitors = comp.competitors || [];
    const homeId = competitors.find((c: any) => c.homeAway === 'home')?.id;
    const awayId = competitors.find((c: any) => c.homeAway === 'away')?.id;

    return keyEvents.map(e => {
      const clock = e.clock || {};
      const seconds = num(clock.value);
      const minute = seconds != null ? Math.floor(seconds / 60) : null;
      const extra = seconds != null ? seconds % 60 : null;
      return {
        minute,
        displayMinute: clock.displayValue || (minute != null && extra != null ? `${minute}'${String(extra).padStart(2, '0')}` : (minute != null ? `${minute}'` : '')),
        type: e.type?.text || 'Event',
        team: e.team?.id
          ? (e.team.id === homeId ? 'home' : e.team.id === awayId ? 'away' : null)
          : null,
        player: e.athletesInvolved && e.athletesInvolved[0]
          ? e.athletesInvolved[0].displayName
          : null,
        assist: null,
      };
    });
  } catch (error) {
    console.error('football-api: failed to fetch key events:', error);
    return [];
  }
}

/**
 * Look up a single fixture by event id within a league. Used to attach
 * statistics and competition metadata to a match detail page.
 */
export async function fetchFixtureById(
  league: string,
  eventId: string
): Promise<ApiFixture | null> {
  try {
    const data = await fetchFixtures(league, 'all');
    return data.find(f => f.id === eventId) || null;
  } catch (error) {
    console.error('football-api: failed to fetch fixture by id:', error);
    return null;
  }
}

/**
 * Fetch the play-by-play event timeline for a match.
 *
 * The plays feed is paginated (up to 14 pages of 100 items for a full match).
 * We fetch every page and keep only the match-defining moments: goals,
 * cards, substitutions, penalties and VAR. Passes, touches and clearances are
 * filtered out so the timeline stays readable.
 */
export async function fetchMatchEvents(
  league: string,
  eventId: string
): Promise<ApiEvent[]> {
  try {
    const plays = await fetchMatchPlaysAllPages(league, eventId);
    const fixture = await fetchFixtureById(league, eventId);
    const comp: any = (fixture?.competitions && fixture.competitions[0]) || {};
    const competitors = comp.competitors || [];
    const homeId = competitors.find((c: any) => c.homeAway === 'home')?.id;
    const awayId = competitors.find((c: any) => c.homeAway === 'away')?.id;

    return plays
      .filter(p => {
        const t = (p.type?.text || '').toLowerCase();
        return (
          t.includes('goal') ||
          t.includes('yellow') ||
          t.includes('red') ||
          t.includes('substitution') ||
          t.includes('penalty') ||
          t.includes('var') ||
          t.includes('card')
        );
      })
      .map(p => {
        const seconds = num(p.clock?.value);
        const minute = seconds != null ? Math.floor(seconds / 60) : null;
        const extra = seconds != null ? seconds % 60 : null;
        return {
          minute,
          displayMinute: p.clock?.displayValue || (minute != null && extra != null ? `${minute}'${String(extra).padStart(2, '0')}` : (minute != null ? `${minute}'` : '')),
          type: p.type?.text || p.text || 'Event',
          team: p.team?.side === 'home' ? 'home' : p.team?.side === 'away' ? 'away' : null,
          player: p.athletesInvolved && p.athletesInvolved[0]
            ? p.athletesInvolved[0].displayName
            : null,
          assist: null,
        };
      });
  } catch (error) {
    console.error('football-api: failed to fetch events:', error);
    return [];
  }
}

/** Fetch every page of the plays feed so the full timeline is available. */
async function fetchMatchPlaysAllPages(
  league: string,
  eventId: string
): Promise<ApiPlay[]> {
  const first = await apiFetch('/' + league + '/events/' + eventId + '/plays', {
    importantOnly: 'true',
  });
  const pageCount: number = first.pageCount || 1;
  if (pageCount <= 1) return first.items || [];

  const rest = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, i) =>
      apiFetch('/' + league + '/events/' + eventId + '/plays', {
        importantOnly: 'true',
        pageIndex: String(i + 2),
      })
    )
  );
  return [...(first.items || []), ...rest.map((r: any) => r.items || [])].flat();
}

/**
 * ---------------------------------------------------------------------------
 * Competition configuration
 * ---------------------------------------------------------------------------
 *
 * worldcup26.ir identifies leagues by slug (e.g. eng.1, esp.1). These are
 * the club competitions the frontend currently surfaces.
 */

export const COMPETITIONS = {
  premierLeague: 'eng.1',
  championship: 'eng.2',
  laLiga: 'esp.1',
} as const;

export type CompetitionKey = keyof typeof COMPETITIONS;

export function getLeagueSlug(key: CompetitionKey): string {
  return COMPETITIONS[key];
}

/** Seasons the worldcup26.ir API exposes for club competitions. */
export const SUPPORTED_SEASONS = [2026] as const;

export type ApiClub = {
  id: string;
  name: string;
  logo: string;
  abbreviation?: string;
};

export async function fetchClubs(league: string): Promise<ApiClub[]> {
  try {
    const data = await apiFetch('/' + league + '/clubs');
    const clubs = data.clubs || data || [];
    return (Array.isArray(clubs) ? clubs : []).map((c: any) => ({
      id: String(c.id || c.slug || ''),
      name: c.name || 'Unknown',
      logo: c.logo || '',
      abbreviation: c.abbreviation,
    }));
  } catch (error) {
    console.error('football-api: failed to fetch clubs:', error);
    return [];
  }
}

export async function fetchAllClubs(): Promise<ApiClub[]> {
  const leagues = Object.values(COMPETITIONS);
  const results: ApiClub[] = [];
  for (const l of leagues) {
    const clubs = await fetchClubs(l);
    results.push(...clubs);
  }
  return results;
}
