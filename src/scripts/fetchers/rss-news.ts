import Parser from 'rss-parser';
import { config } from '../../config/app-config';

export interface FetchedNewsItem {
  title: string;
  summary: string;
  source: string;
  sourceId: string;
  sourceUrl: string;
  sourceCredibility: number;
  image: string | null;
  category: string;
  publishedAt: string;
  relatedTeams: string[];
}

const teamKeywords: Record<string, string[]> = {
  arsenal: ['arsenal', 'gunners'],
  'manchester-city': ['man city', 'manchester city', 'citizens'],
  'manchester-united': ['man utd', 'manchester united', 'red devils'],
  liverpool: ['liverpool', 'reds', 'lfc'],
  chelsea: ['chelsea', 'blues'],
  'tottenham': ['tottenham', 'spurs'],
  'real-madrid': ['real madrid', 'los blancos'],
  barcelona: ['barcelona', 'barca', 'blaugrana'],
  'bayern-munich': ['bayern', 'bayern munich', 'bayern muenchen'],
  psg: ['psg', 'paris saint-germain', 'paris saint germain'],
  'inter-milan': ['inter', 'inter milan', 'internazionale'],
  'ac-milan': ['ac milan', 'milan'],
  'borussia-dortmund': ['dortmund', 'bvb'],
  napoli: ['napoli', 'naples'],
  juventus: ['juventus', 'juve'],
  'atletico-madrid': ['atletico', 'atletico madrid'],
  newcastle: ['newcastle', 'magpies'],
  brighton: ['brighton'],
  'west-ham': ['west ham', 'hammers'],
  'real-sociedad': ['real sociedad'],
};

const categoryKeywords: Record<string, string[]> = {
  Transfers: ['transfer', 'sign', 'deal', 'bid', 'fee', 'rumour', 'rumor', 'agree', 'contract', 'move'],
  'Premier League': ['premier league', 'epl'],
  'Champions League': ['champions league', 'ucl', 'champions cup'],
  'La Liga': ['la liga', 'spanish league', 'laliga'],
  'Serie A': ['serie a', 'italian league'],
  'Bundesliga': ['bundesliga', 'german league'],
  'Ligue 1': ['ligue 1', 'french league'],
  'International Football': ['world cup', 'euro 2024', 'international', 'national team', 'nations league'],
};

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'PitchIntel/1.0',
  },
});

function detectTeams(text: string): string[] {
  const lower = text.toLowerCase();
  return Object.entries(teamKeywords)
    .filter(([, keywords]) => keywords.some(k => lower.includes(k)))
    .map(([teamId]) => teamId);
}

function detectCategory(title: string, summary: string): string {
  const text = `${title} ${summary}`.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(k => text.includes(k))) return category;
  }
  return 'Premier League';
}

function extractImage(item: any): string | null {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item['media:content']?.$.url) return item['media:content']?.$.url;
  const content = item.content || item.contentSnippet || '';
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/);
  return match ? match[1] : null;
}

export async function fetchFromRSSFeed(
  feedId: string,
  feedUrl: string,
  feedName: string,
  credibility: number
): Promise<FetchedNewsItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    const items: FetchedNewsItem[] = [];

    for (const item of feed.items || []) {
      if (!item.title || !item.link) continue;

      const publishedAt = item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString();

      const age = Date.now() - new Date(publishedAt).getTime();
      if (age > config.maxNewsAge) continue;

      const title = item.title;
      const summary = item.contentSnippet
        ? item.contentSnippet.substring(0, 300)
        : title;

      items.push({
        title,
        summary,
        source: feedName,
        sourceId: feedId,
        sourceUrl: item.link,
        sourceCredibility: credibility,
        image: extractImage(item),
        category: detectCategory(title, summary),
        publishedAt,
        relatedTeams: detectTeams(`${title} ${summary}`),
      });
    }

    return items;
  } catch (error) {
    console.error(`Failed to fetch RSS feed ${feedName}:`, error);
    return [];
  }
}

export async function fetchAllNewsFeeds(): Promise<FetchedNewsItem[]> {
  const allItems: FetchedNewsItem[] = [];

  for (const feed of config.rss.feeds) {
    console.log(`Fetching: ${feed.name}...`);
    const items = await fetchFromRSSFeed(
      feed.id,
      feed.url,
      feed.name,
      feed.credibility
    );
    console.log(`  Found ${items.length} articles`);
    allItems.push(...items);
  }

  return allItems;
}
