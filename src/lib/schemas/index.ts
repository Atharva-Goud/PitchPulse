import { z } from 'zod';

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  logo: z.string().nullable(),
  country: z.string(),
  league: z.string(),
  founded: z.number().optional(),
  stadium: z.string().optional(),
  capacity: z.number().optional(),
});

export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string(),
  age: z.number(),
  nationality: z.string(),
  image: z.string().nullable(),
  currentTeamId: z.string(),
});

export const CompetitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  logo: z.string().nullable(),
  country: z.string(),
  type: z.enum(['league', 'cup', 'international']),
});

export const SourceObjectSchema = z.object({
  name: z.string(),
  type: z.string().optional(),
  url: z.string().url().optional(),
  credibilityScore: z.number().optional(),
});

export const NewsArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  content: z.string().optional(),
  source: z.union([z.string(), SourceObjectSchema]),
  sourceUrl: z.string().url(),
  image: z.string().url().nullable(),
  category: z.enum([
    'Transfers',
    'Premier League',
    'Champions League',
    'La Liga',
    'Serie A',
    'Bundesliga',
    'Ligue 1',
    'International Football',
  ]),
  publishedAt: z.string().datetime(),
  relatedTeams: z.array(z.string()).optional(),
  relatedPlayers: z.array(z.string()).optional(),
  sourceName: z.string().optional(),
  originalUrl: z.string().url().optional(),
  discoveredAt: z.string().datetime().optional(),
  lastVerifiedAt: z.string().datetime().optional(),
  dataStatus: z.enum(['FRESH', 'STALE', 'ERROR', 'UNKNOWN', 'UNVERIFIED']).optional(),
  freshness: z.object({
    status: z.string(),
    ageMinutes: z.number(),
    publishedAt: z.string(),
    lastUpdated: z.string(),
  }).optional(),
  verification: z.object({
    level: z.string(),
    sources: z.array(z.any()),
    confidenceScore: z.number(),
    confidenceReasons: z.array(z.string()),
    confirmedBy: z.array(z.string()),
    verificationCount: z.number(),
  }).optional(),
});

export const TransferSchema = z.object({
  id: z.string(),
  player: PlayerSchema,
  fromClub: TeamSchema,
  toClub: TeamSchema.nullable(),
  status: z.enum(['Rumour', 'Advanced', 'Negotiating', 'Confirmed', 'Completed']),
  fee: z.number().nullable(),
  source: z.string(),
  reliability: z.number().min(0).max(100),
  updatedAt: z.string().datetime(),
});

export const MatchSchema = z.object({
  id: z.string(),
  competition: CompetitionSchema,
  homeTeam: TeamSchema,
  awayTeam: TeamSchema,
  homeScore: z.number().nullable(),
  awayScore: z.number().nullable(),
  status: z.enum(['SCHEDULED', 'LIVE', 'HALFTIME', 'FINISHED', 'POSTPONED', 'CANCELLED']),
  kickoff: z.string().datetime(),
  venue: z.string().optional(),
  referee: z.string().optional(),
  matchday: z.number().optional(),
});

export type Team = z.infer<typeof TeamSchema>;
export type Player = z.infer<typeof PlayerSchema>;
export type Competition = z.infer<typeof CompetitionSchema>;
export type NewsArticle = z.infer<typeof NewsArticleSchema>;
export type Transfer = z.infer<typeof TransferSchema>;
export type Match = z.infer<typeof MatchSchema>;

export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T[] {
  if (!Array.isArray(data)) {
    console.error('Expected array, got:', typeof data);
    return [];
  }

  const validItems: T[] = [];
  const errors: z.ZodError[] = [];

  for (const item of data) {
    const result = schema.safeParse(item);
    if (result.success) {
      validItems.push(result.data);
    } else {
      errors.push(result.error);
      console.warn('Validation failed for item:', item);
    }
  }

  if (errors.length > 0) {
    console.error(`${errors.length} items failed validation`);
  }

  return validItems;
}

export function validateSingle<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  console.error('Validation failed:', result.error);
  return null;
}