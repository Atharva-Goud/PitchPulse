'use client';

import { useState } from 'react';
import { Goal, Hand, Shield, Timer, Users } from 'lucide-react';
import TeamLogo from '@/components/ui/TeamLogo';
import DataUnavailablePanel from './DataUnavailablePanel';
import type { PlayerLeader, TeamStatRow, WorldCupData, LeaderCategory } from '@/lib/football/world-cup';

interface Props {
  data: WorldCupData;
}

const PLAYER_TABS: Array<{ id: LeaderCategory; label: string; icon: typeof Goal }> = [
  { id: 'goals', label: 'Goals', icon: Goal },
  { id: 'assists', label: 'Assists', icon: Users },
  { id: 'contributions', label: 'Contributions', icon: Goal },
  { id: 'appearances', label: 'Appearances', icon: Users },
  { id: 'minutes', label: 'Minutes', icon: Timer },
  { id: 'cleanSheets', label: 'Clean sheets', icon: Shield },
  { id: 'saves', label: 'Saves', icon: Hand },
  { id: 'yellowCards', label: 'Yellow cards', icon: Shield },
  { id: 'redCards', label: 'Red cards', icon: Shield },
];

function LeaderTable({ leaders }: { leaders: PlayerLeader[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
            <th className="px-3 py-2 text-left font-semibold">#</th>
            <th className="px-3 py-2 text-left font-semibold">Player</th>
            <th className="px-3 py-2 text-left font-semibold">Team</th>
            <th className="px-3 py-2 text-right font-semibold">Value</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader) => (
            <tr key={`${leader.id}-${leader.rank}`} className="border-t border-[var(--border-subtle)]">
              <td className="px-3 py-2.5 text-[var(--text-muted)]">{leader.rank}</td>
              <td className="px-3 py-2.5 font-medium text-white">{leader.name}</td>
              <td className="px-3 py-2.5">
                {leader.team ? (
                  <span className="flex items-center gap-2">
                    <TeamLogo
                      team={{ id: leader.team.id, name: leader.team.name, shortName: leader.team.name, logo: leader.team.logo, country: '', league: '' }}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type TeamStatKey = Exclude<keyof TeamStatRow, 'team'>;

const TEAM_COLUMNS: Array<{ key: TeamStatKey; label: string }> = [
  { key: 'goalsFor', label: 'Goals scored' },
  { key: 'goalsAgainst', label: 'Goals conceded' },
  { key: 'cleanSheets', label: 'Clean sheets' },
  { key: 'possession', label: 'Possession %' },
  { key: 'shots', label: 'Shots' },
  { key: 'shotsOnTarget', label: 'Shots on target' },
  { key: 'passingAccuracy', label: 'Passing accuracy %' },
  { key: 'expectedGoals', label: 'xG' },
];

function TeamStatsTable({ rows }: { rows: TeamStatRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
            <th className="px-3 py-2 text-left font-semibold">Team</th>
            {TEAM_COLUMNS.map((c) => (
              <th key={String(c.key)} className="px-2 py-2 text-right font-semibold">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.team.id} className="border-t border-[var(--border-subtle)]">
              <td className="px-3 py-2.5">
                <span className="flex items-center gap-2.5">
                  <TeamLogo
                    team={{ id: row.team.id, name: row.team.name, shortName: row.team.name, logo: row.team.logo, country: '', league: '' }}
                    size="sm"
                    alt=""
                  />
                  <span className="truncate font-medium text-white">{row.team.name}</span>
                </span>
              </td>
              {TEAM_COLUMNS.map((c) => {
                const value = row[c.key];
                return (
                  <td key={String(c.key)} className="px-2 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">
                    {value == null ? <span className="text-[var(--text-muted)]">—</span> : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StatsDashboard({ data }: Props) {
  const [activeTab, setActiveTab] = useState<LeaderCategory>('goals');

  const hasAny =
    data.source.available &&
    (Object.values(data.playerLeaders).some((l) => l.length > 0) || data.teamStats.length > 0);

  if (!hasAny) {
    return (
      <DataUnavailablePanel
        section="Tournament statistics"
        checkedSources={data.source.checkedSources}
        requiredSources={[
          '/{league}/summary  (boxscore + key events with players, assists, cards)',
          'player roster endpoints with minutes, saves, clean sheets',
          'team match statistics: possession, shots, passing, xG',
        ]}
      />
    );
  }

  const leaders = data.playerLeaders[activeTab] ?? [];

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Player leaderboards">
          {PLAYER_TABS.map((tab) => {
            const Icon = tab.icon;
            const empty = (data.playerLeaders[tab.id] ?? []).length === 0;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'border-[var(--primary)]/50 bg-[var(--primary)]/15 text-white'
                    : 'border-[var(--border-default)] bg-[var(--surface-2)]/60 text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
        {leaders.length > 0 ? (
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)]/70 p-2">
            <LeaderTable leaders={leaders} />
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)]/70 px-4 py-10 text-center text-sm text-[var(--text-secondary)]">
            This leaderboard is not provided by the current data source.
          </div>
        )}
      </div>

      {data.teamStats.length > 0 ? (
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)]/70 p-2">
          <TeamStatsTable rows={data.teamStats} />
        </div>
      ) : null}
    </div>
  );
}
