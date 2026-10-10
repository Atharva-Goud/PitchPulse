/**
 * UI-facing types for the /world-cup-2026 page.
 *
 * Kept separate from the OpenFootball source types (src/lib/worldcup) so the
 * UI depends on a stable shape while the dataset adapter can change.
 */

import type { KnockoutRoundId } from '../worldcup/openfootball';

export type { KnockoutRoundId };

export interface BracketTeam {
  id: string;
  name: string;
  /** Local national-team logo path when the file exists, else null. */
  logo: string | null;
  winner: boolean;
}

export interface ShootoutScore {
  home: number;
  away: number;
}

export interface BracketMatch {
  id: string;
  round: KnockoutRoundId;
  home: BracketTeam | null;
  away: BracketTeam | null;
  homeScore: number | null;
  awayScore: number | null;
  status: 'pre' | 'in' | 'post';
  /** e.g. "FT", "a.e.t.", "Pens 4-3" — derived from the real score only. */
  detail: string;
  kickoff: string | null;
  /** Venue/ground label from the dataset, when provided. */
  ground: string | null;
  /** Link to a match page, or null when the dataset has none. */
  href: string | null;
  shootout: ShootoutScore | null;
  /**
   * Ids of the matches feeding this one, resolved from actual results.
   * Null entries mean "unresolved" (preceding match not decided).
   */
  feederIds: [string | null, string | null] | null;
}

export interface BracketRound {
  id: KnockoutRoundId;
  label: string;
  matches: BracketMatch[];
}

export interface GroupRow {
  team: BracketTeam;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  /** Only set when a source marks qualification explicitly (never inferred). */
  qualified: boolean | null;
}

export interface GroupMatch {
  id: string;
  date: string;
  team1: string;
  team2: string;
  /** Deciding score (extra time when played), null when not finished. */
  score: PairScoreLike | null;
  shootout: ShootoutScore | null;
  detail: string;
}

export interface PairScoreLike {
  home: number;
  away: number;
}

export interface GroupTable {
  id: string;
  name: string;
  /** True when every match in this group has a result. */
  complete: boolean;
  /** True when the table is calculated from results rather than official. */
  calculated: boolean;
  rows: GroupRow[];
  matches: GroupMatch[];
}

export type LeaderCategory =
  | 'goals' | 'assists' | 'contributions' | 'appearances' | 'minutes'
  | 'cleanSheets' | 'saves' | 'yellowCards' | 'redCards';

export interface PlayerLeader {
  rank: number;
  id: string;
  name: string;
  team: BracketTeam | null;
  value: number;
  /** Penalty goals count, when the source distinguishes penalties. */
  penalties?: number;
}

export interface TeamStatRow {
  team: BracketTeam;
  /** Dataset-supported values. */
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  cleanSheets: number;
  /** Not provided by the OpenFootball dataset. */
  possession: null;
  shots: null;
  shotsOnTarget: null;
  passingAccuracy: null;
  expectedGoals: null;
}

export interface WorldCupCompleteness {
  totalMatches: number;
  finishedMatches: number;
  scheduledMatches: number;
  groupMatchesTotal: number;
  groupMatchesFinished: number;
  allGroupMatchesFinished: boolean;
  finalDecided: boolean;
}

export interface WorldCupSourceStatus {
  available: boolean;
  /** Human-readable explanation, safe to show in the UI. */
  reason: string;
  sourceName: string;
  sourceUrl: string;
  completeness: WorldCupCompleteness | null;
}

export interface WorldCupData {
  source: WorldCupSourceStatus;
  rounds: BracketRound[];
  groups: GroupTable[];
  playerLeaders: Record<LeaderCategory, PlayerLeader[]>;
  teamStats: TeamStatRow[];
  teams: BracketTeam[];
  champion: BracketTeam | null;
}
