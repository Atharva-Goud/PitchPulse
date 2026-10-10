import { Competition } from '@/types';
import { fetchAvailableLeagues } from '@/lib/football/api';
import { unstable_cache as cache } from 'next/cache';

export const getAllCompetitions = cache(async (): Promise<Competition[]> => {
  const leagues = await fetchAvailableLeagues();
  return leagues.map((l): Competition => ({
    id: l.slug || l.id,
    name: l.name,
    shortName: (l.slug || l.id).split('.')[0],
    logo: l.logo || null,
    country: l.country || '',
    type: 'league' as const,
  }));
});

export async function getCompetitionById(id: string): Promise<Competition | null> {
  const competitions = await getAllCompetitions();
  return competitions.find((comp): boolean => comp.id === id) || null;
}

export async function getCompetitionsByType(type: Competition['type']): Promise<Competition[]> {
  const competitions = await getAllCompetitions();
  return competitions.filter((comp): boolean => comp.type === type);
}

export async function getCompetitionsByCountry(country: string): Promise<Competition[]> {
  const competitions = await getAllCompetitions();
  return competitions.filter((comp): boolean => comp.country === country);
}