'use client';

import { useEffect, useState, useMemo } from 'react';
import { Trophy, Clock, MapPin, Calendar, ArrowLeft, Zap, ShieldAlert, RefreshCw } from 'lucide-react';
import { getMatchWithLeague, getRawFixtureById, getRecentMatchesByTeam } from '@/lib/football/matches';
import { getCompetitionConfig, getCompetitionKeyFromSlug } from '@/lib/football/competitions';
import {
  fetchMatchKeyEvents,
  fetchMatchEvents,
  fetchMatchStatistics,
  type ApiEvent,
  type CompetitionKey,
} from '@/lib/football/api';
import TeamLogo from '@/components/football/TeamLogo';
import MatchEvents from '@/components/football/MatchEvents';
import MatchStatistics, { type TeamStatistic } from '@/components/football/MatchStatistics';
import MatchInsights from '@/components/football/MatchInsights';
import TeamForm from '@/components/football/TeamForm';
import {
  formatKickoffTime,
  formatKickoffDate,
  formatMinute,
  type NormalizedMatch,
} from '@/lib/football/types';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui';

interface MatchDetailClientProps {
  params: Promise<{ id: string }>;
}

export default function MatchDetailClient({ params }: MatchDetailClientProps) {
  const [matchId, setMatchId] = useState<string | null>(null);
  const [match, setMatch] = useState<NormalizedMatch | null>(null);
  const [leagueSlug, setLeagueSlug] = useState<string | null>(null);
  const [leagueKey, setLeagueKey] = useState<CompetitionKey | null>(null);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [statistics, setStatistics] = useState<TeamStatistic[]>([]);
  const [homeForm, setHomeForm] = useState<NormalizedMatch[]>([]);
  const [awayForm, setAwayForm] = useState<NormalizedMatch[]>([]);
  const [eventsError, setEventsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    params.then((p) => setMatchId(p.id));
  }, [params]);

  useEffect(() => {
    if (!matchId) return;

    async function loadMatch() {
      try {
        setLoading(true);
        setError(null);
        setEventsError(false);
        const result = await getMatchWithLeague(matchId!);
        if (!result) {
          setError('Match not found');
          return;
        }
        setMatch(result.match);
        setLeagueSlug(result.league);
        setLeagueKey(getCompetitionKeyFromSlug(result.league));

        const [rawFixture, keyEvents, matchEvents, stats, homeRecent, awayRecent] = await Promise.all([
          getRawFixtureById(matchId!),
          fetchMatchKeyEvents(result.league, matchId!),
          fetchMatchEvents(result.league, matchId!),
          fetchMatchStatistics(result.league, matchId!),
          getRecentMatchesByTeam(result.match.homeTeam.id, 5),
          getRecentMatchesByTeam(result.match.awayTeam.id, 5),
        ]);
        setEvents(matchEvents.length > 0 ? matchEvents : keyEvents);
        setStatistics(stats);
        setHomeForm(homeRecent);
        setAwayForm(awayRecent);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error loading match:', err);
        setError('Unable to load match details. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadMatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  if (loading) {
    return (
      <div className="rounded-xl card-base p-8">
        <LoadingState variant="list" count={4} />
      </div>
    );
  }

  if (error || !match) {
    return (
      <ErrorState
        message={error || 'Match not found'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const competition = leagueKey ? getCompetitionConfig(leagueKey) : null;
  const isLive = match.status === 'LIVE' || match.status === 'HALFTIME';
  const isFinished = match.status === 'FINISHED';
  const isScheduled = match.status === 'SCHEDULED';

  // Period display for live matches
  const periodLabel = useMemo(() => {
    if (!isLive) return null;
    const clock = match.statusClock;
    const period = match.statusDisplayClock;
    if (match.status === 'HALFTIME') return 'HT';
    if (period && period.includes('+')) return period; // e.g., "45+2'"
    if (clock != null) {
      if (clock <= 45) return `1H ${clock}'`;
      if (clock <= 90) return `2H ${clock - 45}'`;
      return `${clock}'`;
    }
    return 'LIVE';
  }, [isLive, match.status, match.statusClock, match.statusDisplayClock]);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <a
        href="/matches"
        className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Match Centre
      </a>

      {/* MATCH HEADER */}
      <div className={`rounded-2xl border overflow-hidden relative ${isLive ? 'border-red-500/30 bg-gradient-to-b from-red-500/5 via-slate-900/60 to-slate-900/60' : 'border-white/10 bg-slate-900/60'}`}>
        {/* Live banner for live matches */}
        {isLive && (
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" aria-hidden="true" />
        )}

        <div className="p-6 pb-4 relative z-10">
          <div className="flex flex-col items-center gap-4">
            {/* Competition badge */}
            {competition && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Trophy className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                <span>{competition.name}</span>
                <span className="text-slate-600">|</span>
                <span>{competition.country}</span>
              </div>
            )}

            {/* Prominent Live Indicator */}
            {isLive && (
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 animate-pulse">
                <span className="relative flex h-3 w-3" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-sm text-red-400 font-bold tracking-wide">LIVE</span>
                {periodLabel && (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                    {periodLabel}
                  </span>
                )}
              </div>
            )}

            {/* Finished badge */}
            {isFinished && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-white/10">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">FT</span>
              </div>
            )}

            {/* Scheduled badge */}
            {isScheduled && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wide">Upcoming</span>
              </div>
            )}

            {/* Teams and Score */}
            <div className="w-full flex flex-col items-center gap-6">
              {/* Home team */}
              <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                <TeamLogo team={match.homeTeam} size="xl" />
                <span className="text-lg font-semibold text-white text-center leading-tight">
                  {match.homeTeam.name}
                </span>
              </div>

              {/* Score - Large, prominent */}
              <div className="flex items-center gap-6">
                <div className="text-6xl sm:text-7xl font-bold text-white tabular-nums font-mono leading-none">
                  {match.homeScore ?? '-'}
                </div>
                <div className="flex flex-col items-center gap-1">
                  {isLive ? (
                    <>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">VS</span>
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                        </span>
                        <span className="text-xs text-red-400 font-bold font-mono tabular-nums">
                          {periodLabel || formatMinute(match)}
                        </span>
                      </div>
                    </>
                  ) : isFinished ? (
                    <>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">FT</span>
                      <span className="text-xs text-slate-600 font-medium">Full Time</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">VS</span>
                      <span className="text-xs text-slate-600 font-medium">{formatKickoffTime(match.kickoff)}</span>
                    </>
                  )}
                </div>
                <div className="text-6xl sm:text-7xl font-bold text-white tabular-nums font-mono leading-none">
                  {match.awayScore ?? '-'}
                </div>
              </div>

              {/* Away team */}
              <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                <TeamLogo team={match.awayTeam} size="xl" />
                <span className="text-lg font-semibold text-white text-center leading-tight">
                  {match.awayTeam.name}
                </span>
              </div>
            </div>

            {/* Status line */}
            <div className="flex items-center gap-2 text-sm">
              {isLive && (
                <span className="flex items-center gap-1.5 text-red-400 font-medium">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                  {periodLabel || formatMinute(match)}
                </span>
              )}
              {isFinished && (
                <span className="text-slate-400">Full Time</span>
              )}
              {isScheduled && (
                <span className="text-slate-400">Kickoff {formatKickoffTime(match.kickoff)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Meta info bar */}
        <div className="border-t border-white/10 px-6 py-4 bg-slate-900/40">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {formatKickoffDate(match.kickoff)} at {formatKickoffTime(match.kickoff)}
            </span>
            {match.venue && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {match.venue}
              </span>
            )}
            {match.referee && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Referee: {match.referee}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Live Event Feed - Shows latest events first for live matches */}
      {isLive && events.length > 0 && (
        <LiveEventFeed
          events={events}
          homeTeam={match.homeTeam.name}
          awayTeam={match.awayTeam.name}
          lastUpdated={lastUpdated}
        />
      )}

      {/* Match Moments — generated from real event data + statistics */}
      <MatchInsights
        events={events}
        homeTeam={match.homeTeam.name}
        awayTeam={match.awayTeam.name}
        homeScore={match.homeScore}
        awayScore={match.awayScore}
        status={match.status}
        statistics={statistics}
      />

      {/* Event timeline */}
      <MatchEvents
        events={events}
        homeTeam={match.homeTeam.name}
        awayTeam={match.awayTeam.name}
        liveMode={isLive}
      />

      {/* Team Form - only for finished matches */}
      {(isFinished || isLive) && (homeForm.length > 0 || awayForm.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          <TeamForm
            matches={homeForm}
            teamId={match.homeTeam.id}
            teamName={match.homeTeam.name}
            teamLogo={match.homeTeam.logo}
            label="Home Form"
          />
          <TeamForm
            matches={awayForm}
            teamId={match.awayTeam.id}
            teamName={match.awayTeam.name}
            teamLogo={match.awayTeam.logo}
            label="Away Form"
          />
        </div>
      )}

      {/* Box score statistics */}
      <MatchStatistics statistics={statistics} />
    </div>
  );
}

/* Live Event Feed Component - Shows recent events prominently for live matches */
function LiveEventFeed({
  events,
  homeTeam,
  awayTeam,
  lastUpdated,
}: {
  events: ApiEvent[];
  homeTeam: string;
  awayTeam: string;
  lastUpdated: Date;
}) {
  const sorted = useMemo(() => {
    return [...events]
      .map((e, idx) => ({
        ...e,
        _minute: e.minute ?? 0,
        _id: `evt-${idx}-${e.minute ?? 0}-${e.type}`,
      }))
      .sort((a, b) => b._minute - a._minute); // Latest first for live feed
  }, [events]);

  const recentEvents = sorted.slice(0, 5);

  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-red-500/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Live Events</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
          </span>
          Updated {lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      <div className="divide-y divide-red-500/10">
        {recentEvents.map((event, index) => {
          const isHome = event.team === 'home';
          const isAway = event.team === 'away';
          const teamName = isHome ? homeTeam : isAway ? awayTeam : null;
          const eventType = classifyEvent(event.type, event.team);
          return (
            <div
              key={event._id || `${index}-${event._minute}`}
              className="flex items-center gap-4 px-6 py-3 hover:bg-red-500/5 transition-colors"
            >
              <div className="flex flex-col items-center w-14 flex-shrink-0">
                <span className="text-sm font-bold text-white tabular-nums">
                  {event.displayMinute || (event._minute != null ? `${event._minute}'` : "—")}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center w-8 flex-shrink-0">
                <EventIcon type={eventType} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white">
                    {eventLabel(eventType, event.type)}
                  </span>
                  {teamName && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        isHome
                          ? 'bg-blue-500/10 text-blue-300'
                          : isAway
                          ? 'bg-orange-500/10 text-orange-300'
                          : 'bg-slate-700/50 text-slate-400'
                      }`}
                    >
                      {teamName}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {event.player ? event.player : <span className="text-slate-500">—</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Event classification for live feed
function classifyEvent(type: string, team: 'home' | 'away' | null): MatchEventType {
  const t = (type || '').toLowerCase();
  if (t.includes('own goal') || t.includes('own-goal')) return 'goal_own';
  if (t.includes('goal')) return 'goal';
  if (t.includes('red card') || t.includes('redcard')) return 'red';
  if (t.includes('yellow card') || t.includes('yellowcard')) return 'yellow';
  if (t.includes('penalty')) return 'penalty';
  if (t.includes('var')) return 'var';
  if (t.includes('substitution') || t.includes('sub')) return 'substitution';
  return 'other';
}

type MatchEventType = 'goal' | 'goal_own' | 'yellow' | 'red' | 'substitution' | 'penalty' | 'var' | 'other';

function EventIcon({ type }: { type: MatchEventType }) {
  const cls = 'h-4 w-4 flex-shrink-0';
  switch (type) {
    case 'goal':
      return <span className={cls} style={{ color: '#22c55e' }}>⚽</span>;
    case 'goal_own':
      return <span className={cls} style={{ color: '#f97316' }}>⚽</span>;
    case 'yellow':
      return <span className={cls} style={{ color: '#eab308' }}>🟨</span>;
    case 'red':
      return <span className={cls} style={{ color: '#ef4444' }}>🟥</span>;
    case 'penalty':
      return <span className={cls} style={{ color: '#a855f7' }}>🎯</span>;
    case 'var':
      return <span className={cls} style={{ color: '#3b82f6' }}>📹</span>;
    case 'substitution':
      return <span className={cls} style={{ color: '#60a5fa' }}>🔄</span>;
    default:
      return <span className={cls} style={{ color: '#94a3b8' }}>•</span>;
  }
}

function eventLabel(type: MatchEventType, rawType: string): string {
  if (rawType && rawType.trim()) return rawType;
  switch (type) {
    case 'goal': return 'Goal';
    case 'goal_own': return 'Own Goal';
    case 'yellow': return 'Yellow Card';
    case 'red': return 'Red Card';
    case 'penalty': return 'Penalty';
    case 'var': return 'VAR Review';
    case 'substitution': return 'Substitution';
    default: return 'Event';
  }
}