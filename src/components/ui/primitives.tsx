'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

/* ============================================================
   Shared UI primitives for PitchPulse.
   Every component here is a thin wrapper around the design
   tokens in globals.css so markup stays consistent everywhere.
   ============================================================ */

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  asChild?: boolean;
  href?: string;
  children: ReactNode;
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] focus:ring-[var(--border-focus)]/50',
  secondary:
    'bg-[var(--surface-3)] text-white border border-[var(--border-strong)] hover:bg-[var(--surface-2)] hover:border-[var(--border-focus)]/30 focus:ring-[var(--border-focus)]/50',
  accent:
    'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus:ring-[var(--border-focus-accent)]/50',
  ghost:
    'text-[var(--text-secondary)] hover:text-white hover:bg-white/5 focus:ring-[var(--border-focus)]/50',
  danger:
    'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 focus:ring-red-500/50',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  asChild = false,
  href,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--surface-0)] disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (asChild && href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={loading || rest.disabled} {...rest}>
      {loading && (
        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'live' | 'finished' | 'upcoming' | 'warning' | 'neutral' | 'success' | 'brand' | 'accent';
  dot?: boolean;
  children: ReactNode;
}

const badgeVariantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  live: 'bg-[var(--live-bg)] border-[var(--live)]/20 text-[var(--live)]',
  finished:
    'bg-[var(--surface-3)] border-[var(--border-strong)] text-[var(--text-muted)]',
  upcoming: 'bg-[var(--success-bg)] border-[var(--success)]/20 text-[var(--success)]',
  warning: 'bg-[var(--warning-bg)] border-[var(--warning)]/20 text-[var(--warning)]',
  neutral:
    'bg-[var(--surface-3)] border-[var(--border-default)] text-[var(--text-secondary)]',
  success: 'bg-[var(--success-bg)] border-[var(--success)]/20 text-[var(--success)]',
  brand: 'bg-[var(--brand-soft)] border-[var(--brand)]/20 text-[var(--brand)]',
  accent: 'bg-[var(--accent-soft)] border-[var(--accent)]/20 text-[var(--accent)]',
};

export function Badge({
  variant = 'neutral',
  dot = false,
  children,
  className = '',
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeVariantClasses[variant]} ${className}`}
      {...rest}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          {variant === 'live' ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
          )}
        </span>
      )}
      {children}
    </span>
  );
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevated?: boolean;
}

const cardPaddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  hover = true,
  padding = 'md',
  elevated = false,
  className = '',
  children,
  ...rest
}: CardProps) {
  const baseClasses = elevated
    ? 'rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-2)]/80 backdrop-blur-md shadow-[var(--shadow-lg)]'
    : 'rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)]/70 backdrop-blur-sm';

  const hoverClasses = hover && !elevated
    ? 'hover:border-[var(--border-focus)]/30 hover:bg-[var(--surface-3)]/80'
    : '';

  return (
    <div
      className={`relative transition-colors duration-200 ${baseClasses} ${hoverClasses} ${cardPaddingClasses[padding]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}