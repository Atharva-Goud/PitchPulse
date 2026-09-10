'use client';

import { useState, useEffect } from 'react';
import { getTeamInitials, getTeamLogo, normalizeTeamLogo } from '@/lib/utils/teams';
import { Team } from '@/types';

interface Props {
  team?: Team | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  accentColor?: string;
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
 * Handles valid logos, missing URLs, broken remote images, SVGs and
 * PNG/WebP images. The fallback is a clean, stable crest with team
 * initials so the layout never shifts or shows a broken image.
 */
export default function TeamLogo({ team, size = 'md', className = '' }: Props) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const logo = normalizeTeamLogo(getTeamLogo(team));
  const initials = getTeamInitials(team?.name, team?.shortName);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [team?.id, logo]);

  const showFallback = hasError || !logo;
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
          src={logo}
          alt=""
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          className={`h-full w-full object-contain p-[10%] transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
    </span>
  );
}