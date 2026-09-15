import { NextResponse } from 'next/server';

/**
 * Standings metadata endpoint.
 *
 * Returns the leagues the football API actually exposes, together with the
 * subset that currently has standings data. Discovery happens once on the
 * server using the API coverage field (no extra standings requests),
 * so the client never has to fire 20+ parallel standings requests on load.
 */

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface LeagueMeta {
  slug: string;
  name: string;
  country: string;
  hasStandings: boolean;
}

let cache: LeagueMeta[] | null = null;
let inFlight: Promise<LeagueMeta[]> | null = null;

async function discoverLeagues(): Promise<LeagueMeta[]> {
  const { fetchAvailableLeaguesRaw } = await import('@/lib/football/api');
  const leagues = await fetchAvailableLeaguesRaw();

  const results = leagues.map((l) => {
    const hasStandings = (l.coverage?.standingsGroups ?? 0) > 0 && (l.coverage?.hasData ?? false);
    return { slug: l.slug, name: l.name, country: l.country, hasStandings };
  });
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
    console.error('api/standings: league discovery failed:', error);
    return NextResponse.json({ error: 'discovery failed' }, { status: 500 });
  } finally {
    inFlight = null;
  }
}