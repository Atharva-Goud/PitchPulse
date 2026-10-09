import { NextResponse } from 'next/server';

/**
 * News refresh endpoint with pagination support.
 *
 * The only place in the app that touches the Node-only sync pipeline
 * (RSS / NewsAPI fetchers + sync-news.ts). Client pages call this instead of
 * importing the fetchers directly, so the client bundle never pulls in
 * `fs` modules.
 *
 * Supports pagination via query params:
 * - page: page number (1-based, default 1)
 * - limit: items per page (default 30, max 100)
 * - category: filter by category
 *
 * A refresh runs in the background and is single-flight: concurrent callers
 * share one in-flight promise instead of hammering the news sources. When the
 * refresh fails we fall back to the last known good JSON snapshot, so a
 * source outage never breaks the news pages.
 */

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 100;

type NewsData = { latest: unknown[]; trending: unknown[] };

let refreshState: NewsData | null = null;
let loadedAt = 0;
let inFlight: Promise<NewsData> | null = null;

function isFreshEnough(now: number): boolean {
  return !!refreshState && now - loadedAt < REFRESH_INTERVAL_MS;
}

async function loadSnapshot(): Promise<NewsData> {
  const [{ default: latest }, { default: trending }] = await Promise.all([
    import('@/data/news/latest.json'),
    import('@/data/news/trending.json'),
  ]);
  return { latest: (latest as unknown[]) || [], trending: (trending as unknown[]) || [] };
}

function removeTrendingDuplicates(latest: unknown[], trending: unknown[]): unknown[] {
  const trendingUrls = new Set(
    (trending as Array<{ sourceUrl?: string }>).map(a => a.sourceUrl).filter(Boolean)
  );
  return (latest as Array<{ sourceUrl?: string }>).filter(a => a.sourceUrl && !trendingUrls.has(a.sourceUrl));
}

async function refreshOnce(): Promise<NewsData> {
  const { buildNewsOutput } = await import('@/scripts/sync-news');
  const { fetchAllNewsFeeds } = await import('@/scripts/fetchers/rss-news');
  const { fetchFromNewsAPI } = await import('@/scripts/fetchers/newsapi');

  const timestamp = new Date().toISOString();
  const [rssItems, newsApiItems] = await Promise.all([
    fetchAllNewsFeeds(),
    fetchFromNewsAPI('football'),
  ]);
  const allItems = [...rssItems, ...newsApiItems];
  const { latest, trending } = buildNewsOutput(allItems, timestamp);
  return { latest, trending };
}

async function runRefresh(): Promise<NewsData> {
  try {
    const data = await refreshOnce();
    refreshState = data;
    loadedAt = Date.now();
    return data;
  } catch (error) {
    console.error('api/news: background refresh failed, keeping snapshot:', error);
    return loadSnapshot();
  } finally {
    inFlight = null;
  }
}

function applyPagination<T>(items: T[], page: number, limit: number): { items: T[]; hasMore: boolean; total: number } {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedItems = items.slice(start, end);
  return {
    items: paginatedItems,
    hasMore: end < items.length,
    total: items.length,
  };
}

export async function GET(request: Request) {
  const now = Date.now();
  const { searchParams } = new URL(request.url);
  
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10)));
  const category = searchParams.get('category') || undefined;

  // Serve the cached refresh if it is still fresh.
  if (isFreshEnough(now) && refreshState) {
    let latest = removeTrendingDuplicates(refreshState.latest, refreshState.trending);
    if (category) {
      latest = latest.filter((article: any) => article.category === category);
    }
    const { items, hasMore, total } = applyPagination(latest, page, limit);
    return NextResponse.json({ latest: items, trending: refreshState.trending, hasMore, total, page, limit });
  }

  // If a refresh is already in flight, share it.
  if (inFlight) {
    try {
      const data = await inFlight;
      let latest = removeTrendingDuplicates(data.latest, data.trending);
      if (category) {
        latest = latest.filter((article: any) => article.category === category);
      }
      const { items, hasMore, total } = applyPagination(latest, page, limit);
      return NextResponse.json({ latest: items, trending: data.trending, hasMore, total, page, limit });
    } catch {
      const snapshot = await loadSnapshot();
      let latest = removeTrendingDuplicates(snapshot.latest, snapshot.trending);
      if (category) {
        latest = latest.filter((article: any) => article.category === category);
      }
      const { items, hasMore, total } = applyPagination(latest, page, limit);
      return NextResponse.json({ latest: items, trending: snapshot.trending, hasMore, total, page, limit });
    }
  }

  // Return the existing snapshot immediately and refresh in the background
  // so the request is never blocked on the news sources.
  const snapshotData = refreshState || (await loadSnapshot());
  inFlight = runRefresh();
  
  let latest = removeTrendingDuplicates(snapshotData.latest, snapshotData.trending);
  if (category) {
    latest = latest.filter((article: any) => article.category === category);
  }
  const { items, hasMore, total } = applyPagination(latest, page, limit);
  return NextResponse.json({ latest: items, trending: snapshotData.trending, hasMore, total, page, limit });
}