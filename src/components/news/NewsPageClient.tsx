'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Filter, TrendingUp, Clock, ExternalLink, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import NewsCard from '@/components/news/NewsCard';
import EmptyState from '@/components/ui/EmptyState';
import { useNewsRefresh } from '@/hooks/useNewsRefresh';
import type { NewsArticle, NewsCategory } from '@/types';

interface NewsPageClientProps {
  initialData: {
    latest: NewsArticle[];
    trending: NewsArticle[];
    categories: NewsCategory[];
    hasMore: boolean;
    total: number;
  };
}

const PAGE_SIZE = 30;
const INITIAL_LOAD = 60;

export default function NewsPageClient({ initialData }: NewsPageClientProps) {
  const { latest: initialLatest, trending: initialTrending, categories, hasMore: initialHasMore, total: initialTotal } = initialData;
  const { latest: refreshedLatest, trending, refreshing } = useNewsRefresh(initialLatest, initialTrending);
  
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(null);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [additionalArticles, setAdditionalArticles] = useState<NewsArticle[]>([]);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const retryRef = useRef<HTMLButtonElement>(null);
  const isFetchingRef = useRef(false);

  // Initialize loaded IDs from initial data
  const loadedIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    loadedIdsRef.current = new Set(refreshedLatest.map(a => a.id));
  }, [refreshedLatest]);

  // Reset pagination when category changes
  useEffect(() => {
    setPage(2);
    setHasMore(initialHasMore);
    setError(null);
    setAdditionalArticles([]);
  }, [selectedCategory, initialHasMore]);

  // Combine initial articles with additionally loaded ones
  const allLoadedArticles = useMemo(() => {
    const combined = [...refreshedLatest, ...additionalArticles];
    // Deduplicate
    const seen = new Set<string>();
    return combined.filter(a => {
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });
  }, [refreshedLatest, additionalArticles]);

  const filteredNews = selectedCategory
    ? allLoadedArticles.filter((article) => article.category === selectedCategory)
    : allLoadedArticles;

  // Fetch more articles
  const fetchMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (selectedCategory) {
        params.set('category', selectedCategory);
      }
      
      const response = await fetch(`/api/news?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
const data = await response.json();
       
       // Filter out duplicates
       const newArticles = data.latest.filter(
         (article: NewsArticle) => !loadedIdsRef.current.has(article.id)
       );
       
       if (newArticles.length > 0) {
         newArticles.forEach((a: NewsArticle) => loadedIdsRef.current.add(a.id));
         setAdditionalArticles(prev => [...prev, ...newArticles]);
       }
       
       setHasMore(data.hasMore);
       setPage(data.page + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more articles');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [hasMore, page, selectedCategory]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && hasMore) {
          fetchMore();
        }
      },
      { rootMargin: '200px', threshold: 0.1 }
    );
    
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, fetchMore]);

  if (filteredNews.length === 0 && !refreshing) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <EmptyState type="news" message="No articles found" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Football News</h1>
        <p className="text-slate-400">
          Stay updated with the latest football news from around the world
          {refreshing ? ' · refreshing' : ''}
        </p>
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
            <EmptyState type="news" message="No articles found for this category" />
          ) : (
            <>
              {/* Responsive 3×3 grid: 3 cols desktop, 2 tablet, 1 mobile */}
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredNews.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>

              {/* Infinite Scroll Trigger & Loading/Error States */}
              <div ref={loadMoreRef} className="mt-8" aria-live="polite">
                {loading && (
                  <div className="flex items-center justify-center gap-3 py-8">
                    <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" aria-hidden="true" />
                    <span className="text-slate-400">Loading more articles...</span>
                  </div>
                )}
                
                {error && !loading && (
                  <div className="flex items-center justify-center gap-3 py-8 text-center">
                    <div className="text-slate-500">
                      <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-50" aria-hidden="true" />
                      <p className="text-slate-400 mb-3">{error}</p>
                      <button
                        ref={retryRef}
                        onClick={fetchMore}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                        Retry
                      </button>
                    </div>
                  </div>
                )}
                
                {!loading && !error && !hasMore && filteredNews.length > 0 && (
                  <div className="flex items-center justify-center gap-2 py-8 text-slate-500">
                    <span className="relative flex h-6 w-6 items-center justify-center">
                      <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className="text-sm">You've reached the end</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-sm">{initialTotal} total articles available</span>
                  </div>
                )}
              </div>
            </>
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
                      <span>{typeof article.source === 'string' ? article.source : article.source.name}</span>
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
  );
}