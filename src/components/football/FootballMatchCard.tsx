'use client';

import { useRouter } from 'next/navigation';
import { Radio, Clock } from 'lucide-react';
import TeamLogo from '@/components/football/TeamLogo';
import {
  formatKickoffTime,
  formatKickoffDate,
  formatMinute,
  type NormalizedMatch,
  isLive,
  isFinished,
  isScheduled,
} from '@/lib/football/types';

interface Props {
  match: NormalizedMatch;
  variant?: 'default' | 'live' | 'compact';
  onClick?: (match: NormalizedMatch) => void;
  className?: string;
  hideFooter?: boolean;
}

const statusBgColors: Record<string, string> = {
  LIVE: 'bg-red-500/10 border-red-500/20 text-red-500',
  HALFTIME: 'bg-amber-400/10 border-amber-400/20 text-amber-400',
  FINISHED: 'bg-slate-700/50 border-white/10 text-slate-400',
  SCHEDULED: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
  POSTPONED: 'bg-amber-400/10 border-amber-400/20 text-amber-400',
  CANCELLED: 'bg-red-400/10 border-red-400/20 text-red-400',
};

export default function FootballMatchCard({
  match,
  variant = 'default',
  onClick,
  className = '',
  hideFooter = false,
}: Props) {
  const router = useRouter();
  const live = isLive(match);
  const finished = isFinished(match);
  const scheduled = isScheduled(match);
  const time = formatMinute(match);

  const handleClick = () => {
    if (onClick) {
      onClick(match);
    } else {
      router.push(`/matches/${match.id}`);
    }
  };

  const getStatusLabel = () => {
    if (live) {
      if (match.status === 'HALFTIME') return 'HT';
      return `LIVE ${match.statusDisplayClock || match.statusClock ? `${match.statusDisplayClock || match.statusClock}'` : ''}`.trim();
    }
    if (finished) return 'FT';
    if (scheduled) return 'UPCOMING';
    return match.statusLabel;
  };

  const getStatusBadgeClass = () => {
    return statusBgColors[match.status] || statusBgColors.SCHEDULED;
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left ${className}`}
      >
        <div className="text-xs text-slate-400 w-14 tabular-nums">
          {live ? time : formatKickoffTime(match.kickoff)}
        </div>
        <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TeamLogo team={match.homeTeam} size="xs" />
            <span className="text-emerald-400 text-xs truncate">{match.homeTeam.name}</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-white tabular-nums">
            {match.homeScore ?? '-'} - {match.awayScore ?? '-'}
          </div>
          <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
            <span className="text-emerald-400 text-xs truncate">{match.awayTeam.name}</span>
            <TeamLogo team={match.awayTeam} size="xs" />
          </div>
        </div>
        {live && <Radio className="h-3 w-3 text-red-500 animate-pulse flex-shrink-0" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`relative w-full rounded-xl overflow-hidden bg-slate-900 border border-white/10 hover:border-emerald-500/30 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${className}`}
    >
      {/* Status badge at top */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass()} border`}>
            {live && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
            )}
            {getStatusLabel()}
          </span>
        </div>
      </div>

      {/* Main content: teams, logos, score */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Home team */}
          <div className="flex flex-col items-center gap-2 w-full sm:w-1/3 min-w-0 order-1 sm:order-1">
            <TeamLogo team={match.homeTeam} size="md" className="flex-shrink-0" />
            <span className="text-sm sm:text-base font-medium text-white truncate w-full text-center leading-tight">
              {match.homeTeam.name}
            </span>
          </div>

          {/* Score / VS */}
          <div className="flex flex-col items-center justify-center gap-1.5 w-full sm:w-1/3 min-w-0 flex-shrink-0 order-3 sm:order-2">
            {finished || live ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl font-bold text-white tabular-nums w-8 text-right">
                    {match.homeScore ?? '-'}
                  </span>
                  <span className="text-slate-500 text-sm font-medium px-2">—</span>
                  <span className="text-xl sm:text-2xl font-bold text-white tabular-nums w-8 text-left">
                    {match.awayScore ?? '-'}
                  </span>
                </div>
                {live && (
                  <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <Radio className="h-3 w-3 animate-pulse" />
                    {time}
                  </span>
                )}
                {finished && (
                  <span className="text-xs text-slate-500 font-medium">Full Time</span>
                )}
              </>
            ) : (
              <>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">vs</span>
                <span className="text-xs text-slate-500 font-medium tabular-nums">
                  {formatKickoffTime(match.kickoff)}
                </span>
              </>
            )}
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-2 w-full sm:w-1/3 min-w-0 order-2 sm:order-3">
            <TeamLogo team={match.awayTeam} size="md" className="flex-shrink-0" />
            <span className="text-sm sm:text-base font-medium text-white truncate w-full text-center leading-tight">
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Date/Time info for non-live matches */}
        {!live && !hideFooter && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="h-3 w-3" />
              {formatKickoffDate(match.kickoff)} · {formatKickoffTime(match.kickoff)}
            </span>
            <span className="text-emerald-400 truncate max-w-[150px]">{match.league.name}</span>
          </div>
        )}
      </div>

      {/* Footer for finished/live matches */}
      {(finished || live) && !hideFooter && (
        <div className="px-4 py-3 border-t border-white/5 bg-slate-900/40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Match details</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              View
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      )}
    </button>
  );
}