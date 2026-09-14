'use client';

import { useEffect, useState } from 'react';
import GlobalLoader from '@/components/layout/GlobalLoader';

/**
 * Root app-shell wrapper.
 *
 * Renders the app content plus a full-screen loader until the shell is
 * "ready". Readiness is resolved by:
 *   1. A minimum display time (so the logo animation is visible for the
 *      intended 3-4s window).
 *   2. The document being fully loaded (all initial HTML parsed and initial
 *      scripts executed).
 *
 * The minimum display time always wins: even if the document finishes loading
 * before the timer fires, the loader stays on screen until the timer elapses.
 *
 * Crucially, readiness is NOT tied to any data fetch, so an optional API
 * failure (e.g. the football data API being unreachable) can never keep the
 * loader on screen — the shell always becomes interactive on its own.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Minimum display time lands in the intended 3–4s window; the 0.5s
    // fade-out in GlobalLoader extends total visible time to ~3.5s.
    const MIN_DISPLAY_MS = 3000;

    let settled = false;

    const markReady = () => {
      if (settled) return;
      settled = true;
      setReady(true);
    };

    // Always enforce the minimum display time on initial load. This is the
    // primary trigger; it guarantees the animation plays for the intended
    // window regardless of how fast the document finishes loading.
    const timer = window.setTimeout(markReady, MIN_DISPLAY_MS);

    // If the document is not yet fully loaded, also dismiss as soon as it
    // finishes — but never before the timer above has fired.
    if (document.readyState !== 'complete') {
      const onReady = () => window.setTimeout(markReady, 0);
      window.addEventListener('load', onReady, { once: true });
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener('load', onReady);
      };
    }

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <GlobalLoader ready={ready} />
      {children}
    </>
  );
}