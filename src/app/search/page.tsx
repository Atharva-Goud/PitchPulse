'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { globalSearch } from '@/lib/data/search';
import { SearchResult } from '@/types';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import FallbackImage from '@/components/ui/Image';
import TeamLogo from '@/components/ui/TeamLogo';
import { resolveTeamLogo } from '@/lib/utils/teams';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await globalSearch(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const toggleCategory = (type: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'teams': return '⚽';
      case 'players': return '👤';
      case 'news': return '📰';
      case 'transfers': return '🔄';
      default: return '📋';
    }
  };

  const getLink = (type: string, item: any) => {
    switch (type) {
      case 'teams': return `/teams/${item.id}`;
      case 'news': return item.sourceUrl;
      case 'transfers': return '#';
      default: return '#';
    }
  };

  const getExternal = (type: string) => {
    return type === 'news';
  };

  const getLogoSrc = (item: any): string | null => {
    if (item.logo) return resolveTeamLogo(item);
    if (item.image) return resolveTeamLogo(item);
    return null;
  };

  const renderLogo = (item: any) => {
    const logo = getLogoSrc(item);
    if (logo) {
      return (
        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
          <FallbackImage src={logo} alt={item.name || item.title || ''} className="absolute inset-0" />
        </div>
      );
    }
    if (item.name) {
      return (
        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 flex items-center justify-center">
          <span className="text-xs font-bold text-slate-300">
            {item.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
          </span>
        </div>
      );
    }
    return null;
  };

  if (query && !loading && results.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState type="search" message={`No results for "${query}"`} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Search</h1>
          <p className="text-slate-400">Find teams, players, news, and transfers</p>
        </div>

        <div className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teams, players, news, transfers..."
              className="w-full pl-12 pr-12 py-4 text-lg bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {loading && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <div className="h-5 w-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {!query && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5 text-emerald-400" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Arsenal', 'Manchester City', 'Liverpool', 'Real Madrid', 'Barcelona', 'Bayern Munich', 'Mbappe', 'Haaland', 'Bellingham', 'Rice'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 rounded-lg bg-slate-800 border border-white/10 text-sm text-slate-300 hover:bg-slate-700 hover:text-white hover:border-emerald-500/50 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { label: 'Premier League Teams', href: '/search?q=Premier League' },
                  { label: 'La Liga Teams', href: '/search?q=La Liga' },
                  { label: 'Champions League News', href: '/search?q=Champions League' },
                  { label: 'Transfer Rumours', href: '/transfers' },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="p-4 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/30 transition-colors"
                  >
                    <span className="font-medium text-white">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {query && !loading && results.length > 0 && (
          <div className="space-y-6">
            {results.map((group) => {
              const isExpanded = expandedCategories[group.type] ?? true;
              return (
                <div key={group.type} className="rounded-xl bg-slate-900 border border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleCategory(group.type)}
                    className="w-full flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getIcon(group.type)}</span>
                      <div>
                        <h3 className="font-semibold text-white capitalize">{group.type}</h3>
                        <p className="text-sm text-slate-400">{group.items.length} result{group.items.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="divide-y divide-white/5 px-4 py-4">
                      {group.items.slice(0, 10).map((item: any) => (
                        <Link
                          key={item.id}
                          href={getLink(group.type, item)}
                          target={getExternal(group.type) ? '_blank' : undefined}
                          rel={getExternal(group.type) ? 'noopener noreferrer' : undefined}
                          className="flex items-center gap-3 py-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          {renderLogo(item)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">
                              {item.name || item.title}
                            </div>
                            {item.shortName && (
                              <div className="text-sm text-slate-400">{item.shortName}</div>
                            )}
                            {item.summary && (
                              <div className="text-sm text-slate-400 truncate">{item.summary}</div>
                            )}
                            {item.league && (
                              <div className="text-xs text-slate-500 mt-1">
                                {item.league} · {item.country}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
