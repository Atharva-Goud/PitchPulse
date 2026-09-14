'use client';

import { useEffect, useState } from 'react';
import { Trophy, Clock, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { getMatchWithLeague, getRawFixtureById } from '@/lib/football/matches';
import { getCompetitionConfig, getCompetitionKeyFromSlug } from '@/lib/football/competitions';
import {
  fetchMatchKeyEvents,
  fetchMatchStatistics,
  type ApiEvent,
  type CompetitionKey,
} from '@/lib/football/api';
import TeamLogo from '@/components/football/TeamLogo';
import MatchEvents from '@/components/football/MatchEvents';
import MatchStatistics, { type TeamStatistic } from '@/components/football/MatchStatistics';
import MatchInsights from '@/components/football/MatchInsights';
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
  const [eventsError, setEventsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Load events + statistics in parallel. These are best-effort: if the
        // API doesn't provide them for this fixture we show a clean empty
        // state rather than an error.
        const [rawFixture, keyEvents, stats] = await Promise.all([
          getRawFixtureById(matchId!),
          fetchMatchKeyEvents(result.league, matchId!),
          fetchMatchStatistics(result.league, matchId!),
        ]);
        setEvents(keyEvents);
        setStatistics(stats);
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
      <div className="rounded-xl bg-slate-900 border border-white/10 p-8">
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

  return (
    <div className="space-y-6">
      {/* Back link */}
      <a
        href="/matches"
        className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Match Centre
      </a>

      {/* Header card */}
      <div className="rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col items-center gap-4">
            {/* Competition badge */}
            {competition && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Trophy className="h-4 w-4 text-emerald-400" />
                <span>{competition.name}</span>
                <span className="text-slate-600">|</span>
                <span>{competition.country}</span>
              </div>
            )}

            {/* Live indicator */}
            {isLive && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-xs text-red-400 font-semibold">LIVE</span>
              </div>
            )}

            {/* Teams and score */}
            <div className="w-full flex flex-col items-center gap-6">
              {/* Home team */}
              <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                <TeamLogo team={match.homeTeam} size="xl" />
                <span className="text-lg font-semibold text-white text-center">
                  {match.homeTeam.name}
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center gap-6">
                <div className="text-5xl sm:text-6xl font-bold text-white tabular-nums">
                  {match.homeScore ?? '-'}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm text-slate-500">VS</span>
                  <span className="text-xs text-slate-600">{formatMinute(match)}</span>
                </div>
                <div className="text-5xl sm:text-6xl font-bold text-white tabular-nums">
                  {match.awayScore ?? '-'}
                </div>
              </div>

              {/* Away team */}
              <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                <TeamLogo team={match.awayTeam} size="xl" />
                <span className="text-lg font-semibold text-white text-center">
                  {match.awayTeam.name}
                </span>
              </div>
            </div>

            {/* Status line */}
            <div className="flex items-center gap-2 text-sm">
              {isFinished ? (
                <span className="text-slate-400">Full Time</span>
              ) : isLive ? (
                <span className="text-red-400 font-medium">
                  {formatMinute(match)}
                </span>
              ) : (
                <span className="text-slate-400">Kickoff {formatKickoffTime(match.kickoff)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Meta info bar */}
        <div className="border-t border-white/10 px-6 py-4 bg-slate-900/40">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatKickoffDate(match.kickoff)} at {formatKickoffTime(match.kickoff)}
            </span>
            {match.venue && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {match.venue}
              </span>
            )}
            {match.referee && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Referee: {match.referee}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Match moments — generated from real event data */}
      <MatchInsights
        events={events}
        homeTeam={match.homeTeam.name}
        awayTeam={match.awayTeam.name}
        homeScore={match.homeScore}
        awayScore={match.awayScore}
        status={match.status}
      />

      {/* Event timeline */}
      <MatchEvents
        events={events}
        homeTeam={match.homeTeam.name}
        awayTeam={match.awayTeam.name}
      />

      {/* Box score statistics */}
      <MatchStatistics statistics={statistics} />
    </div>
  );
}