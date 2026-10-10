import { Suspense } from 'react';
import Link from 'next/link';
import { ExternalLink, Trophy } from 'lucide-react';
import { getWorldCupData } from '@/lib/football/world-cup';
import WorldCupPageClient from '@/components/world-cup/WorldCupPageClient';

export const revalidate = 300;

export const metadata = {
  title: 'World Cup 2026 — Knockout Journey, Groups & Stats | PitchPulse',
  description:
    'FIFA World Cup 2026 knockout bracket, group standings and tournament statistics, ' +
    'built from the public-domain OpenFootball dataset. Scores, standings and the champion ' +
    'are shown only from real match results.',
};

function PageFallback() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="h-72 animate-pulse rounded-xl bg-[var(--surface-2)]/50" />
      </div>
    </div>
  );
}

export default async function WorldCup2026Page() {
  const data = await getWorldCupData();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)]/15 text-[var(--primary)]">
              <Trophy className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                FIFA World Cup 2026
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Knockout journey tree, group standings and tournament statistics.
              </p>
            </div>
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Every score, standing and statistic on this page is derived from the public-domain{' '}
            <a
              href="https://github.com/openfootball/worldcup.json"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-emerald-400 hover:text-emerald-300"
            >
              OpenFootball worldcup.json
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>{' '}
            dataset. Where the dataset does not provide a value, the section says so instead of
            showing placeholder data. Group tables are calculated from match results.
          </p>
        </header>

        <Suspense fallback={<PageFallback />}>
          <WorldCupPageClient data={data} />
        </Suspense>
      </div>
    </div>
  );
}
