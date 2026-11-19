import { FootballMatch } from './football-api';

const now = new Date();
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString();
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

const premierLeague = {
  id: 39,
  name: 'Premier League',
  shortName: 'Premier League',
  logo: 'https://media.api-sports.io/football/leagues/39.png',
  country: 'England',
  type: 'league',
};

const laLiga = {
  id: 140,
  name: 'La Liga',
  shortName: 'La Liga',
  logo: 'https://media.api-sports.io/football/leagues/140.png',
  country: 'Spain',
  type: 'league',
};

type Team = { id: number; name: string; shortName: string; logo: string };

function makeMatch(
  id: number,
  league: { id: number; name: string; logo: string; country: string },
  home: Team,
  away: Team,
  homeScore: number | null,
  awayScore: number | null,
  status: string,
  statusShort: string,
  kickoff: string
): FootballMatch {
  return {
    id,
    homeTeam: { id: home.id, name: home.name, logo: home.logo },
    awayTeam: { id: away.id, name: away.name, logo: away.logo },
    homeScore,
    awayScore,
    status,
    statusShort,
    league,
    kickoff,
    venue: null,
    referee: null,
  };
}

export const FALLBACK_LIVE_MATCHES: FootballMatch[] = [
  makeMatch(
    9001,
    premierLeague,
    { id: 42, name: 'Arsenal', shortName: 'ARS', logo: 'https://media.api-sports.io/football/teams/42.png' },
    { id: 50, name: 'Manchester City', shortName: 'MCI', logo: 'https://media.api-sports.io/football/teams/50.png' },
    1, 0, 'LIVE', 'LIVE', oneHourAgo
  ),
  makeMatch(
    9002,
    laLiga,
    { id: 541, name: 'Real Madrid', shortName: 'RMA', logo: 'https://media.api-sports.io/football/teams/541.png' },
    { id: 529, name: 'Barcelona', shortName: 'BAR', logo: 'https://media.api-sports.io/football/teams/529.png' },
    0, 0, 'LIVE', 'LIVE', oneHourAgo
  ),
];

export const FALLBACK_UPCOMING_MATCHES: FootballMatch[] = [
  makeMatch(
    9003,
    premierLeague,
    { id: 49, name: 'Chelsea', shortName: 'CHE', logo: 'https://media.api-sports.io/football/teams/49.png' },
    { id: 65, name: 'Liverpool', shortName: 'LIV', logo: 'https://media.api-sports.io/football/teams/65.png' },
    null, null, 'SCHEDULED', 'NS', threeHoursFromNow
  ),
  makeMatch(
    9004,
    laLiga,
    { id: 530, name: 'Atletico Madrid', shortName: 'ATM', logo: 'https://media.api-sports.io/football/teams/530.png' },
    { id: 558, name: 'Sevilla', shortName: 'SEV', logo: 'https://media.api-sports.io/football/teams/558.png' },
    null, null, 'SCHEDULED', 'NS', threeHoursFromNow
  ),
];

export const FALLBACK_RESULTS_MATCHES: FootballMatch[] = [
  makeMatch(
    9005,
    premierLeague,
    { id: 66, name: 'Manchester United', shortName: 'MUN', logo: 'https://media.api-sports.io/football/teams/66.png' },
    { id: 65, name: 'Tottenham', shortName: 'TOT', logo: 'https://media.api-sports.io/football/teams/65.png' },
    2, 1, 'FINISHED', 'FT', oneDayAgo
  ),
  makeMatch(
    9006,
    laLiga,
    { id: 533, name: 'Valencia', shortName: 'VAL', logo: 'https://media.api-sports.io/football/teams/533.png' },
    { id: 549, name: 'Real Sociedad', shortName: 'RSO', logo: 'https://media.api-sports.io/football/teams/549.png' },
    0, 2, 'FINISHED', 'FT', oneDayAgo
  ),
];
