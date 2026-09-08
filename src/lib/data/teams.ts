import { Team } from '@/types';
import { TeamSchema, validateData } from '@/lib/schemas';
import teamsData from '@/data/teams/teams.json';

export async function getAllTeams(): Promise<Team[]> {
  return validateData(TeamSchema, teamsData);
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