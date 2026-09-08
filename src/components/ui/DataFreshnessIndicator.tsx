'use client';

import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  status: 'FRESH' | 'STALE' | 'ERROR' | 'UNKNOWN';
  lastUpdated?: string;
  message?: string;
  compact?: boolean;
}

export default function DataFreshnessIndicator({ status, lastUpdated, message, compact = false }: Props) {
  const config = {
    FRESH: {
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      label: 'Up to date',
    },
    STALE: {
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      label: 'May be outdated',
    },
    ERROR: {
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      label: 'Update failed',
    },
    UNKNOWN: {
      icon: AlertCircle,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      label: 'Unknown status',
    },
  };
  
  const { icon: Icon, color, bg, label } = config[status];
  
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };
  
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs ${color}`}>
        <Icon className="h-3 w-3" />
        {label}
      </span>
    );
  }
  
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${bg}`}>
      <Icon className={`h-5 w-5 ${color}`} />
      <div>
        <div className={`text-sm font-medium ${color}`}>{label}</div>
        {lastUpdated && (
          <div className="text-xs text-slate-400 mt-0.5">
            Last updated: {formatLastUpdated(lastUpdated)}
          </div>
        )}
        {message && (
          <div className="text-xs text-slate-400 mt-0.5">{message}</div>
        )}
      </div>
    </div>
  );
}