import 'dotenv/config';

export const config = {
  football: {
    apiKey: process.env.FOOTBALL_API_KEY || '',
    apiHost: process.env.FOOTBALL_API_HOST || 'api-football-v1.p.rapidapi.com',
    baseUrl: 'https://api-football-v1.p.rapidapi.com/v3',
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
