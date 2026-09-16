import { Suspense } from 'react';
import { fetchAvailableLeaguesRaw } from '@/lib/football/api';
import { getAvailableSeasons } from '@/lib/football/standings';
import { getStandingsBySlug } from '@/lib/football/standings';
import StandingsPageClient from '@/components/football/StandingsPageClient';

export const dynamic = 'force-dynamic';

interface LeagueMeta {
  slug: string;
  name: string;
  country: string;
  hasStandings: boolean;
}

interface StandingsPageData {
  leagues: LeagueMeta[];
  availableSeasons: number[];
}

async function getStandingsPageData(): Promise<StandingsPageData> {
  const [leaguesRaw, seasons] = await Promise.all([
    fetchAvailableLeaguesRaw(),
    getAvailableSeasons(),
  ]);

  const leagues: LeagueMeta[] = leaguesRaw.map((l) => {
    const hasStandings = (l.coverage?.standingsGroups ?? 0) > 0 && (l.coverage?.hasData ?? false);
    return { slug: l.slug, name: l.name, country: l.country, hasStandings };
  });

  return { leagues, availableSeasons: seasons };
}

interface PageProps {
  searchParams: Promise<{ league?: string }>;
}

export default async function FootballStandingsPage({ searchParams }: PageProps) {
  const { league: urlLeague } = await searchParams;
  const data = await getStandingsPageData();

  // Determine default league
  const withData = data.leagues.filter(l => l.hasStandings);
  const defaultLeague = urlLeague && withData.some(l => l.slug === urlLeague) ? urlLeague : withData[0]?.slug || '';
  const defaultSeason = data.availableSeasons[0] ?? 2026;

  // Pre-fetch standings for default league
  let initialStandings: import('@/lib/football/standings').StandingRow[] = [];
  if (defaultLeague) {
    try {
      initialStandings = await getStandingsBySlug(defaultLeague, defaultSeason);
    } catch {
      // Ignore errors, client will handle
    }
  }

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12"><div className="h-96 bg-slate-900/50 rounded-xl animate-pulse" /></div>}>
        <StandingsPageClient
          initialData={data}
          initialLeague={defaultLeague}
          initialSeason={defaultSeason}
          initialStandings={initialStandings}
        />
      </Suspense>
    </div>
  );
}