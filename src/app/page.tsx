'use client';

import SectionHeader from '@/components/ui/SectionHeader';
import { GlowCard } from '@/components/ui/spotlight-card';
import NewsCard from '@/components/news/NewsCard';
import MatchCard from '@/components/matches/MatchCard';
import TransferCard from '@/components/transfers/TransferCard';
import ContainerScroll from '@/components/home/ContainerScroll';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import FallbackImage from '@/components/ui/Image';
import TeamLogo from '@/components/ui/TeamLogo';
import { getLatestNews, getTrendingNews } from '@/lib/data/news';
import { getLiveMatches, getUpcomingMatches, getRecentResults } from '@/lib/data/matches';
import { getTransferRumours, getConfirmedTransfers } from '@/lib/data/transfers';
import { getAllCompetitions } from '@/lib/data/competitions';
import { getAllTeams } from '@/lib/data/teams';
import { NewsArticle, Match, Transfer, Competition, Team } from '@/types';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [trending, setTrending] = useState<NewsArticle[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [recentResults, setRecentResults] = useState<Match[]>([]);
  const [transferRumours, setTransferRumours] = useState<Transfer[]>([]);
  const [confirmedTransfers, setConfirmedTransfers] = useState<Transfer[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          latestNews,
          trendingNews,
          live,
          upcoming,
          results,
          rumours,
          confirmed,
          comps,
          allTeams,
        ] = await Promise.all([
          getLatestNews(),
          getTrendingNews(),
          getLiveMatches(),
          getUpcomingMatches(),
          getRecentResults(),
          getTransferRumours(),
          getConfirmedTransfers(),
          getAllCompetitions(),
          getAllTeams(),
        ]);

        setNews(latestNews);
        setTrending(trendingNews);
        setLiveMatches(live);
        setUpcomingMatches(upcoming);
        setRecentResults(results);
        setTransferRumours(rumours);
        setConfirmedTransfers(confirmed);
        setCompetitions(comps);
        setTeams(allTeams);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <LoadingState variant="card" count={6} />
        </div>
      </div>
    );
  }

  const featuredCompetitions = competitions.slice(0, 6);

  const heroTitle = (
    <div className="max-w-2xl">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
        Football intelligence.
        <span className="block text-emerald-400">All in one place.</span>
      </h1>
      <p className="mt-6 text-lg text-slate-400">
        Stay ahead with real-time scores, breaking transfer news, and comprehensive match analysis from leagues around the world.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/news"
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
        >
          Latest News
        </Link>
        <Link
          href="/transfers"
          className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-medium rounded-lg transition-colors border border-white/20"
        >
          Transfer Centre
        </Link>
      </div>
    </div>
  );

  const heroPreview = (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-white/10 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-emerald-400">
            Live Now
          </span>
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        </div>
        {liveMatches[0] ? (
          <MatchCard match={liveMatches[0]} variant="live" />
        ) : (
          <div className="py-8 text-center text-sm text-slate-500">No live matches</div>
        )}
      </div>
      <div className="rounded-xl border border-white/10 bg-slate-900 p-6">
        <div className="mb-4 text-xs font-medium uppercase tracking-wide text-emerald-400">
          Latest News
        </div>
        <div className="space-y-3">
          {news.slice(0, 3).map((article) => (
            <NewsCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-950">
      <ContainerScroll titleComponent={heroTitle}>{heroPreview}</ContainerScroll>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Everything you need to stay ahead
          </h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
            Real-time scores, breaking transfers, and deep match analysis from leagues around the world.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <GlowCard className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Live Scores</h3>
            </div>
            <p className="text-sm text-slate-400">
              Follow every goal, card, and substitution as it happens from leagues around the world.
            </p>
          </GlowCard>
          <GlowCard className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Transfer Centre</h3>
            </div>
            <p className="text-sm text-slate-400">
              Track rumours, confirmations, and completed deals with reliability scoring and source context.
            </p>
          </GlowCard>
          <GlowCard className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Match Analysis</h3>
            </div>
            <p className="text-sm text-slate-400">
              Deep dive into fixtures, head-to-head records, and form trends before kickoff.
            </p>
          </GlowCard>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 space-y-12">
        {liveMatches.length > 0 && (
          <section>
            <SectionHeader title="Live Matches" href="/matches" actionLabel="All matches" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {liveMatches.slice(0, 3).map((match) => (
                <MatchCard key={match.id} match={match} variant="live" />
              ))}
            </div>
          </section>
        )}

        <section>
          <SectionHeader title="Latest News" href="/news" actionLabel="All news" />
          {news.length === 0 ? (
            <EmptyState type="news" />
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="lg:row-span-2">
                {news[0] && <NewsCard article={news[0]} variant="featured" />}
              </div>
              <div className="space-y-4">
                {news.slice(1, 5).map((article) => (
                  <NewsCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
            </div>
          )}
        </section>

        <section>
          <SectionHeader 
            title="Transfer Centre" 
            description="Latest moves and rumours"
            href="/transfers" 
            actionLabel="All transfers" 
          />
          {transferRumours.length === 0 && confirmedTransfers.length === 0 ? (
            <EmptyState type="transfers" />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {transferRumours.slice(0, 4).map((transfer) => (
                <TransferCard key={transfer.id} transfer={transfer} variant="compact" />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Upcoming Matches" href="/fixtures" actionLabel="All fixtures" />
          {upcomingMatches.length === 0 ? (
            <EmptyState
              type="matches"
              message="No upcoming fixtures"
              reason="The free football data plan only covers seasons 2022-2024, and the 2024 season ended in May 2025. No future fixtures exist in the available data yet."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingMatches.slice(0, 6).map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Recent Results" />
          {recentResults.length === 0 ? (
            <EmptyState
              type="matches"
              message="No recent results"
              reason="The free football data plan only covers seasons 2022-2024, so results shown are from the 2024 season (ended May 2025)."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentResults.slice(0, 6).map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Trending Stories" />
          {trending.length === 0 ? (
            <EmptyState type="news" message="No trending stories" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {trending.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Featured Competitions" href="/matches" actionLabel="All competitions" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {featuredCompetitions.map((competition) => (
              <Link
                key={competition.id}
                href={`/fixtures?competition=${competition.id}`}
                className="group p-4 rounded-lg bg-slate-900 border border-white/10 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <FallbackImage src={competition.logo} alt={competition.name} className="absolute inset-0" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                      {competition.shortName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{competition.country}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Popular Teams" href="/search" actionLabel="Search teams" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {teams.slice(0, 12).map((team) => (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
                className="group p-4 rounded-lg bg-slate-900 border border-white/10 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <TeamLogo team={team} size="lg" />
                  <div>
                    <h3 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                      {team.shortName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{team.league}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
