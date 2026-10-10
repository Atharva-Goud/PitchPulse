/**
 * Pure normalization and statistics for the OpenFootball World Cup dataset.
 *
 * No network, no Next.js imports: every function here is deterministic and can
 * be tested directly against the source JSON.
 */

import { findLogoAsset } from '../utils/logo-mapping';

/* ============================================================
   Raw dataset schema (as published by OpenFootball)
   ============================================================ */

export interface RawGoal {
  name: string;
  minute: string;
  penalty?: boolean;
  ownGoal?: boolean;
}

export interface RawScore {
  ht?: [number, number];
  ft?: [number, number];
  et?: [number, number];
  p?: [number, number];
}

export interface RawMatch {
  num?: number;
  round: string;
  date: string;
  time?: string;
  team1: string;
  team2: string;
  score?: RawScore;
  goals1?: RawGoal[];
  goals2?: RawGoal[];
  group?: string;
  ground?: string;
  city?: string;
}

export interface RawWorldCup {
  name: string;
  matches: RawMatch[];
}

/* ============================================================
   Normalized types (consumed by the UI and derived stats)
   ============================================================ */

export type KnockoutRoundId = 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final';

export interface WorldCupTeam {
  /** Stable id derived from the team name (a key only — never invented data). */
  id: string;
  name: string;
  shortName: string;
  /** Local national-team logo path when the file exists, else null. */
  logo: string | null;
}

export interface WorldCupGoal {
  player: string;
  minute: string;
  penalty: boolean;
  ownGoal: boolean;
  team: 1 | 2;
}

export interface PairScore {
  home: number;
  away: number;
}

export interface WorldCupMatch {
  id: string;
  /** Source match number when the dataset provides one. */
  num: number | null;
  round: string;
  roundId: KnockoutRoundId | 'group';
  group: string | null;
  date: string;
  kickoff: string | null;
  timeLabel: string;
  ground: string | null;
  team1: WorldCupTeam;
  team2: WorldCupTeam;
  ht: PairScore | null;
  ft: PairScore | null;
  et: PairScore | null;
  shootout: PairScore | null;
  goals: WorldCupGoal[];
  /** 'finished' when the dataset provides a full-time score, else 'scheduled'. */
  status: 'finished' | 'scheduled';
  /** Deciding score: extra time when played, otherwise full time. */
  decided: PairScore | null;
  /** 1 = team1, 2 = team2, null when the match does not decide a winner. */
  winner: 1 | 2 | null;
  /** e.g. "FT", "a.e.t.", "Pens 4-3" — derived from the real score only. */
  detail: string;
  /**
   * Ids of the two matches that feed this one, resolved from actual results
   * (the match each participant won). Entries are null when the feeder cannot
   * be resolved — e.g. the preceding match is not decided yet. Never guessed.
   */
  feederIds: [string | null, string | null] | null;
}

