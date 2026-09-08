'use client';

import { Clock, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { getFreshnessLabel, getFreshnessColor } from '@/lib/engine/freshness';
import { getVerificationBadge, getConfidenceLabel } from '@/lib/engine/credibility';
import { FreshnessStatus, Verification, VerificationLevel } from '@/lib/schemas/enhanced';

interface Props {
  source: {
    name: string;
    url?: string;
    type?: string;
    credibilityScore?: number;
  };
  publishedAt: string;
  freshness?: {
    status: FreshnessStatus;
    ageMinutes: number;
  };
  verification?: Verification;
  showConfidence?: boolean;
  compact?: boolean;
}

export default function SourceBadge({
  source,
  publishedAt,
  freshness,
  verification,
  showConfidence = false,
  compact = false,
}: Props) {
  const freshnessLabel = freshness ? getFreshnessLabel(freshness.status) : '';
  const freshnessColor = freshness ? getFreshnessColor(freshness.status) : '';
  const verificationBadge = verification ? getVerificationBadge(verification) : null;
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };
  
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>{source.name}</span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatTime(publishedAt)}
        </span>
        {verificationBadge && (
          <span className={`px-1.5 py-0.5 rounded text-xs ${verificationBadge.color}`}>
            {verificationBadge.icon}
          </span>
        )}
      </div>
    );
  }
  
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1"
          >
            {source.name}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-sm text-slate-300">{source.name}</span>
        )}
      </div>
      
      {freshness && (
        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${freshnessColor}`}>
          {freshnessLabel}
        </span>
      )}
      
      {verificationBadge && (
        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${verificationBadge.color}`}>
          {verificationBadge.label}
        </span>
      )}
      
      {showConfidence && verification && (
        <span className="text-xs text-slate-400">
          Confidence: {getConfidenceLabel(verification.confidenceScore)}
        </span>
      )}
      
      <div className="flex items-center gap-1 text-xs text-slate-400">
        <Clock className="h-3 w-3" />
        <span>{formatTime(publishedAt)}</span>
      </div>
    </div>
  );
}