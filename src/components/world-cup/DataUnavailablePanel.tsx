'use client';

import { AlertTriangle, ExternalLink } from 'lucide-react';

interface Props {
  /** Section this panel stands in for, e.g. "Knockout journey tree". */
  section: string;
  /** Why the data is unavailable / what the source can provide. */
  reason: string;
  sourceName: string;
  sourceUrl: string;
}

/**
 * Explicit "Data unavailable" state.
 *
 * PitchPulse never invents tournament data. When a value cannot be sourced,
 * this panel states the reason and links to the dataset being used.
 */
export default function DataUnavailablePanel({ section, reason, sourceName, sourceUrl }: Props) {
  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)]/70 p-8">
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--warning-bg)] text-[var(--warning)]">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">{section} — data unavailable</h3>
        <p className="max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">{reason}</p>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300"
        >
          Source: {sourceName}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
