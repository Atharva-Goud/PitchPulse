import { config } from '../../config/app-config';

interface NewsAPIArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { id: string; name: string };
}

export async function fetchFromNewsAPI(query: string = 'football'): Promise<any[]> {
  if (!config.news.apiKey || config.news.apiKey === 'your_newsapi_key_here') {
    console.warn('NewsAPI key not configured.');
    return [];
  }

  try {
    const url = new URL(`${config.news.baseUrl}/everything`);
    url.searchParams.set('q', query);
    url.searchParams.set('language', 'en');
    url.searchParams.set('sortBy', 'publishedAt');
    url.searchParams.set('pageSize', '20');
    url.searchParams.set('apiKey', config.news.apiKey);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`);

    const data = await res.json();
    return (data.articles || []).map((a: NewsAPIArticle) => ({
      title: a.title,
      summary: a.description || a.title,
      source: a.source.name,
      sourceId: mapSourceId(a.source.id),
      sourceUrl: a.url,
      sourceCredibility: getSourceCredibility(a.source.id),
      image: a.urlToImage,
      category: detectCategory(a.title, a.description),
      publishedAt: a.publishedAt,
      relatedTeams: detectTeams(`${a.title} ${a.description}`),
    }));
  } catch (error) {
    console.error('Failed to fetch from NewsAPI:', error);
    return [];
  }
}

function mapSourceId(sourceId: string | null): string {
  const mapping: Record<string, string> = {
    'bbc-sport': 'bbc-sport',
    'sky-news': 'sky-sports',
    'espn': 'espn-fc',
    'the-guardian-uk': 'guardian-sport',
    'the-athletic': 'the-athletic',
    'reuters': 'reuters-sports',
  };
  return mapping[sourceId || ''] || sourceId || 'unknown';
}

function getSourceCredibility(sourceId: string | null): number {
  const scores: Record<string, number> = {
    'bbc-sport': 92,
    'sky-news': 88,
    'espn': 85,
    'the-guardian-uk': 88,
    'the-athletic': 90,
    'reuters': 95,
  };
  return scores[sourceId || ''] || 60;
}

function detectTeams(text: string): string[] {
  const lower = text.toLowerCase();
  const teams: string[] = [];
  const patterns: [string, string[]][] = [
    ['arsenal', ['arsenal']],
    ['manchester-city', ['man city', 'manchester city']],
    ['manchester-united', ['man utd', 'manchester united']],
    ['liverpool', ['liverpool']],
    ['chelsea', ['chelsea']],
    ['tottenham', ['tottenham', 'spurs']],
    ['real-madrid', ['real madrid']],
    ['barcelona', ['barcelona', 'barca']],
    ['bayern-munich', ['bayern']],
    ['psg', ['psg', 'paris saint-germain']],
  ];
  for (const [id, keywords] of patterns) {
    if (keywords.some(k => lower.includes(k))) teams.push(id);
  }
  return teams;
}

function detectCategory(title: string, summary: string): string {
  const text = `${title} ${summary}`.toLowerCase();
  if (/transfer|sign|deal|bid|fee|rumour|contract|move/i.test(text)) return 'Transfers';
  if (/champions league|ucl/i.test(text)) return 'Champions League';
  if (/premier league/i.test(text)) return 'Premier League';
  if (/la liga/i.test(text)) return 'La Liga';
  if (/serie a/i.test(text)) return 'Serie A';
  if (/bundesliga/i.test(text)) return 'Bundesliga';
  if (/ligue 1/i.test(text)) return 'Ligue 1';
  if (/world cup|euro|international/i.test(text)) return 'International Football';
  return 'Premier League';
}
