/**
 * Server-side news refresh.
 *
 * The news pipeline is built around a manual sync (`npm run sync:news`) that
 * writes static JSON snapshots. In production those snapshots go stale the
 * moment the sync stops running, so this module gives the running server a
 * cheap, safe way to refresh them on demand.
 *
 * Design goals (from the task brief):
 *   - Refresh news on a reasonable schedule, not on every browser request.
 *   - Never hammer the news sources: a single-flight refresh guards the
 *     pipeline so only one in-flight refresh exists at a time.
 *   - Never break the app when sources are down: if a refresh fails we fall
 *     back to the last known good JSON snapshot.
 *   - Keep News and Football independent: this module imports only the news
 *     fetchers; a failure here must not affect the football API client.
 *
 * The sync pipeline (`sync-news.ts`, the RSS/NewsAPI fetchers and the app
 * config) all live behind dynamic imports so they are never bundled into the
 * client — they touch Node-only `fs` modules and must only run on the server.
 */

import snapshot from '@/data/news/latest.json';
import trendingSnapshot from '@/data/news/trending.json';

export const NEWS_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

type NewsData = { latest: unknown[]; trending: unknown[] };
type RefreshState = NewsData & { timestamp: string; loadedAt: number };

let refreshState: RefreshState | null = null;
let refreshTimer: NodeJS.Timeout | null = null;
let inFlight: Promise<NewsData> | null = null;

function isFreshEnough(state: RefreshState, now: number): boolean {
  return now - state.loadedAt < NEWS_REFRESH_INTERVAL_MS;
}

function loadSnapshot(): NewsData {
  return {
    latest: (snapshot as unknown[]) || [],
    trending: (trendingSnapshot as unknown[]) || [],
  };
}

/** Run a single refresh. Single-flight: concurrent callers share one promise
 * instead of hammering the RSS / NewsAPI sources. */
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

/** Refresh in the background, storing the result or falling back to snapshot. */
async function runRefresh(): Promise<NewsData> {
  try {
    const data = await refreshOnce();
    refreshState = { ...data, timestamp: new Date().toISOString(), loadedAt: Date.now() };
    return data;
  } catch (error) {
    console.error('news-refresh: background refresh failed, keeping snapshot:', error);
    return loadSnapshot();
  } finally {
    inFlight = null;
    scheduleNextRefresh();
  }
}

function scheduleNextRefresh(): void {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    inFlight = runRefresh();
  }, NEWS_REFRESH_INTERVAL_MS);
}

/**
 * Get the latest + trending news, refreshing in the background when stale.
 *
 * Always returns data immediately: either a fresh refresh, or the last
 * snapshot. The refresh itself never blocks the caller.
 */
export async function getNewsRefreshed(): Promise<NewsData> {
  // Client-side: nothing to refresh, just return the imported snapshot.
  if (typeof window !== 'undefined') {
    return loadSnapshot();
  }

  const now = Date.now();

  // Serve the cached refresh if it is still fresh.
  if (refreshState && isFreshEnough(refreshState, now)) {
    return { latest: refreshState.latest, trending: refreshState.trending };
  }

  // If a refresh is already in flight, share it.
  if (inFlight) {
    try {
      return await inFlight;
    } catch {
      return loadSnapshot();
    }
  }

  // Return the existing snapshot immediately and refresh in the background
  // so the request is never blocked on the news sources.
  const snapshotData = refreshState
    ? { latest: refreshState.latest, trending: refreshState.trending }
    : loadSnapshot();

  inFlight = runRefresh();
  return snapshotData;
}

export function getNewsRefreshState(): { lastRefresh: string | null; ageMs: number | null } {
  if (!refreshState) return { lastRefresh: null, ageMs: null };
  return { lastRefresh: refreshState.timestamp, ageMs: Date.now() - refreshState.loadedAt };
}