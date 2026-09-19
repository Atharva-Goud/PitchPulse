# PitchPulse

A football dashboard built with Next.js that displays live scores, fixtures, standings, team information, news, and transfers. Data comes from a public football API (worldcup26.ir) and static JSON files synced via scripts.

## Features

- **Matches** — Live matches, upcoming fixtures, and recent results with scores and status
- **Match Details** — Event timeline, statistics, and insights for individual matches
- **Fixtures** — Fixtures grouped by date with competition and team filters
- **Standings** — League tables filterable by competition and season
- **Leagues** — League overview with leaders and quick navigation
- **Teams** — Team pages with upcoming matches, recent results, news, and transfers
- **News** — Latest articles and trending stories with category filters
- **Transfers** — Rumours and confirmed deals with status and reliability
- **Search** — Global search across teams, news, and transfers
- **Quiz** — Football knowledge test with multiple difficulty tiers

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS v4
- **Validation:** Zod
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Date formatting:** date-fns
- **RSS parsing:** rss-parser (sync scripts only)
- **Football API:** worldcup26.ir (public, no key, CORS-enabled)
- **News API:** NewsAPI.org (optional, for sync scripts)

## Architecture

```
worldcup26.ir (football data)
        ↓
Next.js Server Components (runtime fetch)
        ↓
Client Components (interactivity only)
        ↓
User Interface
```

**Two data strategies:**

1. **Runtime API** (`src/lib/football/`) — Matches, fixtures, standings fetched at runtime from worldcup26.ir via `src/lib/football/api.ts`. Normalised into `NormalizedMatch` shape.

2. **Static Data** (`src/scripts/` → `src/data/*.json` → `src/lib/data/`) — News, transfers, teams, competitions synced via scripts, validated with Zod, stored as JSON. App imports JSON at build time; accessors validate on read.

**Local Development:** An optional Express proxy (`local-api-server.js`) runs on port 3050, forwarding to worldcup26.ir with CORS headers. By default the app connects directly to worldcup26.ir; set `NEXT_PUBLIC_FOOTBALL_API_URL=http://localhost:3050` in `.env.local` to route through the proxy instead.

## Project Structure

```
src/
├── app/                    # Next.js routes
│   ├── page.tsx           # Homepage
│   ├── news/              # News page
│   ├── matches/           # Matches + [id] detail
│   ├── fixtures/          # Fixtures page
│   ├── standings/         # Standings page
│   ├── transfers/         # Transfers page
│   ├── search/            # Search page
│   ├── teams/[teamId]/    # Team detail page
│   └── api/               # API routes (leagues, standings)
├── components/
│   ├── layout/            # Header, AppShell, GlobalLoader
│   ├── home/              # Homepage components
│   ├── football/          # Match cards, detail, standings
│   ├── news/              # NewsCard
│   ├── transfers/         # TransferCard
│   ├── teams/             # TeamCard
│   ├── search/            # SearchModal
│   ├── quiz/              # FootballQuiz
│   └── ui/                # Reusable UI (Image, TeamLogo, BeamsBackground, etc.)
├── data/                  # Generated static JSON (news, transfers, teams, competitions)
├── lib/
│   ├── data/              # Async accessors over src/data/*.json
│   ├── football/          # Runtime API client (worldcup26.ir)
│   │   ├── api.ts         # HTTP wrapper, types, rate limiting
│   │   ├── matches.ts     # Normalised match lists
│   │   ├── standings.ts   # Standings accessors
│   │   ├── competitions.ts
│   │   └── types.ts       # NormalizedMatch, etc.
│   ├── engine/            # Credibility, freshness, deduplication
│   ├── schemas/           # Zod schemas + validation
│   └── utils/             # image.ts, teams.ts
├── scripts/               # Sync scripts (run via tsx, not in build)
│   ├── run-sync.ts        # CLI: news | matches | all
│   ├── sync-news.ts
│   ├── sync-matches.ts
│   └── fetchers/          # football-api.ts, rss-news.ts, newsapi.ts
├── types/                 # TypeScript types (Team, NewsArticle, Transfer, etc.)
└── config/                # app-config.ts, source registries
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, live matches, news, transfers, upcoming/results |
| `/news` | News grid with category filters + trending sidebar |
| `/matches` | Match Centre with Live / Upcoming / Results tabs |
| `/matches/[id]` | Match detail with event timeline, statistics, insights |
| `/fixtures` | Fixtures grouped by date, filterable by competition/team |
| `/standings` | League tables filterable by league and season |
| `/transfers` | Transfer Centre with Rumours/Confirmed tabs + status filter |
| `/search` | Global search (teams, news, transfers) |
| `/teams/[teamId]` | Team page: info, matches, news, transfers, standings position |

## Getting Started

```bash
# Install dependencies
npm install

# Copy env template and add keys if needed
cp .env.local.example .env.local

# Run development server (http://localhost:3000)
npm run dev

# Optional: start local API proxy (port 3050) in a separate terminal
# node local-api-server.js
```

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_FOOTBALL_API_URL` | Football API base URL | No (defaults to `https://worldcup26.ir/get/soccer`; set to `http://localhost:3050` for local proxy) |
| `NEWS_API_KEY` | NewsAPI key for news sync | No (sync only) |

**Local:** `.env.local.example` includes `NEXT_PUBLIC_FOOTBALL_API_URL=https://worldcup26.ir/get/soccer`. Optionally override to `http://localhost:3050` if running the local proxy.
**Production:** Set `NEXT_PUBLIC_FOOTBALL_API_URL=https://worldcup26.ir/get/soccer` (or your deployed proxy)

Never commit real API keys. `.env.local` is gitignored.

## Data Sources

- **Matches, Fixtures, Standings** — worldcup26.ir (`/leagues`, `/{league}/fixtures`, `/{league}/standings`, `/{league}/clubs`). Public, no key, rate-limited (exponential backoff retry).
- **News** — RSS feeds (BBC Sport, ESPN FC, The Guardian) + NewsAPI (`newsapi.org/v2/everything`). Synced via `npm run sync:news`.
- **Transfers, Teams, Competitions** — Static JSON in `src/data/` (synced via scripts, no live feed yet).

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (localhost:3000) |
| `npm run build` | Production build + type check |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run sync` | Sync news + matches |
| `npm run sync:news` | Sync news only |
| `npm run sync:matches` | Sync matches only |

## Deployment

Configured for Vercel (`vercel.json`):

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```

Deploy steps:
1. Push to GitHub
2. Import in Vercel dashboard
3. Set `NEXT_PUBLIC_FOOTBALL_API_URL=https://worldcup26.ir/get/soccer` in Vercel Environment Variables
4. Optional: Add `NEWS_API_KEY` if you want fresh news on each deploy

Football data is fetched at runtime (no API key). Static data (news, transfers, teams) bundles with the build.

## Known Limitations

- **Rate limiting** — worldcup26.ir returns 429 under load; client retries with exponential backoff (max 3 attempts)
- **Intermittent empty responses** — API may return 0 results; client retries
- **Transfer data is static** — No live transfer feed; `rumours.json`/`confirmed.json` are hand-maintained
- **No player/squad data** — Team pages show matches, news, transfers only
- **News deduplication** — Title-based only; near-duplicates not merged
- **No dedicated `/teams` index page** — Teams reachable via search or homepage rail