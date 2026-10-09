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
      { name: 'Sky Sports Football', url: 'https://www.skysports.com/rss/12040', id: 'sky-sports', credibility: 90 },
      { name: 'Goal.com', url: 'https://www.goal.com/en/feeds/news', id: 'goal', credibility: 80 },
      { name: 'Football Italia', url: 'https://www.football-italia.net/feed/', id: 'football-italia', credibility: 82 },
      { name: 'OneFootball', url: 'https://onefootball.com/en/rss', id: 'onefootball', credibility: 78 },
      { name: 'TalkSPORT Football', url: 'https://talksport.com/football/feed/', id: 'talksport', credibility: 75 },
      { name: '90min Football', url: 'https://www.90min.com/posts/rss', id: '90min', credibility: 75 },
      { name: 'Football365', url: 'https://www.football365.com/feed', id: 'football365', credibility: 80 },
      { name: 'FourFourTwo', url: 'https://www.fourfourtwo.com/rss', id: 'fourfourtwo', credibility: 85 },
      { name: 'Marca Football', url: 'https://www.marca.com/rss/futbol.xml', id: 'marca', credibility: 82 },
      { name: 'AS Football', url: 'https://as.com/rss/tags/ultimas_noticias_futbol.xml', id: 'as', credibility: 82 },
      { name: "L'Equipe Football", url: 'https://www.lequipe.fr/Football/rss', id: 'lequipe', credibility: 88 },
      { name: 'Gazzetta dello Sport', url: 'https://www.gazzetta.it/rss/calcio.xml', id: 'gazzetta', credibility: 85 },
      { name: 'Kicker', url: 'https://www.kicker.de/news/fussball/rss.xml', id: 'kicker', credibility: 88 },
      { name: 'Mundo Deportivo', url: 'https://www.mundodeportivo.com/rss/football.xml', id: 'mundodeportivo', credibility: 82 },
      { name: 'Sport.es', url: 'https://www.sport.es/rss/football.xml', id: 'sport', credibility: 80 },
      { name: 'Football London', url: 'https://www.football.london/all-about/football/rss.xml', id: 'football-london', credibility: 78 },
      { name: 'Liverpool Echo LFC', url: 'https://www.liverpoolecho.co.uk/all-about/liverpool-fc/rss.xml', id: 'liverpool-echo', credibility: 80 },
      { name: 'Manchester Evening News MUFC', url: 'https://www.manchestereveningnews.co.uk/all-about/manchester-united-fc/rss.xml', id: 'man-utd-men', credibility: 78 },
    ],
  },
  dataDir: 'src/data',
  maxNewsAge: 48 * 60 * 60 * 1000,
};
