# PitchPulse

Football intelligence, all in one place. A Next.js app that aggregates
live scores, fixtures, results, transfer news, and team information from
multiple sources into a single dark-themed dashboard.

## Features

- **News** — Latest football articles and trending stories, filtered by
  category (Transfers, Premier League, Champions League, La Liga, Serie A,
  Bundesliga, Ligue 1, International Football). Articles with no source
  image fall back to a deterministic local sample photo.
- **Matches / Match Centre** — Live matches, upcoming fixtures, and recent
  results, each rendered with scores, status, and competition context.
  Match data is fetched at runtime from the football data API.
- **Standings** — League tables with standings, form trends, and
  insights, filterable by league and season.
- **Fixtures** — Browse fixtures grouped by kickoff date, with
  filters for competition and team.
- **Transfers / Transfer Centre** — Rumours and confirmed deals, each with
  a reliability score, source, fee, and status (Rumour, Advanced,
  Negotiating, Confirmed, Completed).
- **Teams** — Per-team pages showing the club's league, country, stadium,
  capacity, upcoming matches, recent results, related news, and transfer
  activity.
- **Leagues** — League overview with standings leaders, fixture snapshots,
  and quick navigation to standings/fixtures per competition.
- **Search** — Global search across teams, news, and transfers, with a
  debounced input, expandable result groups, and a keyboard-accessible
  modal (opened from the header).
- **Quiz** — 30-question Football Knowledge Test with difficulty tiers,
  progress tracking, and instant feedback.
- **Homepage** — Scroll-reveal hero, live match + latest news preview,
  feature cards, and sections for live matches, latest news, transfers,
  upcoming matches, recent results, trending stories, competitions, and
  popular teams.

## Tech Stack

- **Next.js 16.3.4** (App Router, React 19, TypeScript, Tailwind CSS v4)
- **Zod** — runtime schema validation for all data
- **date-fns** — date formatting on the fixtures page
- **framer-motion** — scroll-reveal hero animation
- **lucide-react** — icons
- **rss-parser** — RSS feed parsing during sync
- **dotenv** — environment variable loading for sync scripts
- **express** / **cors** — local API proxy server (`local-api-server.js`)
- **worldcup26.ir** — football data API (live matches, fixtures, standings, teams)

## Architecture

The app uses two data strategies:

1. **Runtime API** (`src/lib/football/`) — Football data (matches, fixtures,
   standings) is fetched at runtime from the worldcup26.ir REST API
   via `src/lib/football/api.ts`. This layer is used by the Matches,
   Fixtures, Standings, and Leagues pages. Data is normalised into a shared
   `NormalizedMatch` shape in `src/lib/football/types.ts`.

2. **Static data** (`src/scripts/fetchers/` → `src/data/*.json` → `src/lib/data/`)
   — News, transfers, teams, and competitions are fetched by sync scripts
   (`src/scripts/`), deduplicated, validated (Zod), and stored as static
   JSON files under `src/data/`. The React app imports those JSON files
   directly; `src/lib/data/*.ts` exposes async accessor functions that run
   `validateData(schema, json)` on every read, so malformed entries are
   silently dropped rather than crashing the UI.

The sync scripts (`src/scripts/`) are run manually via `tsx` outside
Next.js. They are not part of the production build.

**Local API Proxy** — A lightweight Express server (`local-api-server.js`)
proxies requests from `http://localhost:3050` to `worldcup26.ir`,
adding CORS headers and avoiding direct browser-to-external-API calls.
The Next.js app reads `NEXT_PUBLIC_FOOTBALL_API_URL` (default
`http://localhost:3050`) so the same code works locally and in production.

The `/api/leagues` server-side route fetches all leagues + their leaders
(standings only, no fixtures) in one cached call, eliminating the
80–120 API requests that previously triggered 429 Too Many Requests
on the Leagues page.

## Data Flow

**Football data** (matches, fixtures, standings) is fetched at runtime:

1. **Fetch** — `src/lib/football/api.ts` calls the worldcup26.ir REST
   endpoints (`/leagues`, `/{league}/fixtures`, `/{league}/standings`, etc.)
   via the local proxy at `http://localhost:3050`. No API key required.
