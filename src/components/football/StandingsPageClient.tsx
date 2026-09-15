'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { LoadingState, EmptyState, ErrorState } from '@/components/ui';
import { getStandingsBySlug, getAvailableSeasons } from '@/lib/football/standings';
import StandingsTable from '@/components/football/StandingsTable';
import StandingsInsights from '@/components/football/StandingsInsights';
import { ChevronRight, Trophy } from 'lucide-react';

interface LeagueOption {
  slug: string;
  name: string;
  country: string;
}

interface LeagueMeta {
  slug: string;
  name: string;
  country: string;
  hasStandings: boolean;
}

export default function FootballStandingsClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leagues, setLeagues] = useState<LeagueOption[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [availableSeasons, setAvailableSeasons] = useState<number[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [standings, setStandings] = useState<import('@/lib/football/standings').StandingRow[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const searchParams = useSearchParams();
  const urlLeague = searchParams?.get('league');
  const router = useRouter();

  // Initial load: discover leagues + seasons from the server.
  useEffect(() => {
    let cancelled = false;
    async function loadMeta() {
      try {
        setError(null);
        const [metaRes, seasons] = await Promise.all([
          fetch('/api/standings'),
          getAvailableSeasons(),
        ]);
        if (!metaRes.ok) throw new Error('league discovery failed');
        const meta: LeagueMeta[] = await metaRes.json();

        // Only keep leagues that actually expose standings data.
        const withData = meta
          .filter(l => l.hasStandings)
          .map(l => ({ slug: l.slug, name: l.name, country: l.country }));
        if (cancelled) return;
        setLeagues(withData);
        setAvailableSeasons(seasons);
        const defaultSeason = seasons[0] ?? 2026;
        setSelectedSeason(defaultSeason);
        // Prefer URL league, then first available
        if (urlLeague && withData.some(l => l.slug === urlLeague)) {
          setSelectedSlug(urlLeague);
        } else if (withData.length > 0) {
          setSelectedSlug(withData[0].slug);
        }
      } catch (err) {
        console.error('Error loading leagues:', err);
        if (!cancelled) setError('Unable to load standings. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadMeta();
    return () => { cancelled = true; };
  }, [urlLeague]);

  // Fetch standings whenever the selected league or season changes.
  useEffect(() => {
    if (!selectedSlug) return;
    let cancelled = false;
    async function loadStandings() {
      try {
        setTableLoading(true);
        const data = await getStandingsBySlug(selectedSlug, selectedSeason ?? undefined);
        if (cancelled) return;
        setStandings(data);
      } catch (err) {
        console.error('Error loading standings:', err);
        if (!cancelled) setError('Unable to load standings. Please try again.');
      } finally {
        if (!cancelled) setTableLoading(false);
      }
    }
    loadStandings();
    return () => { cancelled = true; };
  }, [selectedSlug, selectedSeason]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <LoadingState variant="table" count={10} />
        </div>
      </div>
    );
  }

  if (error && leagues.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <ErrorState message={error} onRetry={() => router.refresh()} />
        </div>
      </div>
    );
  }

  const selectedLeague = leagues.find(l => l.slug === selectedSlug);

  const handleLeagueChange = (slug: string) => {
    setSelectedSlug(slug);
    const params = new URLSearchParams(searchParams?.toString());
    params.set('league', slug);
    router.push(`/standings?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Standings</h1>
            <p className="text-slate-400">League tables powered by the football data API</p>
          </div>
          <Link
            href="/leagues"
            className="btn-secondary flex items-center gap-2 whitespace-nowrap"
          >
            <Trophy className="h-4 w-4" />
            Browse All Leagues
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-[280px]">
            <label className="block text-sm font-medium text-slate-400 mb-2">League</label>
            <div className="relative">
              <select
                value={selectedSlug}
                onChange={(e) => handleLeagueChange(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500 appearance-none"
              >
                {leagues.map((l) => (
                  <option key={l.slug} value={l.slug}>
                    {l.name}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-400 mb-2">Season</label>
            <select
              value={selectedSeason ?? undefined}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
            >
              {availableSeasons.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Current league context */}
        {selectedLeague && (
          <div className="mb-6 p-4 rounded-xl border border-white/10 bg-slate-900/40 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-emerald-400" />
              <div>
                <p className="font-semibold text-white">{selectedLeague.name}</p>
                <p className="text-sm text-slate-400">{selectedLeague.country} · {availableSeasons[0] ?? 2026} Season</p>
              </div>
            </div>
            <Link
              href="/leagues"
              className="btn-ghost text-sm"
            >
              View all leagues
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {tableLoading ? (
          <LoadingState variant="table" count={10} />
        ) : standings.length === 0 ? (
          <EmptyState
            type="matches"
            message="No standings available"
            reason="Standings are not available for the selected competition or season."
          />
        ) : (
          <div className="space-y-6">
            <StandingsInsights
              standings={standings}
              competitionName={selectedLeague?.name || 'Competition'}
            />
            <StandingsTable standings={standings} />
          </div>
        )}
      </div>
    </div>
  );
}