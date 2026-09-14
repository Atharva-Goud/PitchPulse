'use client';

import { useEffect, useState } from 'react';
import { NewsArticle } from '@/types';

type NewsData = { latest: NewsArticle[]; trending: NewsArticle[] };

/**
 * Fetch news from the server API route on mount.
 *
 * This triggers at most one background refresh per page load (the server
 * caches the result for 5 minutes and runs the refresh single-flight), so it
 * never hammers the news sources. A failure falls back to the static
 * snapshot, so a source outage never breaks the news pages.
 */
export function useNewsRefresh(initialLatest: NewsArticle[], initialTrending: NewsArticle[]) {
  const [latest, setLatest] = useState<NewsArticle[]>(initialLatest);
  const [trending, setTrending] = useState<NewsArticle[]>(initialTrending);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setRefreshing(true);
    fetch('/api/news')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('api/news ' + r.status))))
      .then((data: NewsData) => {
        if (cancelled) return;
        if (Array.isArray(data.latest) && data.latest.length > 0) setLatest(data.latest);
        if (Array.isArray(data.trending) && data.trending.length > 0) setTrending(data.trending);
      })
      .catch(error => {
        console.warn('useNewsRefresh: keeping snapshot, refresh failed:', error);
      })
      .finally(() => {
        if (!cancelled) setRefreshing(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { latest, trending, refreshing };
}