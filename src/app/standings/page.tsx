import { Suspense } from 'react';
import StandingsPageClient from '@/components/football/StandingsPageClient';

export default function FootballStandingsPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12"><div className="h-96 bg-slate-900/50 rounded-xl animate-pulse" /></div>}>
        <StandingsPageClient />
      </Suspense>
    </div>
  );
}