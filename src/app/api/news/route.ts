import { NextResponse } from 'next/server';

/**
 * News refresh endpoint.
 *
 * The only place in the app that touches the Node-only sync pipeline
 * (RSS / NewsAPI fetchers + sync-news.ts). Client pages call this instead of
 * importing the fetchers directly, so the client bundle never pulls in
 * `fs` modules.
 *
 * A refresh runs in the background and is single-flight: concurrent callers
 * share one in-flight promise instead of hammering the news sources. When the
 * refresh fails we fall back to the last known good JSON snapshot, so a
 * source outage never breaks the news pages.
 */

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

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

export async function GET() {
  const now = Date.now();

  // Serve the cached refresh if it is still fresh.
  if (isFreshEnough(now) && refreshState) {
    return NextResponse.json(refreshState);
  }

  // If a refresh is already in flight, share it.
  if (inFlight) {
    try {
      const data = await inFlight;
      return NextResponse.json(data);
    } catch {
      const snapshot = await loadSnapshot();
      return NextResponse.json(snapshot);
    }
  }

  // Return the existing snapshot immediately and refresh in the background
  // so the request is never blocked on the news sources.
  const snapshotData = refreshState || (await loadSnapshot());
  inFlight = runRefresh();
  return NextResponse.json(snapshotData);
}