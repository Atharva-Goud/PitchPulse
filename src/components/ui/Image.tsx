'use client';

import { useState, useEffect } from 'react';

interface Props {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export default function Image({ src, alt, className = '', fill, sizes, priority }: Props) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    setResolvedSrc(src || null);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const validSrc = hasError ? null : resolvedSrc;

  if (validSrc === null) {
    return (
      <div 
        className={`bg-slate-800 flex items-center justify-center ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : {}}
      >
        <span className="text-xs text-slate-600 font-mono">
          {alt.split(' ').map(w => w[0]).slice(0, 3).join('').toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={validSrc}
      alt={alt}
      srcSet={priority ? `${validSrc}?w=400 400w, ${validSrc}?w=800 800w` : undefined}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
     onError={handleError}
      onLoad={handleLoad}
      className={`${fill ? 'object-cover' : 'object-cover'} transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
    />
  );
}