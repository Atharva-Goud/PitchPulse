'use client';

import { useEffect, useState } from 'react';

/**
 * Reports whether the component has mounted on the client.
 *
 * Used to gate time-relative labels ("5m ago") that must not be rendered
 * during server prerender: a prerendered label is computed at build time and
 * will not match the client render, which fails hydration.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export default useMounted;
