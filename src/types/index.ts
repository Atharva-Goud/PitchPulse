export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string | null;
  country: string;
  league: string;
  founded?: number;
  stadium?: string;
  capacity?: number;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  nationality: string;
  image: string | null;
  currentTeamId: string;
}

export interface Competition {
  id: string;
  name: string;
  shortName: string;
  logo: string | null;
  country: string;
  type: 'league' | 'cup' | 'international';
}

export interface SourceObject {
  name: string;
  type?: string;
  url?: string;
  credibilityScore?: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: string | SourceObject;
  sourceUrl: string;
  image: string | null;
  category: NewsCategory;
  publishedAt: string;
  relatedTeams?: string[];
  relatedPlayers?: string[];
  sourceName?: string;
  originalUrl?: string;
  discoveredAt?: string;
  lastVerifiedAt?: string;
  dataStatus?: 'FRESH' | 'STALE' | 'ERROR' | 'UNKNOWN' | 'UNVERIFIED';
  freshness?: {
    status: string;
    ageMinutes: number;
    publishedAt: string;
    lastUpdated: string;
  };
  verification?: {
    level: string;
    sources: any[];
    confidenceScore: number;
    confidenceReasons: string[];
    confirmedBy: string[];
    verificationCount: number;
  };
}

export type NewsCategory = 
  | 'Transfers'
  | 'Premier League'
  | 'Champions League'
  | 'La Liga'
  | 'Serie A'
  | 'Bundesliga'
  | 'Ligue 1'
  | 'International Football';

export interface Transfer {
  id: string;
  player: Player;
  fromClub: Team;
  toClub: Team | null;
  status: TransferStatus;
  fee: number | null;
  source: string;
  reliability: number;
  updatedAt: string;
}

export type TransferStatus = 
  | 'Rumour'
  | 'Advanced'
  | 'Negotiating'
  | 'Confirmed'
  | 'Completed';

export interface Match {
  id: string;
  competition: Competition;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  kickoff: string;
  venue?: string;
  referee?: string;
  matchday?: number;
}

export type MatchStatus = 
  | 'SCHEDULED'
  | 'LIVE'
  | 'HALFTIME'
  | 'FINISHED'
  | 'POSTPONED'
  | 'CANCELLED';

export interface SearchResult {
  type: 'teams' | 'players' | 'news' | 'transfers' | 'competitions';
  items: (Team | Player | NewsArticle | Transfer | Competition)[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type { Team as TeamType };
export type { Player as PlayerType };
export type { Competition as CompetitionType };
export type { NewsArticle as NewsArticleType };
export type { Transfer as TransferType };
export type { Match as MatchType };