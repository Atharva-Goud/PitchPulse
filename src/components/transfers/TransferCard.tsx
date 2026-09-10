'use client';

import { ArrowRight, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Transfer, TransferStatus } from '@/types';
import TeamLogo from '@/components/ui/TeamLogo';
import FallbackImage from '@/components/ui/Image';
import { resolveImageUrl } from '@/lib/utils/image';

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

// Transfer data is static (no live feed), so anything older than 30 days
// is historical, not current. Label it so it isn't mistaken for fresh news.
function isStaleTransfer(updatedAt: string): boolean {
  const ageMs = Date.now() - new Date(updatedAt).getTime();
  return ageMs > 30 * 24 * 60 * 60 * 1000;
}

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
    return `${diffDays}d ago`;
  };

  const status = transfer.status;
  const statusConfigItem = statusConfig[status];

  const playerImage = resolveImageUrl(transfer.player);
  const fromLogo = transfer.fromClub;
  const toLogo = transfer.toClub;

  return (
    <div className="rounded-xl overflow-hidden bg-slate-900 border border-white/10 hover:border-emerald-500/30 transition-colors">
      <div className="flex items-center gap-4 p-4">
        {playerImage && (
          <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800">
            <FallbackImage
              src={playerImage}
              alt={transfer.player.name}
              className="absolute inset-0"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white">{transfer.player.name}</h3>
          <p className="text-sm text-slate-400">{transfer.player.position} · {transfer.player.age}</p>

          <div className="mt-2 flex items-center gap-2">
            <TeamLogo team={fromLogo} size="sm" />
            <span className="text-xs text-slate-400">{fromLogo?.shortName || fromLogo?.name}</span>
            <ArrowRight className="h-4 w-4 text-slate-500" />
            <TeamLogo team={toLogo} size="sm" />
            <span className="text-xs text-slate-400">{toLogo?.shortName || toLogo?.name}</span>
          </div>

          <div className="mt-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${statusConfigItem.bgColor} ${statusConfigItem.color}`}>
              {statusConfigItem.icon}
              {status}
            </span>
            {isStaleTransfer(transfer.updatedAt) && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-slate-700/60 text-slate-400">
                <Clock className="h-3 w-3" />
                Historical
              </span>
            )}
          </div>

          {transfer.fee !== null && (
            <p className="mt-1 text-sm text-slate-400">{formatFee(transfer.fee)}</p>
          )}

          <div className="mt-1 text-xs text-slate-500">
            <span>{transfer.source}</span>
            <span> · </span>
            <span>{formatDate(transfer.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}