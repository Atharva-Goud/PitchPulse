import { Team } from '@/types';
import { fetchAllClubs } from '@/lib/football/api';

export async function getAllTeams(): Promise<Team[]> {
  const clubs = await fetchAllClubs();
  return clubs.map(c => ({
    id: c.id,
    name: c.name,
    shortName: c.abbreviation || c.name.slice(0, 3).toUpperCase(),
    logo: c.logo || null,
    country: '',
    league: '',
  }));
}

export async function getTeamById(id: string): Promise<Team | null> {
  const teams = await getAllTeams();
  return teams.find(team => team.id === id) || null;
}

export async function getTeamsByLeague(league: string): Promise<Team[]> {
  const teams = await getAllTeams();
  return teams.filter(team => team.league === league);
}

export async function getTeamsByCountry(country: string): Promise<Team[]> {
  const teams = await getAllTeams();
  return teams.filter(team => team.country === country);
}

export async function searchTeams(query: string): Promise<Team[]> {
  const teams = await getAllTeams();
  const lowerQuery = query.toLowerCase();
  return teams.filter(
    team =>
      team.name.toLowerCase().includes(lowerQuery) ||
      team.shortName.toLowerCase().includes(lowerQuery)
  );
}