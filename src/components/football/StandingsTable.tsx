'use client';

import { Trophy } from 'lucide-react';
import TeamLogo from '@/components/football/TeamLogo';
import type { StandingRow } from '@/lib/football/standings';

interface StandingsTableProps {
  standings: StandingRow[];
}

/**
 * Render a standings table from real API data.
 *
 * Columns are derived from the data itself: a column is only shown when every
 * row has a non-zero value for it, so we never fabricate statistics the API
 * did not return. Team logos fall back to the shared TeamLogo component when
 * the API does not provide one.
 */
export default function StandingsTable({ standings }: StandingsTableProps) {
  if (!standings || standings.length === 0) return null;

  const has = (key: keyof StandingRow): boolean =>
    standings.every(row => {
      const v = row[key];
      return typeof v === 'number' && v > 0;
    });

  const showPlayed = has('played');
  const showWon = has('won');
  const showDraw = has('draw');
  const showLost = has('lost');
  const showGF = has('goalsFor');
  const showGA = has('goalsAgainst');
  const showGD = has('goalDifference');
  const showPts = has('points');

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-slate-400 bg-slate-900/80">
            <tr>
              <th className="px-4 py-3 text-left font-medium">#</th>
              <th className="px-4 py-3 text-left font-medium">Team</th>
              {showPlayed && <th className="px-4 py-3 text-center font-medium">P</th>}
              {showWon && <th className="px-4 py-3 text-center font-medium">W</th>}
              {showDraw && <th className="px-4 py-3 text-center font-medium">D</th>}
              {showLost && <th className="px-4 py-3 text-center font-medium">L</th>}
              {showGF && <th className="px-4 py-3 text-center font-medium">GF</th>}
              {showGA && <th className="px-4 py-3 text-center font-medium">GA</th>}
              {showGD && <th className="px-4 py-3 text-center font-medium">GD</th>}
              {showPts && <th className="px-4 py-3 text-center font-medium">Pts</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {standings.map((row) => (
              <tr key={row.teamId} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-slate-400 font-medium">{row.rank}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <TeamLogo team={{ name: row.teamName, logo: row.teamLogo }} size="sm" />
                    <span className="font-medium text-white">{row.teamName}</span>
                    {row.form && <span className="text-xs text-slate-500 ml-auto">{row.form}</span>}
                  </div>
                </td>
                {showPlayed && <td className="px-4 py-3 text-center text-slate-300 tabular-nums">{row.played}</td>}
                {showWon && <td className="px-4 py-3 text-center text-slate-300 tabular-nums">{row.won}</td>}
                {showDraw && <td className="px-4 py-3 text-center text-slate-300 tabular-nums">{row.draw}</td>}
                {showLost && <td className="px-4 py-3 text-center text-slate-300 tabular-nums">{row.lost}</td>}
                {showGF && <td className="px-4 py-3 text-center text-slate-300 tabular-nums">{row.goalsFor}</td>}
                {showGA && <td className="px-4 py-3 text-center text-slate-300 tabular-nums">{row.goalsAgainst}</td>}
                {showGD && (
                  <td className="px-4 py-3 text-center tabular-nums">
                    <span className={row.goalDifference > 0 ? 'text-emerald-400' : row.goalDifference < 0 ? 'text-red-400' : 'text-slate-400'}>
                      {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                    </span>
                  </td>
                )}
                {showPts && <td className="px-4 py-3 text-center font-bold text-white tabular-nums">{row.points}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}