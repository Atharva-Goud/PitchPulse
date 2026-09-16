'use client';

import { useEffect, useState } from 'react';
import { getLiveMatchList } from '@/lib/football/matches';
import type { NormalizedMatch } from '@/lib/football/types';

export default function TestMatchesClient() {
  const [matches, setMatches] = useState<NormalizedMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[TestMatchesClient] useEffect running');
    async function test() {
      try {
        console.log('[TestMatchesClient] calling getLiveMatchList');
        const result = await getLiveMatchList();
        console.log('[TestMatchesClient] getLiveMatchList returned:', result.length, result);
        setMatches(result);
      } catch (e) {
        console.error('[TestMatchesClient] error:', e);
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    test();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Test Matches Client</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <p>Count: {matches.length}</p>
      <ul>
        {matches.map(m => <li key={m.id}>{m.homeTeam.name} vs {m.awayTeam.name} - {m.status}</li>)}
      </ul>
    </div>
  );
}