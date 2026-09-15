'use client';

import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import TeamLogo from '@/components/football/TeamLogo';
import type { StandingRow, TeamRecord } from '@/lib/football/standings';

interface StandingsTableProps {
  standings: StandingRow[];
}

function formatRecord(record: TeamRecord): string {
  if (record.played === 0) return '—';
  return `${record.won}W ${record.draw}D ${record.lost}L`;
}

function formatRecordDetail(record: TeamRecord): string {
  if (record.played === 0) return '—';
  return `${record.played} matches · ${record.won}W ${record.draw}D ${record.lost}L · ${record.goalsFor} GF · ${record.goalsAgainst} GA`;
}

/**
 * Render a standings table from real API data.
 *
 * Columns are derived from the data itself: a column is only shown when every
 * row has a non-zero value for it, so we never fabricate statistics the API
 * did not return. Team logos fall back to the shared TeamLogo component when
 * the API does not provide one.
 *
 * Mobile: first two columns (# and Team) are sticky for horizontal scrolling.
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
  const showRankChange = has('rankChange');
  const showHomeRecord = standings.some(row => row.homeRecord.played > 0);
  const showAwayRecord = standings.some(row => row.awayRecord.played > 0);
  const showForm = standings.some(row => row.form && row.form.length > 0);

  // Calculate how many stat columns we have for min-width
  const statColumns = [showPlayed, showWon, showDraw, showLost, showGF, showGA, showGD, showPts, showRankChange, showForm, showHomeRecord, showAwayRecord].filter(Boolean).length;
  const tableMinWidth = Math.max(800, 120 + 200 + statColumns * 70); // rank + team + stats

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden">
      <div className="overflow-x-auto" style={{ minWidth: tableMinWidth }}>
        <table className="w-full text-sm" style={{ minWidth: tableMinWidth }}>
          <thead className="text-xs uppercase text-slate-400 bg-slate-900/80 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-medium sticky left-0 z-20 bg-slate-900/80 border-r border-white/10 w-12">#</th>
              <th className="px-4 py-3 text-left font-medium sticky left-12 z-20 bg-slate-900/80 border-r border-white/10 min-w-[180px]">Team</th>
              {showPlayed && <th className="px-4 py-3 text-center font-medium w-12">P</th>}
              {showWon && <th className="px-4 py-3 text-center font-medium w-12">W</th>}
              {showDraw && <th className="px-4 py-3 text-center font-medium w-12">D</th>}
              {showLost && <th className="px-4 py-3 text-center font-medium w-12">L</th>}
              {showGF && <th className="px-4 py-3 text-center font-medium w-12">GF</th>}
              {showGA && <th className="px-4 py-3 text-center font-medium w-12">GA</th>}
              {showGD && <th className="px-4 py-3 text-center font-medium w-16">GD</th>}
              {showPts && <th className="px-4 py-3 text-center font-medium w-16 sticky right-0 z-20 bg-slate-900/80 border-l border-white/10">Pts</th>}
              {showForm && <th className="px-4 py-3 text-center font-medium w-24">Form</th>}
              {showHomeRecord && <th className="px-4 py-3 text-center font-medium w-28" title="Home record">Home</th>}
              {showAwayRecord && <th className="px-4 py-3 text-center font-medium w-28" title="Away record">Away</th>}
              {showRankChange && <th className="px-4 py-3 text-center font-medium w-16 sticky right-0 z-20 bg-slate-900/80 border-l border-white/10">±</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {standings.map((row, index) => {
              const isTop = row.rank <= 3;
              const isEuropean = row.rank <= 5;
              const isRelegation = row.rank > standings.length - 4;
              const isChampions = row.rank === 1;
              const note = row.note;

              return (
                <tr
                  key={row.teamId}
                  className={`hover:bg-white/5 transition-colors ${
                    isChampions ? 'bg-emerald-500/5 border-l-4 border-emerald-500' :
                    isEuropean ? 'bg-blue-500/5' :
                    isRelegation ? 'bg-red-500/5' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-slate-400 font-medium sticky left-0 z-10 bg-slate-900/60 border-r border-white/10 w-12">
                    {isChampions && <Trophy className="inline h-4 w-4 text-emerald-400 mr-1" />}
                    {row.rank}
                  </td>
                  <td className="px-4 py-3 sticky left-12 z-10 bg-slate-900/60 border-r border-white/10 min-w-[180px]">
                    <div className="flex items-center gap-3">
                      <TeamLogo team={{ name: row.teamName, logo: row.teamLogo }} size="sm" />
                      <span className={`font-medium text-white ${isChampions ? 'text-emerald-400' : ''}`}>{row.teamName}</span>
                      {note && (
                        <span
                          className={`ml-2 px-1.5 py-0.5 text-xs rounded font-medium ${
                            note.color === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
                            note.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                            note.color === 'red' ? 'bg-red-500/20 text-red-400' :
                            'bg-slate-700/50 text-slate-400'
                          }`}
                          title={note.description}
                        >
                          {note.description}
                        </span>
                      )}
                    </div>
                  </td>
                  {showPlayed && <td className="px-4 py-3 text-center text-slate-300 tabular-nums w-12">{row.played}</td>}
                  {showWon && <td className="px-4 py-3 text-center text-slate-300 tabular-nums w-12">{row.won}</td>}
                  {showDraw && <td className="px-4 py-3 text-center text-slate-300 tabular-nums w-12">{row.draw}</td>}
                  {showLost && <td className="px-4 py-3 text-center text-slate-300 tabular-nums w-12">{row.lost}</td>}
                  {showGF && <td className="px-4 py-3 text-center text-slate-300 tabular-nums w-12">{row.goalsFor}</td>}
                  {showGA && <td className="px-4 py-3 text-center text-slate-300 tabular-nums w-12">{row.goalsAgainst}</td>}
                  {showGD && (
                    <td className="px-4 py-3 text-center tabular-nums w-16">
                      <span className={row.goalDifference > 0 ? 'text-emerald-400 font-medium' : row.goalDifference < 0 ? 'text-red-400' : 'text-slate-400'}>
                        {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                      </span>
                    </td>
                  )}
                  {showPts && (
                    <td className="px-4 py-3 text-center font-bold text-white tabular-nums w-16 sticky right-0 z-10 bg-slate-900/60 border-l border-white/10">
                      {row.points}
                    </td>
                  )}
                  {showForm && (
                    <td className="px-4 py-3 text-center w-24" title={row.form ? `Recent form: ${row.form.split(' ').join(', ')}` : 'No form data'}>
                      <span className="font-mono text-xs text-slate-300 flex items-center justify-center gap-1">
                        {row.form ? row.form.split(' ').map((r, i) => (
                          <span key={i} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            r === 'W' ? 'bg-emerald-500/20 text-emerald-400' :
                            r === 'D' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>{r}</span>
                        )) : <span className="text-slate-500">—</span>}
                      </span>
                    </td>
                  )}
                  {showHomeRecord && (
                    <td className="px-4 py-3 text-center w-28" title={formatRecordDetail(row.homeRecord)}>
                      <span className="text-xs text-emerald-400 font-mono">{formatRecord(row.homeRecord)}</span>
                    </td>
                  )}
                  {showAwayRecord && (
                    <td className="px-4 py-3 text-center w-28" title={formatRecordDetail(row.awayRecord)}>
                      <span className="text-xs text-blue-400 font-mono">{formatRecord(row.awayRecord)}</span>
                    </td>
                  )}
                  {showRankChange && (
                    <td className="px-4 py-3 text-center tabular-nums w-16 sticky right-0 z-10 bg-slate-900/60 border-l border-white/10">
                      {row.rankChange !== 0 && (
                        <span className={`flex items-center justify-center gap-1 font-medium ${
                          row.rankChange > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {row.rankChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {Math.abs(row.rankChange)}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile scroll indicator */}
      <div className="md:hidden px-4 py-2 text-center">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
          <span>← Swipe for more stats →</span>
        </p>
      </div>
    </div>
  );
}