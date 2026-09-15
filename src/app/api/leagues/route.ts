import { NextResponse } from 'next/server';

/**
 * Leagues metadata endpoint.
 *
 * Returns the leagues the football API actually exposes, together with basic
 * metadata (team count, hasStandings). Discovery happens once on the server
 * and is cached for the lifetime of the process. We avoid probing standings
 * for every league to prevent 429 errors - the API coverage field tells us
 * which leagues have data.
 */

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export interface LeagueWithLeader {
  id: string;
  name: string;
  slug: string;
  country: string;
  logo: string;
  leader: { name: string; logo: string; points: number; goalDifference: number } | null;
  teamCount: number;
}

let cache: LeagueWithLeader[] | null = null;
let inFlight: Promise<LeagueWithLeader[]> | null = null;

async function discoverLeagues(): Promise<LeagueWithLeader[]> {
  const { fetchAvailableLeaguesRaw } = await import('@/lib/football/api');
  const leagues = await fetchAvailableLeaguesRaw();

  // Major league slugs where we want to show the leader
  const majorLeagues = new Set(['eng.1', 'esp.1', 'ger.1', 'ita.1', 'fra.1', 'ned.1', 'por.1', 'sco.1']);

  const { fetchStandings } = await import('@/lib/football/api');

  function statValue(stats: Array<{ name: string; abbreviation: string; displayValue: string }>, name: string): number {
    const s = stats.find((x) => x.name === name);
    if (!s) return 0;
    const n = Number(s.displayValue);
    return Number.isFinite(n) ? n : 0;
  }

  const results = await Promise.all(
    leagues.map(async (l) => {
      let leader: LeagueWithLeader['leader'] = null;
      // Use coverage data from the leagues API to avoid extra requests
      const teamCount = l.coverage?.clubs ?? 0;
      const hasStandings = (l.coverage?.standingsGroups ?? 0) > 0 && (l.coverage?.hasData ?? false);

      // Only fetch leader for major leagues that have standings
      if (hasStandings && majorLeagues.has(l.slug)) {
        try {
          const rows = await fetchStandings(l.slug);
          if (rows.length > 0) {
            const first = rows[0];
            leader = {
              name: first.team.name,
              logo: first.team.logo,
              points: statValue(first.stats, 'points'),
              goalDifference: statValue(first.stats, 'pointDifferential'),
            };
          }
        } catch {
          // Ignore leader fetch errors
        }
      }
      return { ...l, leader, teamCount };
    })
  );

  return results;
}

export async function GET() {
  if (cache) {
    return NextResponse.json(cache);
  }
  if (inFlight) {
    try {
      const data = await inFlight;
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ error: 'discovery failed' }, { status: 500 });
    }
  }

  inFlight = discoverLeagues();
  try {
    cache = await inFlight;
    return NextResponse.json(cache);
  } catch (error) {
    console.error('api/leagues: league discovery failed:', error);
    return NextResponse.json({ error: 'discovery failed' }, { status: 500 });
  } finally {
    inFlight = null;
  }
}