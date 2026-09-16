'use client';

import SectionHeader from '@/components/ui/SectionHeader';
import { GlowCard } from '@/components/ui/spotlight-card';
import { Badge } from '@/components/ui';
import NewsCard from '@/components/news/NewsCard';
import TransferCard from '@/components/transfers/TransferCard';
import ContainerScroll from '@/components/home/ContainerScroll';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import FallbackImage from '@/components/ui/Image';
import TeamLogo from '@/components/ui/TeamLogo';
import FootballQuiz from '@/components/quiz/FootballQuiz';
import MatchCard from '@/components/football/MatchCard';
import { getTransferRumours, getConfirmedTransfers } from '@/lib/data/transfers';
import { getAllCompetitions } from '@/lib/data/competitions';
import { getAllTeams } from '@/lib/data/teams';
import { getLiveMatchList, getUpcomingMatchList, getRecentMatchList } from '@/lib/football/matches';
import { NewsArticle, Transfer, Competition, Team } from '@/types';
import type { NormalizedMatch } from '@/lib/football/types';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNewsRefresh } from '@/hooks/useNewsRefresh';
import { getLatestNewsSnapshot, getTrendingNewsSnapshot } from '@/lib/data/news';
import { format } from 'date-fns';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [trending, setTrending] = useState<NewsArticle[]>([]);
  const [liveMatches, setLiveMatches] = useState<NormalizedMatch[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<NormalizedMatch[]>([]);
  const [recentResults, setRecentResults] = useState<NormalizedMatch[]>([]);
  const [transferRumours, setTransferRumours] = useState<Transfer[]>([]);
  const [confirmedTransfers, setConfirmedTransfers] = useState<Transfer[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const initialLatest = getLatestNewsSnapshot();
  const initialTrending = getTrendingNewsSnapshot();
  const refresh = useNewsRefresh(initialLatest, initialTrending);

  useEffect(() => {
    async function loadData() {
      console.log('[HomePage] loadData started');
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
          Promise.resolve(refresh.latest),
          Promise.resolve(refresh.trending),
          getLiveMatchList(),
          getUpcomingMatchList(undefined, 30),
          getRecentMatchList(undefined, 30),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh.latest, refresh.trending]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container-page py-12">
          <LoadingState variant="card" count={6} />
        </div>
      </div>
    );
  }

  const featuredCompetitions = competitions.slice(0, 6);

  // Group upcoming matches by date for "Today" and "This Week"
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const todaysMatches = upcomingMatches.filter(m => {
    const matchDate = new Date(m.kickoff);
    matchDate.setHours(0, 0, 0, 0);
    return matchDate.getTime() === today.getTime();
  }).slice(0, 6);

  const thisWeeksMatches = upcomingMatches.filter(m => {
    const matchDate = new Date(m.kickoff);
    matchDate.setHours(0, 0, 0, 0);
    return matchDate > today && matchDate <= weekEnd;
  }).slice(0, 6);

  const laterMatches = upcomingMatches.filter(m => {
    const matchDate = new Date(m.kickoff);
    matchDate.setHours(0, 0, 0, 0);
    return matchDate > weekEnd;
  }).slice(0, 4);

  const heroTitle = (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6 animate-in stagger-1">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-[var(--primary)] text-sm font-medium">
          {liveMatches.length > 0 ? (
            <>
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span>{liveMatches.length} Live Now</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-[var(--text-muted)]" aria-hidden="true" />
              <span>No Live Matches</span>
            </>
          )}
        </div>
        {todaysMatches.length > 0 && (
          <span className="px-3 py-1 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] text-sm font-medium">
            {todaysMatches.length} Today
          </span>
        )}
      </div>
      <h1 className="text-display-lg animate-in stagger-2">
        Football intelligence.
        <span className="block text-gradient-brand">All in one place.</span>
      </h1>
      <p className="mt-6 text-lg text-[var(--text-secondary)] animate-in stagger-3">
        Real-time scores, breaking transfers, and deep match analysis from leagues worldwide.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 animate-in stagger-4">
        <Link href="/matches" className="btn-primary">
          Live Centre
        </Link>
        <Link href="/fixtures" className="btn-secondary">
          Fixtures
        </Link>
        <Link href="/standings" className="btn-accent">
          Standings
        </Link>
      </div>
    </div>
  );

  const heroPreview = (
    <div className="grid gap-6 md:grid-cols-2 animate-in stagger-5">
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)]/80 p-6 backdrop-blur-sm card-elevated">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-label">Live Now</span>
          <Badge variant="live" dot>
            {liveMatches.length} live
          </Badge>
        </div>
        {liveMatches[0] ? (
          <MatchCard match={liveMatches[0]} variant="live" />
        ) : (
          <EmptyState type="matches" message="No live matches at the moment" />
        )}
      </div>
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)]/80 p-6 backdrop-blur-sm card-elevated">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-label">Latest News</span>
          <Link href="/news" className="text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors">
            All news
          </Link>
        </div>
        <div className="space-y-3">
          {news.slice(0, 3).map((article, index) => (
            <div key={article.id} className="animate-in" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
              <NewsCard article={article} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Helper to render match grid with stagger
  const MatchGrid = ({ matches, variant = 'default', maxCols = 3, className = '' }: { matches: NormalizedMatch[]; variant?: 'default' | 'live' | 'compact'; maxCols?: number; className?: string }) => (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-${maxCols} ${className}`}>
      {matches.map((match, index) => (
        <div key={match.id} className="animate-in" style={{ animationDelay: `${index * 0.05}s` }}>
          <MatchCard match={match} variant={variant} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      <ContainerScroll titleComponent={heroTitle}>{heroPreview}</ContainerScroll>

      <div className="container-page py-12 space-y-12">
        {/* 1. Live Matches - most prominent when live */}
        {liveMatches.length > 0 && (
          <section className="animate-in stagger-1">
            <SectionHeader title="Live Now" href="/matches" actionLabel="All live matches" />
            <MatchGrid matches={liveMatches.slice(0, 3)} variant="live" maxCols={3} />
          </section>
        )}

        {/* 2. Today's Matches - high priority */}
        {todaysMatches.length > 0 && (
          <section className="animate-in stagger-2">
            <SectionHeader title="Today's Matches" href="/fixtures" actionLabel="All fixtures" />
            <MatchGrid matches={todaysMatches} variant="default" maxCols={3} />
          </section>
        )}

        {/* 3. This Week's Fixtures */}
        {(thisWeeksMatches.length > 0 || laterMatches.length > 0) && (
          <section className="animate-in stagger-3">
            <SectionHeader title="Upcoming Fixtures" href="/fixtures" actionLabel="All fixtures" />
            <div className="space-y-8">
              {thisWeeksMatches.length > 0 && (
                <div>
                  <h4 className="text-label mb-4 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent)] text-xs font-semibold">This Week</span>
                    {thisWeeksMatches.length} matches
                  </h4>
                  <MatchGrid matches={thisWeeksMatches} variant="default" maxCols={3} />
                </div>
              )}
              {laterMatches.length > 0 && (
                <div>
                  <h4 className="text-label mb-4 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[var(--text-muted)]/15 text-[var(--text-muted)] text-xs font-semibold">Later</span>
                    {laterMatches.length} matches
                  </h4>
                  <MatchGrid matches={laterMatches} variant="default" maxCols={2} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. League Standings - with top teams preview */}
        <section className="animate-in stagger-4">
          <SectionHeader title="League Standings" href="/standings" actionLabel="View all tables" />
          {competitions.length === 0 ? (
            <EmptyState type="matches" message="No competitions available" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {featuredCompetitions.map((competition, index) => (
                <Link
                  key={competition.id}
                  href={`/standings?competition=${competition.id}`}
                  className="group p-4 rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)]/70 backdrop-blur-sm card-hover animate-in"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="relative h-12 w-12 flex-shrink-0">
                      <FallbackImage src={competition.logo} alt={competition.name} className="absolute inset-0" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-[var(--primary)] transition-colors">
                        {competition.shortName}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{competition.country}</p>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                      Table
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 5. Latest News - featured + compact */}
        <section className="animate-in stagger-5">
          <SectionHeader title="Latest News" href="/news" actionLabel="All news" />
          {news.length === 0 ? (
            <EmptyState type="news" />
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="lg:row-span-2 animate-in stagger-1">
                {news[0] && <NewsCard article={news[0]} variant="featured" />}
              </div>
              <div className="space-y-4">
                {news.slice(1, 5).map((article, index) => (
                  <div key={article.id} className="animate-in" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
                    <NewsCard article={article} variant="compact" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 6. Transfer Centre - rumours + confirmed */}
        <section className="animate-in stagger-6">
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
              {[
                ...transferRumours.slice(0, 3),
                ...confirmedTransfers.slice(0, 1),
              ].map((transfer, index) => (
                <div key={transfer.id} className="animate-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <TransferCard transfer={transfer} variant="compact" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 7. Recent Results */}
        <section className="animate-in stagger-7">
          <SectionHeader title="Recent Results" href="/matches" actionLabel="All results" />
          {recentResults.length === 0 ? (
            <EmptyState
              type="matches"
              message="No recent results"
              reason="No completed matches found for the selected competitions."
            />
          ) : (
            <MatchGrid matches={recentResults.slice(0, 6)} variant="default" maxCols={3} />
          )}
        </section>

        {/* 8. Trending Stories */}
        <section className="animate-in stagger-8">
          <SectionHeader title="Trending Stories" href="/news" actionLabel="All news" />
          {trending.length === 0 ? (
            <EmptyState type="news" message="No trending stories" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {trending.map((article, index) => (
                <div key={article.id} className="animate-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <NewsCard article={article} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 9. Football Quiz - less prominent */}
        <section className="animate-in stagger-8">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[var(--border-default)] bg-gradient-to-r from-[var(--surface-2)]/80 to-[var(--surface-3)]/80 p-6 md:p-8 backdrop-blur-sm">
              <div className="text-center mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/15 text-[var(--primary)] mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Football Quiz</h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Test your knowledge with 5 questions from our pool.
                </p>
              </div>
              <FootballQuiz />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
