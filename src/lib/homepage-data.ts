import { getLiveMatchList, getUpcomingMatchList, getRecentMatchList } from '@/lib/football/matches';
import { getLatestNews, getTrendingNews, getFeaturedNews } from '@/lib/data/news';
import { getTransferRumours, getConfirmedTransfers } from '@/lib/data/transfers';
import { getAllCompetitions } from '@/lib/data/competitions';
import { getAllTeams } from '@/lib/data/teams';
import type { NormalizedMatch } from '@/lib/football/types';
import type { NewsArticle, Transfer, Competition, Team } from '@/types';

export interface HomepageData {
  liveMatches: NormalizedMatch[];
  upcomingMatches: NormalizedMatch[];
  recentResults: NormalizedMatch[];
  news: NewsArticle[];
  trending: NewsArticle[];
  featuredNews: NewsArticle | null;
  transferRumours: Transfer[];
  confirmedTransfers: Transfer[];
  competitions: Competition[];
  teams: Team[];
}

export async function getHomepageData(): Promise<HomepageData> {
  const [
    liveMatches,
    upcomingMatches,
    recentResults,
    news,
    trending,
    featuredNews,
    transferRumours,
    confirmedTransfers,
    competitions,
    teams,
  ] = await Promise.all([
    getLiveMatchList(),
    getUpcomingMatchList(undefined, 30),
    getRecentMatchList(undefined, 30),
    getLatestNews(),
    getTrendingNews(),
    getFeaturedNews(),
    getTransferRumours(),
    getConfirmedTransfers(),
    getAllCompetitions(),
    getAllTeams(),
  ]);

  return {
    liveMatches,
    upcomingMatches,
    recentResults,
    news,
    trending,
    featuredNews,
    transferRumours,
    confirmedTransfers,
    competitions,
    teams,
  };
}