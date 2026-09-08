import { SearchResult } from '@/types';
import { searchNews } from './news';
import { searchTransfers } from './transfers';
import { searchTeams } from './teams';

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  const [teams, news, transfers] = await Promise.all([
    searchTeams(query),
    searchNews(query),
    searchTransfers(query),
  ]);

  const results: SearchResult[] = [];

  if (teams.length > 0) {
    results.push({ type: 'teams', items: teams });
  }

  if (news.length > 0) {
    results.push({ type: 'news', items: news });
  }

  if (transfers.length > 0) {
    results.push({ type: 'transfers', items: transfers });
  }

  return results;
}