export interface GroupRow {
  team: WorldCupTeam;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface GroupTable {
  id: string;
  name: string;
  /** True when every match in this group has a result. */
  complete: boolean;
  rows: GroupRow[];
}

export interface ScorerRow {
  rank: number;
  player: string;
  team: WorldCupTeam | null;
  goals: number;
  penalties: number;
}

export interface TeamStatRow {
  team: WorldCupTeam;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  cleanSheets: number;
}

export interface WorldCupTournament {
  name: string;
  sourceUrl: string;
  /** All normalized matches, in dataset order. */
  matches: WorldCupMatch[];
  groupMatches: WorldCupMatch[];
  knockout: {
    r32: WorldCupMatch[];
    r16: WorldCupMatch[];
    qf: WorldCupMatch[];
    sf: WorldCupMatch[];
    third: WorldCupMatch[];
    final: WorldCupMatch[];
  };
  groups: GroupTable[];
  teams: WorldCupTeam[];
  scorers: ScorerRow[];
  teamStats: TeamStatRow[];
  /** Champion team, derived from a decided final only — never predicted. */
  champion: WorldCupTeam | null;
  thirdPlace: WorldCupTeam | null;
  completeness: {
    totalMatches: number;
    finishedMatches: number;
    scheduledMatches: number;
    groupMatchesTotal: number;
    groupMatchesFinished: number;
    allGroupMatchesFinished: boolean;
    finalDecided: boolean;
  };
}

/* ============================================================
   Round classification
   ============================================================ */

export const KNOCKOUT_ROUNDS: Array<{ id: KnockoutRoundId; label: string; short: string }> = [
  { id: 'r32', label: 'Round of 32', short: 'R32' },
  { id: 'r16', label: 'Round of 16', short: 'R16' },
  { id: 'qf', label: 'Quarter-finals', short: 'QF' },
  { id: 'sf', label: 'Semi-finals', short: 'SF' },
  { id: 'third', label: 'Third-place play-off', short: '3rd' },
  { id: 'final', label: 'Final', short: 'F' },
];

export function classifyRound(round: string): KnockoutRoundId | 'group' {
  const r = (round || '').trim().toLowerCase();
  if (r.includes('round of 32')) return 'r32';
  if (r.includes('round of 16')) return 'r16';
  if (r.includes('quarter')) return 'qf';
  if (r.includes('semi')) return 'sf';
  if (r.includes('third') || r.includes('3rd')) return 'third';
  if (r.includes('final')) return 'final';
  return 'group';
}

/* ============================================================
   Team name normalization
   ============================================================ */

/**
 * Dataset team names that differ from the names registered in the local logo
 * mapping. Exact, verified aliases only — never fuzzy matching.
 */
const DATASET_NAME_ALIASES: Record<string, string> = {
  'Bosnia & Herzegovina': 'Bosnia and Herzegovina',
  'Cape Verde': 'Cabo Verde',
  'Ivory Coast': "Côte d'Ivoire",
};

const teamCache = new Map<string, WorldCupTeam>();

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeTeam(name: string): WorldCupTeam {
  const cached = teamCache.get(name);
  if (cached) return cached;

  const logoName = DATASET_NAME_ALIASES[name] ?? name;
  // Exact lookup through the existing local-logo resolution: a logo is only
  // attached when the file actually exists in the manifest.
  const asset = findLogoAsset({ name: logoName });
  const team: WorldCupTeam = {
    id: toSlug(name),
    name,
    shortName: name.slice(0, 3).toUpperCase(),
    logo: asset ? asset.path : null,
  };
  teamCache.set(name, team);
  return team;
}

/* ============================================================
   Date / time normalization
   ============================================================ */

/**
 * Parse the dataset's "13:00 UTC-6" style time label into a UTC ISO string.
 * Returns null when the date is missing or unparseable — no guess is made.
 */
export function parseKickoff(date: string, time?: string): string | null {
  if (!date) return null;
  const base = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(base.getTime())) return null;
  if (!time) return base.toISOString();

  const m = /^(\d{1,2}):(\d{2})(?:\s*UTC([+-])(\d{1,2})(?::(\d{2}))?)?/i.exec(time.trim());
  if (!m) return base.toISOString();

  let hours = Number(m[1]);
  const minutes = Number(m[2]);
  if (m[3]) {
    const sign = m[3] === '-' ? 1 : -1; // local = UTC + offset  =>  UTC = local - offset
    const offsetHours = Number(m[4]);
    const offsetMinutes = m[5] ? Number(m[5]) : 0;
    const totalMinutes = (hours * 60 + minutes) + sign * (offsetHours * 60 + offsetMinutes);
    const utc = new Date(base.getTime() + totalMinutes * 60_000);
    return Number.isNaN(utc.getTime()) ? null : utc.toISOString();
  }
  const utc = new Date(base.getTime() + (hours * 60 + minutes) * 60_000);
  return Number.isNaN(utc.getTime()) ? null : utc.toISOString();
}

/* ============================================================
   Match normalization
   ============================================================ */

function toPair(value: [number, number] | undefined): PairScore | null {
  if (!Array.isArray(value) || value.length !== 2) return null;
  const home = Number(value[0]);
  const away = Number(value[1]);
  if (!Number.isFinite(home) || !Number.isFinite(away)) return null;
  return { home, away };
}

