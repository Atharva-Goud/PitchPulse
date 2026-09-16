import { Suspense } from 'react';
import { getTransferRumours, getConfirmedTransfers } from '@/lib/data/transfers';
import TransfersPageClient from '@/components/transfers/TransfersPageClient';
import type { Transfer, TransferStatus } from '@/types';

export const dynamic = 'force-dynamic';

interface TransfersPageData {
  rumours: Transfer[];
  confirmed: Transfer[];
  statusFilters: { value: TransferStatus | 'all'; label: string }[];
}

async function getTransfersPageData(): Promise<TransfersPageData> {
  const statusFilters: { value: TransferStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'Rumour', label: 'Rumours' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'Negotiating', label: 'Negotiating' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Completed', label: 'Done Deals' },
  ];

  const [rumours, confirmed] = await Promise.all([
    getTransferRumours(),
    getConfirmedTransfers(),
  ]);

  return { rumours, confirmed, statusFilters };
}

export default async function TransfersPage() {
  const data = await getTransfersPageData();

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12"><div className="h-96 bg-slate-900/50 rounded-xl animate-pulse" /></div>}>
        <TransfersPageClient initialData={data} />
      </Suspense>
    </div>
  );
}