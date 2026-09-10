'use client';

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

function isStale(kickoff: string): boolean {
  // The free football data plan only covers seasons 2022-2024, so any
  // fixture older than 6 months is historical data, not a recent result.
  const ageMs = Date.now() - new Date(kickoff).getTime();
  return ageMs > 6 * 30 * 24 * 60 * 60 * 1000;
}

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
            <span className="text-emerald-400 text-xs">{match.homeTeam.shortName}</span>
          </div>
          <div className="flex items-center gap-2 text-2xl font-bold text-white">
            {match.homeScore} - {match.awayScore}
          </div>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-emerald-400 text-xs">{match.awayTeam.shortName}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-white/10 hover:border-emerald-500/30 transition-colors">
      <div className="flex items-center gap-3 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{match.homeTeam.shortName}</span>
          {match.competition && (
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              {match.competition.shortName}
            </span>
          )}
        </div>

        <div className="text-4xl font-bold text-white">
          {match.homeScore}
        </div>

        <div className="flex items-center gap-2 text-4xl font-bold text-white">
          {match.awayScore}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{match.awayTeam.shortName}</span>
        </div>
      </div>

      {variant === 'live' && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-0.5 rounded text-xs text-red-500 animate-pulse">
            LIVE
          </span>
        </div>
      )}

      {isStale(match.kickoff) && (
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400">
            Historical
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full h-12 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div>
            <span className="text-emerald-400 text-xs">{formatTime(match.kickoff)}</span>
            <span className="text-slate-500"> {formatDate(match.kickoff)}</span>
          </div>
          <span className="text-emerald-400 text-xs">
            {match.competition?.name || ''}
          </span>
        </div>
      </div>
    </div>
  );
}