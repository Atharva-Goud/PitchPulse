import { Suspense } from 'react';
import MatchDetailClient from '@/components/football/MatchDetailClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MatchDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Suspense fallback={<div className="h-96 bg-slate-900/50 rounded-xl animate-pulse" />}>
          <MatchDetailClient params={params} />
        </Suspense>
      </div>
    </div>
  );
}