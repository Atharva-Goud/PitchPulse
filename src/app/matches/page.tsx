import { Suspense } from 'react';
import { getLiveMatchList, getUpcomingMatchList, getRecentMatchList } from '@/lib/football/matches';
import MatchesPageClient from '@/components/football/MatchesPageClient';
import type { NormalizedMatch } from '@/lib/football/types';

export const dynamic = 'force-dynamic';

interface MatchesPageData {
  live: NormalizedMatch[];
  upcoming: NormalizedMatch[];
  results: NormalizedMatch[];
}

async function getMatchesPageData(): Promise<MatchesPageData> {
  const [live, upcoming, results] = await Promise.all([
    getLiveMatchList(),
    getUpcomingMatchList(undefined, 14),
    getRecentMatchList(undefined, 20),
  ]);

  return { live, upcoming, results };
}

export default async function FootballMatchesPage() {
  const data = await getMatchesPageData();

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="container-page py-12"><div className="h-96 bg-slate-900/50 rounded-xl animate-pulse" /></div>}>
        <MatchesPageClient initialData={data} />
      </Suspense>
    </div>
  );
}