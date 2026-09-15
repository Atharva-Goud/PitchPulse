import { NextResponse } from 'next/server';

/**
 * Leagues metadata endpoint.
 *
 * Returns the leagues the football API actually exposes, together with the
 * current leader (top team in standings) for each. Discovery + leader probing
 * happen once on the server and are cached for the lifetime of the process,
 * so the client never has to fire 20+ parallel standings/fixtures requests.
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

async function discoverLeaguesWithLeaders(): Promise<LeagueWithLeader[]> {
  const { fetchAvailableLeagues, fetchStandings } = await import('@/lib/football/api');
  const leagues = await fetchAvailableLeagues();

  function statValue(stats: Array<{ name: string; abbreviation: string; displayValue: string }>, name: string): number {
    const s = stats.find((x) => x.name === name);
    if (!s) return 0;
    const n = Number(s.displayValue);
    return Number.isFinite(n) ? n : 0;
  }

  const results = await Promise.all(
    leagues.map(async (l) => {
      let leader: LeagueWithLeader['leader'] = null;
      let teamCount = 0;
      try {
        const rows = await fetchStandings(l.slug);
        teamCount = rows.length;
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
        // No standings data for this league
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

  inFlight = discoverLeaguesWithLeaders();
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