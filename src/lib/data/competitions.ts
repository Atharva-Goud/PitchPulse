import { Competition } from '@/types';
import { CompetitionSchema, validateData } from '@/lib/schemas';
import competitionsData from '@/data/competitions/competitions.json';

export async function getAllCompetitions(): Promise<Competition[]> {
  return validateData(CompetitionSchema, competitionsData);
}

export async function getCompetitionById(id: string): Promise<Competition | null> {
  const competitions = await getAllCompetitions();
  return competitions.find(comp => comp.id === id) || null;
}

export async function getCompetitionsByType(type: Competition['type']): Promise<Competition[]> {
  const competitions = await getAllCompetitions();
  return competitions.filter(comp => comp.type === type);
}

export async function getCompetitionsByCountry(country: string): Promise<Competition[]> {
  const competitions = await getAllCompetitions();
  return competitions.filter(comp => comp.country === country);
}