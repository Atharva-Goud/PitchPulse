'use client';

import { useMemo } from 'react';
import TeamLogo from '@/components/football/TeamLogo';
import type { NormalizedMatch } from '@/lib/football/types';
import { isFinished } from '@/lib/football/types';

interface TeamFormProps {
  matches: NormalizedMatch[];
  teamId: string;
  teamName: string;
  teamLogo: string;
  label: string;
}

function getResultForTeam(match: NormalizedMatch, teamId: string): 'W' | 'D' | 'L' | null {
  if (!isFinished(match)) return null;
  const isHome = match.homeTeam.id === teamId;
  const teamScore = isHome ? match.homeScore : match.awayScore;
  const oppScore = isHome ? match.awayScore : match.homeScore;
  if (teamScore == null || oppScore == null) return null;
  if (teamScore > oppScore) return 'W';
  if (teamScore === oppScore) return 'D';
  return 'L';
}

function getScoreForTeam(match: NormalizedMatch, teamId: string): string {
  const isHome = match.homeTeam.id === teamId;
  const teamScore = isHome ? match.homeScore : match.awayScore;
  const oppScore = isHome ? match.awayScore : match.homeScore;
  if (teamScore == null || oppScore == null) return '-';
  return `${teamScore}-${oppScore}`;
}

export default function TeamForm({ matches, teamId, teamName, teamLogo, label }: TeamFormProps) {
  const teamMatches = useMemo(() => {
    return matches
      .filter(m => m.homeTeam.id === teamId || m.awayTeam.id === teamId)
      .filter(isFinished)
      .slice(0, 5);
  }, [matches, teamId]);

  const results = useMemo(() => {
    return teamMatches.map(m => getResultForTeam(m, teamId)).filter(Boolean) as ('W' | 'D' | 'L')[];
  }, [teamMatches, teamId]);

  const formString = results.join('');

  const lastMatches = useMemo(() => {
    return teamMatches.map(m => ({
      opponent: m.homeTeam.id === teamId ? m.awayTeam.name : m.homeTeam.name,
      opponentLogo: m.homeTeam.id === teamId ? m.awayTeam.logo : m.homeTeam.logo,
      isHome: m.homeTeam.id === teamId,
      score: getScoreForTeam(m, teamId),
      result: getResultForTeam(m, teamId),
      date: m.kickoff,
      competition: m.league.name,
    }));
  }, [teamMatches, teamId]);

  if (teamMatches.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TeamLogo team={{ name: teamName, logo: teamLogo }} size="sm" />
          <span>{label}</span>
        </h3>
        <p className="text-sm text-slate-400">No recent match data available.</p>
      </div>
    );
  }

  const w = results.filter(r => r === 'W').length;
  const d = results.filter(r => r === 'D').length;
  const l = results.filter(r => r === 'L').length;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <TeamLogo team={{ name: teamName, logo: teamLogo }} size="sm" />
        <span>{label}</span>
        <span className="ml-auto text-xs text-slate-500">Last 5</span>
      </h3>

      {/* Form summary */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <span className="text-emerald-400 font-medium">W {w}</span>
        <span className="text-slate-400 font-medium">D {d}</span>
        <span className="text-red-400 font-medium">L {l}</span>
        <span className="ml-auto text-xs text-slate-500 uppercase tracking-wide">{formString || '—'}</span>
      </div>

      {/* Last 5 matches */}
      <div className="space-y-3">
        {lastMatches.map((m, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <span className={`w-7 text-center font-medium ${
              m.result === 'W' ? 'text-emerald-400' :
              m.result === 'D' ? 'text-slate-400' :
              m.result === 'L' ? 'text-red-400' :
              'text-slate-500'
            }`}>
              {m.result || '?'}
            </span>
            <TeamLogo team={{ name: m.opponent, logo: m.opponentLogo }} size="xs" />
            <span className="flex-1 text-white truncate">{m.opponent}</span>
            <span className="text-slate-400 font-mono tabular-nums w-16 text-right">{m.score}</span>
            <span className="text-xs text-slate-500 whitespace-nowrap">{m.competition}</span>
          </div>
        ))}
      </div>
    </div>
  );
}