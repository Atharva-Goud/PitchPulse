'use client';

import { useState, useEffect } from 'react';
import { LoadingState, EmptyState, ErrorState } from '@/components/ui';
import { getStandingsBySlug, getAvailableSeasons } from '@/lib/football/standings';
import StandingsTable from '@/components/football/StandingsTable';
import StandingsInsights from '@/components/football/StandingsInsights';

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

export default function FootballStandingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leagues, setLeagues] = useState<LeagueOption[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [availableSeasons, setAvailableSeasons] = useState<number[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [standings, setStandings] = useState<import('@/lib/football/standings').StandingRow[]>([]);
  const [tableLoading, setTableLoading] = useState(false);

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
        if (withData.length > 0) {
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
  }, []);

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
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  const selectedLeague = leagues.find(l => l.slug === selectedSlug);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Standings</h1>
          <p className="text-slate-400">League tables powered by the football data API</p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">League</label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
            >
              {leagues.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
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