2. **Cache** — In-memory 30s TTL cache in `api.ts` deduplicates
   concurrent requests across components.
3. **Normalise** — Raw API responses are normalised in
   `src/lib/football/matches.ts` and `src/lib/football/types.ts` into
   the `NormalizedMatch` shape, with home/away teams, kickoff time,
   scores, and status mapped consistently.
4. **Display** — Pages and components consume the normalised data
   directly, with loading, empty, and error states.

**Leagues page optimisation** — The server-side `/api/leagues` route
fetches the league list once, then fetches standings for each league
in parallel on the server (bypassing client-side rate limits), caches
the combined payload, and returns a single JSON response to the client.

**Static data** (news, transfers, teams, competitions) follows the
sync-pipeline approach:

1. **Fetch** — `syncNews()` pulls RSS + NewsAPI articles; transfer and
   team data come from static JSON committed to the repo.
2. **Process** — Articles are deduplicated by normalised title, scored for
   trending (credibility + team relevance + image bonus + 48-hour recency),
   and mapped to the `NewsArticle` schema.
3. **Store** — Results are written atomically (write to `.tmp`, then
   `rename`) into `src/data/news/{latest,trending}.json`,
   `src/data/transfers/{rumours,confirmed}.json`, `src/data/teams/teams.json`,
   `src/data/competitions/competitions.json`.
4. **Display** — The app imports the JSON at build time; accessor functions
   validate on read; pages render with loading, empty, and error states.

```mermaid
flowchart LR
    subgraph Static["Static Data Pipeline"]
        A["RSS / NewsAPI"] --> B["Sync scripts tsx"]
        B --> C["Validate & dedupe Zod"]
        C --> D["Static JSON src/data/"]
        D --> E["Accessors src/lib/data/"]
    end
    subgraph Runtime["Runtime API Pipeline"]
        F["worldcup26.ir"] --> G["lib/football/api.ts"]
        G --> H["Normalise lib/football/types.ts"]
        H --> I["Pages & components"]
    end
    E --> J["News / Transfers / Teams Pages"]
```

## Project Structure

```
.
├── public/
│   └── assets/news/        # 17 sample images used as article fallbacks
├── src/
│   ├── app/                # Next.js routes (see Routes below)
│   │   ├── globals.css
│   │   ├── layout.tsx      # Root layout: BeamsBackground, Header, footer
│   │   ├── page.tsx        # Homepage
│   │   ├── news/page.tsx
│   │   ├── matches/page.tsx
│   │   ├── matches/[id]/page.tsx  # Match detail
│   │   ├── fixtures/page.tsx
│   │   ├── standings/page.tsx
│   │   ├── transfers/page.tsx
│   │   ├── search/page.tsx
│   │   ├── teams/[teamId]/page.tsx
│   │   └── api/standings/route.ts
│   ├── components/
│   │   ├── layout/Header.tsx
│   │   ├── layout/AppShell.tsx
│   │   ├── layout/GlobalLoader.tsx
│   │   ├── home/ContainerScroll.tsx
│   │   ├── football/FootballMatchCard.tsx
│   │   ├── football/MatchDetailClient.tsx
│   │   ├── football/MatchEvents.tsx
│   │   ├── football/MatchStatistics.tsx
│   │   ├── football/MatchInsights.tsx
│   │   ├── football/StandingsTable.tsx
│   │   ├── football/StandingsInsights.tsx
│   │   ├── football/TeamLogo.tsx
│   │   ├── news/NewsCard.tsx
│   │   ├── transfers/TransferCard.tsx
│   │   ├── teams/TeamCard.tsx
│   │   ├── search/SearchModal.tsx
│   │   ├── quiz/FootballQuiz.tsx
│   │   └── ui/             # Image, TeamLogo, BeamsBackground,
│   │                         # GlowCard, SectionHeader, EmptyState,
│   │                         # LoadingState, ErrorState, SourceBadge,
│   │                         # DisclaimerBadge, DataFreshnessIndicator,
│   │                         # LiquidGlass
│   ├── data/               # Generated static JSON (see Data/JSON structure)
│   ├── lib/
│   │   ├── data/           # Async accessors over src/data/*.json
│   │   ├── football/       # Runtime API client (worldcup26.ir)
│   │   │   ├── api.ts      # HTTP wrapper + types
│   │   │   ├── matches.ts    # Normalised match lists
│   │   │   ├── standings.ts  # Standings accessors
│   │   │   ├── competitions.ts
│   │   │   └── types.ts      # Shared NormalizedMatch, etc.
│   │   ├── engine/         # Credibility, freshness, dedup, stale-data,
│   │   │                     # source registry
│   │   ├── schemas/        # Zod schemas + validateData / validateSingle
│   │   ├── constants/news-image-count.ts   # auto-generated
│   │   └── utils/          # image.ts, teams.ts
│   ├── scripts/            # Sync scripts (run via tsx, not in build)
│   │   ├── run-sync.ts     # CLI entry: news | matches | all
│   │   ├── sync-news.ts
│   │   ├── sync-matches.ts
│   │   ├── sync-all.ts
│   │   ├── fetchers/       # football-api.ts, rss-news.ts, newsapi.ts
│   │   ├── scrapers/       # Templates (not wired into sync)
│   │   ├── validators/     # Schema validation + error logging
│   │   ├── processors/     # saveToJson, dedup helpers
│   │   └── update-news-image-count.ts
│   ├── types/              # Team, Player, Competition, NewsArticle,
│   │                         # Transfer, Match, SearchResult, NewsCategory,
│   │                         # TransferStatus, MatchStatus
│   └── config/             # app-config.ts, source registries
└── scripts/strip-placeholder-images.ts
```## Routes

