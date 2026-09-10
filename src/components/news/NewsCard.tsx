'use client';

import Link from 'next/link';
import { Clock, ExternalLink } from 'lucide-react';
import { NewsArticle, SourceObject } from '@/types';
import { resolveImageUrl, localNewsImage } from '@/lib/utils/image';
import FallbackImage from '@/components/ui/Image';

interface Props {
  article: NewsArticle;
  variant?: 'default' | 'featured' | 'compact';
}

function getSourceName(source: string | SourceObject): string {
  return typeof source === 'string' ? source : source.name;
}

function getSourceUrl(source: string | SourceObject): string {
  return typeof source === 'string' ? '' : (source.url || '');
}

/**
 * Prefer the source image, but fall back to a local sample image when the
 * article has none. The fallback is deterministic per article id so the same
 * article always maps to the same photo.
 */
function resolveArticleImage(article: NewsArticle): string | null {
  const sourceUrl = resolveImageUrl(article);
  if (sourceUrl) return sourceUrl;
  return localNewsImage(article.id);
}

export default function NewsCard({ article, variant = 'default' }: Props) {
  const sourceName = getSourceName(article.source);
  const imageUrl = resolveArticleImage(article);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const categoryColors: Record<string, string> = {
    'Transfers': 'bg-emerald-500/20 text-emerald-400',
    'Premier League': 'bg-blue-500/20 text-blue-400',
    'Champions League': 'bg-purple-500/20 text-purple-400',
    'La Liga': 'bg-red-500/20 text-red-400',
    'Serie A': 'bg-amber-500/20 text-amber-400',
    'Bundesliga': 'bg-red-500/20 text-red-400',
    'Ligue 1': 'bg-indigo-500/20 text-indigo-400',
    'International Football': 'bg-teal-500/20 text-teal-400',
  };

  const categoryClass = categoryColors[article.category] || 'bg-slate-500/20 text-slate-400';

  const imageContainerClass = 'relative overflow-hidden bg-slate-800';

  if (variant === 'compact') {
    return (
      <Link
        href={article.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors group"
      >
        <div className="relative h-20 w-28 rounded-lg flex-shrink-0">
          <FallbackImage src={imageUrl} alt={article.title} className="absolute inset-0" />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-xs px-2 py-0.5 rounded ${categoryClass}`}>
            {article.category}
          </span>
          <h3 className="mt-1 text-sm font-medium text-white line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <span>{sourceName}</span>
            <span>·</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="relative group rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
        <Link href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
          <div className="relative aspect-video">
            <FallbackImage src={imageUrl} alt={article.title} className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent" />
          </div>
        </Link>

        <div className="absolute top-4 left-4 right-4">
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${categoryClass}`}>
            {article.category}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="text-xs text-slate-400">{sourceName}</span>
          </div>
          <Link
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <h2 className="text-2xl font-bold text-white line-clamp-2 group-hover:text-emerald-400 transition-colors">
              {article.title}
            </h2>
          </Link>
          <p className="mt-2 text-slate-300 line-clamp-2">{article.summary}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <Link
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
            >
              Read more
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group rounded-xl overflow-hidden bg-slate-900 border border-white/10 hover:border-emerald-500/30 transition-colors">
      <Link href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative aspect-[16/10]">
          <FallbackImage src={imageUrl} alt={article.title} className="absolute inset-0" />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded ${categoryClass}`}>
            {article.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(article.publishedAt)}
          </span>
        </div>

        <Link
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h3 className="font-semibold text-white line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {article.title}
          </h3>
        </Link>

        <p className="mt-2 text-sm text-slate-300 line-clamp-2">{article.summary}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">{sourceName}</span>
          <Link
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}