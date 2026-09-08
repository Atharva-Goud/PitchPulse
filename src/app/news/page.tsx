'use client';

import { useState, useEffect } from 'react';
import { Filter, TrendingUp, Clock, ExternalLink } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import NewsCard from '@/components/news/NewsCard';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import { getLatestNews, getTrendingNews, getNewsByCategory } from '@/lib/data/news';
import { NewsArticle, NewsCategory } from '@/types';

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

export default function NewsPage() {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [trending, setTrending] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [latestNews, trendingNews] = await Promise.all([
          getLatestNews(),
          getTrendingNews(),
        ]);
        setNews(latestNews);
        setTrending(trendingNews);
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredNews = selectedCategory
    ? news.filter((article) => article.category === selectedCategory)
    : news;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <LoadingState variant="card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Football News</h1>
          <p className="text-slate-400">Stay updated with the latest football news from around the world</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-400">Filter by category</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <SectionHeader 
              title={selectedCategory || 'All News'} 
              description={`${filteredNews.length} articles`}
            />

            {filteredNews.length === 0 ? (
              <EmptyState type="news" message="No articles found" />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {filteredNews.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-8">
            <div className="rounded-xl bg-slate-900 border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <h3 className="font-semibold text-white">Trending</h3>
              </div>
              <div className="space-y-4">
                {trending.slice(0, 5).map((article, index) => (
                  <a
                    key={article.id}
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-3"
                  >
                    <span className="text-2xl font-bold text-slate-600 w-8 flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-emerald-400 transition-colors">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <span>{article.source}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-slate-900 border border-white/10 p-6">
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                {categories.slice(0, 4).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
