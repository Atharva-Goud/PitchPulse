import { Source, VerificationLevel, Verification, SourceReference } from '@/lib/schemas/enhanced';

export interface CredibilityResult {
  score: number;
  level: VerificationLevel;
  reasons: string[];
  tier: 'official' | 'trusted' | 'established' | 'unverified';
}

export function calculateCredibility(
  sources: SourceReference[],
  sourceRegistry: Map<string, Source>
): CredibilityResult {
  if (sources.length === 0) {
    return {
      score: 0,
      level: 'unverified',
      reasons: ['No sources provided'],
      tier: 'unverified',
    };
  }

  const reasons: string[] = [];
  let baseScore = 0;
  const verifiedSources: SourceReference[] = [];

  for (const source of sources) {
    const registeredSource = sourceRegistry.get(source.id);
    
    if (registeredSource) {
      baseScore = Math.max(baseScore, registeredSource.credibilityScore);
      verifiedSources.push(source);
      
      if (registeredSource.type === 'official') {
        reasons.push('Official source');
      } else if (registeredSource.type === 'journalist' && registeredSource.verified) {
        reasons.push(`Reported by verified journalist (${registeredSource.name})`);
      } else if (registeredSource.type === 'publication') {
        reasons.push(`Published by ${registeredSource.name}`);
      }
    } else {
      reasons.push('Source not in verified registry');
    }
  }

  if (verifiedSources.length > 1) {
    const bonus = Math.min(verifiedSources.length * 5, 15);
    baseScore = Math.min(100, baseScore + bonus);
    reasons.push(`Confirmed by ${verifiedSources.length} sources`);
  }

  const tier = determineTier(baseScore, verifiedSources, sourceRegistry);
  const level = determineLevel(baseScore, verifiedSources.length);

  return {
    score: baseScore,
    level,
    reasons,
    tier,
  };
}

function determineTier(
  score: number,
  sources: SourceReference[],
  sourceRegistry: Map<string, Source>
): 'official' | 'trusted' | 'established' | 'unverified' {
  const hasOfficial = sources.some(s => {
    const registered = sourceRegistry.get(s.id);
    return registered?.type === 'official';
  });

  if (hasOfficial) return 'official';
  if (score >= 90) return 'trusted';
  if (score >= 70) return 'established';
  return 'unverified';
}

function determineLevel(score: number, sourceCount: number): VerificationLevel {
  if (score >= 100) return 'official';
  if (sourceCount >= 3 && score >= 85) return 'multiple_sources';
  if (score >= 85) return 'trusted_journalist';
  if (sourceCount >= 2 && score >= 70) return 'single_source';
  if (score >= 60) return 'single_source';
  return 'rumour';
}

export function createVerification(
  sources: SourceReference[],
  sourceRegistry: Map<string, Source>
): Verification {
  const result = calculateCredibility(sources, sourceRegistry);
  const confirmedBy = sources
    .filter(s => {
      const registered = sourceRegistry.get(s.id);
      return registered?.type === 'official';
    })
    .map(s => s.name);

  return {
    level: result.level,
    sources,
    confidenceScore: result.score,
    confidenceReasons: result.reasons,
    confirmedBy,
    verificationCount: sources.length,
  };
}

export function isTransferConfirmed(verification: Verification): boolean {
  return verification.level === 'official' && verification.confidenceScore === 100;
}

export function getConfidenceLabel(score: number): string {
  if (score >= 95) return 'Very High';
  if (score >= 85) return 'High';
  if (score >= 70) return 'Moderate';
  if (score >= 50) return 'Low';
  return 'Very Low';
}

export function getConfidenceColor(score: number): string {
  if (score >= 95) return 'bg-emerald-500/20 text-emerald-400';
  if (score >= 85) return 'bg-blue-500/20 text-blue-400';
  if (score >= 70) return 'bg-amber-500/20 text-amber-400';
  if (score >= 50) return 'bg-orange-500/20 text-orange-400';
  return 'bg-red-500/20 text-red-400';
}

export function getVerificationBadge(verification: Verification): {
  label: string;
  color: string;
  icon: string;
} {
  switch (verification.level) {
    case 'official':
      return {
        label: 'OFFICIAL',
        color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        icon: '✓',
      };
    case 'multiple_sources':
      return {
        label: 'VERIFIED',
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: '✓✓',
      };
    case 'trusted_journalist':
      return {
        label: 'TRUSTED',
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        icon: '★',
      };
    case 'single_source':
      return {
        label: 'REPORTED',
        color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        icon: '•',
      };
    case 'rumour':
      return {
        label: 'RUMOUR',
        color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        icon: '?',
      };
    default:
      return {
        label: 'UNVERIFIED',
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: '!',
      };
  }
}

export function canDisplayAsConfirmed(verification: Verification): boolean {
  return verification.level === 'official' && verification.confirmedBy.length > 0;
}

export function requiresDisclaimer(verification: Verification): boolean {
  return verification.level === 'rumour' || verification.confidenceScore < 70;
}

export function getDisclaimerText(verification: Verification): string | null {
  if (verification.level === 'official') return null;
  
  if (verification.level === 'rumour') {
    return 'This is an unconfirmed rumour. No official announcement has been made.';
  }
  
  if (verification.confidenceScore < 70) {
    return 'This report has not been independently verified by official sources.';
  }
  
  if (verification.level === 'single_source') {
    return `Reported by ${verification.sources[0]?.name || 'a single source'}. Awaiting confirmation.`;
  }
  
  return null;
}