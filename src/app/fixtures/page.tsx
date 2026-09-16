import { Suspense } from 'react';
import { getUpcomingMatchList, type CompetitionKey } from '@/lib/football/matches';
import { getAllCompetitions, type CompetitionConfig } from '@/lib/football/competitions';
import FixturesPageClient from '@/components/football/FixturesPageClient';
import type { NormalizedMatch } from '@/lib/football/types';

export const dynamic = 'force-dynamic';

interface FixturesPageData {
  matches: NormalizedMatch[];
  competitions: CompetitionConfig[];
}

async function getFixturesPageData(): Promise<FixturesPageData> {
  const [comps, data] = await Promise.all([
    getAllCompetitions(),
    getUpcomingMatchList(undefined, 30),
  ]);

  return { matches: data, competitions: comps };
}

export default async function FootballFixturesPage() {
  const data = await getFixturesPageData();

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12"><div className="h-96 bg-slate-900/50 rounded-xl animate-pulse" /></div>}>
        <FixturesPageClient initialData={data} />
      </Suspense>
    </div>
  );
}