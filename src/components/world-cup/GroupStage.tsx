'use client';

import { CheckCircle2 } from 'lucide-react';
import TeamLogo from '@/components/ui/TeamLogo';
import DataUnavailablePanel from './DataUnavailablePanel';
import type { GroupTable, WorldCupData } from '@/lib/football/world-cup';

interface Props {
  data: WorldCupData;
}

function GroupCard({ group }: { group: GroupTable }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)]/70">
      <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] bg-[var(--surface-1)]/60 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">{group.name}</h3>
        <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
          {group.complete ? 'Complete · calculated' : 'In progress · calculated'}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <th className="px-3 py-2 text-left font-semibold">Team</th>
              {['P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map((h) => (
                <th key={h} className="px-2 py-2 text-right font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.rows.map((row, i) => (
              <tr
                key={row.team.id}
                className={`border-t border-[var(--border-subtle)] ${i % 2 === 1 ? 'bg-[var(--surface-1)]/30' : ''}`}
              >
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 text-center text-xs text-[var(--text-muted)]">{i + 1}</span>
                    <TeamLogo
                      team={{ id: row.team.id, name: row.team.name, logo: row.team.logo }}
                      size="sm"
                      alt=""
                    />
                    <span className="truncate text-white">{row.team.name}</span>
                  </div>
                </td>
                <td className="px-2 py-2 text-right tabular-nums text-[var(--text-secondary)]">{row.played}</td>
                <td className="px-2 py-2 text-right tabular-nums text-[var(--text-secondary)]">{row.wins}</td>
                <td className="px-2 py-2 text-right tabular-nums text-[var(--text-secondary)]">{row.draws}</td>
                <td className="px-2 py-2 text-right tabular-nums text-[var(--text-secondary)]">{row.losses}</td>
                <td className="px-2 py-2 text-right tabular-nums text-[var(--text-secondary)]">{row.goalsFor}</td>
                <td className="px-2 py-2 text-right tabular-nums text-[var(--text-secondary)]">{row.goalsAgainst}</td>
                <td className="px-2 py-2 text-right tabular-nums text-[var(--text-secondary)]">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                <td className="px-2 py-2 text-right font-bold tabular-nums text-white">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {group.matches.length > 0 ? (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-1)]/40 px-4 py-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Matches
          </p>
          <ul className="space-y-1">
            {group.matches.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 text-xs">
                <span className="min-w-0 flex-1 truncate text-[var(--text-secondary)]">
                  {m.team1} — {m.team2}
                </span>
                <span className="flex-shrink-0 tabular-nums text-white">
                  {m.score ? `${m.score.home}-${m.score.away}` : '—'}
                  {m.shootout ? (
                    <span className="ml-1 text-[var(--warning)]">(pens {m.shootout.home}-{m.shootout.away})</span>
                  ) : null}
                </span>
                <span className="w-16 flex-shrink-0 text-right text-[var(--text-muted)]">{m.date.slice(5)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default function GroupStage({ data }: Props) {
  if (!data.source.available || data.groups.length === 0) {
    return (
      <DataUnavailablePanel
        section="Group stage"
        reason={data.source.reason}
        sourceName={data.source.sourceName}
        sourceUrl={data.source.sourceUrl}
      />
    );
  }

  const allComplete = data.groups.every((g) => g.complete);

  return (
    <div className="space-y-4">
      <p className="text-xs text-[var(--text-muted)]">
        Standings are calculated from match results (P·W·D·L·GF·GA·GD·Pts, tiebreakers: points,
        goal difference, goals scored). Head-to-head is not applied because the dataset does not
        provide it. {allComplete
          ? 'All group matches in the dataset have results.'
          : 'Some group matches in the dataset are still without results.'}
      </p>
      <div className="grid gap-5 lg:grid-cols-2">
        {data.groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
