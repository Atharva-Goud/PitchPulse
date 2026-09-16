import { getAllLeagueSlugs } from '@/lib/football/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const slugs = await getAllLeagueSlugs();
    return NextResponse.json({ slugs, count: slugs.length });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}