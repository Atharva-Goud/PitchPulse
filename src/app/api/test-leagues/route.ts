import { getAllLeagueSlugs } from '@/lib/football/api';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/security/rate-limit';

export async function GET(request: Request) {
  // Rate limiting
  const rl = rateLimit(request.headers);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: Math.ceil((rl.reset - Date.now()) / 1000) },
      { status: 429 }
    );
  }

  try {
    const slugs = await getAllLeagueSlugs();
    return NextResponse.json({ slugs, count: slugs.length });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
