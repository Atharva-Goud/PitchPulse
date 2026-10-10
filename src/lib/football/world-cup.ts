/**
 * World Cup 2026 data layer.
 *
 * Adapts the public-domain OpenFootball dataset (src/lib/worldcup/openfootball.ts)
 * into the shapes consumed by the /world-cup-2026 UI components.
 *
 * Data-integrity contract: every value below comes from the fetched dataset.
 * Statistics the dataset cannot provide (assists, saves, possession, passing
 * accuracy, xG, cards, minutes) are returned as empty and must be rendered as
 * "not available" — never invented.
 */

import {
  getWorldCupTournament,
  KNOCKOUT_ROUNDS,
  type KnockoutRoundId,
  type WorldCupMatch,
  type WorldCupTournament,
} from '../worldcup/openfootball';

export type { KnockoutRoundId, PlayerLeader, TeamStatRow, GroupTable, GroupRow, WorldCupData, WorldCupSourceStatus, WorldCupCompleteness, BracketTeam, BracketMatch, BracketRound, ShootoutScore, LeaderCategory } from './world-cup.types';

import type {
  BracketMatch,
  BracketRound,
  BracketTeam,
  GroupRow,
  GroupTable,
  PlayerLeader,
  ShootoutScore,
  TeamStatRow,
  WorldCupData,
} from './world-cup.types';

/* ============================================================
   Mapping OpenFootball -> UI shapes
   ============================================================ */

function toBracketTeam(match: WorldCupMatch, side: 1 | 2, winner: 1 | 2 | null): BracketTeam {
  const team = side === 1 ? match.team1 : match.team2;
  return {
    id: team.id,
    name: team.name,
    logo: team.logo,
    winner: winner === side,
  };
}

function toBracketMatch(match: WorldCupMatch): BracketMatch {
  return {
    id: match.id,
    round: match.roundId as KnockoutRoundId,
    home: toBracketTeam(match, 1, match.winner),
    away: toBracketTeam(match, 2, match.winner),
    homeScore: match.decided?.home ?? null,
    awayScore: match.decided?.away ?? null,
    status: match.status === 'finished' ? 'post' : 'pre',
    detail: match.detail,
    kickoff: match.kickoff,
    ground: match.ground,
    href: null, // the dataset has no per-match page; fixture pages are club data
    shootout: match.shootout
      ? ({ home: match.shootout.home, away: match.shootout.away } as ShootoutScore)
      : null,
    feederIds: match.feederIds,
  };
}

function toRounds(tournament: WorldCupTournament): BracketRound[] {
  return KNOCKOUT_ROUNDS.map((round) => ({
    id: round.id,
    label: round.label,
    matches: tournament.knockout[round.id].map(toBracketMatch),
  }));
}

function toGroups(tournament: WorldCupTournament): GroupTable[] {
  return tournament.groups.map((g) => ({
    id: g.id,
    name: g.name,
    complete: g.complete,
    // Calculated from match results, not the official table.
    calculated: true,
    rows: g.rows.map((r): GroupRow => ({
      team: { id: r.team.id, name: r.team.name, logo: r.team.logo, winner: false },
      played: r.played,
      wins: r.wins,
      draws: r.draws,
      losses: r.losses,
      goalsFor: r.goalsFor,
      goalsAgainst: r.goalsAgainst,
      goalDifference: r.goalDifference,
      points: r.points,
      qualified: null,
    })),
    matches: tournament.groupMatches
      .filter((m) => m.group === g.name)
      .map((m) => ({
        id: m.id,
        date: m.date,
        team1: m.team1.name,
        team2: m.team2.name,
        score: m.decided ? { home: m.decided.home, away: m.decided.away } : null,
        shootout: m.shootout ? { home: m.shootout.home, away: m.shootout.away } : null,
        detail: m.detail,
      })),
  }));
}

function toTeamStats(tournament: WorldCupTournament): TeamStatRow[] {
  return tournament.teamStats.map((t) => ({
    team: { id: t.team.id, name: t.team.name, logo: t.team.logo, winner: false },
    played: t.played,
    wins: t.wins,
    draws: t.draws,
    losses: t.losses,
    goalsFor: t.goalsFor,
    goalsAgainst: t.goalsAgainst,
    goalDifference: t.goalDifference,
    cleanSheets: t.cleanSheets,
    // Not provided by the dataset.
    possession: null,
    shots: null,
    shotsOnTarget: null,
    passingAccuracy: null,
    expectedGoals: null,
  }));
}

function toScorers(tournament: WorldCupTournament): PlayerLeader[] {
  return tournament.scorers.map((s) => ({
    rank: s.rank,
    id: `${s.team?.id ?? 'unknown'}-${toKey(s.player)}`,
    name: s.player,
    team: s.team ? { id: s.team.id, name: s.team.name, logo: s.team.logo, winner: false } : null,
    value: s.goals,
    penalties: s.penalties,
  }));
}

function toKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

const NO_LEADERS: PlayerLeader[] = [];

/* ============================================================
   Public loader
   ============================================================ */

export const getWorldCupData = async (): Promise<WorldCupData> => {
  const tournament = await getWorldCupTournament();

  if (!tournament) {
    return {
      source: {
        available: false,
        reason:
          'The OpenFootball World Cup dataset could not be loaded. It is fetched from ' +
          'raw.githubusercontent.com (public domain, no API key); if this message persists, ' +
          'the source is temporarily unavailable.',
        sourceName: 'OpenFootball worldcup.json',
        sourceUrl: 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json',
        completeness: null,
      },
      rounds: [],
      groups: [],
      playerLeaders: {
        goals: NO_LEADERS, assists: NO_LEADERS, contributions: NO_LEADERS, appearances: NO_LEADERS,
        minutes: NO_LEADERS, cleanSheets: NO_LEADERS, saves: NO_LEADERS, yellowCards: NO_LEADERS,
        redCards: NO_LEADERS,
      },
      teamStats: [],
      teams: [],
      champion: null,
    };
  }

  const { completeness } = tournament;
  const statusParts: string[] = [];
  if (completeness.scheduledMatches > 0) {
    statusParts.push(
      `${completeness.finishedMatches} of ${completeness.totalMatches} matches have results`
    );
  } else {
    statusParts.push(`all ${completeness.totalMatches} matches have results`);
  }

  return {
    source: {
      available: true,
      reason: `Live tournament data from the public-domain OpenFootball dataset (${statusParts.join(', ')}).`,
      sourceName: tournament.name,
      sourceUrl: tournament.sourceUrl,
      completeness,
    },
    rounds: toRounds(tournament),
    groups: toGroups(tournament),
    playerLeaders: {
      goals: toScorers(tournament),
      assists: NO_LEADERS,
      contributions: NO_LEADERS,
      appearances: NO_LEADERS,
      minutes: NO_LEADERS,
      cleanSheets: NO_LEADERS,
      saves: NO_LEADERS,
      yellowCards: NO_LEADERS,
      redCards: NO_LEADERS,
    },
    teamStats: toTeamStats(tournament),
    teams: tournament.teams.map((t) => ({ id: t.id, name: t.name, logo: t.logo, winner: false })),
    champion: tournament.champion
      ? { id: tournament.champion.id, name: tournament.champion.name, logo: tournament.champion.logo, winner: true }
      : null,
  };
};

export { KNOCKOUT_ROUNDS };
export { getWorldCupTournament } from '../worldcup/openfootball';
export type { WorldCupTournament, WorldCupMatch } from '../worldcup/openfootball';
