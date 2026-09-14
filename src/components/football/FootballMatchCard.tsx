'use client';

import { useRouter } from 'next/navigation';
import { Clock, Trophy, Radio } from 'lucide-react';
import TeamLogo from '@/components/football/TeamLogo';
import { formatKickoffTime, formatKickoffDate, formatMinute, type NormalizedMatch } from '@/lib/football/types';

interface Props {
  match: NormalizedMatch;
  variant?: 'default' | 'live' | 'compact';
  onClick?: (match: NormalizedMatch) => void;
  className?: string;
}

const statusColors: Record<string, string> = {
  LIVE: 'text-red-500',
  HALFTIME: 'text-amber-400',
  FINISHED: 'text-slate-400',
  SCHEDULED: 'text-slate-400',
  POSTPONED: 'text-amber-400',
  CANCELLED: 'text-red-400',
};

export default function FootballMatchCard({ match, variant = 'default', onClick, className = '' }: Props) {
  const router = useRouter();
  const isLive = match.status === 'LIVE' || match.status === 'HALFTIME';
  const time = formatMinute(match);

  const handleClick = () => {
    if (onClick) {
      onClick(match);
    } else {
      router.push(`/matches/${match.id}`);
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left ${className}`}
      >
        <div className="text-xs text-slate-400 w-14 tabular-nums">
          {isLive ? time : formatKickoffTime(match.kickoff)}
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
        {isLive && <Radio className="h-3 w-3 text-red-500 animate-pulse flex-shrink-0" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`relative w-full rounded-xl overflow-hidden bg-slate-900 border border-white/10 hover:border-emerald-500/30 transition-colors text-left ${className}`}
    >
      {isLive && (
        <div className="absolute top-2 right-2 z-10">
          <span className="px-2 py-0.5 rounded text-xs text-red-500 animate-pulse font-semibold">LIVE</span>
        </div>
      )}

      <div className="flex flex-nowrap items-center gap-2 p-3 sm:p-4">
        <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
          <TeamLogo team={match.homeTeam} size="sm" />
          <span className="text-xs sm:text-sm font-medium text-white truncate w-full text-center">{match.homeTeam.name}</span>
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <div className="text-lg sm:text-2xl font-bold text-white tabular-nums">
            {match.homeScore ?? '-'}
          </div>
          <div className="text-xs text-slate-500 tabular-nums">{time}</div>
          <div className="text-[10px] text-slate-500">VS</div>
          <div className="text-lg sm:text-2xl font-bold text-white tabular-nums">
            {match.awayScore ?? '-'}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
          <TeamLogo team={match.awayTeam} size="sm" />
          <span className="text-xs sm:text-sm font-medium text-white truncate w-full text-center">{match.awayTeam.name}</span>
        </div>
      </div>

      <div className="px-3 sm:px-4 pb-3 pt-1 flex items-center justify-between text-xs text-slate-400">
        <div>
          <span className="text-emerald-400">{formatKickoffTime(match.kickoff)}</span>
          <span className="text-slate-500 ml-1">{formatKickoffDate(match.kickoff)}</span>
        </div>
        <span className="text-emerald-400 truncate ml-2">{match.league.name}</span>
      </div>
    </button>
  );
}