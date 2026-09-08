'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Team } from '@/types';

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
          <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-slate-800">
            <Image
              src={team.logo}
              alt={team.name}
              fill
              className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
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
        <div className="relative h-8 w-8 rounded-lg overflow-hidden bg-slate-800">
          <Image src={team.logo} alt={team.name} fill className="object-contain p-1" />
        </div>
        <div>
          <div className="text-sm font-medium text-white">{team.shortName}</div>
          <div className="text-xs text-slate-400">{team.country}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/teams/${team.id}`}
      className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/30 transition-colors"
    >
      <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-slate-800">
        <Image src={team.logo} alt={team.name} fill className="object-contain p-2" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
          {team.name}
        </h3>
        <p className="text-sm text-slate-400 mt-0.5">
          {team.league} · {team.country}
        </p>
      </div>
    </Link>
  );
}