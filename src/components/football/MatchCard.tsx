'use client';

import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
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
  hideLeague?: boolean;
}

const statusBadgeVariant: Record<string, 'live' | 'finished' | 'upcoming' | 'warning'> = {
  LIVE: 'live',
  HALFTIME: 'warning',
  FINISHED: 'finished',
  SCHEDULED: 'upcoming',
  POSTPONED: 'warning',
  CANCELLED: 'warning',
};

export default function MatchCard({
  match,
  variant = 'default',
  onClick,
  className = '',
  hideFooter = false,
  hideLeague = false,
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

  const statusVariant = statusBadgeVariant[match.status] || 'upcoming';
  const statusLabel = (() => {
    if (live) {
      if (match.status === 'HALFTIME') return 'HT';
      const clock = match.statusDisplayClock || (match.statusClock != null ? `${match.statusClock}'` : '');
      return `LIVE${clock ? ` ${clock}` : ''}`;
    }
    if (finished) return 'FT';
    if (scheduled) return 'UPCOMING';
    return match.statusLabel;
  })();

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left ${className}`}
      >
        <div className="text-xs text-[var(--text-muted)] w-14 tabular-nums">
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
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`relative w-full rounded-xl overflow-hidden card-base card-hover focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${className}`}
    >
      {/* Status badge at top */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border badge-${statusVariant}`}
          >
            {live && (
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
            )}
            {statusLabel}
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
                  <span className="text-[var(--text-disabled)] text-sm font-medium px-2">—</span>
                  <span className="text-xl sm:text-2xl font-bold text-white tabular-nums w-8 text-left">
                    {match.awayScore ?? '-'}
                  </span>
                </div>
                {live && (
                  <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3 animate-pulse" aria-hidden="true" />
                    {time}
                  </span>
                )}
                {finished && (
                  <span className="text-xs text-[var(--text-muted)] font-medium">Full Time</span>
                )}
              </>
            ) : (
              <>
                <span className="text-xs font-medium text-[var(--text-disabled)] uppercase tracking-wider">vs</span>
                <span className="text-xs text-[var(--text-muted)] font-medium tabular-nums">
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

        {/* Match details footer - only for finished/live matches */}
        {(finished || live) && !hideFooter && (
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Match details</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                View
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        )}

        {/* Upcoming match time indicator - compact, only when not hidden */}
        {scheduled && !hideFooter && (
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {formatKickoffDate(match.kickoff).toUpperCase()} · {formatKickoffTime(match.kickoff)}
              </span>
              {!hideLeague && match.league?.name && (
                <span className="text-emerald-400 truncate max-w-[150px]">{match.league.name}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </button>
  );
}