import { FreshnessStatus, Verification, TransferStatus } from '@/lib/schemas/enhanced';

export interface NewsArticleEnhanced {
  id: string;
  title: string;
  summary: string;
  source: {
    id: string;
    name: string;
    type: string;
    url: string;
    credibilityScore: number;
    publishedAt: string;
    discoveredAt: string;
  };
  verification: Verification;
  freshness: {
    status: FreshnessStatus;
    ageMinutes: number;
    publishedAt: string;
    lastUpdated: string;
  };
  dataStatus: 'FRESH' | 'STALE' | 'ERROR' | 'UNKNOWN';
  category: string;
  image?: string;
  originalUrl: string;
  relatedTeams?: string[];
  relatedPlayers?: string[];
}

export interface TransferEnhanced {
  id: string;
  player: {
    id: string;
    name: string;
    position: string;
    age: number;
    nationality: string;
    image: string;
  };
  fromClub: {
    id: string;
    name: string;
    logo: string;
  };
  toClub: {
    id: string;
    name: string;
    logo: string;
  } | null;
  status: TransferStatus;
  source: {
    id: string;
    name: string;
    type: string;
    url: string;
    credibilityScore: number;
    publishedAt: string;
    discoveredAt: string;
  };
  verification: Verification;
  freshness: {
    status: FreshnessStatus;
    ageMinutes: number;
    publishedAt: string;
    lastUpdated: string;
  };
  dataStatus: 'FRESH' | 'STALE' | 'ERROR' | 'UNKNOWN';
  fee: number | null;
}

export interface MatchEnhanced {
  id: string;
  competition: {
    id: string;
    name: string;
    logo: string;
  };
  homeTeam: {
    id: string;
    name: string;
    logo: string;
    score: number | null;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string;
    score: number | null;
  };
  status: 'SCHEDULED' | 'LIVE' | 'HALFTIME' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';
  kickoff: string;
  freshness: {
    status: FreshnessStatus;
    ageMinutes: number;
    publishedAt: string;
    lastUpdated: string;
  };
  source: {
    provider: string;
    type: 'official_api' | 'football_api' | 'verified_feed';
  };
  dataStatus: 'FRESH' | 'STALE' | 'ERROR' | 'UNKNOWN';
}