export function normalizeMatch(raw: RawMatch, index: number): WorldCupMatch {
  const team1 = normalizeTeam(raw.team1);
  const team2 = normalizeTeam(raw.team2);
  const ht = toPair(raw.score?.ht);
  const ft = toPair(raw.score?.ft);
  const et = toPair(raw.score?.et);
  const shootout = toPair(raw.score?.p);

  const roundId = classifyRound(raw.round);
  const status: WorldCupMatch['status'] = ft ? 'finished' : 'scheduled';
  const decided = et ?? ft;

  let winner: 1 | 2 | null = null;
  if (decided) {
    if (decided.home > decided.away) winner = 1;
    else if (decided.away > decided.home) winner = 2;
    else if (shootout) {
      if (shootout.home > shootout.away) winner = 1;
      else if (shootout.away > shootout.home) winner = 2;
    }
    // A level match with no shootout stays undecided — never guessed.
  }

  let detail = 'Scheduled';
  if (status === 'finished') {
    if (shootout) detail = `Pens ${shootout.home}-${shootout.away}`;
    else if (et) detail = 'a.e.t.';
    else detail = 'FT';
  }

  const goals: WorldCupGoal[] = [
    ...(raw.goals1 || []).map((g) => ({ player: g.name, minute: g.minute ?? '', penalty: !!g.penalty, ownGoal: !!g.ownGoal, team: 1 as const })),
    ...(raw.goals2 || []).map((g) => ({ player: g.name, minute: g.minute ?? '', penalty: !!g.penalty, ownGoal: !!g.ownGoal, team: 2 as const })),
  ];

  return {
    id: raw.num != null ? `wc2026-${raw.num}` : `wc2026-idx-${index}`,
    num: raw.num ?? null,
    round: raw.round,
    roundId,
    group: raw.group ?? null,
    date: raw.date,
    kickoff: parseKickoff(raw.date, raw.time),
    timeLabel: raw.time ?? '',
    ground: raw.ground ?? null,
    team1,
    team2,
    ht,
    ft,
    et,
    shootout,
    goals,
    status,
    decided,
    winner,
    detail,
    feederIds: null,
  };
}

const ROUND_ORDER: KnockoutRoundId[] = ['r32', 'r16', 'qf', 'sf', 'final'];

function winningSide(match: WorldCupMatch): WorldCupTeam | null {
  if (!match.winner) return null;
  return match.winner === 1 ? match.team1 : match.team2;
}

function losingSide(match: WorldCupMatch): WorldCupTeam | null {
  if (!match.winner) return null;
  return match.winner === 1 ? match.team2 : match.team1;
}

/**
 * Resolve bracket progression from actual results.
 *
 * For every knockout match after the Round of 32, each participant is matched
 * to the earlier-round match that team WON. The third-place play-off is fed by
 * the two semi-final LOSERS. When a participant has no resolvable feeder (the
 * earlier match is undecided), the slot stays null — nothing is guessed.
 *
 * Positional pairing is deliberately NOT used: verification against the real
 * dataset showed the published bracket order does not follow simple index
 * pairing, so results are the only reliable link.
 */
function resolveFeederIds(matches: WorldCupMatch[]): void {
  const byRound = new Map<KnockoutRoundId, WorldCupMatch[]>();
  for (const roundId of ROUND_ORDER) {
    byRound.set(roundId, matches.filter((m) => m.roundId === roundId));
  }

  // team id -> match id that produced this team as a winner
  let winners = new Map<string, string>();
  for (const roundId of ROUND_ORDER) {
    const roundMatches = byRound.get(roundId) ?? [];
    const nextWinners = new Map<string, string>();

    for (const match of roundMatches) {
      if (roundId === 'r32') {
        match.feederIds = null; // entry round: fed by the group stage
      } else {
        match.feederIds = [
          winners.get(match.team1.id) ?? null,
          winners.get(match.team2.id) ?? null,
        ];
      }
      const winner = winningSide(match);
      if (winner) nextWinners.set(winner.id, match.id);
    }

    // Losers of the round feed the third-place play-off (single match).
    const third = (byRound.get('third') ?? [])[0];
    if (third && third.feederIds === null) {
      const loserSources = roundMatches
        .map((m) => ({ match: m, loser: losingSide(m) }))
        .filter((x) => x.loser);
      third.feederIds = [
        loserSources.find((x) => x.loser!.id === third.team1.id)?.match.id ?? null,
        loserSources.find((x) => x.loser!.id === third.team2.id)?.match.id ?? null,
      ];
    }

    winners = nextWinners;
  }
}

