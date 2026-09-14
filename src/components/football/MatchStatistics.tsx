'use client';

import { Trophy } from 'lucide-react';

export interface TeamStatistic {
  side: 'home' | 'away';
  team: { id: string; name: string; logo: string };
  statistics: Array<{ name: string; abbreviation: string; displayValue: string }>;
}

interface MatchStatisticsProps {
  statistics: TeamStatistic[];
}

/** Human-friendly label for a raw stat name. */
function statLabel(name: string): string {
  const labels: Record<string, string> = {
    appearances: 'Appearances',
    foulsCommitted: 'Fouls',
    wonCorners: 'Corners',
    goalAssists: 'Assists',
    possessionPct: 'Possession',
    shotAssists: 'Shot Assists',
    shotsOnTarget: 'Shots on Target',
    totalGoals: 'Goals',
    totalShots: 'Shots',
    shots: 'Shots',
    tackles: 'Tackles',
    interceptions: 'Interceptions',
    saves: 'Saves',
    passes: 'Passes',
    passAccuracy: 'Pass Accuracy',
    clearances: 'Clearances',
    offside: 'Offsides',
    yellowCards: 'Yellow Cards',
    redCards: 'Red Cards',
  };
  return labels[name] || name.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
}

export default function MatchStatistics({ statistics }: MatchStatisticsProps) {
  if (!statistics || statistics.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Match Statistics</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Trophy className="h-8 w-8 text-slate-600 mb-2" />
          <p className="text-sm text-slate-400">No statistics available.</p>
          <p className="text-xs text-slate-500 mt-1">Statistics are not available for this fixture.</p>
        </div>
      </div>
    );
  }

  const home = statistics.find(s => s.side === 'home');
  const away = statistics.find(s => s.side === 'away');
  if (!home || !away) {
    return null;
  }

  // Merge stat names from both sides so the table shows every stat.
  const statNames = Array.from(
    new Set([...home.statistics, ...away.statistics].map(s => s.name))
  );

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Match Statistics</h3>
        <p className="text-xs text-slate-400 mt-0.5">Box score from the fixture data</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-white/5">
            {statNames.map(name => {
              const h = home.statistics.find(s => s.name === name);
              const a = away.statistics.find(s => s.name === name);
              const hv = h ? h.displayValue : '0';
              const av = a ? a.displayValue : '0';
              const hNum = Number(hv);
              const aNum = Number(av);
              const hHigher = !isNaN(hNum) && !isNaN(aNum) && hNum > aNum;
              const aHigher = !isNaN(hNum) && !isNaN(aNum) && aNum > hNum;
              return (
                <tr key={name} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-2.5 text-slate-400 text-right tabular-nums">
                    <span className={hHigher ? 'text-white font-medium' : ''}>{hv}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-300 text-left text-xs">
                    {statLabel(name)}
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 text-right tabular-nums">
                    <span className={aHigher ? 'text-white font-medium' : ''}>{av}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}