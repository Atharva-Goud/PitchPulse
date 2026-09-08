import { NewsArticleEnhanced, TransferEnhanced } from '@/lib/schemas/enhanced';

export interface DeduplicationResult<T> {
  unique: T[];
  duplicates: Array<{ item: T; duplicates: T[] }>;
}

export function deduplicateNews(
  articles: NewsArticleEnhanced[]
): DeduplicationResult<NewsArticleEnhanced> {
  const seen = new Map<string, NewsArticleEnhanced>();
  const duplicates: Array<{ item: NewsArticleEnhanced; duplicates: NewsArticleEnhanced[] }> = [];
  
  for (const article of articles) {
    const key = generateNewsKey(article);
    
    if (seen.has(key)) {
      const existing = seen.get(key)!;
      
      if (article.verification.confidenceScore > existing.verification.confidenceScore) {
        seen.set(key, article);
      }
    } else {
      seen.set(key, article);
    }
  }
  
  return {
    unique: Array.from(seen.values()),
    duplicates,
  };
}

export function deduplicateTransfers(
  transfers: TransferEnhanced[]
): DeduplicationResult<TransferEnhanced> {
  const seen = new Map<string, TransferEnhanced>();
  const duplicates: Array<{ item: TransferEnhanced; duplicates: TransferEnhanced[] }> = [];
  
  for (const transfer of transfers) {
    const key = generateTransferKey(transfer);
    
    if (seen.has(key)) {
      const existing = seen.get(key)!;
      
      if (transfer.verification.confidenceScore > existing.verification.confidenceScore) {
        seen.set(key, transfer);
      } else if (transfer.freshness.ageMinutes < existing.freshness.ageMinutes) {
        seen.set(key, transfer);
      }
    } else {
      seen.set(key, transfer);
    }
  }
  
  return {
    unique: Array.from(seen.values()),
    duplicates,
  };
}

function generateNewsKey(article: NewsArticleEnhanced): string {
  const normalizedTitle = normalizeText(article.title);
  const entities = [
    ...(article.relatedTeams || []),
    ...(article.relatedPlayers || []),
  ].sort().join('-');
  
  return `${normalizedTitle}-${entities}`;
}

function generateTransferKey(transfer: TransferEnhanced): string {
  const player = normalizeText(transfer.player.name);
  const fromClub = normalizeText(transfer.fromClub.name);
  const toClub = transfer.toClub ? normalizeText(transfer.toClub.name) : 'unknown';
  
  return `${player}-${fromClub}-${toClub}`;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 50);
}

export function calculateSimilarity(a: string, b: string): number {
  const normalizedA = normalizeText(a);
  const normalizedB = normalizeText(b);
  
  if (normalizedA === normalizedB) return 1;
  
  const longer = normalizedA.length > normalizedB.length ? normalizedA : normalizedB;
  const shorter = normalizedA.length > normalizedB.length ? normalizedB : normalizedA;
  
  if (longer.length === 0) return 1;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

export function findSimilarStories(
  article: NewsArticleEnhanced,
  allArticles: NewsArticleEnhanced[],
  threshold: number = 0.8
): NewsArticleEnhanced[] {
  return allArticles.filter(other => {
    if (other.id === article.id) return false;
    
    const similarity = calculateSimilarity(article.title, other.title);
    return similarity >= threshold;
  });
}