/* ============================================================
   Derived statistics
   ============================================================ */

export function computeGroups(matches: WorldCupMatch[]): GroupTable[] {
  const byGroup = new Map<string, WorldCupMatch[]>();
  for (const m of matches) {
    if (!m.group) continue;
    const list = byGroup.get(m.group) ?? [];
    list.push(m);
    byGroup.set(m.group, list);
  }

  const tables: GroupTable[] = [];
  for (const [name, list] of [...byGroup.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const rows = new Map<string, GroupRow>();
    for (const m of list) {
      for (const side of [1, 2] as const) {
        const team = side === 1 ? m.team1 : m.team2;
        if (!rows.has(team.id)) {
          rows.set(team.id, {
            team, played: 0, wins: 0, draws: 0, losses: 0,
            goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
          });
        }
      }
      if (!m.decided) continue; // incomplete match: no result counted
      const home = rows.get(m.team1.id)!;
      const away = rows.get(m.team2.id)!;
      home.played += 1;
      away.played += 1;
      home.goalsFor += m.decided.home;
      home.goalsAgainst += m.decided.away;
      away.goalsFor += m.decided.away;
      away.goalsAgainst += m.decided.home;
      if (m.decided.home > m.decided.away) { home.wins += 1; away.losses += 1; home.points += 3; }
      else if (m.decided.away > m.decided.home) { away.wins += 1; home.losses += 1; away.points += 3; }
      else { home.draws += 1; away.draws += 1; home.points += 1; away.points += 1; }
    }

    const sorted = [...rows.values()]
      .map((r) => ({ ...r, goalDifference: r.goalsFor - r.goalsAgainst }))
      // Calculated tiebreakers: points, goal difference, goals scored.
      // Head-to-head is not applied — the dataset does not provide it.
      .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);

    tables.push({
      id: toSlug(name),
      name,
      complete: list.every((m) => m.status === 'finished'),
      rows: sorted,
    });
  }
  return tables;
}

export function computeScorers(matches: WorldCupMatch[]): ScorerRow[] {
  const byPlayer = new Map<string, { player: string; team: WorldCupTeam | null; goals: number; penalties: number }>();
  for (const m of matches) {
    for (const goal of m.goals) {
      const team = goal.team === 1 ? m.team1 : m.team2;
      const key = `${goal.player.toLowerCase()}|${team.id}`;
      const row = byPlayer.get(key) ?? { player: goal.player, team, goals: 0, penalties: 0 };
      row.goals += 1;
      if (goal.penalty) row.penalties += 1;
      byPlayer.set(key, row);
    }
  }
  return [...byPlayer.values()]
    .sort((a, b) => b.goals - a.goals || a.player.localeCompare(b.player))
    .map((r, i) => ({ rank: i + 1, ...r }));
}

export function computeTeamStats(matches: WorldCupMatch[]): TeamStatRow[] {
  const byTeam = new Map<string, {
    team: WorldCupTeam; played: number; wins: number; draws: number; losses: number;
    goalsFor: number; goalsAgainst: number; cleanSheets: number;
  }>();
  for (const m of matches) {
    for (const side of [1, 2] as const) {
      const team = side === 1 ? m.team1 : m.team2;
      if (!byTeam.has(team.id)) {
        byTeam.set(team.id, { team, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, cleanSheets: 0 });
      }
    }
    if (!m.decided) continue;
    const home = byTeam.get(m.team1.id)!;
    const away = byTeam.get(m.team2.id)!;
    home.played += 1;
    away.played += 1;
    home.goalsFor += m.decided.home;
    home.goalsAgainst += m.decided.away;
    away.goalsFor += m.decided.away;
    away.goalsAgainst += m.decided.home;
    if (m.decided.away === 0) home.cleanSheets += 1;
    if (m.decided.home === 0) away.cleanSheets += 1;
    if (m.decided.home > m.decided.away) { home.wins += 1; away.losses += 1; }
    else if (m.decided.away > m.decided.home) { away.wins += 1; home.losses += 1; }
    else { home.draws += 1; away.draws += 1; }
  }
  return [...byTeam.values()]
    .map((r) => ({ ...r, goalDifference: r.goalsFor - r.goalsAgainst }))
    .sort((a, b) => b.goalsFor - a.goalsFor || b.goalDifference - a.goalDifference);
}

