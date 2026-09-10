'use client';

import Link from 'next/link';
import { Team } from '@/types';
import TeamLogo from '@/components/ui/TeamLogo';

interface Props {
  team: Team;
  variant?: 'default' | 'compact' | 'card';
}

export default function TeamCard({ team, variant = 'default' }: Props) {
  if (variant === 'card') {
    return (
      <Link
        href={`/teams/${team.id}`}
        className="group block p-6 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/30 transition-colors"
      >
        <div className="flex flex-col items-center gap-4">
          <TeamLogo team={team} size="xl" className="mt-2" />
          <div className="text-center">
            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
              {team.name}
            </h3>
            <p className="text-sm text-slate-400 mt-1">{team.league}</p>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/teams/${team.id}`}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <TeamLogo team={team} size="sm" className="mt-0" />
        <div>
          <div className="text-sm font-medium text-white">{team.shortName}</div>
          <div className="text-xs text-slate-400">{team.country} · {team.league}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/teams/${team.id}`}
      className="flex items-center gap-3 rounded-lg bg-slate-800 px-4 py-2 hover:bg-white/5 transition-colors"
    >
      <TeamLogo team={team} size="lg" />
      <div>
        <div className="text-sm font-medium text-white">{team.shortName}</div>
        <div className="text-xs text-slate-400">{team.country} · {team.league}</div>
      </div>
    </Link>
  );
}