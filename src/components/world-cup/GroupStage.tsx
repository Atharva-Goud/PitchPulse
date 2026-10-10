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
      <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-1)]/60 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">{group.name}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <th className="px-3 py-2 text-left font-semibold">Team</th>
              {['P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map((h) => (
                <th key={h} className="px-2 py-2 text-right font-semibold">{h}</th>
              ))}
              <th className="px-3 py-2 text-center font-semibold">Qual.</th>
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
                      team={{ id: row.team.id, name: row.team.name, shortName: row.team.name, logo: row.team.logo, country: '', league: '' }}
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
                <td className="px-3 py-2 text-center">
                  {row.qualified === true ? (
                    <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-400" aria-label="Qualified" />
                  ) : row.qualified === false ? (
                    <span className="text-xs text-[var(--text-muted)]">—</span>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]" title="Qualification not provided by source">n/a</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function GroupStage({ data }: Props) {
  if (!data.source.available || data.groups.length === 0) {
    return (
      <DataUnavailablePanel
        section="Group stage"
        checkedSources={data.source.checkedSources}
        requiredSources={[
          '/{league}/standings  (group tables: played, W/D/L, GF, GA, GD, points)',
          'per-group standings children from the source',
        ]}
      />
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {data.groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}
