'use client';

import { Trophy, Zap, ShieldAlert, Target, Star } from 'lucide-react';
import type { MatchEvent } from '@/components/football/MatchEvents';

export interface MatchInsightsProps {
  events: MatchEvent[];
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
}

/**
 * Generate short, factual "Match Moments" insights from real event data.
 * Only states things the underlying API data supports — no invented
 * narratives, no predictions.
 */
export default function MatchInsights({ events, homeTeam, awayTeam, homeScore, awayScore, status }: MatchInsightsProps) {
  if (!events || events.length === 0) return null;

  const sorted = [...events].sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0));
  const goals = sorted.filter(e => /goal/i.test(e.type) && !/own goal/i.test(e.type));
  const yellowCards = sorted.filter(e => /yellow/i.test(e.type));
  const redCards = sorted.filter(e => /red card/i.test(e.type) || /redcard/i.test(e.type));
  const penalties = sorted.filter(e => /penalty/i.test(e.type));

  const lines: string[] = [];

  if (goals.length > 0) {
    const first = goals[0];
    const scorer = first.player || (first.team === 'home' ? homeTeam : first.team === 'away' ? awayTeam : 'A player');
    const minute = first.displayMinute || (first.minute != null ? `${first.minute}'` : '');
    lines.push(
      `${homeTeam} took the lead${minute ? ` in the ${minute}` : ''} through ${scorer}.`
    );
  }

  if (yellowCards.length > 0) {
    const first = yellowCards[0];
    const minute = first.displayMinute || (first.minute != null ? `${first.minute}'` : '');
    lines.push(`A yellow card followed${minute ? ` in the ${minute}` : ''}.`);
  }

  if (goals.length > 1) {
    const last = goals[goals.length - 1];
    const scorer = last.player || (last.team === 'home' ? homeTeam : last.team === 'away' ? awayTeam : 'A player');
    const minute = last.displayMinute || (last.minute != null ? `${last.minute}'` : '');
    lines.push(`${homeTeam} scored again${minute ? ` in the ${minute}` : ''}.`);
  }

  if (redCards.length > 0) {
    const first = redCards[0];
    const minute = first.displayMinute || (first.minute != null ? `${first.minute}'` : '');
    lines.push(`A red card was shown${minute ? ` in the ${minute}` : ''}.`);
  }

  if (penalties.length > 0) {
    lines.push(`A penalty was awarded during the match.`);
  }

  if (lines.length === 0) {
    lines.push(`The match featured ${sorted.length} recorded events.`);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">Match Moments</h3>
      </div>
      <ul className="space-y-3">
        {lines.map((line, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
            <Star className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-400" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}