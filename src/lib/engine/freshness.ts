import { FreshnessStatus, Freshness } from '@/lib/schemas/enhanced';

export interface FreshnessResult {
  status: FreshnessStatus;
  ageMinutes: number;
  label: string;
  color: string;
  priority: number;
}

export function calculateFreshness(
  publishedAt: string,
  lastUpdated: string,
  now: Date = new Date()
): FreshnessResult {
  const publishedTime = new Date(publishedAt).getTime();
  const updatedTime = new Date(lastUpdated).getTime();
  const nowTime = now.getTime();
  
  const ageMinutes = Math.floor((nowTime - publishedTime) / 60000);
  const minutesSinceUpdate = Math.floor((nowTime - updatedTime) / 60000);
  
  if (ageMinutes < 0) {
    return {
      status: 'breaking',
      ageMinutes: 0,
      label: 'Just now',
      color: 'text-red-500',
      priority: 1,
    };
  }
  
  if (ageMinutes < 30) {
    return {
      status: 'breaking',
      ageMinutes,
      label: formatAgeLabel(ageMinutes),
      color: 'text-red-500',
      priority: 1,
    };
  }
  
  if (ageMinutes < 180) {
    return {
      status: 'very_fresh',
      ageMinutes,
      label: formatAgeLabel(ageMinutes),
      color: 'text-emerald-400',
      priority: 2,
    };
  }
  
  if (ageMinutes < 720) {
    return {
      status: 'recent',
      ageMinutes,
      label: formatAgeLabel(ageMinutes),
      color: 'text-blue-400',
      priority: 3,
    };
  }
  
  if (ageMinutes < 1440) {
    return {
      status: 'today',
      ageMinutes,
      label: 'Earlier today',
      color: 'text-slate-400',
      priority: 4,
    };
  }
  
  if (ageMinutes < 4320) {
    return {
      status: 'recent_days',
      ageMinutes,
      label: formatDaysLabel(ageMinutes),
      color: 'text-slate-500',
      priority: 5,
    };
  }
  
  if (minutesSinceUpdate > 1440) {
    return {
      status: 'stale',
      ageMinutes,
      label: 'Outdated',
      color: 'text-amber-500',
      priority: 7,
    };
  }
  
  return {
    status: 'archived',
    ageMinutes,
    label: formatDaysLabel(ageMinutes),
    color: 'text-slate-600',
    priority: 6,
  };
}

export function isDataFresh(
  publishedAt: string,
  threshold: 'breaking' | 'very_fresh' | 'recent' | 'today' = 'today'
): boolean {
  const freshness = calculateFreshness(publishedAt, publishedAt);
  const thresholds: Record<string, number> = {
    breaking: 1,
    very_fresh: 2,
    recent: 3,
    today: 4,
  };
  
  return freshness.priority <= thresholds[threshold];
}

export function shouldDisplayInLatest(publishedAt: string): boolean {
  return isDataFresh(publishedAt, 'today');
}

export function shouldDisplayInBreaking(publishedAt: string): boolean {
  return isDataFresh(publishedAt, 'very_fresh');
}

export function getFreshnessLabel(status: FreshnessStatus): string {
  const labels: Record<FreshnessStatus, string> = {
    breaking: 'BREAKING',
    very_fresh: 'JUST IN',
    recent: 'RECENT',
    today: 'TODAY',
    older_today: 'EARLIER',
    recent_days: 'THIS WEEK',
    archived: 'OLDER',
    stale: 'OUTDATED',
  };
  return labels[status];
}

export function getFreshnessColor(status: FreshnessStatus): string {
  const colors: Record<FreshnessStatus, string> = {
    breaking: 'bg-red-500/20 text-red-400 border-red-500/30',
    very_fresh: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    recent: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    today: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    older_today: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    recent_days: 'bg-slate-600/20 text-slate-500 border-slate-600/30',
    archived: 'bg-slate-700/20 text-slate-600 border-slate-700/30',
    stale: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
  };
  return colors[status];
}

function formatAgeLabel(minutes: number): string {
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDaysLabel(minutes: number): string {
  const days = Math.floor(minutes / 1440);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  return `${weeks} weeks ago`;
}

export function createFreshnessObject(
  publishedAt: string,
  lastUpdated?: string
): Freshness {
  const result = calculateFreshness(publishedAt, lastUpdated || publishedAt);
  return {
    status: result.status,
    ageMinutes: result.ageMinutes,
    publishedAt,
    lastUpdated: lastUpdated || publishedAt,
  };
}