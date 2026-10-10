'use client';

import { useState } from 'react';
import { BarChart3, ExternalLink, LayoutGrid, Trophy } from 'lucide-react';
import { Badge, Card } from '@/components/ui';
import KnockoutBracket from './KnockoutBracket';
import GroupStage from './GroupStage';
import StatsDashboard from './StatsDashboard';
import DataUnavailablePanel from './DataUnavailablePanel';
import type { WorldCupData } from '@/lib/football/world-cup';

interface Props {
  data: WorldCupData;
}

const TABS = [
  { id: 'bracket', label: 'Knockout journey', icon: Trophy },
  { id: 'groups', label: 'Group stage', icon: LayoutGrid },
  { id: 'stats', label: 'Statistics', icon: BarChart3 },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function WorldCupPageClient({ data }: Props) {
  const [tab, setTab] = useState<TabId>('bracket');
  const { source } = data;

  return (
    <div className="space-y-6">
      {/* Source status */}
      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Tournament data status</h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">{source.reason}</p>
          {source.completeness ? (
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {source.completeness.finishedMatches}/{source.completeness.totalMatches} matches with
              results · {source.completeness.groupMatchesFinished}/
              {source.completeness.groupMatchesTotal} group matches played
              {source.completeness.finalDecided ? ' · champion decided' : ''}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <Badge variant={source.available ? 'success' : 'warning'} dot>
            {source.available ? 'Dataset loaded' : 'Source unavailable'}
          </Badge>
          <a
            href={source.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300"
          >
            {source.sourceName}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </Card>

      {!data.source.available ? (
        <DataUnavailablePanel
          section="World Cup 2026 hub"
          reason={data.source.reason}
          sourceName={data.source.sourceName}
          sourceUrl={data.source.sourceUrl}
        />
      ) : null}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="World Cup sections">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? 'border-[var(--primary)]/50 bg-[var(--primary)]/15 text-white'
                  : 'border-[var(--border-default)] bg-[var(--surface-2)]/60 text-[var(--text-secondary)] hover:bg-[var(--surface-3)]/70 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div id="panel-bracket" role="tabpanel" hidden={tab !== 'bracket'}>
        {tab === 'bracket' ? <KnockoutBracket data={data} /> : null}
      </div>
      <div id="panel-groups" role="tabpanel" hidden={tab !== 'groups'}>
        {tab === 'groups' ? <GroupStage data={data} /> : null}
      </div>
      <div id="panel-stats" role="tabpanel" hidden={tab !== 'stats'}>
        {tab === 'stats' ? <StatsDashboard data={data} /> : null}
      </div>
    </div>
  );
}
