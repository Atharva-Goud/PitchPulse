/**
 * Normalized match model used by the runtime match UI.
 *
 * This is intentionally separate from the sync-time `FootballMatch` in
 * scripts/fetchers/football-api.ts. It is the shape the match pages and
 * components consume, and it maps cleanly onto both worldcup26.ir
 * fixtures and the existing JSON-backed Match type.
 */

export type LiveStatus = 'LIVE' | 'HALFTIME' | 'SCHEDULED' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';

export interface NormalizedTeam {
  id: string;
  name: string;
  logo: string;
  abbreviation?: string;
}

export interface NormalizedMatch {
  id: string;
  homeTeam: NormalizedTeam;
  awayTeam: NormalizedTeam;
  homeScore: number | null;
  awayScore: number | null;
  status: LiveStatus;
  statusLabel: string;
  statusElapsed: number | null;
  statusClock: number | null;
  statusDisplayClock: string | null;
  league: { id: string; name: string; logo: string; country: string };
  kickoff: string;
  venue: string | null;
  referee: string | null;
}

const STATUS_MAP: Record<string, LiveStatus> = {
  STATUS_FULL_TIME: 'FINISHED',
  STATUS_MATCH_FINISHED: 'FINISHED',
  STATUS_POSTPONED: 'POSTPONED',
  STATUS_CANCELLED: 'CANCELLED',
  STATUS_SUSPENDED: 'POSTPONED',
  STATUS_SCHEDULED: 'SCHEDULED',
  STATUS_FIRST_HALF: 'LIVE',
  STATUS_HALF_TIME: 'HALFTIME',
  STATUS_SECOND_HALF: 'LIVE',
  STATUS_EXTRA_TIME: 'LIVE',
  STATUS_PENALTY_SHOOTOUT: 'LIVE',
  STATUS_HALF_TIME_BREAK: 'HALFTIME',
};

export function mapApiStatus(
  state?: string,
  name?: string,
  description?: string
): LiveStatus {
  if (name && STATUS_MAP[name]) return STATUS_MAP[name];
  if (state === 'post') return 'FINISHED';
  if (state === 'in') {
    if (description && /half.time|halftime|ht break|half-time break/i.test(description)) {
      return 'HALFTIME';
    }
    return 'LIVE';
  }
  return 'SCHEDULED';
}

export function statusLabel(status: LiveStatus): string {
  switch (status) {
    case 'LIVE':
      return 'LIVE';
    case 'HALFTIME':
      return 'HT';
    case 'FINISHED':
      return 'FT';
    case 'POSTPONED':
      return 'Postponed';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return 'Scheduled';
  }
}

export function normalizeApiFixture(f: {
  id: string;
  homeTeam: { id: string; name: string; logo: string; abbreviation?: string };
  awayTeam: { id: string; name: string; logo: string; abbreviation?: string };
  homeScore: number | null;
  awayScore: number | null;
  status: { type?: string; state?: string; description?: string; detail?: string };
  league: { id: string; name: string; logo: string; country: string };
  kickoff: string;
  venue: string | null;
  referee: string | null;
  statusClock?: number | null;
  statusDisplayClock?: string | null;
}): NormalizedMatch {
  const status = mapApiStatus(f.status?.state, f.status?.type, f.status?.description);
  return {
    id: f.id,
    homeTeam: f.homeTeam,
    awayTeam: f.awayTeam,
    homeScore: f.homeScore,
    awayScore: f.awayScore,
    status,
    statusLabel: statusLabel(status),
    statusElapsed: null,
    statusClock: f.statusClock ?? null,
    statusDisplayClock: f.statusDisplayClock ?? null,
    league: f.league,
    kickoff: f.kickoff,
    venue: f.venue,
    referee: f.referee,
  };
}

export function isLive(m: NormalizedMatch): boolean {
  return m.status === 'LIVE' || m.status === 'HALFTIME';
}

export function isFinished(m: NormalizedMatch): boolean {
  return m.status === 'FINISHED';
}

export function isScheduled(m: NormalizedMatch): boolean {
  return m.status === 'SCHEDULED';
}

/**
 * Convert the JSON-backed `Match` type (used by the team/news data layer)
 * into the NormalizedMatch shape consumed by the unified match card.
 *
 * This keeps the legacy data layer and the live football API layer on one
 * component without duplicating rendering logic.
 */
export function normalizeLegacyMatch(m: {
  id: string;
  homeTeam: { id: string; name: string; logo?: string | null; shortName?: string };
  awayTeam: { id: string; name: string; logo?: string | null; shortName?: string };
  homeScore: number | null;
  awayScore: number | null;
  status: LiveStatus;
  kickoff: string;
  venue?: string | null;
  referee?: string | null;
  league?: { id: string; name: string; logo?: string | null; country?: string };
  competition?: { id: string; name: string; logo?: string | null; country?: string };
}): NormalizedMatch {
  const league = m.league ?? m.competition ?? { id: '', name: '', logo: '', country: '' };
  return {
    id: m.id,
    homeTeam: { id: m.homeTeam.id, name: m.homeTeam.name, logo: m.homeTeam.logo ?? '', abbreviation: m.homeTeam.shortName },
    awayTeam: { id: m.awayTeam.id, name: m.awayTeam.name, logo: m.awayTeam.logo ?? '', abbreviation: m.awayTeam.shortName },
    homeScore: m.homeScore,
    awayScore: m.awayScore,
    status: m.status,
    statusLabel: statusLabel(m.status),
    statusElapsed: null,
    statusClock: null,
    statusDisplayClock: null,
    league: { id: league.id, name: league.name, logo: league.logo ?? '', country: league.country ?? '' },
    kickoff: m.kickoff,
    venue: m.venue ?? null,
    referee: m.referee ?? null,
  };
}

export function formatKickoffTime(kickoff: string): string {
  const date = new Date(kickoff);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function formatKickoffDate(kickoff: string): string {
  const date = new Date(kickoff);
  if (isNaN(date.getTime())) return '';
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return 'Today';
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function formatMinute(match: NormalizedMatch): string {
  if (match.status === 'FINISHED') return 'FT';
  if (match.status === 'HALFTIME') return 'HT';
  if (match.status === 'LIVE') {
    if (match.statusDisplayClock) return match.statusDisplayClock;
    if (match.statusClock != null) return String(match.statusClock) + "'";
  }
  if (match.status === 'SCHEDULED') return formatKickoffTime(match.kickoff);
  return match.statusLabel;
}