'use client';

import { useMemo } from 'react';
import { Trophy, AlertTriangle, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { MatchEvent } from '@/components/football/MatchEvents';

export interface MatchInsightsProps {
  events: MatchEvent[];
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  statistics?: Array<{ side: 'home' | 'away'; statistics: Array<{ name: string; displayValue: string }> }>;
}

/**
 * Generate factual "PitchPulse Insights" from verified API data only.
 * No invented statistics, xG, probabilities, player ratings, injuries, or tactical claims.
 * Only states what the underlying data directly supports.
 */
export default function MatchInsights({
  events,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  status,
  statistics,
}: MatchInsightsProps) {
  const insights = useMemo(() => {
    if (!events || events.length === 0) return [];

    const lines: Array<{ icon: React.ReactNode; text: string; type: 'neutral' | 'positive' | 'negative' | 'warning' }> = [];
    const sorted = [...events].sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0));

    const goals = sorted.filter(e => /goal/i.test(e.type) && !/own goal/i.test(e.type));
    const ownGoals = sorted.filter(e => /own goal/i.test(e.type));
    const yellowCards = sorted.filter(e => /yellow/i.test(e.type));
    const redCards = sorted.filter(e => /red card/i.test(e.type) || /redcard/i.test(e.type));
    const penalties = sorted.filter(e => /penalty/i.test(e.type));
    const substitutions = sorted.filter(e => /substitution|sub/i.test(e.type));
    const varEvents = sorted.filter(e => /var/i.test(e.type));

    // Goals
    if (goals.length > 0) {
      const first = goals[0];
      const scorer = first.player || (first.team === 'home' ? homeTeam : awayTeam);
      const minute = first.displayMinute || (first.minute != null ? `${first.minute}'` : '');
      const teamName = first.team === 'home' ? homeTeam : awayTeam;
      lines.push({
        icon: <Trophy className="h-4 w-4 text-emerald-400" />,
        text: `${teamName} opened the scoring${minute ? ` in the ${minute}` : ''} through ${scorer}.`,
        type: 'positive',
      });

      if (goals.length > 1) {
        const last = goals[goals.length - 1];
        const scorer = last.player || (last.team === 'home' ? homeTeam : awayTeam);
        const minute = last.displayMinute || (last.minute != null ? `${last.minute}'` : '');
        const teamName = last.team === 'home' ? homeTeam : awayTeam;
        lines.push({
          icon: <Trophy className="h-4 w-4 text-emerald-400" />,
          text: `${teamName} scored again${minute ? ` in the ${minute}` : ''} (${scorer}).`,
          type: 'positive',
        });
      }
    }

    // Own goals
    if (ownGoals.length > 0) {
      const first = ownGoals[0];
      const minute = first.displayMinute || (first.minute != null ? `${first.minute}'` : '');
      const teamName = first.team === 'home' ? homeTeam : awayTeam;
      lines.push({
        icon: <AlertTriangle className="h-4 w-4 text-orange-400" />,
        text: `Own goal by ${teamName}${minute ? ` in the ${minute}` : ''}.`,
        type: 'warning',
      });
    }

    // Cards
    if (yellowCards.length > 0) {
      const first = yellowCards[0];
      const minute = first.displayMinute || (first.minute != null ? `${first.minute}'` : '');
      const teamName = first.team === 'home' ? homeTeam : awayTeam;
      const player = first.player ? ` (${first.player})` : '';
      lines.push({
        icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
        text: `First yellow card: ${teamName}${player}${minute ? ` in the ${minute}` : ''}.`,
        type: 'warning',
      });
    }

    if (redCards.length > 0) {
      const first = redCards[0];
      const minute = first.displayMinute || (first.minute != null ? `${first.minute}'` : '');
      const teamName = first.team === 'home' ? homeTeam : awayTeam;
      const player = first.player ? ` (${first.player})` : '';
      lines.push({
        icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
        text: `Red card shown to ${teamName}${player}${minute ? ` in the ${minute}` : ''}.`,
        type: 'negative',
      });
    }

    // Penalties
    if (penalties.length > 0) {
      const first = penalties[0];
      const minute = first.displayMinute || (first.minute != null ? `${first.minute}'` : '');
      const teamName = first.team === 'home' ? homeTeam : awayTeam;
      const scored = first.type.toLowerCase().includes('scored') || first.type.toLowerCase().includes('goal');
      lines.push({
        icon: <Target className="h-4 w-4 text-purple-400" />,
        text: `Penalty ${scored ? 'scored' : 'awarded'} for ${teamName}${minute ? ` in the ${minute}` : ''}.`,
        type: 'neutral',
      });
    }

    // VAR
    if (varEvents.length > 0) {
      const first = varEvents[0];
      const minute = first.displayMinute || (first.minute != null ? `${first.minute}'` : '');
      lines.push({
        icon: <Target className="h-4 w-4 text-blue-400" />,
        text: `VAR review${minute ? ` in the ${minute}` : ''}.`,
        type: 'neutral',
      });
    }

    // Substitutions
    if (substitutions.length > 0) {
      const homeSubs = substitutions.filter(e => e.team === 'home').length;
      const awaySubs = substitutions.filter(e => e.team === 'away').length;
      lines.push({
        icon: <ArrowUpRight className="h-4 w-4 text-slate-400" />,
        text: `${substitutions.length} substitution${substitutions.length !== 1 ? 's' : ''} made (${homeTeam}: ${homeSubs}, ${awayTeam}: ${awaySubs}).`,
        type: 'neutral',
      });
    }

    // Statistics-based insights (only from verified data)
    if (statistics && statistics.length === 2) {
      const homeStats = statistics.find(s => s.side === 'home')?.statistics || [];
      const awayStats = statistics.find(s => s.side === 'away')?.statistics || [];

      // Possession
      const homePoss = homeStats.find(s => s.name === 'possessionPct' || s.name === 'possession');
      const awayPoss = awayStats.find(s => s.name === 'possessionPct' || s.name === 'possession');
      if (homePoss && awayPoss) {
        const hp = parseInt(homePoss.displayValue);
        const ap = parseInt(awayPoss.displayValue);
        if (!isNaN(hp) && !isNaN(ap) && hp !== ap) {
          const leader = hp > ap ? homeTeam : awayTeam;
          const pct = Math.max(hp, ap);
          lines.push({
            icon: <Target className="h-4 w-4 text-cyan-400" />,
            text: `${leader} dominated possession (${pct}%).`,
            type: 'neutral',
          });
        }
      }

      // Shots on target
      const homeSOT = homeStats.find(s => s.name === 'shotsOnTarget');
      const awaySOT = awayStats.find(s => s.name === 'shotsOnTarget');
      if (homeSOT && awaySOT) {
        const hs = parseInt(homeSOT.displayValue);
        const as = parseInt(awaySOT.displayValue);
        if (!isNaN(hs) && !isNaN(as) && hs !== as) {
          const leader = hs > as ? homeTeam : awayTeam;
          const val = Math.max(hs, as);
          lines.push({
            icon: <Target className="h-4 w-4 text-orange-400" />,
            text: `${leader} had more shots on target (${val}).`,
            type: 'neutral',
          });
        }
      }

      // Corners
      const homeCorners = homeStats.find(s => s.name === 'wonCorners' || s.name === 'corners');
      const awayCorners = awayStats.find(s => s.name === 'wonCorners' || s.name === 'corners');
      if (homeCorners && awayCorners) {
        const hc = parseInt(homeCorners.displayValue);
        const ac = parseInt(awayCorners.displayValue);
        if (!isNaN(hc) && !isNaN(ac) && hc !== ac) {
          const leader = hc > ac ? homeTeam : awayTeam;
          const val = Math.max(hc, ac);
          lines.push({
            icon: <ArrowUpRight className="h-4 w-4 text-slate-400" />,
            text: `${leader} won more corners (${val}).`,
            type: 'neutral',
          });
        }
      }

      // Fouls
      const homeFouls = homeStats.find(s => s.name === 'foulsCommitted');
      const awayFouls = awayStats.find(s => s.name === 'foulsCommitted');
      if (homeFouls && awayFouls) {
        const hf = parseInt(homeFouls.displayValue);
        const af = parseInt(awayFouls.displayValue);
        if (!isNaN(hf) && !isNaN(af) && hf !== af) {
          const leader = hf > af ? homeTeam : awayTeam;
          const val = Math.max(hf, af);
          lines.push({
            icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
            text: `${leader} committed more fouls (${val}).`,
            type: 'warning',
          });
        }
      }
    }

    // Score-based insight for finished matches
    if (status === 'FINISHED' && homeScore != null && awayScore != null) {
      if (homeScore > awayScore) {
        const diff = homeScore - awayScore;
        lines.push({
          icon: <Trophy className="h-4 w-4 text-emerald-400" />,
          text: `${homeTeam} won by ${diff} goal${diff !== 1 ? 's' : ''}.`,
          type: 'positive',
        });
      } else if (awayScore > homeScore) {
        const diff = awayScore - homeScore;
        lines.push({
          icon: <Trophy className="h-4 w-4 text-emerald-400" />,
          text: `${awayTeam} won by ${diff} goal${diff !== 1 ? 's' : ''}.`,
          type: 'positive',
        });
      } else {
        lines.push({
          icon: <ArrowUpRight className="h-4 w-4 text-slate-400" />,
          text: `Match ended in a draw.`,
          type: 'neutral',
        });
      }
    }

    // Total events
    if (lines.length === 0 && sorted.length > 0) {
      lines.push({
        icon: <ArrowUpRight className="h-4 w-4 text-slate-400" />,
        text: `The match featured ${sorted.length} recorded event${sorted.length !== 1 ? 's' : ''}.`,
        type: 'neutral',
      });
    }

    return lines;
  }, [events, homeTeam, awayTeam, homeScore, awayScore, status, statistics]);

  if (insights.length === 0) return null;

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-emerald-500/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-white">PitchPulse Insights</h3>
          <span className="text-xs text-slate-500 ml-auto">Data-driven · No speculation</span>
        </div>
      </div>
      <ul className="divide-y divide-emerald-500/10">
        {insights.map((insight, index) => (
          <li key={index} className="px-6 py-4 flex items-start gap-3">
            <span className="flex-shrink-0 mt-0.5">{insight.icon}</span>
            <span className="text-sm text-slate-300 leading-relaxed">{insight.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}