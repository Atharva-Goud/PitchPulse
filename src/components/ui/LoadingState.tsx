'use client';

export default function LoadingState({ 
  variant = 'card', 
  count = 3,
  height 
}: { 
  variant?: 'card' | 'list' | 'table';
  count?: number;
  height?: string;
} = {}) {
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
        <div key={i} className="rounded-xl bg-slate-900 border border-white/10 overflow-hidden">
          <div 
            className="aspect-[16/10] bg-slate-800 animate-pulse" 
            style={{ height: height || '200px' }}
          />
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