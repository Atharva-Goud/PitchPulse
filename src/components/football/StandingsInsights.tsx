'use client';

import { Trophy, TrendingUp } from 'lucide-react';
import type { StandingRow } from '@/lib/football/standings';

interface StandingsInsightsProps {
  standings: StandingRow[];
  competitionName: string;
}

export default function StandingsInsights({ standings, competitionName }: StandingsInsightsProps) {
  if (!standings || standings.length === 0) return null;

  const leader = standings[0];
  const second = standings[1];
  const last = standings[standings.length - 1];
  const topScorer = [...standings].sort((a, b) => b.goalsFor - a.goalsFor)[0];
  const biggestGap = second ? leader.points - second.points : 0;

  const insights: string[] = [];

  insights.push(
    `${leader.teamName} currently sit 1st with ${leader.points} points${leader.goalDifference > 0 ? ` and a +${leader.goalDifference} goal difference` : leader.goalDifference < 0 ? ` and a ${leader.goalDifference} goal difference` : ''}.`
  );

  if (second && biggestGap > 0) {
    insights.push(
      `${second.teamName} are in 2nd, ${biggestGap} point${biggestGap === 1 ? '' : 's'} behind the leaders.`
    );
  }

  if (topScorer && topScorer.teamId !== leader.teamId) {
    insights.push(
      `${topScorer.teamName} have scored the most goals (${topScorer.goalsFor}).`
    );
  }

  if (last && last.points < leader.points) {
    const gap = leader.points - last.points;
    insights.push(
      `${last.teamName} are rooted to the bottom, ${gap} point${gap === 1 ? '' : 's'} adrift.`
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">Table Insight</h3>
        <span className="text-xs text-slate-500 ml-auto">{competitionName}</span>
      </div>
      <ul className="space-y-3">
        {insights.map((insight, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
            <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-400" />
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}