import { Transfer } from '@/types';
import { TransferSchema, validateData } from '@/lib/schemas';
import rumoursData from '@/data/transfers/rumours.json';
import confirmedData from '@/data/transfers/confirmed.json';

export async function getTransferRumours(): Promise<Transfer[]> {
  return validateData(TransferSchema, rumoursData);
}

export async function getConfirmedTransfers(): Promise<Transfer[]> {
  return validateData(TransferSchema, confirmedData);
}

export async function getAllTransfers(): Promise<Transfer[]> {
  const [rumours, confirmed] = await Promise.all([
    getTransferRumours(),
    getConfirmedTransfers(),
  ]);
  return [...rumours, ...confirmed].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getTransfersByStatus(status: Transfer['status']): Promise<Transfer[]> {
  const allTransfers = await getAllTransfers();
  return allTransfers.filter(transfer => transfer.status === status);
}

export async function getTransfersByPlayer(playerId: string): Promise<Transfer[]> {
  const allTransfers = await getAllTransfers();
  return allTransfers.filter(transfer => transfer.player.id === playerId);
}

export async function getTransfersByClub(clubId: string): Promise<Transfer[]> {
  const allTransfers = await getAllTransfers();
  return allTransfers.filter(
    transfer => transfer.fromClub.id === clubId || transfer.toClub?.id === clubId
  );
}

export async function searchTransfers(query: string): Promise<Transfer[]> {
  const allTransfers = await getAllTransfers();
  const lowerQuery = query.toLowerCase();
  return allTransfers.filter(
    transfer =>
      transfer.player.name.toLowerCase().includes(lowerQuery) ||
      transfer.fromClub.name.toLowerCase().includes(lowerQuery) ||
      transfer.toClub?.name.toLowerCase().includes(lowerQuery) ||
      transfer.source.toLowerCase().includes(lowerQuery)
  );
}