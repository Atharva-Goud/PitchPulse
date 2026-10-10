'use client';

import { useEffect, useState } from 'react';
import { getTeamInitials } from '@/lib/utils/teams';
import { resolveLocalLogoPath } from '@/lib/utils/logo-mapping';

interface TeamLike {
  id?: string | null;
  apiId?: string | null;
  name?: string;
  logo?: string | null;
  shortName?: string;
}

interface Props {
  team: TeamLike;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
}

const sizeClasses = {
  xs: 'h-5 w-5 text-[9px]',
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-14 w-14 text-sm',
  xl: 'h-20 w-20 text-base',
};

/**
 * Reusable team logo component.
 *
 * Fallback chain, tried in order, with each step only reached when the previous
 * one is unavailable or fails to load — so no broken-image icon ever appears and
 * the layout never shifts:
 *
 *   1. Local logo from public/assets/logos/ when a real file matches
 *   2. API-provided logo URL
 *   3. Team initials badge (neutral placeholder)
 */
export default function TeamLogo({ team, size = 'md', className = '', alt }: Props) {
  const localLogo = resolveLocalLogoPath(team);
  const apiLogo = typeof team?.logo === 'string' && team.logo.trim().length > 0 ? team.logo.trim() : null;
  const initials = getTeamInitials(team?.name, team?.shortName);

  const candidates = [localLogo, apiLogo].filter((c): c is string => !!c);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Reset whenever the team identity or candidate list changes.
  const teamKey = `${team?.id || ''}|${team?.name || ''}|${candidates.join(',')}`;

  useEffect(() => {
    setCandidateIndex(0);
    setIsLoading(true);
  }, [teamKey, candidates.join(',')]);

  const current = candidates[Math.min(candidateIndex, candidates.length - 1)];
  const showFallback = !current;

  const handleError = () => {
    if (candidateIndex + 1 < candidates.length) {
      setCandidateIndex(candidateIndex + 1);
    } else {
      setIsLoading(false);
    }
  };

  const sizeClass = sizeClasses[size];

  return (
    <span
      className={`relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-800 text-center font-bold tracking-tight text-slate-300 ${sizeClass} ${className}`}
      title={team?.name}
    >
      {showFallback ? (
        <span className="leading-none">{initials}</span>
      ) : (
        <img
          src={current}
          alt={alt ?? ''}
          aria-hidden={alt ? undefined : true}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={handleError}
          className={`h-full w-full object-contain p-[10%] transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
    </span>
  );
}