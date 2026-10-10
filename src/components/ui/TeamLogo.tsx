'use client';

import { useEffect, useRef, useState } from 'react';
import { getTeamInitials } from '@/lib/utils/teams';
import { resolveLocalLogoPath } from '@/lib/utils/logo-mapping';

/** Loose team shape accepted by the resolver (API rows, standings rows, …). */
interface TeamLike {
  id?: string | null;
  name?: string | null;
  logo?: string | null;
  shortName?: string | null;
}

interface Props {
  team?: TeamLike | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  accentColor?: string;
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
 * Reusable team logo component — the single logo implementation for the site.
 *
 * Fallback chain, tried in order:
 *   1. Local logo from public/assets/logos/ when a real file matches
 *   2. API-provided logo URL
 *   3. Team initials badge (stable placeholder, never a broken-image icon)
 *
 * Visibility is driven by the image's own state rather than only by load/error
 * events, which is what made logos behave inconsistently:
 *
 *  - React assigns `src` before it attaches the load/error listeners, so an
 *    image that is already in the browser cache (or fails instantly) can
 *    settle before React hears anything. The logo then stayed at opacity 0,
 *    or never fell back — and appeared only once a later render happened to
 *    re-trigger it (the "appears after refreshing twice" symptom).
 *  - Reveal state is keyed strictly to the candidate actually being displayed,
 *    not to the candidate list. Data that arrives in waves (server rows first,
 *    client refresh afterwards) used to re-run a reset on every wave and hide
 *    logos that were already showing.
 *
 * Each candidate is requested at most once, so there are no retry loops.
 */
export default function TeamLogo({ team, size = 'md', className = '', alt }: Props) {
  const localLogo = resolveLocalLogoPath(team);
  const apiLogo = typeof team?.logo === 'string' && team.logo.trim().length > 0 ? team.logo.trim() : null;
  const initials = getTeamInitials(team?.name ?? undefined, team?.shortName ?? undefined);

  const candidates = [localLogo, apiLogo].filter((c): c is string => !!c);

  /** Index of the candidate to show; `candidates.length` means all failed. */
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const current = candidateIndex < candidates.length ? candidates[candidateIndex] : null;
  const showFallback = !current;

  /** Try the next logo source, or settle on the initials placeholder. */
  const advance = () => {
    setCandidateIndex((index) => (index + 1 < candidates.length ? index + 1 : candidates.length));
  };

  // Only re-evaluate when the candidate actually being displayed changes. A new
  // render with the same resolved logo must never hide an already-visible one.
  useEffect(() => {
    if (!current) {
      setRevealed(true);
      return;
    }
    setRevealed(false);

    // A cached image can already be complete before React attached its
    // listeners, so check its real state in addition to the events.
    const check = () => {
      const el = imgRef.current;
      if (!el || !el.complete) return;
      if (el.naturalWidth > 0) {
        setRevealed(true);
      } else {
        advance();
      }
    };
    check();
    const frame = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frame);
  }, [current]);

  return (
    <span
      className={`relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-800 text-center font-bold tracking-tight text-slate-300 ${sizeClasses[size]} ${className}`}
      title={team?.name ?? undefined}
    >
      {showFallback ? (
        <span className="leading-none">{initials}</span>
      ) : (
        <img
          key={current}
          ref={imgRef}
          src={current}
          alt={alt ?? ''}
          aria-hidden={alt ? undefined : true}
          loading="lazy"
          decoding="async"
          onLoad={() => setRevealed(true)}
          onError={advance}
          className={`h-full w-full object-contain p-[10%] transition-opacity ${revealed ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </span>
  );
}
