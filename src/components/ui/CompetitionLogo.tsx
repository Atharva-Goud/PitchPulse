'use client';

import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { resolveCompetitionLogoPath } from '@/lib/utils/logo-mapping';

interface Props {
  /** Competition-like object: id/name resolve the local crest, logo is the API logo. */
  competition: {
    id?: string | null;
    name?: string | null;
    logo?: string | null;
  };
  /** Rendered icon/box size in pixels (default 32). */
  size?: number;
  /** Icon size for the neutral fallback, defaults from `size`. */
  iconClassName?: string;
  className?: string;
}

/**
 * Competition crest with a deterministic fallback chain:
 *   1. local crest from the centralized mapping (only files that exist)
 *   2. API-provided competition logo
 *   3. neutral trophy icon
 *
 * A failed image never retries in a loop: each source is tried at most once
 * and the last failure settles on the neutral icon.
 */
export default function CompetitionLogo({ competition, size = 32, iconClassName, className = '' }: Props) {
  const localPath = resolveCompetitionLogoPath(competition);
  const apiLogo = typeof competition.logo === 'string' && competition.logo.trim() ? competition.logo.trim() : null;

  const [stage, setStage] = useState<'local' | 'api' | 'icon'>(localPath ? 'local' : apiLogo ? 'api' : 'icon');
  const src = stage === 'local' ? localPath : stage === 'api' ? apiLogo : null;

  if (!src) {
    return (
      <span
        className={`flex flex-shrink-0 items-center justify-center rounded-lg bg-slate-800 ${className}`}
        style={{ width: size, height: size }}
        role="img"
        aria-label={`${competition.name ?? 'Competition'} (no crest available)`}
      >
        <Trophy className={iconClassName ?? 'h-5 w-5 text-slate-500'} aria-hidden="true" />
      </span>
    );
  }

  return (
    <span
      className={`flex flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-800 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        key={src}
        src={src}
        alt=""
        loading="lazy"
        className="h-full w-full object-contain p-1"
        onError={() => setStage(stage === 'local' ? (apiLogo ? 'api' : 'icon') : 'icon')}
      />
    </span>
  );
}
