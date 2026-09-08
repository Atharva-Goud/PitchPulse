import { SourceReference, Verification, Freshness } from '@/lib/schemas/enhanced';
import { calculateFreshness, createFreshnessObject, shouldDisplayInLatest } from './freshness';
import { createVerification, canDisplayAsConfirmed, requiresDisclaimer } from './credibility';
import { getSourceRegistry, SourceRegistry } from './source-registry';

export * from './freshness';
export * from './credibility';
export * from './deduplication';
export * from './stale-data';
export * from './source-registry';

export interface ProcessedItem {
  id: string;
  verification: Verification;
  freshness: Freshness;
  isFresh: boolean;
  isConfirmed: boolean;
  needsDisclaimer: boolean;
  disclaimerText: string | null;
}

export function processItem(
  id: string,
  sources: SourceReference[],
  publishedAt: string,
  lastUpdated?: string
): ProcessedItem {
  const registry = getSourceRegistry();
  const registryMap = new Map(registry.getAllSources().map(s => [s.id, s]));
  
  const verification = createVerification(sources, registryMap);
  const freshness = createFreshnessObject(publishedAt, lastUpdated);
  
  const freshnessResult = calculateFreshness(publishedAt, lastUpdated || publishedAt);
  const isFresh = shouldDisplayInLatest(publishedAt);
  const isConfirmed = canDisplayAsConfirmed(verification);
  const needsDisclaimer = requiresDisclaimer(verification);
  
  let disclaimerText: string | null = null;
  if (verification.level === 'rumour') {
    disclaimerText = 'This is an unconfirmed rumour. No official announcement has been made.';
  } else if (verification.confidenceScore < 70) {
    disclaimerText = 'This report has not been independently verified by official sources.';
  }
  
  return {
    id,
    verification,
    freshness,
    isFresh,
    isConfirmed,
    needsDisclaimer,
    disclaimerText,
  };
}

export { SourceRegistry, getSourceRegistry };