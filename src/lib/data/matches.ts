import { Match } from '@/types';
import { MatchSchema, validateData } from '@/lib/schemas';
import liveData from '@/data/matches/live.json';
import upcomingData from '@/data/matches/upcoming.json';
import resultsData from '@/data/matches/results.json';

export async function getLiveMatches(): Promise<Match[]> {
  return validateData(MatchSchema, liveData);
}

export async function getUpcomingMatches(): Promise<Match[]> {
  return validateData(MatchSchema, upcomingData);
}

export async function getRecentResults(): Promise<Match[]> {
  return validateData(MatchSchema, resultsData);
}

export async function getAllMatches(): Promise<Match[]> {
  const [live, upcoming, results] = await Promise.all([
    getLiveMatches(),
    getUpcomingMatches(),
    getRecentResults(),
  ]);
  return [...live, ...upcoming, ...results].sort(
    (a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime()
  );
}

export async function getMatchesByStatus(status: Match['status']): Promise<Match[]> {
  const allMatches = await getAllMatches();
  return allMatches.filter(match => match.status === status);
}

export async function getMatchesByCompetition(competitionId: string): Promise<Match[]> {
  const allMatches = await getAllMatches();
  return allMatches.filter(match => match.competition.id === competitionId);
}

export async function getMatchesByTeam(teamId: string): Promise<Match[]> {
  const allMatches = await getAllMatches();
  return allMatches.filter(
    match => match.homeTeam.id === teamId || match.awayTeam.id === teamId
  );
}

export async function getMatchesByDateRange(startDate: string, endDate: string): Promise<Match[]> {
  const allMatches = await getAllMatches();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return allMatches.filter(match => {
    const kickoff = new Date(match.kickoff).getTime();
    return kickoff >= start && kickoff <= end;
  });
}

export async function getMatchById(id: string): Promise<Match | null> {
  const allMatches = await getAllMatches();
  return allMatches.find(match => match.id === id) || null;
}