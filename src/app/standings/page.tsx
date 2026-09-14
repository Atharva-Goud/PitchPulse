'use client';

import { useState, useEffect } from 'react';
import { Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { LoadingState, EmptyState, ErrorState } from '@/components/ui';
import { getStandings, getAvailableSeasons } from '@/lib/football/standings';
import type { StandingRow } from '@/lib/football/standings';
import { getAllCompetitions, type CompetitionConfig } from '@/lib/football/competitions';
import StandingsInsights from '@/components/football/StandingsInsights';

export default function FootballStandingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [competitions, setCompetitions] = useState<CompetitionConfig[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('premierLeague');
  const [availableSeasons, setAvailableSeasons] = useState<number[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [standings, setStandings] = useState<StandingRow[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [comps, seasons] = await Promise.all([
          Promise.resolve(getAllCompetitions()),
          getAvailableSeasons(),
        ]);
        setCompetitions(comps);
        setAvailableSeasons(seasons);
        const defaultSeason = seasons[0] ?? 2024;
        setSelectedSeason(defaultSeason);

        const data = await getStandings(selectedCompetition as any, defaultSeason);
        setStandings(data);
      } catch (error) {
        console.error('Error loading standings:', error);
        setError('Unable to load standings. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompetition]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <LoadingState variant="table" count={10} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Standings</h1>
          <p className="text-slate-400">League tables powered by the football data API</p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">Competition</label>
            <select
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
            >
              {competitions.map((comp) => (
                <option key={comp.key} value={comp.key}>
                  {comp.name}
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

        {standings.length === 0 ? (
          <EmptyState
            type="matches"
            message="No standings available"
            reason="Standings are not available for the selected competition or season."
          />
        ) : (
          <div className="space-y-6">
            <StandingsInsights
              standings={standings}
              competitionName={
                competitions.find(c => c.key === selectedCompetition)?.name || 'Competition'
              }
            />
            <div className="rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-slate-400 bg-slate-900/80">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">#</th>
                    <th className="px-4 py-3 text-left font-medium">Team</th>
                    <th className="px-4 py-3 text-center font-medium">P</th>
                    <th className="px-4 py-3 text-center font-medium">W</th>
                    <th className="px-4 py-3 text-center font-medium">D</th>
                    <th className="px-4 py-3 text-center font-medium">L</th>
                    <th className="px-4 py-3 text-center font-medium">GF</th>
                    <th className="px-4 py-3 text-center font-medium">GA</th>
                    <th className="px-4 py-3 text-center font-medium">GD</th>
                    <th className="px-4 py-3 text-center font-medium">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {standings.map((row) => (
                    <tr key={row.teamId} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-slate-400 font-medium">{row.rank}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {row.teamLogo ? (
                            <img src={row.teamLogo} alt="" className="h-6 w-6 object-contain" loading="lazy" />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-slate-800" />
                          )}
                          <span className="font-medium text-white">{row.teamName}</span>
                          {row.form && <span className="text-xs text-slate-500 ml-auto">{row.form}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-300 tabular-nums">{row.played}</td>
                      <td className="px-4 py-3 text-center text-slate-300 tabular-nums">{row.won}</td>
                      <td className="px-4 py-3 text-center text-slate-300 tabular-nums">{row.draw}</td>
                      <td className="px-4 py-3 text-center text-slate-300 tabular-nums">{row.lost}</td>
                      <td className="px-4 py-3 text-center text-slate-300 tabular-nums">{row.goalsFor}</td>
                      <td className="px-4 py-3 text-center text-slate-300 tabular-nums">{row.goalsAgainst}</td>
                      <td className="px-4 py-3 text-center tabular-nums">
                        <span className={row.goalDifference > 0 ? 'text-emerald-400' : row.goalDifference < 0 ? 'text-red-400' : 'text-slate-400'}>
                          {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-white tabular-nums">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}