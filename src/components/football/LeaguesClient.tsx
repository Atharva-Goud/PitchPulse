'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, ChevronRight, TrendingUp } from 'lucide-react';
import TeamLogo from '@/components/football/TeamLogo';
import type { ApiLeague } from '@/lib/football/standings';
import { LoadingState, EmptyState } from '@/components/ui';

interface LeagueWithLeader extends ApiLeague {
  leader: { name: string; logo: string; points: number; goalDifference: number } | null;
  teamCount: number;
}

export default function LeaguesClient() {
  const [loading, setLoading] = useState(true);
  const [leagues, setLeagues] = useState<LeagueWithLeader[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadLeagues() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/leagues');
        if (!res.ok) throw new Error('Failed to fetch leagues');
        const data: LeagueWithLeader[] = await res.json();
        if (!cancelled) {
          setLeagues(data);
        }
      } catch (err) {
        console.error('Error loading leagues:', err);
        if (!cancelled) setError('Unable to load leagues. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadLeagues();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Leagues</h1>
          <p className="text-slate-400">All available competitions with live standings</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-slate-900/60 p-6 animate-pulse">
              <div className="h-10 w-3/4 bg-slate-800 rounded mb-4" />
              <div className="h-4 w-1/2 bg-slate-800 rounded" />
              <div className="h-4 w-1/3 bg-slate-800 rounded mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState type="matches" message={error} />
      </div>
    );
  }

  const leaguesWithData = leagues.filter(l => l.teamCount > 0);
  const leaguesWithoutData = leagues.filter(l => l.teamCount === 0);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Leagues</h1>
        <p className="text-slate-400">All available competitions with live standings</p>
      </div>

      {leaguesWithData.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-emerald-400" />
            Active Competitions
            <span className="ml-auto text-sm text-slate-500">{leaguesWithData.length} leagues</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {leaguesWithData.map((l) => (
              <Link
                key={l.slug}
                href={`/standings?league=${l.slug}`}
                className="rounded-xl border border-white/10 bg-slate-900/60 p-5 hover:border-emerald-500/30 hover:bg-slate-900/80 transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                    {l.logo ? (
                      <img src={l.logo} alt="" className="h-full w-full object-contain p-1" />
                    ) : (
                      <Trophy className="h-6 w-6 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {l.name}
                    </h3>
                    <p className="text-sm text-slate-400 mt-0.5">{l.country} · {l.teamCount} teams</p>
                    {l.leader && (
                      <div className="mt-3 flex items-center gap-3 pt-3 border-t border-white/5">
                        <TeamLogo team={{ name: l.leader.name, logo: l.leader.logo }} size="xs" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{l.leader.name}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" aria-hidden="true" />
                            {l.leader.points} pts {l.leader.goalDifference > 0 ? `(+${l.leader.goalDifference})` : l.leader.goalDifference < 0 ? `(${l.leader.goalDifference})` : ''}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {leaguesWithoutData.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-slate-500" />
            No Standings Data
            <span className="ml-auto text-sm text-slate-500">{leaguesWithoutData.length} leagues</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {leaguesWithoutData.map((l) => (
              <div key={l.slug} className="rounded-xl border border-white/10 bg-slate-900/40 p-4 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden">
                    {l.logo ? (
                      <img src={l.logo} alt="" className="h-full w-full object-contain p-1" />
                    ) : (
                      <Trophy className="h-5 w-5 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-300 truncate">{l.name}</h3>
                    <p className="text-xs text-slate-500">{l.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {leagues.length === 0 && (
        <EmptyState type="matches" message="No leagues available" />
      )}
    </div>
  );
}