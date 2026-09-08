'use client';

import Image from 'next/image';
import { Match, MatchStatus } from '@/types';

interface Props {
  match: Match;
  variant?: 'default' | 'live' | 'compact';
}

const statusConfig: Record<MatchStatus, { label: string; color: string }> = {
  SCHEDULED: { label: 'Scheduled', color: 'text-slate-400' },
  LIVE: { label: 'LIVE', color: 'text-red-500 animate-pulse' },
  HALFTIME: { label: 'HT', color: 'text-amber-400' },
  FINISHED: { label: 'FT', color: 'text-slate-400' },
  POSTPONED: { label: 'Postponed', color: 'text-amber-400' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-400' },
};

export default function MatchCard({ match, variant = 'default' }: Props) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const status = statusConfig[match.status];

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
        <div className="text-xs text-slate-400 w-16">{formatTime(match.kickoff)}</div>
        <div className="flex-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative h-5 w-5 rounded overflow-hidden bg-slate-800">
              <Image src={match.homeTeam.logo} alt={match.homeTeam.name} fill className="object-contain p-0.5" />
            </div>
            <span className="text-sm text-white truncate">{match.homeTeam.shortName}</span>
          </div>
          <div className="flex items-center gap-1 px-2">
            {match.status === 'SCHEDULED' ? (
              <span className="text-xs text-slate-400">{formatTime(match.kickoff)}</span>
            ) : (
              <span className="text-sm font-bold text-white">
                {match.homeScore} - {match.awayScore}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-sm text-white truncate">{match.awayTeam.shortName}</span>
            <div className="relative h-5 w-5 rounded overflow-hidden bg-slate-800">
              <Image src={match.awayTeam.logo} alt={match.awayTeam.name} fill className="object-contain p-0.5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'live') {
    return (
      <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative h-5 w-5 rounded overflow-hidden bg-slate-800">
              <Image src={match.competition.logo} alt={match.competition.name} fill className="object-contain p-0.5" />
            </div>
            <span className="text-sm text-slate-400">{match.competition.shortName}</span>
          </div>
          <span className={`text-sm font-bold ${status.color}`}>{status.label}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-800">
              <Image src={match.homeTeam.logo} alt={match.homeTeam.name} fill className="object-contain p-2" />
            </div>
            <span className="text-sm font-medium text-white text-center">{match.homeTeam.shortName}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="text-3xl font-bold text-white tabular-nums">
              {match.homeScore} - {match.awayScore}
            </div>
            {match.status === 'LIVE' && (
              <div className="flex items-center gap-1 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-800">
              <Image src={match.awayTeam.logo} alt={match.awayTeam.name} fill className="object-contain p-2" />
            </div>
            <span className="text-sm font-medium text-white text-center">{match.awayTeam.shortName}</span>
          </div>
        </div>

        {match.venue && (
          <div className="mt-4 pt-3 border-t border-white/5 text-xs text-slate-400 text-center">
            {match.venue}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/30 transition-colors p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative h-5 w-5 rounded overflow-hidden bg-slate-800">
            <Image src={match.competition.logo} alt={match.competition.name} fill className="object-contain p-0.5" />
          </div>
          <span className="text-xs text-slate-400">{match.competition.name}</span>
        </div>
        <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative h-7 w-7 rounded-lg overflow-hidden bg-slate-800">
              <Image src={match.homeTeam.logo} alt={match.homeTeam.name} fill className="object-contain p-1" />
            </div>
            <span className="text-sm font-medium text-white">{match.homeTeam.name}</span>
          </div>
          <div className="text-lg font-bold text-white tabular-nums w-8 text-center">
            {match.status === 'SCHEDULED' ? '-' : match.homeScore}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative h-7 w-7 rounded-lg overflow-hidden bg-slate-800">
              <Image src={match.awayTeam.logo} alt={match.awayTeam.name} fill className="object-contain p-1" />
            </div>
            <span className="text-sm font-medium text-white">{match.awayTeam.name}</span>
          </div>
          <div className="text-lg font-bold text-white tabular-nums w-8 text-center">
            {match.status === 'SCHEDULED' ? '-' : match.awayScore}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <span>{formatDate(match.kickoff)}</span>
        <span>{formatTime(match.kickoff)}</span>
      </div>
    </div>
  );
}