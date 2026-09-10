'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Trophy, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import MatchCard from '@/components/matches/MatchCard';
import NewsCard from '@/components/news/NewsCard';
import TransferCard from '@/components/transfers/TransferCard';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import TeamLogo from '@/components/ui/TeamLogo';
import { getTeamById, getTeamsByLeague } from '@/lib/data/teams';
import { getMatchesByTeam } from '@/lib/data/matches';
import { searchNews } from '@/lib/data/news';
import { getTransfersByClub } from '@/lib/data/transfers';
import { Team, Match, NewsArticle, Transfer } from '@/types';

interface Props {
  params: Promise<{ teamId: string }>;
}

export default function TeamPage({ params }: Props) {
  const [team, setTeam] = useState<Team | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setTeamId(p.teamId));
  }, [params]);

  useEffect(() => {
    async function loadData() {
      if (!teamId) return;
      try {
        const teamData = await getTeamById(teamId);
        if (!teamData) {
          setLoading(false);
          return;
        }
        setTeam(teamData);

        const [matchesData, newsData, transfersData] = await Promise.all([
          getMatchesByTeam(teamId),
          searchNews(teamData.name),
          getTransfersByClub(teamId),
        ]);

        setMatches(matchesData);
        setNews(newsData);
        setTransfers(transfersData);
      } catch (error) {
        console.error('Error loading team data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [teamId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <LoadingState variant="card" count={3} />
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-950 flex items-center justify-center">
        <EmptyState type="teams" message="Team not found" />
      </div>
    );
  }

  const upcomingMatches = matches.filter(m => m.status === 'SCHEDULED').slice(0, 3);
  const recentResults = matches.filter(m => m.status === 'FINISHED').slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-950">
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
<div className="relative h-32 w-32 flex-shrink-0">
            <TeamLogo team={team} size="xl" />
          </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                <Link href="/teams" className="hover:text-white transition-colors">Teams</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-white">{team.name}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{team.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Trophy className="h-4 w-4" />
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
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-400" />
                Upcoming Matches
              </h2>
              {upcomingMatches.length === 0 ? (
                <EmptyState type="matches" message="No upcoming matches" />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-emerald-400" />
                Recent Results
              </h2>
              {recentResults.length === 0 ? (
                <EmptyState type="matches" message="No recent results" />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recentResults.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-400" />
                Latest News
              </h2>
              {news.length === 0 ? (
                <EmptyState type="news" message="No recent news" />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {news.slice(0, 4).map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-8">
            <div className="rounded-xl bg-slate-900 border border-white/10 p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-400" />
                Transfer Activity
              </h3>
              {transfers.length === 0 ? (
                <p className="text-sm text-slate-400">No recent transfer activity</p>
              ) : (
                <div className="space-y-4">
                  {transfers.slice(0, 5).map((transfer) => (
                    <TransferCard key={transfer.id} transfer={transfer} variant="compact" />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl bg-slate-900 border border-white/10 p-6">
              <h3 className="font-semibold text-white mb-4">Team Info</h3>
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
