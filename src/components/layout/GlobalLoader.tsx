'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const FADE_DURATION = 0.5;
const ENTER_DURATION = 0.6;

/**
 * Full-screen app-shell loader.
 *
 * Renders the animated Footballer logo while the app shell loads, then fades
 * out and unmounts once the shell is ready. Dismissal is driven by document
 * readiness and a minimum display time only — never by a data fetch — so an
 * optional API failure can never leave it stuck on screen.
 */
export default function GlobalLoader({ ready }: { ready: boolean }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          key="global-loader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 pointer-events-auto"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={
            reducedMotion
              ? { duration: 0.15 }
              : { duration: FADE_DURATION, ease }
          }
        >
          <div className="relative flex flex-col items-center">
            {/* Soft emerald glow that breathes behind the logo */}
            <motion.div
              className="absolute inset-0 -m-10 rounded-full bg-emerald-500/20 blur-3xl"
              animate={
                reducedMotion
                  ? { opacity: 0.4 }
                  : { opacity: [0.2, 0.45, 0.2] }
              }
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
              }
            />
            <motion.img
              src="/assets/Footballer-logo.svg"
              alt="PitchPulse"
              className="relative h-28 w-28 md:h-36 md:w-36 drop-shadow-2xl pointer-events-none"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { delay: 0.15, duration: ENTER_DURATION, ease }
              }
            />
            <motion.p
              className="mt-5 text-xs font-medium tracking-[0.35em] text-slate-500"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { delay: 0.5, duration: 0.5, ease: 'easeOut' }
              }
            >
              PITCHINTEL
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}