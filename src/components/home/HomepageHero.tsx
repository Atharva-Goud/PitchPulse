'use client';

import ContainerScroll from '@/components/home/ContainerScroll';
import MatchCard from '@/components/football/MatchCard';
import NewsCard from '@/components/news/NewsCard';
import { Badge } from '@/components/ui';
import EmptyState from '@/components/ui/EmptyState';
import FallbackImage from '@/components/ui/Image';
import Link from 'next/link';
import type { NormalizedMatch } from '@/lib/football/types';
import type { NewsArticle, Competition } from '@/types';

interface HomepageHeroProps {
  data: {
    liveMatches: NormalizedMatch[];
    upcomingMatches: NormalizedMatch[];
    news: NewsArticle[];
    competitions: Competition[];
  };
}

export default function HomepageHero({ data }: HomepageHeroProps) {
  const { liveMatches, upcomingMatches, news, competitions } = data;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const todaysMatches = upcomingMatches.filter(m => {
    const matchDate = new Date(m.kickoff);
    matchDate.setHours(0, 0, 0, 0);
    return matchDate.getTime() === today.getTime();
  }).slice(0, 6);

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

  return (
    <ContainerScroll titleComponent={heroTitle}>{heroPreview}</ContainerScroll>
  );
}