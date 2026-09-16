import { Suspense } from 'react';
import { getHomepageData } from '@/lib/homepage-data';
import HomepageHero from '@/components/home/HomepageHero';
import HomepageSections from '@/components/home/HomepageSections';

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-[60rem] md:h-[80rem] flex items-center justify-center"><div className="h-96 bg-slate-900/50 rounded-xl animate-pulse" /></div>}>
        <HomepageHero data={data} />
      </Suspense>

      <div className="container-page py-12 space-y-12">
        <Suspense fallback={<LoadingState variant="card" count={3} />}>
          <HomepageSections data={data} />
        </Suspense>
      </div>
    </div>
  );
}

function LoadingState({ variant = 'card', count = 3 }: { variant?: 'card' | 'list' | 'table'; count?: number }) {
  if (variant === 'list') {
    return (
      <div className="space-y-3" role="status" aria-label="Loading">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50 border border-white/5">
            <div className="h-12 w-12 rounded-lg bg-slate-800 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-slate-800 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="space-y-3" role="status" aria-label="Loading">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 p-3 rounded-lg bg-slate-900/50 border border-white/5">
            <div className="h-10 w-10 rounded bg-slate-800 animate-pulse" />
            <div className="col-span-2 space-y-2">
              <div className="h-4 w-1/3 bg-slate-800 rounded animate-pulse" />
              <div className="h-3 w-1/4 bg-slate-800 rounded animate-pulse" />
            </div>
            <div className="h-4 w-1/2 bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-slate-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden">
          <div className="aspect-[16/10] bg-slate-800 animate-pulse" style={{ height: '200px' }} />
          <div className="p-4 space-y-3">
            <div className="h-4 w-1/4 bg-slate-800 rounded animate-pulse" />
            <div className="h-5 w-3/4 bg-slate-800 rounded animate-pulse" />
            <div className="h-5 w-3/4 bg-slate-800 rounded animate-pulse" />
            <div className="h-5 w-1/2 bg-slate-800 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}