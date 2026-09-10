'use client';

import React, { ReactNode } from 'react';

type Tag = 'div' | 'header' | 'section' | 'nav' | 'aside';

interface LiquidGlassProps {
  children: ReactNode;
  className?: string;
  as?: Tag;
  /**
   * When true the frosted-glass appearance is applied (backdrop blur,
   * transparency, subtle border and shadow). When false the element renders
   * with its normal solid appearance. The switch is animated via CSS
   * transitions so the effect fades in and out smoothly.
   */
  active?: boolean;
}

const highlightStyle: React.CSSProperties = { borderRadius: 'inherit' };

/**
 * A subtle liquid-glass / frosted-glass styling wrapper.
 *
 * Designed to be intentionally minimal and premium: a semi-transparent
 * dark base, generous backdrop blur, a faint hairline border and a soft
 * drop shadow. An inner highlight line and a gradient sheen give the glass a
 * lit, dimensional feel without going overboard.
 *
 * Toggle `active` to transition between a normal solid appearance and the
 * glass look — ideal for a navigation header that only goes glassy after the
 * user scrolls.
 */
const Component = ({
  children,
  className = '',
  as = 'div',
  active = true,
}: LiquidGlassProps) => {
  const Tag = as as React.ElementType;

  return (
    <Tag
      className={`relative overflow-hidden transition-all duration-300 ease-out ${
        active
          ? 'bg-slate-950/40 backdrop-blur-xl border border-white/15 shadow-lg shadow-black/20'
          : 'bg-slate-950/95 backdrop-blur-sm border border-white/10'
      } ${className}`}
    >
      {/* Inner top highlight — gives the glass a lit edge. */}
      <span
        style={highlightStyle}
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/6 to-transparent"
      />
      {/* Subtle inner border sheen. */}
      <span
        style={highlightStyle}
        className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
      />
      <div className="relative z-10">{children}</div>
    </Tag>
  );
};

export { Component };
export default Component;