'use client';

import { Search } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { globalSearch } from '@/lib/data';
import FallbackImage from '@/components/ui/Image';
import { resolveTeamLogo } from '@/lib/utils/teams';

interface SearchResult {
  type: string;
  items: Array<{
    id: string;
    name?: string | null;
    title?: string | null;
    logo?: string | null;
    image?: string | null;
    shortName?: string | null;
    summary?: string | null;
  }>;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await globalSearch(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderLogo = (item: any) => {
    const logo = resolveTeamLogo(item);
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-start justify-center pt-20 px-4">
        <div className="w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b border-white/10">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teams, players, news, transfers..."
              className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-lg"
              autoFocus
            />
            {loading && (
              <div className="h-5 w-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {query && !loading && results.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                No results found for &ldquo;{query}&rdquo;
              </div>
            )}

            {results.map((group) => (
              <div key={group.type} className="border-b border-white/5 last:border-0">
                <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-800/50">
                  {group.type}
                </div>
                <div className="divide-y divide-white/5">
                  {group.items.slice(0, 5).map((item) => (
                    <Link
                      key={item.id}
                      href={group.type === 'teams' ? `/teams/${item.id}` : group.type === 'news' ? `/news/${item.id}` : '#'}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                    >
                      {renderLogo(item)}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {item.name || item.title}
                        </div>
                        {item.shortName && (
                          <div className="text-sm text-slate-400">{item.shortName}</div>
                        )}
                        {item.summary && (
                          <div className="text-sm text-slate-400 truncate">{item.summary}</div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-white/10 bg-slate-800/50 flex items-center justify-between text-xs text-slate-400">
            <span>Press ESC to close</span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">/</kbd>
              <span>to search</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
