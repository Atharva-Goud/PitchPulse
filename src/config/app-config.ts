import 'dotenv/config';
import { config as loadEnv } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

// dotenv/config only loads .env by default. In Next.js the app also
// reads .env.local, so load it explicitly here to keep the sync scripts
// (run via tsx outside Next) consistent with the app.
for (const file of ['.env.local', '.env']) {
  const path = resolve(/*turbopackIgnore: true*/ process.cwd(), file);
  if (existsSync(path)) loadEnv({ path });
}

export const config = {
  football: {
    baseUrl: process.env.NEXT_PUBLIC_FOOTBALL_API_URL || 'https://worldcup26.ir/get/soccer',
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
      { name: 'Football Italia', url: 'https://www.football-italia.net/feed/', id: 'football-italia', credibility: 82 },
      { name: 'TalkSPORT Football', url: 'https://talksport.com/football/feed/', id: 'talksport', credibility: 75 },
      { name: 'FourFourTwo', url: 'https://www.fourfourtwo.com/rss', id: 'fourfourtwo', credibility: 85 },
      { name: 'Marca Football', url: 'https://www.marca.com/rss/futbol.xml', id: 'marca', credibility: 82 },
      { name: 'Liverpool Echo LFC', url: 'https://www.liverpoolecho.co.uk/all-about/liverpool-fc/rss.xml', id: 'liverpool-echo', credibility: 80 },
      { name: 'Manchester Evening News MUFC', url: 'https://www.manchestereveningnews.co.uk/all-about/manchester-united-fc/rss.xml', id: 'man-utd-men', credibility: 78 },
    ],
  },
  dataDir: 'src/data',
  maxNewsAge: 48 * 60 * 60 * 1000,
};
