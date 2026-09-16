import { Suspense } from 'react';
import { getTeamById } from '@/lib/data/teams';
import { getMatchesByTeam } from '@/lib/data/matches';
import { searchNews } from '@/lib/data/news';
import { getTransfersByClub } from '@/lib/data/transfers';
import { getStandingsBySlug } from '@/lib/football/standings';
import TeamPageClient from '@/components/teams/TeamPageClient';
import type { Team, Match, NewsArticle, Transfer } from '@/types';
import type { StandingRow } from '@/lib/football/standings';

export const dynamic = 'force-dynamic';

interface TeamPageData {
  team: Team | null;
  matches: Match[];
  news: NewsArticle[];
  transfers: Transfer[];
  standingsPosition: { rank: number; points: number; played: number } | null;
}

async function getTeamPageData(teamId: string): Promise<TeamPageData> {
  const teamData = await getTeamById(teamId);
  if (!teamData) {
    return { team: null, matches: [], news: [], transfers: [], standingsPosition: null };
  }

  const [matchesData, newsData, transfersData] = await Promise.all([
    getMatchesByTeam(teamId),
    searchNews(teamData.name),
    getTransfersByClub(teamId),
  ]);

  // Try to get league position from standings
  let standingsPosition: { rank: number; points: number; played: number } | null = null;
  if (teamData.league) {
    const leagueSlugMap: Record<string, string> = {
      'Premier League': 'eng.1',
      'La Liga': 'esp.1',
      'Bundesliga': 'ger.1',
      'Serie A': 'ita.1',
      'Ligue 1': 'fra.1',
      'Eredivisie': 'ned.1',
    };
    const slug = leagueSlugMap[teamData.league];
    if (slug) {
      try {
        const standings = await getStandingsBySlug(slug);
        const teamStanding = standings.find(s => s.teamName === teamData.name || s.teamId === teamData.id);
        if (teamStanding) {
          standingsPosition = {
            rank: teamStanding.rank,
            points: teamStanding.points,
            played: teamStanding.played,
          };
        }
      } catch {
        // Standings not available for this league
      }
    }
  }

  return {
    team: teamData,
    matches: matchesData,
    news: newsData,
    transfers: transfersData,
    standingsPosition,
  };
}

interface PageProps {
  params: Promise<{ teamId: string }>;
}

export default async function TeamPage({ params }: PageProps) {
  const { teamId } = await params;
  const data = await getTeamPageData(teamId);

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12"><div className="h-96 bg-slate-900/50 rounded-xl animate-pulse" /></div>}>
        <TeamPageClient data={data} teamId={teamId} />
      </Suspense>
    </div>
  );
}