'use client';

import Image from 'next/image';
import { ArrowRight, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Transfer, TransferStatus } from '@/types';

interface Props {
  transfer: Transfer;
  variant?: 'default' | 'compact';
}

const statusConfig: Record<TransferStatus, { color: string; bgColor: string; icon: React.ReactNode }> = {
  Rumour: {
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  },
  Advanced: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    icon: <ArrowRight className="h-3.5 w-3.5" />,
  },
  Negotiating: {
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  Confirmed: {
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  Completed: {
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
};

export default function TransferCard({ transfer, variant = 'default' }: Props) {
  const formatFee = (fee: number | null) => {
    if (!fee) return 'Undisclosed';
    if (fee >= 1000000) {
      return `£${(fee / 1000000).toFixed(0)}m`;
    }
    return `£${fee.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const status = statusConfig[transfer.status];

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-slate-800 flex-shrink-0">
          <Image
            src={transfer.player.image}
            alt={transfer.player.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">{transfer.player.name}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${status.bgColor} ${status.color}`}>
              {status.icon}
              {transfer.status}
            </span>
          </div>
          <div className="text-sm text-slate-400 mt-0.5">
            {transfer.fromClub.name} → {transfer.toClub?.name || 'Unknown'}
          </div>
        </div>
        {transfer.fee && (
          <div className="text-sm font-medium text-emerald-400">
            {formatFee(transfer.fee)}
          </div>
        )}
      </div>
    );
  }

  return (
    <article className="group rounded-xl overflow-hidden bg-slate-900 border border-white/10 hover:border-emerald-500/30 transition-colors p-4">
      <div className="flex items-start gap-4">
        <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
          <Image
            src={transfer.player.image}
            alt={transfer.player.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
              {transfer.player.name}
            </h3>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
              {status.icon}
              {transfer.status}
            </span>
          </div>

          <div className="text-sm text-slate-400 mb-3">
            {transfer.player.position} · {transfer.player.age} years · {transfer.player.nationality}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-lg overflow-hidden bg-slate-800">
                <Image
                  src={transfer.fromClub.logo}
                  alt={transfer.fromClub.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="text-sm text-slate-300">{transfer.fromClub.shortName}</span>
            </div>
            
            <ArrowRight className="h-4 w-4 text-slate-500" />
            
            {transfer.toClub ? (
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 rounded-lg overflow-hidden bg-slate-800">
                  <Image
                    src={transfer.toClub.logo}
                    alt={transfer.toClub.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <span className="text-sm text-slate-300">{transfer.toClub.shortName}</span>
              </div>
            ) : (
              <span className="text-sm text-slate-500">Unknown</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {transfer.fee && (
            <div>
              <div className="text-xs text-slate-400">Fee</div>
              <div className="font-semibold text-emerald-400">{formatFee(transfer.fee)}</div>
            </div>
          )}
          <div>
            <div className="text-xs text-slate-400">Source</div>
            <div className="text-sm text-slate-300">{transfer.source}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Reliability</div>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    transfer.reliability >= 90 ? 'bg-emerald-500' : 
                    transfer.reliability >= 70 ? 'bg-blue-500' : 
                    transfer.reliability >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${transfer.reliability}%` }}
                />
              </div>
              <span className="text-sm text-slate-300">{transfer.reliability}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDate(transfer.updatedAt)}
        </span>
      </div>
    </article>
  );
}