import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fetchAllNewsFeeds, FetchedNewsItem } from './fetchers/rss-news';
import { fetchFromNewsAPI } from './fetchers/newsapi';
import { updateNewsImageCount } from './update-news-image-count';

export interface SyncResult {
  itemsFound: number;
  itemsAdded: number;
  duplicatesRemoved: number;
  errors: string[];
  timestamp: string;
}

export async function syncNews(): Promise<SyncResult> {
  const errors: string[] = [];
  const timestamp = new Date().toISOString();
  const dataDir = join(process.cwd(), 'src', 'data', 'news');

  try {
    await mkdir(dataDir, { recursive: true });
  } catch (e) {
    errors.push(`Failed to create data dir: ${e}`);
  }

  const [rssItems, newsApiItems] = await Promise.all([
    fetchAllNewsFeeds(),
    fetchFromNewsAPI('football'),
  ]);

  const allItems = [...rssItems, ...newsApiItems];
  const unique = deduplicateNews(allItems);
  const sorted = unique.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const latest = sorted.slice(0, 30);
  const trending = getTrending(sorted);

  // Keep the local sample-image count in sync with whatever is in
  // public/assets/news so articles without a source image still render a
  // relevant photo instead of a broken-image icon.
  await updateNewsImageCount().catch((e: unknown) => errors.push(`image count: ${e}`));

  const latestOutput = latest.map(item => mapToOutput(item, timestamp));
  const trendingOutput = trending.map(item => mapToOutput(item, timestamp));

  try {
    await writeFile(join(dataDir, 'latest.json'), JSON.stringify(latestOutput, null, 2), 'utf-8');
    await writeFile(join(dataDir, 'trending.json'), JSON.stringify(trendingOutput, null, 2), 'utf-8');
    console.log(`✅ Wrote ${latestOutput.length} latest + ${trendingOutput.length} trending articles`);
  } catch (e) {
    errors.push(`Failed to write output: ${e}`);
  }

  return {
    itemsFound: allItems.length,
    itemsAdded: unique.length,
    duplicatesRemoved: allItems.length - unique.length,
    errors,
    timestamp,
  };
}

function deduplicateNews(items: FetchedNewsItem[]): FetchedNewsItem[] {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Weighted trending score. Source credibility and team relevance are the
 * base signals, but an article with a usable image is strongly preferred for
 * the trending rail (it is the only place images are shown), and recency
 * keeps stale stories from crowding out fresh ones.
 */
function trendingScore(item: FetchedNewsItem): number {
  const ageHours = (Date.now() - new Date(item.publishedAt).getTime()) / 3600000;
  const recency = Math.max(0, 1 - ageHours / 48);
  return (
    item.sourceCredibility +
    item.relatedTeams.length * 5 +
    (item.image ? 40 : 0) +
    recency * 40
  );
}

function getTrending(items: FetchedNewsItem[]): FetchedNewsItem[] {
  return [...items]
    .sort((a, b) => trendingScore(b) - trendingScore(a))
    .slice(0, 10);
}

function mapToOutput(item: FetchedNewsItem, timestamp: string) {
  const isSourceVerified = item.sourceCredibility >= 70;
  const categoryString = item.category === 'Transfers' ? 'Transfers' : item.category;

  return {
    id: `news-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 6)}`,
    title: item.title,
    summary: item.summary,
    source: {
      name: item.source,
      type: item.sourceCredibility >= 90 ? 'official' : 'publication',
      url: item.sourceUrl,
      credibilityScore: item.sourceCredibility,
    },
    sourceName: item.source,
    sourceUrl: item.sourceUrl,
    image: item.image || null,
    category: categoryString,
    originalUrl: item.sourceUrl,
    publishedAt: item.publishedAt,
    discoveredAt: timestamp,
    lastVerifiedAt: timestamp,
    dataStatus: isSourceVerified ? 'FRESH' : 'UNVERIFIED',
    freshness: {
      status: 'breaking',
      ageMinutes: Math.floor((Date.now() - new Date(item.publishedAt).getTime()) / 60000),
      publishedAt: item.publishedAt,
      lastUpdated: timestamp,
    },
    verification: {
      level: item.sourceCredibility >= 90 ? 'trusted_journalist' : item.sourceCredibility >= 70 ? 'single_source' : 'unverified',
      sources: [{
        id: item.sourceId,
        name: item.source,
        type: item.sourceCredibility >= 90 ? 'official' : 'publication',
        url: item.sourceUrl,
        credibilityScore: item.sourceCredibility,
        publishedAt: item.publishedAt,
        discoveredAt: timestamp,
      }],
      confidenceScore: item.sourceCredibility,
      confidenceReasons: [
        `Reported by ${item.source}`,
        item.sourceCredibility >= 90 ? 'High source credibility' : 'Moderate source credibility',
      ],
      confirmedBy: item.sourceCredibility >= 90 ? [item.source] : [],
      verificationCount: 1,
    },
    relatedTeams: item.relatedTeams,
  };
}