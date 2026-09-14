/**
 * News data access.
 *
 * Reads the latest + trending news from the static JSON snapshots. The
 * server-side refresh happens in the /api/news route (which is the only place
 * that touches the Node-only sync pipeline), so this module stays safely
 * importable by client components.
 */

import { NewsArticle } from '@/types';
import { NewsArticleSchema, validateData } from '@/lib/schemas';
import latestNews from '@/data/news/latest.json';
import trendingNews from '@/data/news/trending.json';

export async function getLatestNews(): Promise<NewsArticle[]> {
  return validateData(NewsArticleSchema, latestNews);
}

export async function getTrendingNews(): Promise<NewsArticle[]> {
  return validateData(NewsArticleSchema, trendingNews);
}

export async function getNewsByCategory(category: string): Promise<NewsArticle[]> {
  const allNews = await getLatestNews();
  return allNews.filter(article => article.category === category);
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  const allNews = await getLatestNews();
  return allNews.find(article => article.id === id) || null;
}

export async function getFeaturedNews(): Promise<NewsArticle | null> {
  const allNews = await getLatestNews();
  return allNews[0] || null;
}

export async function searchNews(query: string): Promise<NewsArticle[]> {
  const allNews = await getLatestNews();
  const lowerQuery = query.toLowerCase();
  return allNews.filter(
    article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.summary.toLowerCase().includes(lowerQuery) ||
      (typeof article.source === 'string' ? article.source : article.source.name).toLowerCase().includes(lowerQuery)
  );
}

/** Raw snapshot access for components that need the unvalidated shape. */
export function getLatestNewsSnapshot(): NewsArticle[] {
  return validateData(NewsArticleSchema, latestNews);
}

export function getTrendingNewsSnapshot(): NewsArticle[] {
  return validateData(NewsArticleSchema, trendingNews);
}