| Route | Page | What it does |
|---|---|---|
| `/` | `src/app/page.tsx` | Homepage: scroll-reveal hero, live match + latest news preview, feature cards, and sections for live matches, latest news, transfers, upcoming matches, recent results, trending stories, competitions, and popular teams |
| `/news` | `src/app/news/page.tsx` | Latest news grid with category filter chips, plus a trending sidebar and quick links |
| `/matches` | `src/app/matches/page.tsx` | Match Centre with Live / Upcoming / Results tabs |
| `/matches/[id]` | `src/app/matches/[id]/page.tsx` | Match detail page with live event feed |
| `/fixtures` | `src/app/fixtures/page.tsx` | Fixtures grouped by kickoff date, with competition/team filters |
| `/standings` | `src/app/standings/page.tsx` | League standings tables, filterable by league and season |
| `/transfers` | `src/app/transfers/page.tsx` | Transfer Centre with Rumours / Confirmed tabs and a status filter |
| `/search` | `src/app/search/page.tsx` | Debounced global search across teams, news, and transfers |
| `/teams/[teamId]` | `src/app/teams/[teamId]/page.tsx` | Team detail page (upcoming matches, recent results, news, transfer activity, team info) |

The header also opens a `SearchModal` (command-palette style) that runs the
same `globalSearch` query.

## Important Components and Utilities

- `NewsCard` (`src/components/news/NewsCard.tsx`) â€” three variants
  (`default`, `featured`, `compact`). `resolveArticleImage()` prefers the
  source image, then falls back to `localNewsImage(article.id)`.
- `FootballMatchCard` (`src/components/football/FootballMatchCard.tsx`) â€”
  `default`, `live`, and `compact` variants; tags historical
  matches (older than 6 months). Used on the homepage, fixtures,
  and match detail pages.
- `MatchCard` (`src/components/matches/MatchCard.tsx`) â€” `default`,
  `live`, and `compact` variants; used on team detail pages.
- `TransferCard` (`src/components/transfers/TransferCard.tsx`) â€”
  `default` and `compact` variants; tags transfers older than 30 days as
  historical.
- `TeamCard` (`src/components/teams/TeamCard.tsx`) â€” `default`, `compact`,
  and `card` variants.
