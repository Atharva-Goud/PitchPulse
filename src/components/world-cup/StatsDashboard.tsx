'use client';

import { AlertTriangle, Goal } from 'lucide-react';
import TeamLogo from '@/components/ui/TeamLogo';
import DataUnavailablePanel from './DataUnavailablePanel';
import type { PlayerLeader, TeamStatRow, WorldCupData } from '@/lib/football/world-cup';

interface Props {
  data: WorldCupData;
}

/** Statistics the OpenFootball dataset does NOT provide. */
const UNSUPPORTED_STATS = [
  'Assists',
  'Saves (goalkeepers)',
  'Possession',
  'Shots / shots on target',
  'Passing accuracy',
  'Expected goals (xG)',
  'Yellow / red cards',
  'Minutes played & appearances',
];

function ScorerTable({ leaders }: { leaders: PlayerLeader[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[440px] text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
            <th className="px-3 py-2 text-left font-semibold">#</th>
            <th className="px-3 py-2 text-left font-semibold">Player</th>
            <th className="px-3 py-2 text-left font-semibold">Team</th>
            <th className="px-3 py-2 text-right font-semibold">Goals</th>
            <th className="px-3 py-2 text-right font-semibold">Pens</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader) => (
            <tr key={leader.id} className="border-t border-[var(--border-subtle)]">
              <td className="px-3 py-2.5 text-[var(--text-muted)]">{leader.rank}</td>
              <td className="px-3 py-2.5 font-medium text-white">{leader.name}</td>
              <td className="px-3 py-2.5">
                {leader.team ? (
                  <span className="flex items-center gap-2">
                    <TeamLogo
                      team={{ id: leader.team.id, name: leader.team.name, logo: leader.team.logo }}
                      size="xs"
                      alt=""
                    />
                    <span className="truncate text-[var(--text-secondary)]">{leader.team.name}</span>
                  </span>
                ) : (
                  <span className="text-[var(--text-muted)]">—</span>
                )}
              </td>
              <td className="px-3 py-2.5 text-right font-bold tabular-nums text-white">{leader.value}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">
                {leader.penalties ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeamStatsTable({ rows }: { rows: TeamStatRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
            <th className="px-3 py-2 text-left font-semibold">Team</th>
            <th className="px-2 py-2 text-right font-semibold">P</th>
            <th className="px-2 py-2 text-right font-semibold">W</th>
            <th className="px-2 py-2 text-right font-semibold">D</th>
            <th className="px-2 py-2 text-right font-semibold">L</th>
            <th className="px-2 py-2 text-right font-semibold">GF</th>
            <th className="px-2 py-2 text-right font-semibold">GA</th>
            <th className="px-2 py-2 text-right font-semibold">GD</th>
            <th className="px-2 py-2 text-right font-semibold">Clean sheets</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.team.id} className="border-t border-[var(--border-subtle)]">
              <td className="px-3 py-2.5">
                <span className="flex items-center gap-2.5">
                  <TeamLogo
                    team={{ id: row.team.id, name: row.team.name, logo: row.team.logo }}
                    size="sm"
                    alt=""
                  />
                  <span className="truncate font-medium text-white">{row.team.name}</span>
                </span>
              </td>
              <td className="px-2 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">{row.played}</td>
              <td className="px-2 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">{row.wins}</td>
              <td className="px-2 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">{row.draws}</td>
              <td className="px-2 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">{row.losses}</td>
              <td className="px-2 py-2.5 text-right font-semibold tabular-nums text-white">{row.goalsFor}</td>
              <td className="px-2 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">{row.goalsAgainst}</td>
              <td className="px-2 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">
                {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
              </td>
              <td className="px-2 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">{row.cleanSheets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StatsDashboard({ data }: Props) {
  const scorers = data.playerLeaders.goals;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-white">
          <Goal className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          Top goalscorers
        </h3>
        {scorers.length > 0 ? (
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)]/70 p-2">
            <ScorerTable leaders={scorers} />
          </div>
        ) : (
          <DataUnavailablePanel
            section="Top goalscorers"
            reason={data.source.available ? 'No goals recorded in the dataset yet.' : data.source.reason}
            sourceName={data.source.sourceName}
            sourceUrl={data.source.sourceUrl}
          />
        )}
      </div>

      <div>
        <h3 className="mb-3 text-base font-semibold text-white">Team statistics</h3>
        {data.teamStats.length > 0 ? (
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)]/70 p-2">
            <TeamStatsTable rows={data.teamStats} />
          </div>
        ) : (
          <DataUnavailablePanel
            section="Team statistics"
            reason={data.source.reason}
            sourceName={data.source.sourceName}
            sourceUrl={data.source.sourceUrl}
          />
        )}
      </div>

      <div className="rounded-xl border border-[var(--warning)]/25 bg-[var(--warning-bg)]/40 p-5">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--warning)]">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          Not available from this dataset
        </h3>
        <p className="mb-3 text-sm text-[var(--text-secondary)]">
          The public-domain OpenFootball dataset records matches and goalscorers only. The
          following statistics are not present in the source and require an additional data
          provider before they can be shown:
        </p>
        <ul className="flex flex-wrap gap-2">
          {UNSUPPORTED_STATS.map((s) => (
            <li
              key={s}
              className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)]/60 px-2.5 py-1 text-xs text-[var(--text-secondary)]"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
