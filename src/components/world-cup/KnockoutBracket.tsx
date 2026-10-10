'use client';

import { useState } from 'react';
import { Crown, MapPin, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import TeamLogo from '@/components/ui/TeamLogo';
import { Badge, Card } from '@/components/ui';
import DataUnavailablePanel from './DataUnavailablePanel';
import { KNOCKOUT_ROUNDS } from '@/lib/football/world-cup';
import type { BracketMatch, BracketTeam, WorldCupData } from '@/lib/football/world-cup';

interface Props {
  data: WorldCupData;
}

const STATUS_BADGE: Record<BracketMatch['status'], { variant: 'live' | 'finished' | 'upcoming' | 'warning'; label: string }> = {
  in: { variant: 'live', label: 'LIVE' },
  post: { variant: 'finished', label: 'FT' },
  pre: { variant: 'upcoming', label: 'Scheduled' },
};

const ROUND_BY_ID = new Map(KNOCKOUT_ROUNDS.map((r) => [r.id, r]));

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

function MatchCard({ match, roundShort }: { match: BracketMatch; roundShort: string }) {
  const badge = STATUS_BADGE[match.status];
  return (
    <div className="w-full min-w-[228px] rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)]/80 p-3 backdrop-blur-sm">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <Badge variant={badge.variant} dot={match.status === 'in'}>
          {badge.label}
        </Badge>
        <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
          <span className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 text-[10px]">{roundShort}</span>
          {match.shootout ? <span className="text-[var(--warning)]">pens {match.shootout.home}-{match.shootout.away}</span> : null}
          {match.detail === 'a.e.t.' ? <span className="text-[var(--warning)]">a.e.t.</span> : null}
        </span>
      </div>
      <TeamRow team={match.home} score={match.homeScore} isWinner={!!match.home?.winner} />
      <TeamRow team={match.away} score={match.awayScore} isWinner={!!match.away?.winner} />
      {match.kickoff || match.ground ? (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
          <MapPin className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">
            {match.kickoff ? format(new Date(match.kickoff), 'EEE d MMM, HH:mm') : ''}
            {match.kickoff && match.ground ? ' · ' : ''}
            {match.ground ?? ''}
          </span>
        </p>
      ) : null}
    </div>
  );
}

/** Elbow connector between a match pair and the match it feeds. */
function Connector() {
  return (
    <div className="relative mx-2 hidden h-full w-6 flex-shrink-0 sm:block" aria-hidden="true">
      <span className="absolute left-0 top-1/2 h-px w-6 -translate-y-1/2 bg-[var(--border-strong)]" />
      <span className="absolute right-0 top-0 h-full w-px bg-[var(--border-strong)]" />
      <span className="absolute right-0 top-1/2 h-px w-6 -translate-y-1/2 bg-[var(--border-strong)]" />
    </div>
  );
}

/**
 * Recursive bracket subtree.
 *
 * Renders the match at the given id with its feeder matches nested to the
 * left. Feeders come from each match's resolved `feederIds` (the match each
 * participant actually won) — never from positional pairing, which
 * verification showed does not match the published bracket order. A null
 * feeder is left unresolved rather than guessed.
 */
function SubBracket({ rounds, match }: { rounds: WorldCupData['rounds']; match: BracketMatch }) {
  const roundShort = ROUND_BY_ID.get(match.round)?.short ?? match.round;
  const feeders = (match.feederIds ?? [])
    .map((id) => (id ? rounds.flatMap((r) => r.matches).find((m) => m.id === id) ?? null : null))
    .filter((m): m is BracketMatch => m !== null);

  return (
    <div className="flex items-center">
      {feeders.length > 0 ? (
        <div className="flex flex-col justify-around gap-2">
          {feeders.map((feeder) => (
            <SubBracket key={feeder.id} rounds={rounds} match={feeder} />
          ))}
        </div>
      ) : null}
      <Connector />
      <MatchCard match={match} roundShort={roundShort} />
    </div>
  );
}

export default function KnockoutBracket({ data }: Props) {
  const [selectedRound, setSelectedRound] = useState<string>('all');

  const rounds = data.rounds.filter((r) => r.matches.length > 0);
  if (!data.source.available || rounds.length === 0) {
    return (
      <DataUnavailablePanel
        section="Knockout journey tree"
        reason={data.source.reason}
        sourceName={data.source.sourceName}
        sourceUrl={data.source.sourceUrl}
      />
    );
  }

  const champion = data.champion;

  const visibleRounds = selectedRound === 'all'
    ? rounds
    : rounds.filter((r) => r.id === selectedRound);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[{ id: 'all', label: 'All rounds' }, ...rounds.map((r) => ({ id: r.id, label: r.label }))].map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRound(r.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedRound === r.id
                ? 'border-[var(--primary)]/50 bg-[var(--primary)]/15 text-white'
                : 'border-[var(--border-default)] bg-[var(--surface-2)]/60 text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {selectedRound === 'all' ? (
        <div className="overflow-x-auto pb-4">
          {/* Root of the tree: the final. Feeders nest recursively to its left. */}
          <SubBracket rounds={rounds} match={rounds.flatMap((r) => r.matches).find((m) => m.round === 'final')!} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleRounds[0]?.matches.map((m) => (
            <MatchCard key={m.id} match={m} roundShort={ROUND_BY_ID.get(m.round)?.short ?? m.round} />
          ))}
        </div>
      )}

      {/* Round summary */}
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {rounds.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRound(r.id)}
            className={`rounded-lg border px-3 py-2 text-left transition-colors ${
              selectedRound === r.id
                ? 'border-[var(--primary)]/50 bg-[var(--primary)]/15'
                : 'border-[var(--border-subtle)] bg-[var(--surface-1)]/60 hover:border-[var(--border-focus)]/30'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">{r.label}</p>
            <p className="text-sm text-white">{r.matches.length} matches</p>
          </button>
        ))}
      </div>

      {/* Champion */}
      <Card elevated className="border-[var(--primary)]/30 bg-gradient-to-br from-[var(--primary)]/15 to-[var(--surface-2)]/70 p-6 text-center">
        <Trophy className="mx-auto mb-3 h-8 w-8 text-[var(--primary)]" aria-hidden="true" />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Champion</h3>
        {champion ? (
          <div className="mt-3 flex flex-col items-center gap-3">
            <TeamLogo team={teamForLogo(champion)} size="xl" alt="" />
            <p className="flex items-center gap-2 text-2xl font-bold text-white">
              <Crown className="h-6 w-6 text-[var(--primary)]" aria-hidden="true" />
              {champion.name}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              Winner of the final — derived from the match result in the dataset.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-lg text-[var(--text-secondary)]">To be determined</p>
        )}
      </Card>
    </div>
  );
}
