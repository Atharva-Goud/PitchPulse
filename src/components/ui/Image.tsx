'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

/**
 * Image with a graceful placeholder.
 *
 * Visibility is based on the image's actual state rather than only the `load`
 * event: React assigns `src` before attaching the load listener, so an image
 * served from the browser cache can finish loading first and never fire
 * `onLoad`, which used to leave the image stuck at opacity 0. Failing images
 * fall back to the initials placeholder — never a broken-image icon — and each
 * src is requested at most once.
 */
export default function Image({ src, alt, className = '', fill, sizes, priority }: Props) {
  const [hasError, setHasError] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const resolvedSrc = hasError ? null : src && src.trim() ? src.trim() : null;

  useEffect(() => {
    setHasError(false);
    setRevealed(false);
  }, [src]);

  useEffect(() => {
    if (!resolvedSrc) {
      setRevealed(true);
      return;
    }
    setRevealed(false);
    // Same race as the load event: React assigns `src` before attaching the
    // error listener, so a fast failure (DNS, cached error) can be reported
    // before React hears it. Check the image's own state instead of relying
    // only on the event.
    const frame = requestAnimationFrame(() => {
      const el = imgRef.current;
      if (!el || !el.complete) return;
      if (el.naturalWidth > 0) {
        setRevealed(true);
      } else {
        setHasError(true);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [resolvedSrc]);

  const handleError = () => {
    setHasError(true);
  };

  if (resolvedSrc === null) {
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
      ref={imgRef}
      src={resolvedSrc}
      alt={alt}
      srcSet={priority ? `${resolvedSrc}?w=400 400w, ${resolvedSrc}?w=800 800w` : undefined}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={handleError}
      onLoad={() => setRevealed(true)}
      className={`${fill ? 'object-cover' : 'object-cover'} transition-opacity ${revealed ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  );
}
