import { Suspense } from 'react';
import { fetchAvailableLeaguesRaw } from '@/lib/football/api';
import { fetchStandings } from '@/lib/football/api';
import LeaguesPageClient from '@/components/football/LeaguesPageClient';

export const dynamic = 'force-dynamic';

interface LeagueWithLeader {
  id: string;
  name: string;
  slug: string;
  country: string;
  logo: string;
  leader: { name: string; logo: string; points: number; goalDifference: number } | null;
  teamCount: number;
}

async function getLeaguesPageData(): Promise<LeagueWithLeader[]> {
  const leagues = await fetchAvailableLeaguesRaw();

  const majorLeagues = new Set(['eng.1', 'esp.1', 'ger.1', 'ita.1', 'fra.1', 'ned.1', 'por.1', 'sco.1']);

  function statValue(stats: Array<{ name: string; abbreviation: string; displayValue: string }>, name: string): number {
    const s = stats.find((x) => x.name === name);
    if (!s) return 0;
    const n = Number(s.displayValue);
    return Number.isFinite(n) ? n : 0;
  }

  const results = await Promise.all(
    leagues.map(async (l) => {
      let leader: LeagueWithLeader['leader'] = null;
      const teamCount = l.coverage?.clubs ?? 0;
      const hasStandings = (l.coverage?.standingsGroups ?? 0) > 0 && (l.coverage?.hasData ?? false);

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

export default async function LeaguesPage() {
  const data = await getLeaguesPageData();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <Suspense fallback={<div className="h-96 bg-slate-900/50 rounded-xl animate-pulse" />}>
          <LeaguesPageClient initialData={data} />
        </Suspense>
      </div>
    </div>
  );
}