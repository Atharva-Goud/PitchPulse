'use client';

import { AlertTriangle, Database } from 'lucide-react';

interface Props {
  /** Section this panel stands in for, e.g. "Knockout bracket". */
  section: string;
  /** What the data layer checked before concluding data is unavailable. */
  checkedSources?: string[];
  /** Endpoints/fields a source must expose to fill this section. */
  requiredSources?: string[];
}

/**
 * Explicit "Data unavailable" state.
 *
 * PitchPulse never invents tournament data. When the configured football API
 * does not expose the required competition, this panel states exactly what was
 * checked and which endpoint contract would fill the section.
 */
export default function DataUnavailablePanel({ section, checkedSources, requiredSources }: Props) {
  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)]/70 p-8">
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--warning-bg)] text-[var(--warning)]">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">
          {section} — data unavailable
        </h3>
        <p className="max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
          This section is built to display live tournament data, but the configured football
          API currently exposes no World Cup fixture, group, player or team statistics for this
          competition. No placeholder scores, standings or players are shown, because fabricating
          tournament data would misrepresent results.
        </p>
      </div>

      {(checkedSources?.length || requiredSources?.length) ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {checkedSources?.length ? (
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)]/60 p-4 text-left">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Sources checked
              </p>
              <ul className="space-y-1">
                {checkedSources.map((s) => (
                  <li key={s} className="font-mono text-xs text-[var(--text-secondary)]">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {requiredSources?.length ? (
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)]/60 p-4 text-left">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                <Database className="h-3.5 w-3.5" aria-hidden="true" />
                Required to fill this section
              </p>
              <ul className="space-y-1">
                {requiredSources.map((s) => (
                  <li key={s} className="font-mono text-xs text-[var(--text-secondary)]">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
