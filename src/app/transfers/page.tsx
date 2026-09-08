'use client';

import { useState, useEffect } from 'react';
import { Filter, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import TransferCard from '@/components/transfers/TransferCard';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import { getTransferRumours, getConfirmedTransfers, getTransfersByStatus } from '@/lib/data/transfers';
import { Transfer, TransferStatus } from '@/types';

const statusFilters: { value: TransferStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Rumour', label: 'Rumours' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Negotiating', label: 'Negotiating' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Completed', label: 'Done Deals' },
];

export default function TransfersPage() {
  const [loading, setLoading] = useState(true);
  const [rumours, setRumours] = useState<Transfer[]>([]);
  const [confirmed, setConfirmed] = useState<Transfer[]>([]);
  const [activeTab, setActiveTab] = useState<'rumours' | 'confirmed'>('rumours');
  const [statusFilter, setStatusFilter] = useState<TransferStatus | 'all'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [rumoursData, confirmedData] = await Promise.all([
          getTransferRumours(),
          getConfirmedTransfers(),
        ]);
        setRumours(rumoursData);
        setConfirmed(confirmedData);
      } catch (error) {
        console.error('Error loading transfers:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const allTransfers = [...rumours, ...confirmed].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const filteredTransfers = statusFilter === 'all' 
    ? allTransfers 
    : allTransfers.filter(t => t.status === statusFilter);

  const displayedTransfers = activeTab === 'rumours' ? rumours : confirmed;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <LoadingState variant="list" count={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Transfer Centre</h1>
          <p className="text-slate-400">Track the latest transfer rumours and completed deals</p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex rounded-lg bg-slate-900 p-1 border border-white/10">
            <button
              onClick={() => setActiveTab('rumours')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'rumours'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Rumours & News
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'confirmed'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Confirmed Deals
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TransferStatus | 'all')}
              className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {statusFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeTab === 'rumours' && (
          <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-blue-500/10 border border-white/10">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-amber-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">Reliability Score</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Transfer rumours are scored based on source credibility. Higher scores indicate more reliable information.
                </p>
              </div>
            </div>
          </div>
        )}

        {filteredTransfers.length === 0 ? (
          <EmptyState type="transfers" />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredTransfers.map((transfer) => (
              <TransferCard key={transfer.id} transfer={transfer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
