# Architecture

PitchPulse is a Next.js 16 (App Router) football dashboard displaying live scores, fixtures, standings, team information, news, and transfers.

## Data Strategies

### 1. Runtime API (`src/lib/football/`)
Matches, fixtures, and standings are fetched at runtime from [worldcup26.ir](https://worldcup26.ir) via `src/lib/football/api.ts`. Results are normalised into `NormalizedMatch` shape.

Key files:
- `src/lib/football/api.ts` — HTTP client with retry, rate limiting (max 3 concurrent), 30s in-memory cache, and request deduplication for fixture fetches.
- `src/lib/football/matches.ts` — Live/upcoming/recent match list accessors.
- `src/lib/football/standings.ts` — Standings accessors with home/away records and form calculation.
- `src/lib/football/types.ts` — `NormalizedMatch` model and status mapping.
- `src/app/api/matches/lookup/route.ts` — Server-side match lookup by ID (avoids O(n*m) client-side league iteration).

### 2. Static Data (`src/scripts/` → `src/data/*.json` → `src/lib/data/`)
News, transfers, teams, and competitions are synced via scripts, validated with Zod, stored as JSON. App imports JSON at build time; accessors validate on read.

Key files:
- `src/scripts/sync-news.ts` — News sync (RSS + NewsAPI → latest.json/trending.json).
- `src/scripts/sync-matches.ts` — Match sync from football API.
- `src/lib/data/news.ts`, `transfers.ts`, `teams.ts`, `matches.ts`, `competitions.ts` — JSON-backed data accessors.
- `src/app/api/news/route.ts` — Server-side news refresh endpoint (single-flight, fallback to snapshot).

### 3. Local Development Proxy (`local-api-server.js`)
Optional Express proxy on port 3050, forwarding to worldcup26.ir with:
- CORS restricted to `localhost:3000`
- GET-only methods
- Path validation
- 1MB body limit

Set `NEXT_PUBLIC_FOOTBALL_API_URL=http://localhost:3050` in `.env.local` to use it.

## Request Flow

```
Client Component
    ↓
Server Component / API Route
    ↓
lib/football/api.ts (cache + dedupe + retry)
    ↓
worldcup26.ir (public API)
```

## Security

- Security headers via `next.config.ts`: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy, HSTS.
- Rate limiting on API routes via `src/lib/security/rate-limit.ts` (30 req/min per IP).
- Input validation on `/api/matches/lookup` (alphanumeric ID format).
- Next.js `images.remotePatterns` restricts allowed image hostnames.
- No secrets in client code; `.env.local` is gitignored.

## Testing

- Vitest configured in `vitest.config.ts`.
- Tests in `src/**/__tests__/*.test.ts`.
- Run with `npm test`.