/* ============================================================
   Tournament assembly (pure)
   ============================================================ */

export function buildTournament(raw: RawWorldCup, sourceUrl: string): WorldCupTournament {
  const matches = raw.matches.map(normalizeMatch);
  resolveFeederIds(matches);
  const knockout = {
    r32: matches.filter((m) => m.roundId === 'r32'),
    r16: matches.filter((m) => m.roundId === 'r16'),
    qf: matches.filter((m) => m.roundId === 'qf'),
    sf: matches.filter((m) => m.roundId === 'sf'),
    third: matches.filter((m) => m.roundId === 'third'),
    final: matches.filter((m) => m.roundId === 'final'),
  };

  const finalMatch = knockout.final[0] ?? null;
  const champion = finalMatch?.winner
    ? (finalMatch.winner === 1 ? finalMatch.team1 : finalMatch.team2)
    : null;
  const thirdMatch = knockout.third[0] ?? null;
  const thirdPlace = thirdMatch?.winner
    ? (thirdMatch.winner === 1 ? thirdMatch.team1 : thirdMatch.team2)
    : null;

  const groupMatches = matches.filter((m) => m.roundId === 'group');

  const teamMap = new Map<string, WorldCupTeam>();
  for (const m of matches) {
    teamMap.set(m.team1.id, m.team1);
    teamMap.set(m.team2.id, m.team2);
  }

  return {
    name: raw.name,
    sourceUrl,
    matches,
    groupMatches,
    knockout,
    groups: computeGroups(matches),
    teams: [...teamMap.values()].sort((a, b) => a.name.localeCompare(b.name)),
    scorers: computeScorers(matches),
    teamStats: computeTeamStats(matches),
    champion,
    thirdPlace,
    completeness: {
      totalMatches: matches.length,
      finishedMatches: matches.filter((m) => m.status === 'finished').length,
      scheduledMatches: matches.filter((m) => m.status === 'scheduled').length,
      groupMatchesTotal: groupMatches.length,
      groupMatchesFinished: groupMatches.filter((m) => m.status === 'finished').length,
      allGroupMatchesFinished: groupMatches.length > 0 && groupMatches.every((m) => m.status === 'finished'),
      finalDecided: !!finalMatch?.winner,
    },
  };
}

/**
 * Validate bracket progression resolved from results.
 *
 * Checks, for every knockout match after the Round of 32:
 *   - each participant resolves to exactly one feeder match it won (when the
 *     preceding round is decided), and
 *   - no single match feeds two different matches.
 * Unresolved feeders are only allowed while a feeder match is undecided.
 * Used by verification — the UI never depends on pairing to display data.
 */
export function validateBracketProgression(tournament: WorldCupTournament): {
  ok: boolean;
  checks: Array<{ round: string; match: string; issue: string }>;
} {
  const issues: Array<{ round: string; match: string; issue: string }> = [];
  const feederUse = new Map<string, number>();

  for (const roundId of ROUND_ORDER) {
    for (const match of tournament.knockout[roundId]) {
      if (roundId === 'r32') continue;
      const feeders = match.feederIds ?? [null, null];
      for (const feederId of feeders) {
        if (!feederId) continue;
        feederUse.set(feederId, (feederUse.get(feederId) ?? 0) + 1);
      }
      if (match.status === 'finished') {
        const missing = feeders.filter((f) => !f).length;
        if (missing > 0) {
          issues.push({
            round: match.round,
            match: `${match.team1.name} vs ${match.team2.name}`,
            issue: `${missing} participant(s) without resolvable feeder in a finished match`,
          });
        }
      }
    }
  }

  for (const [feederId, count] of feederUse) {
    if (count > 1) {
      const feeder = tournament.matches.find((m) => m.id === feederId);
      issues.push({
        round: feeder?.round ?? '?',
        match: feeder ? `${feeder.team1.name} vs ${feeder.team2.name}` : feederId,
        issue: `feeds ${count} different matches`,
      });
    }
  }

  return { ok: issues.length === 0, checks: issues };
}
