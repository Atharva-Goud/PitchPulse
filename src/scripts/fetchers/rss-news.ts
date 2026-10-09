import Parser from 'rss-parser';
import { config } from '../../config/app-config';

/** Simple English detection - checks for common English words and absence of non-Latin scripts */
function isLikelyEnglish(text: string): boolean {
  if (!text || text.trim().length < 10) return false;
  
  // Check for non-Latin scripts (Cyrillic, Arabic, Chinese, etc.)
  const nonLatinRegex = /[\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/;
  if (nonLatinRegex.test(text)) return false;
  
  // Count English common words
  const englishWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'did', 'she', 'oil', 'sit', 'set', 'put', 'end', 'why', 'try', 'off', 'took', 'says'];
  const lower = text.toLowerCase();
  let englishCount = 0;
  for (const word of englishWords) {
    if (lower.includes(' ' + word + ' ') || lower.startsWith(word + ' ') || lower.endsWith(' ' + word)) {
      englishCount++;
    }
  }
  
  // If we find at least 3 common English words in a reasonable length text, it's likely English
  return englishCount >= 3;
}

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
  language: string;
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
  credibility: number,
  language: string
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
        language,
      });
    }

    // Extra safety: filter to English-only articles
    const englishItems = items.filter(i => isLikelyEnglish(`${i.title} ${i.summary}`));
    if (englishItems.length !== items.length) {
      console.log(`RSS ${feedName}: filtered ${items.length - englishItems.length} non-English articles`);
    }
    return englishItems;
  } catch (error) {
    console.error(`Failed to fetch RSS feed ${feedName}:`, error);
    return [];
  }
}

export async function fetchAllNewsFeeds(): Promise<FetchedNewsItem[]> {
  const allItems: FetchedNewsItem[] = [];

  for (const feed of config.rss.feeds) {
    // Only fetch English-language feeds
    if (feed.language !== 'en') {
      console.log(`Skipping non-English feed: ${feed.name} (${feed.language})`);
      continue;
    }
    console.log(`Fetching: ${feed.name}...`);
    const items = await fetchFromRSSFeed(
      feed.id,
      feed.url,
      feed.name,
      feed.credibility,
      feed.language || 'en'
    );
    console.log(`  Found ${items.length} articles`);
    allItems.push(...items);
  }

  return allItems;
}