- `FallbackImage` (`src/components/ui/Image.tsx`) â€” renders an `<img>` or,
  when the source is null/errored, an initials placeholder. Supports
  `fill` + `sizes` for fixed-aspect-ratio cards.
- `TeamLogo` (`src/components/ui/TeamLogo.tsx`) â€” logo with initials
  fallback, five sizes.
- `ContainerScroll` (`src/components/home/ContainerScroll.tsx`) â€”
  framer-motion scroll-reveal hero.
- `BeamsBackground` (`src/components/ui/beams-background.tsx`) â€” canvas
  animation, site-wide, respects `prefers-reduced-motion`.
- `GlowCard` (`src/components/ui/spotlight-card.tsx`) â€” mouse-tracking
  radial spotlight card.
- `resolveImageUrl` / `localNewsImage` (`src/lib/utils/image.ts`) â€” image
  normalisation and deterministic local-image mapping.
- `resolveTeamLogo` / `getTeamInitials` (`src/lib/utils/teams.ts`) â€” logo
  normalisation and fallback initials.
- `processItem` (`src/lib/engine/index.ts`) â€” combines credibility,
  freshness, and source-registry data into a single `ProcessedItem`
  (verification, freshness, flags, disclaimer text).

## Data / JSON Structure

All data lives under `src/data/` and is regenerated by the sync scripts.

| File | Contents |
|---|---|
| `src/data/news/latest.json` | 30 most recent articles, newest first |
| `src/data/news/trending.json` | 10 top trending articles by weighted score |
| `src/data/matches/live.json` | Live matches from API-Football |
| `src/data/matches/upcoming.json` | Upcoming fixtures from API-Football |
| `src/data/matches/results.json` | Recent results from API-Football |
| `src/data/teams/teams.json` | 23 teams |
| `src/data/competitions/competitions.json` | 10 competitions |
| `src/data/transfers/rumours.json` | 8 transfer rumours |
| `src/data/transfers/confirmed.json` | 8 confirmed transfers |

Core shapes (see `src/types/index.ts`, `src/lib/schemas/index.ts`,
and `src/lib/football/types.ts`):

- `NewsArticle` â€” `id`, `title`, `summary`, `source` (string or
  `{name, type, url, credibilityScore}`), `sourceUrl`, `image` (nullable),
  `category`, `publishedAt`, plus optional `freshness`, `verification`,
  `relatedTeams`, `relatedPlayers`, `dataStatus`.
- `Match` â€” static match shape written by `sync-matches.ts`
  from API-Football data.
- `NormalizedMatch` (`src/lib/football/types.ts`) â€” runtime
  shape used by the Match Centre, Fixtures, and Standings pages;
  normalised from worldcup26.ir API responses via
  `src/lib/football/matches.ts`.
- `StandingRow` (`src/lib/football/standings.ts`) â€” a single
  row in a league standings table.
- `Transfer` â€” `id`, `player`, `fromClub`, `toClub` (nullable), `status`
  (`Rumour | Advanced | Negotiating | Confirmed | Completed`), `fee`
  (nullable), `source`, `reliability` (0-100), `updatedAt`.
- `Team` â€” `id`, `name`, `shortName`, `logo` (nullable), `country`, `league`,
  optional `founded`, `stadium`, `capacity`.
- `Competition` â€” `id`, `name`, `shortName`, `logo` (nullable), `country`,
  `type` (`league | cup | international`).

## Data Sources

- **Matches, Fixtures, Standings** — worldcup26.ir (`worldcup26.ir/get/soccer/*`),
  public API, no key required, CORS-enabled. Endpoints: `/leagues`,
  `/{league}/fixtures`, `/{league}/standings`, `/{league}/clubs`,
  `/{league}/clubs/{clubId}`. Rate-limited with exponential backoff retry.
- **News** — RSS feeds (BBC Sport, ESPN FC, The Guardian) via
  `rss-parser`, plus NewsAPI (`newsapi.org/v2/everything`).
- **Transfers / Teams / Competitions** — Static JSON committed to the repo
  (no live fetcher wired into sync yet).

Source credibility is tracked in `config/sources/*.json` (publications,
official clubs, journalists, official leagues) and consumed by
`src/lib/engine/source-registry.ts`.

