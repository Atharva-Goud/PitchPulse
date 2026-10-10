'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Trophy, Activity } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Component as LiquidGlass } from '@/components/ui/liquid-glass';
import SearchModal from '@/components/search/SearchModal';

/**
 * Core navigation.
 *
 * Labels match the actual page headings so users never land on a page whose
 * title contradicts the nav item they clicked:
 *   /matches        -> "Matches"       (Match Centre: live, upcoming, results)
 *   /fixtures       -> "Fixtures"      (upcoming schedule)
 *   /standings      -> "Standings"     (league tables)
 *   /leagues        -> "Leagues"       (discover all available competitions)
 *   /news           -> "News"
 *   /transfers      -> "Transfers"
 *   /quiz           -> "Quiz"
 *   /search         -> "Search"
 *   /privacy        -> "Privacy Policy"
 *   /cookie-policy  -> "Cookie Policy"
 *   /terms          -> "Terms & Conditions"
 *
 * Every href resolves to a real route; no dead links.
 */
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/matches', label: 'Matches', icon: Activity },
  { href: '/fixtures', label: 'Fixtures' },
  { href: '/standings', label: 'Standings', icon: Trophy },
  { href: '/leagues', label: 'Leagues', icon: Trophy },
  { href: '/news', label: 'News' },
  { href: '/transfers', label: 'Transfers' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/world-cup-2026', label: 'World Cup 2026', icon: Trophy },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
];

// Desktop: main navigation items (horizontal layout)
const desktopNavItems = [
  { href: '/', label: 'Home' },
  { href: '/matches', label: 'Matches', icon: Activity },
  { href: '/fixtures', label: 'Fixtures' },
  { href: '/standings', label: 'Standings', icon: Trophy },
  { href: '/leagues', label: 'Leagues', icon: Trophy },
  { href: '/news', label: 'News' },
  { href: '/transfers', label: 'Transfers' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/world-cup-2026', label: 'World Cup 2026', icon: Trophy },
];

// Mobile: all navigation items including legal pages (vertical layout)
const mobileNavItems = [
  { href: '/', label: 'Home' },
  { href: '/matches', label: 'Matches', icon: Activity },
  { href: '/fixtures', label: 'Fixtures' },
  { href: '/standings', label: 'Standings', icon: Trophy },
  { href: '/leagues', label: 'Leagues', icon: Trophy },
  { href: '/news', label: 'News' },
  { href: '/transfers', label: 'Transfers' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/world-cup-2026', label: 'World Cup 2026', icon: Trophy },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Trap focus inside the mobile menu while it is open.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const el = mobileMenuRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        toggleBtnRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    el.addEventListener('keydown', onKeyDown);
    return () => el.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Skip to main content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--primary)] focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]/50 focus:ring-offset-2 focus:ring-offset-[var(--surface-0)]"
      >
        Skip to main content
      </a>

      <LiquidGlass
        as="header"
        active={scrolled}
        className="sticky top-0 z-50"
      >
        <div className="container-page">
          <div className="flex h-16 items-center justify-between">
            {/* Left: logo + desktop nav */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2" aria-label="PitchPulse home">
                <img
                  src="/assets/Footballer-logo.svg"
                  alt=""
                  className="h-10 w-10 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-xl font-bold tracking-tight text-white">
                  PITCH<span className="text-[var(--primary)]">PULSE</span>
                </span>
              </Link>

              <nav
                className="ml-8 flex items-center gap-1"
                role="navigation"
                aria-label="Primary navigation"
              >
                {desktopNavItems.map(item => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                        active
                          ? 'text-white'
                          : 'text-[var(--text-secondary)] hover:text-white'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                      {item.label}
                      <span
                        className={`absolute bottom-0 left-1/2 h-0.5 w-0 transition-all duration-200 ease-out -translate-x-1/2 bg-[var(--primary)] ${
                          active ? 'w-full' : 'w-0'
                        }`}
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: search + mobile toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="btn-icon"
                aria-label="Search PitchPulse"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                ref={toggleBtnRef}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="btn-icon md:hidden"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </LiquidGlass>

      {/* Mobile menu — rendered OUTSIDE LiquidGlass to avoid overflow:hidden clipping */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
          className="fixed top-16 left-0 right-0 z-[100] md:hidden border-b border-[var(--border-default)] bg-[var(--surface-1)]/95 backdrop-blur-xl shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto animate-in"
        >
          <nav className="px-4 py-4 space-y-1">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3.5 text-base font-medium rounded-lg transition-colors min-h-[48px] ${
                    active
                      ? 'bg-[var(--primary)]/15 text-white'
                      : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}