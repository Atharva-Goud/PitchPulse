import { z } from 'zod';

export const SourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['official', 'journalist', 'publication', 'social', 'wire_service']),
  category: z.string(),
  credibilityScore: z.number().min(0).max(100),
  verified: z.boolean(),
  enabled: z.boolean(),
  website: z.string().url().optional(),
  socialAccounts: z.array(z.object({
    platform: z.string(),
    handle: z.string(),
    verified: z.boolean().optional(),
  })).optional(),
  dataTypes: z.array(z.string()),
  refreshIntervalMinutes: z.number(),
  priority: z.number().min(1).max(4),
});

export const FreshnessStatusSchema = z.enum(['breaking', 'very_fresh', 'recent', 'today', 'older_today', 'recent_days', 'archived', 'stale']);

export const VerificationLevelSchema = z.enum(['official', 'multiple_sources', 'trusted_journalist', 'single_source', 'unverified', 'rumour']);

export const TransferStatusSchema = z.enum([
  'RUMOUR',
  'LINKED',
  'INTEREST',
  'TALKS',
  'NEGOTIATING',
  'ADVANCED',
  'AGREEMENT_REPORTED',
  'HIGH_CONFIDENCE_REPORT',
  'OFFICIALLY_CONFIRMED',
  'COMPLETED',
]);

export const SourceReferenceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  url: z.string().url(),
  credibilityScore: z.number().min(0).max(100),
  publishedAt: z.string().datetime(),
  discoveredAt: z.string().datetime(),
});

export const VerificationSchema = z.object({
  level: VerificationLevelSchema,
  sources: z.array(SourceReferenceSchema).min(1),
  confidenceScore: z.number().min(0).max(100),
  confidenceReasons: z.array(z.string()),
  confirmedBy: z.array(z.string()),
  verificationCount: z.number().min(0),
});

export const FreshnessSchema = z.object({
  status: FreshnessStatusSchema,
  ageMinutes: z.number().min(0),
  publishedAt: z.string().datetime(),
  lastUpdated: z.string().datetime(),
});

export const DataStatusSchema = z.enum(['FRESH', 'STALE', 'ERROR', 'UNKNOWN', 'UNVERIFIED']);

export const ScraperHealthSchema = z.object({
  scraperId: z.string(),
  status: z.enum(['SUCCESS', 'PARTIAL', 'FAILURE', 'UNKNOWN']),
  lastRun: z.string().datetime(),
  lastSuccessfulRun: z.string().datetime().optional(),
  itemsFound: z.number(),
  itemsAdded: z.number(),
  duplicatesRemoved: z.number(),
  errors: z.array(z.object({
    timestamp: z.string().datetime(),
    message: z.string(),
    code: z.string().optional(),
  })),
  nextScheduledRun: z.string().datetime().optional(),
});

export const NewsArticleEnhancedSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  source: SourceReferenceSchema,
  verification: VerificationSchema,
  freshness: FreshnessSchema,
  dataStatus: DataStatusSchema,
  category: z.string(),
  image: z.string().url().optional(),
  originalUrl: z.string().url(),
  relatedTeams: z.array(z.string()).optional(),
  relatedPlayers: z.array(z.string()).optional(),
});

export const TransferEnhancedSchema = z.object({
  id: z.string(),
  player: z.object({
    id: z.string(),
    name: z.string(),
    position: z.string(),
    age: z.number(),
    nationality: z.string(),
    image: z.string().url(),
  }),
  fromClub: z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string().url(),
  }),
  toClub: z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string().url(),
  }).nullable(),
  status: TransferStatusSchema,
  source: SourceReferenceSchema,
  verification: VerificationSchema,
  freshness: FreshnessSchema,
  dataStatus: DataStatusSchema,
  fee: z.number().nullable(),
  feeCurrency: z.string().optional(),
});

export const MatchEnhancedSchema = z.object({
  id: z.string(),
  competition: z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string().url(),
  }),
  homeTeam: z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string().url(),
    score: z.number().nullable(),
  }),
  awayTeam: z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string().url(),
    score: z.number().nullable(),
  }),
  status: z.enum(['SCHEDULED', 'LIVE', 'HALFTIME', 'FINISHED', 'POSTPONED', 'CANCELLED']),
  kickoff: z.string().datetime(),
  freshness: FreshnessSchema,
  source: z.object({
    provider: z.string(),
    type: z.enum(['official_api', 'football_api', 'verified_feed']),
  }),
  dataStatus: DataStatusSchema,
});

export type Source = z.infer<typeof SourceSchema>;
export type FreshnessStatus = z.infer<typeof FreshnessStatusSchema>;
export type VerificationLevel = z.infer<typeof VerificationLevelSchema>;
export type TransferStatus = z.infer<typeof TransferStatusSchema>;
export type SourceReference = z.infer<typeof SourceReferenceSchema>;
export type Verification = z.infer<typeof VerificationSchema>;
export type Freshness = z.infer<typeof FreshnessSchema>;
export type DataStatus = z.infer<typeof DataStatusSchema>;
export type ScraperHealth = z.infer<typeof ScraperHealthSchema>;
export type NewsArticleEnhanced = z.infer<typeof NewsArticleEnhancedSchema>;
export type TransferEnhanced = z.infer<typeof TransferEnhancedSchema>;
export type MatchEnhanced = z.infer<typeof MatchEnhancedSchema>;