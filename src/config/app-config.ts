import 'dotenv/config';
import { config as loadEnv } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

// dotenv/config only loads .env by default. In Next.js the app also
// reads .env.local, so load it explicitly here to keep the sync scripts
// (run via tsx outside Next) consistent with the app.
for (const file of ['.env.local', '.env']) {
  const path = resolve(process.cwd(), file);
  if (existsSync(path)) loadEnv({ path });
}

export const config = {
  football: {
    apiKey: process.env.FOOTBALL_API_KEY || '',
    apiHost: process.env.FOOTBALL_API_HOST || 'api-football-v1.p.rapidapi.com',
    // The host already includes the version segment (e.g.
    // v3.football.api-sports.io), so the base URL must NOT add /v3 again.
    baseUrl: `https://${process.env.FOOTBALL_API_HOST || 'api-football-v1.p.rapidapi.com'}`,
  },
  news: {
    apiKey: process.env.NEWS_API_KEY || '',
    baseUrl: 'https://newsapi.org/v2',
  },
  rss: {
    feeds: [
      { name: 'BBC Sport Football', url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', id: 'bbc-sport', credibility: 92 },
      { name: 'ESPN FC', url: 'https://www.espn.com/espn/rss/soccer/news', id: 'espn-fc', credibility: 85 },
      { name: 'The Guardian Football', url: 'https://www.theguardian.com/football/rss', id: 'guardian-sport', credibility: 88 },
    ],
  },
  dataDir: 'src/data',
  maxNewsAge: 48 * 60 * 60 * 1000,
};
