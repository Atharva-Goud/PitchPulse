import { Suspense } from 'react';
import { getLatestNewsSnapshot, getTrendingNewsSnapshot } from '@/lib/data/news';
import NewsPageClient from '@/components/news/NewsPageClient';
import type { NewsArticle, NewsCategory } from '@/types';

export const dynamic = 'force-dynamic';

interface NewsPageData {
  latest: NewsArticle[];
  trending: NewsArticle[];
  categories: NewsCategory[];
}

async function getNewsPageData(): Promise<NewsPageData> {
  const categories: NewsCategory[] = [
    'Transfers',
    'Premier League',
    'Champions League',
    'La Liga',
    'Serie A',
    'Bundesliga',
    'Ligue 1',
    'International Football',
  ];

  const [latest, trending] = await Promise.all([
    getLatestNewsSnapshot(),
    getTrendingNewsSnapshot(),
  ]);

  return { latest, trending, categories };
}

export default async function NewsPage() {
  const data = await getNewsPageData();

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12"><div className="h-96 bg-slate-900/50 rounded-xl animate-pulse" /></div>}>
        <NewsPageClient initialData={data} />
      </Suspense>
    </div>
  );
}