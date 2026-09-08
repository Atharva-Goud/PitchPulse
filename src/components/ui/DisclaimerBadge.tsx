'use client';

import { AlertTriangle, Info } from 'lucide-react';

interface Props {
  type: 'rumour' | 'unverified' | 'stale' | 'low_confidence';
  message: string;
  showIcon?: boolean;
  compact?: boolean;
}

export default function DisclaimerBadge({ type, message, showIcon = true, compact = false }: Props) {
  const colors = {
    rumour: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    unverified: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
    stale: 'bg-red-500/10 border-red-500/30 text-red-400',
    low_confidence: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
  };
  
  const icons = {
    rumour: AlertTriangle,
    unverified: AlertTriangle,
    stale: AlertTriangle,
    low_confidence: Info,
  };
  
  const Icon = icons[type];
  const colorClass = colors[type];
  
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${colorClass}`}>
        {showIcon && <Icon className="h-3 w-3" />}
        {message}
      </span>
    );
  }
  
  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg border ${colorClass}`}>
      {showIcon && <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />}
      <p className="text-sm">{message}</p>
    </div>
  );
}