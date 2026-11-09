import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/security/rate-limit';
import { getRawFixtureById } from '@/lib/football/matches';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Rate limiting
  const rl = rateLimit(request.headers);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: Math.ceil((rl.reset - Date.now()) / 1000) },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Match id is required' }, { status: 400 });
  }

  // Validate id format - prevent path traversal/injection
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return NextResponse.json({ error: 'Invalid match id format' }, { status: 400 });
  }

  try {
    const result = await getRawFixtureById(id);
    if (!result) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }
    return NextResponse.json({ fixture: result.fixture, league: result.league });
  } catch (error) {
    console.error('api/matches/lookup: lookup failed:', error);
    return NextResponse.json({ error: 'lookup failed' }, { status: 500 });
  }
}
