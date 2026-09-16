'use client';

import { useMemo } from 'react';
import { MapPin, Calendar, Users, Trophy, ChevronRight, ExternalLink, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import MatchCard from '@/components/football/MatchCard';
import { normalizeLegacyMatch } from '@/lib/football/types';
import NewsCard from '@/components/news/NewsCard';
import TransferCard from '@/components/transfers/TransferCard';
import EmptyState from '@/components/ui/EmptyState';
import TeamLogo from '@/components/football/TeamLogo';
import TeamForm from '@/components/football/TeamForm';
import { Team, Match, NewsArticle, Transfer } from '@/types';

interface TeamPageClientProps {
  data: {
    team: Team | null;
    matches: Match[];
    news: NewsArticle[];
    transfers: Transfer[];
    standingsPosition: { rank: number; points: number; played: number } | null;
  };
  teamId: string;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function TeamPageClient({ data, teamId }: TeamPageClientProps) {
  const { team, matches, news, transfers, standingsPosition } = data;

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState type="teams" message="Team not found" />
      </div>
    );
  }

  const upcomingMatches = useMemo(() =>
    matches.filter(m => m.status === 'SCHEDULED').slice(0, 5), [matches]);
  const recentResults = useMemo(() =>
    matches.filter(m => m.status === 'FINISHED').slice(0, 5), [matches]);

  const hasUpcoming = upcomingMatches.length > 0;
  const hasResults = recentResults.length > 0;
  const hasNews = news.length > 0;
  const hasTransfers = transfers.length > 0;
  const hasStandings = standingsPosition !== null;

  return (
    <div className="min-h-screen">
      {/* Team Header */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative h-32 w-32 sm:h-36 sm:w-36 flex-shrink-0">
              <TeamLogo team={team} size="xl" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-400 mb-1">
                <Link href="/teams" className="hover:text-white transition-colors">Teams</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-white font-medium">{team.name}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{team.name}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-emerald-400" />
                  {team.league}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {team.country}
                </span>
                {team.founded && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Founded {team.founded}
                  </span>
                )}
              </div>
              {/* League Position Badge */}
              {hasStandings && (
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                    <Target className="h-4 w-4" />
                    <span>{ordinal(standingsPosition.rank)}</span>
                    <span className="text-slate-400">|</span>
                    <span>{standingsPosition.points} pts</span>
                    <span className="text-slate-400">|</span>
                    <span>{standingsPosition.played} played</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {team.stadium && (
            <div className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-white/10">
              <div className="flex items-center gap-4">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <div>
                  <div className="font-medium text-white">{team.stadium}</div>
                  {team.capacity && (
                    <div className="text-sm text-slate-400">
                      Capacity: {team.capacity.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Content */}
          <div className="space-y-10">
            {/* Form Section - Only for teams with finished matches */}
            {(hasResults || hasUpcoming) && (
              <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  Current Form
                </h2>
                <TeamForm
                  matches={matches.map(normalizeLegacyMatch)}
                  teamId={team.id}
                  teamName={team.name}
                  teamLogo={team.logo || ''}
                  label={team.name}
                />
              </section>
            )}

            {/* Upcoming Matches */}
            {hasUpcoming && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-400" />
                    Upcoming Matches
                  </h2>
                  <Link
                    href="/fixtures"
                    className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    View all
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {upcomingMatches.map((match) => (
                    <MatchCard key={match.id} match={normalizeLegacyMatch(match)} variant="default" hideFooter />
                  ))}
                </div>
              </section>
            )}

            {/* Recent Results */}
            {hasResults && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-emerald-400" />
                    Recent Results
                  </h2>
                  <Link
                    href="/matches"
                    className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    View all
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {recentResults.map((match) => (
                    <MatchCard key={match.id} match={normalizeLegacyMatch(match)} variant="default" hideFooter />
                  ))}
                </div>
              </section>
            )}

            {/* Latest News */}
            {hasNews && (
              <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-400" />
                  Latest News
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {news.slice(0, 4).map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* League Position Card */}
            {hasStandings && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-emerald-400" />
                  League Position
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-emerald-400">{ordinal(standingsPosition.rank)}</span>
                      <TeamLogo team={team} size="sm" />
                      <span className="font-medium text-white">{team.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{standingsPosition.points}</div>
                      <div className="text-xs text-slate-400">Points</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-white/10">
                      <div className="text-xl font-bold text-white">{standingsPosition.played}</div>
                      <div className="text-xs text-slate-400">Played</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-white/10">
                      <div className="text-xl font-bold text-emerald-400">{standingsPosition.rank <= 4 ? 'UCL' : standingsPosition.rank <= 6 ? 'UEL' : standingsPosition.rank >= 18 ? 'REL' : 'MID'}</div>
                      <div className="text-xs text-slate-400">Zone</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-white/10">
                      <div className="text-xl font-bold text-white">{standingsPosition.points > 0 ? '+' : ''}{standingsPosition.points}</div>
                      <div className="text-xs text-slate-400">Pts</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transfer Activity */}
            {hasTransfers && (
              <div className="rounded-xl bg-slate-900 border border-white/10 p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-400" />
                  Transfer Activity
                </h3>
                <div className="space-y-4">
                  {transfers.slice(0, 5).map((transfer) => (
                    <TransferCard key={transfer.id} transfer={transfer} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            {/* Team Info */}
            <div className="rounded-xl bg-slate-900 border border-white/10 p-6">
              <h3 className="font-semibold text-white mb-4">Club Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">League</span>
                  <span className="text-white">{team.league}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Country</span>
                  <span className="text-white">{team.country}</span>
                </div>
                {team.founded && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Founded</span>
                    <span className="text-white">{team.founded}</span>
                  </div>
                )}
                {team.stadium && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stadium</span>
                    <span className="text-white text-right">{team.stadium}</span>
                  </div>
                )}
                {team.capacity && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Capacity</span>
                    <span className="text-white">{team.capacity.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}