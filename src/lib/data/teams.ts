import { Team } from '@/types';
import { fetchAllClubs } from '@/lib/football/api';
import { unstable_cache as cache } from 'next/cache';
import teamsJson from '@/data/teams/teams.json';

export const getAllTeams = cache(async (): Promise<Team[]> => {
  const clubs = await fetchAllClubs();
  return clubs.map((c): Team => ({
    id: c.id,
    name: c.name,
    shortName: c.abbreviation || c.name.slice(0, 3).toUpperCase(),
    logo: c.logo || null,
    country: '',
    league: '',
  }));
});

export async function getTeamById(id: string): Promise<Team | null> {
  const teams = teamsJson as unknown as Team[];
  const found = teams.find((team): boolean => team.id === id);
  if (found) return found;
  const apiTeams = await getAllTeams();
  return apiTeams.find((team): boolean => team.id === id) || null;
}

export async function getTeamsByLeague(league: string): Promise<Team[]> {
  const teams = await getAllTeams();
  return teams.filter((team): boolean => team.league === league);
}

export async function getTeamsByCountry(country: string): Promise<Team[]> {
  const teams = await getAllTeams();
  return teams.filter((team): boolean => team.country === country);
}

export async function searchTeams(query: string): Promise<Team[]> {
  const teams = await getAllTeams();
  const lowerQuery = query.toLowerCase();
  return teams.filter(
    (team): boolean =>
      team.name.toLowerCase().includes(lowerQuery) ||
      team.shortName.toLowerCase().includes(lowerQuery)
  );
}
