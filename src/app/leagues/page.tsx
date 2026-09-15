import { Suspense } from 'react';
import LeaguesClient from '@/components/football/LeaguesClient';

export const dynamic = 'force-dynamic';

export default function LeaguesPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <Suspense fallback={<div className="h-96 bg-slate-900/50 rounded-xl animate-pulse" />}>
          <LeaguesClient />
        </Suspense>
      </div>
    </div>
  );
}