'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Crown, Trophy } from 'lucide-react';
import TeamLogo from '@/components/ui/TeamLogo';
import { Badge } from '@/components/ui';
import DataUnavailablePanel from './DataUnavailablePanel';
import type { BracketMatch, BracketRound, BracketTeam } from '@/lib/football/world-cup';
import type { WorldCupData } from '@/lib/football/world-cup';

interface Props {
  data: WorldCupData;
}

const STATUS_BADGE: Record<BracketMatch['status'], { variant: 'live' | 'finished' | 'upcoming' | 'warning'; label: string }> = {
  in: { variant: 'live', label: 'LIVE' },
  post: { variant: 'finished', label: 'FT' },
  pre: { variant: 'upcoming', label: 'Scheduled' },
};

function teamForLogo(team: BracketTeam | null) {
  if (!team) return null;
  return {
    id: team.id,
    name: team.name,
    shortName: team.name,
    logo: team.logo,
    country: '',
    league: '',
  };
}

function TeamRow({ team, score, isWinner }: { team: BracketTeam | null; score: number | null; isWinner: boolean }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors ${
        isWinner ? 'bg-[var(--primary)]/15' : ''
      }`}
    >
      {team ? (
        <TeamLogo team={teamForLogo(team)} size="sm" alt="" />
      ) : (
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--border-strong)] text-[10px] text-[var(--text-muted)]">
          TBD
        </span>
      )}
      <span
        className={`min-w-0 flex-1 truncate text-sm ${
          team ? (isWinner ? 'font-semibold text-white' : 'text-[var(--text-secondary)]') : 'italic text-[var(--text-muted)]'
        }`}
      >
        {team?.name ?? 'To be determined'}
      </span>
      <span className={`flex-shrink-0 text-sm font-bold tabular-nums ${isWinner ? 'text-white' : 'text-[var(--text-muted)]'}`}>
        {score ?? '–'}
      </span>
    </div>
  );
}

function MatchCard({ match }: { match: BracketMatch }) {
  const badge = STATUS_BADGE[match.status];
  const body = (
    <>
      <div className="mb-1.5 flex items-center justify-between">
        <Badge variant={badge.variant} dot={match.status === 'in'}>
          {badge.label}
        </Badge>
        <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
          {match.detail}
        </span>
      </div>
      <TeamRow team={match.home} score={match.homeScore} isWinner={!!match.home?.winner} />
      <TeamRow team={match.away} score={match.awayScore} isWinner={!!match.away?.winner} />
    </>
  );

  const className =
    'block w-full min-w-[240px] rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)]/80 p-3 backdrop-blur-sm transition-colors';
  const interactive = match.href
    ? 'hover:border-[var(--border-focus)]/40 hover:bg-[var(--surface-3)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]/50'
    : '';

  if (match.href) {
    return (
      <Link href={match.href} className={`${className} ${interactive}`} aria-label={`Match: ${match.home?.name ?? 'TBD'} vs ${match.away?.name ?? 'TBD'}`}>
        {body}
      </Link>
    );
  }
  return (
    <div className={`${className} opacity-80`} aria-disabled="true">
      {body}
    </div>
  );
}

/**
 * Bracket columns with CSS elbow connectors.
 *
 * Matches in a round are paired by index (2i, 2i+1 feed round+1 match i), so
 * each pair renders in a flex row: two stacked match cards, the vertical
 * connector spanning them, and the elbow into the next round's match card.
 */
function BracketTree({ matches, next, depth }: { matches: BracketMatch[]; next?: BracketMatch; depth: number }) {
  if (matches.length === 1) {
    return (
      <div className="flex items-center">
        <MatchCard match={matches[0]} />
        {next ? <Connector /> : null}
      </div>
    );
  }

  const pairs: BracketMatch[][] = [];
  for (let i = 0; i < matches.length; i += 2) {
    pairs.push([matches[i], matches[i + 1]].filter(Boolean));
  }

  return (
    <div className="flex flex-col justify-around">
      {pairs.map((pair, i) => (
        <div key={i} className="flex items-center py-2">
          <div className="flex flex-col gap-2">
            {pair.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
          <Connector />
          {next ? <MatchCard match={next} /> : null}
        </div>
      ))}
    </div>
  );
}

function Connector() {
  return (
    <div className="relative mx-3 hidden h-full w-8 flex-shrink-0 sm:block" aria-hidden="true">
      <span className="absolute left-0 top-1/2 h-px w-8 -translate-y-1/2 bg-[var(--border-strong)]" />
      <span className="absolute right-0 top-0 h-full w-px bg-[var(--border-strong)]" />
      <span className="absolute right-0 top-1/2 h-px w-8 -translate-y-1/2 bg-[var(--border-strong)]" />
    </div>
  );
}

export default function KnockoutBracket({ data }: Props) {
  const [activeRound, setActiveRound] = useState<string>('all');

  const brackets = data.rounds.filter((r) => r.matches.length > 0);

  if (!data.source.available || brackets.length === 0) {
    return (
      <DataUnavailablePanel
        section="Knockout journey tree"
        checkedSources={data.source.checkedSources}
        requiredSources={[
          '/{league}/fixtures  (knockout matches with teams, scores, status)',
          'shootout details on competition details',
        ]}
      />
    );
  }

  const rounds: BracketRound[] = data.rounds.filter((r) => r.matches.length > 0);
  const finalMatch = rounds.find((r) => r.id === 'final')?.matches[0];
  const champion = finalMatch && finalMatch.status === 'post'
    ? finalMatch.home?.winner ? finalMatch.home : finalMatch.away?.winner ? finalMatch.away : null
    : null;

  return (
    <div className="space-y-6">
      {/* Round filter chips (mobile friendly: the tree scrolls horizontally) */}
      <div className="flex flex-wrap gap-2">
        {[{ id: 'all', label: 'All rounds' }, ...rounds.map((r) => ({ id: r.id, label: r.label }))].map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveRound(r.id === 'all' ? 'all' : r.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeRound === r.id
                ? 'border-[var(--primary)]/50 bg-[var(--primary)]/15 text-white'
                : 'border-[var(--border-default)] bg-[var(--surface-2)]/60 text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto pb-4">
        <BracketTree matches={rounds[0].matches} depth={0} />
      </div>

      {/* Round labels + champion */}
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {rounds.map((r) => (
          <div key={r.id} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)]/60 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">{r.label}</p>
            <p className="text-sm text-white">{r.matches.length} matches</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border-default)] bg-gradient-to-br from-[var(--primary)]/15 to-[var(--surface-2)]/70 p-6 text-center">
        <Trophy className="mx-auto mb-3 h-8 w-8 text-[var(--primary)]" aria-hidden="true" />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Champion</h3>
        {champion ? (
          <div className="mt-3 flex flex-col items-center gap-3">
            <TeamLogo team={teamForLogo(champion)} size="xl" alt="" />
            <p className="flex items-center gap-2 text-2xl font-bold text-white">
              <Crown className="h-6 w-6 text-[var(--primary)]" aria-hidden="true" />
              {champion.name}
            </p>
          </div>
        ) : (
          <p className="mt-3 text-lg text-[var(--text-secondary)]">To be determined</p>
        )}
      </div>
    </div>
  );
}