## Environment Variables

Defined in `.env.local` (copy from `.env.local.example`). Never commit
real values â€” `.env` and `.env.local` are gitignored.

| Variable | Purpose | Example |
|---|---|---|
| `NEWS_API_KEY` | NewsAPI key | `your_newsapi_key_here` |

The app itself never reads these at runtime â€” they are only consumed by
the sync scripts. When either key is missing, the corresponding fetcher
logs a warning and returns an empty array, leaving the existing JSON in
place.

## Setup & Installation

```bash
npm install
cp .env.local.example .env.local   # fill in keys if you want live data
npm run dev                       # http://localhost:3000
```

TypeScript and ESLint are configured via the standard Next.js toolchain:

```bash
npm run build      # production build + type check
npm run lint       # eslint
npx tsc --noEmit   # standalone type check
```

## Available npm Commands

| Command | What it runs |
|---|---|
| `npm run dev` | `next dev` â€” development server |
| `npm run build` | `next build` â€” production build |
| `npm run start` | `next start` â€” production server |
| `npm run lint` | `eslint` |
| `npm run sync` | `tsx src/scripts/run-sync.ts` â€” sync news **and** matches (API-Football) |
| `npm run sync:news` | `tsx src/scripts/run-sync.ts news` â€” sync news only |
| `npm run sync:matches` | `tsx src/scripts/run-sync.ts matches` â€” sync match JSON from API-Football
## How Data is Updated

Run a sync from the project root:

```bash
npm run sync            # news + matches
npm run sync:news       # news only
npm run sync:matches    # matches only
```

Each run:

- Fetches from the configured sources (skipping any fetcher whose API key
  is not set).
- Deduplicates, validates against the Zod schemas, and writes the JSON
  atomically.
- Recomputes `src/lib/constants/news-image-count.ts` from
  `public/assets/news/` so article image fallbacks stay in sync with the
  sample images on disk.

After adding or removing images in `public/assets/news/`, re-run
`npm run sync:news` (or any sync) to refresh the count.

## Deployment

The app is configured for Vercel (`vercel.json`):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```

To deploy:

1. Push the repo to GitHub (already on `origin/main`).
2. In the Vercel dashboard, **Import Project** â†’ select
   `Atharva-Goud/PitchPulse`.
3. Vercel auto-detects `next.config.ts` as Next.js, runs `npm install`
   and `npm run build`, and deploys. No environment variables are needed â€”
   football data is fetched at runtime from worldcup26.ir (no API key),
   and static data (news, transfers, teams) ships as bundled JSON.

## Known Limitations

- **Rate limiting** — The worldcup26.ir public endpoint enforces a
  fair-use cap. When exceeded it returns HTTP 429; the client
  retries with exponential backoff.
- **Intermittent empty API responses** — The API can return 0 results,
  likely due to rate limiting. The client retries with exponential
  backoff (up to 3 attempts).
- **Transfer data is static** — `rumours.json` and `confirmed.json` are
  hand-maintained; there is no live transfer feed wired into sync yet (the
  `scrapers/` templates exist but are not called).
- **No player data on team pages** — team pages show matches, news, and
  transfers, but not squad/player details.
- **News deduplication is title-based** — near-duplicate headlines with
  different wording are not merged.

## Potential Future Improvements

- Add more data from the worldcup26.ir API (club squads, event
  plays, coach data).
- Wire the `scrapers/` templates (Transfermarkt, Fabrizio Romano, etc.) into
  the sync pipeline for live transfer data.
- Add a dedicated `/teams` index page (currently teams are only reachable
  via search or the homepage's "Popular Teams" rail).
- Add team squad / player detail pages.
- Add a `/competitions/[id]` page for league standings and form tables.
- Server-side rendering of data accessors instead of client-side fetch
  on every navigation.
- Persist sync results (last-run timestamp, items found) and surface a
  data-freshness banner on pages that depend on fresh data.
- Replace the deterministic local-image fallback with AI-generated or
  context-specific imagery once a suitable source is available.

