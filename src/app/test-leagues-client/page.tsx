'use client';

import { useEffect, useState } from 'react';
import { getAllLeagueSlugs, fetchAvailableLeaguesRaw } from '@/lib/football/api';

export default function TestLeaguesClient() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);

  useEffect(() => {
    async function test() {
      try {
        const result = await getAllLeagueSlugs();
        console.log('[TestLeaguesClient] getAllLeagueSlugs returned:', result.length, result);
        setSlugs(result);
      } catch (e) {
        console.error('[TestLeaguesClient] getAllLeagueSlugs error:', e);
        setError(String(e));
      }
      
      try {
        const raw = await fetchAvailableLeaguesRaw();
        console.log('[TestLeaguesClient] fetchAvailableLeaguesRaw returned:', raw.length, raw);
      } catch (e) {
        console.error('[TestLeaguesClient] fetchAvailableLeaguesRaw error:', e);
        setRawError(String(e));
      }
    }
    test();
  }, []);

  return (
    <div>
      <h2>Test Leagues Client</h2>
      {error && <p style={{ color: 'red' }}>getAllLeagueSlugs Error: {error}</p>}
      {rawError && <p style={{ color: 'red' }}>fetchAvailableLeaguesRaw Error: {rawError}</p>}
      <p>Count: {slugs.length}</p>
      <ul>
        {slugs.map(s => <li key={s}>{s}</li>)}
      </ul>
    </div>
  );
}