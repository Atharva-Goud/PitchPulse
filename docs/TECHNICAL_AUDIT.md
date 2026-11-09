# Technical Audit

## Code Quality

### Strengths
- Clear separation between runtime API data and static synced data
- Zod validation on all static JSON data layers
- Single-flight request deduplication on news refresh
- In-memory cache with TTL on football API calls
- Centralized logo component with cache-race fix (revealed state + rAF checks)
- Shared TeamLogo component (no duplicate implementations)
- Graceful image fallbacks (initials badge instead of broken-image icon)

### Issues Fixed

| Issue | Location | Severity | Fix |
|-------|----------|----------|-----|
| Match detail O(n*m) API calls | `src/components/football/MatchDetailClient.tsx` | High | Replaced client-side league iteration with `/api/matches/lookup?id=` server route + request deduplication |
| Standings query param mismatch | `src/components/home/HomepageSections.tsx` | High | Changed `?competition=` to `?league=` |
| Team page resolution by API club id | `src/lib/data/teams.ts` | High | Now resolves by slug from `src/data/teams/teams.json` first, falls back to API |
| Missing security headers | `next.config.ts` | High | Added X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS |
| Unrestricted local API proxy | `local-api-server.js` | High | CORS restricted, GET-only, path validation, body limit |
| No rate limiting | `src/app/api/*/route.ts` | High | Added rate limiter (30 req/min per IP) |

### Code Duplication
- `getLeaguesPageData` in `src/app/leagues/page.tsx` duplicates logic from `src/app/api/leagues/route.ts`. Consider refactoring to share the discovery function.
- `statValue` function duplicated in `src/app/leagues/page.tsx` and `src/lib/football/api.ts`.

### Unused/Dead Code
- `src/app/api/test-leagues/route.ts` — test endpoint, kept for debugging
- `src/app/test-leagues-client/page.tsx` and `src/app/test-matches-client/page.tsx` — test pages
- `src/scripts/verify-pages.tsx`, `verify-render.tsx`, `verify-worldcup.mjs`, `verify-worldcup-edges.mjs` — verification scripts

### Type Safety
- TypeScript `strict: true` enabled
- All static JSON validated with Zod schemas
- `tsc --noEmit` passes with no errors

## Performance

### Optimizations Applied
1. **Request deduplication** — `fetchFixturesDeduped` in `api.ts` ensures concurrent callers for the same league+status share one promise.
2. **In-memory cache** — 30s TTL cache on football API fetches prevents hammering the rate-limited public API.
3. **Next.js `unstable_cache`** — Server-side caching for leagues, teams, World Cup data.
4. **Request semaphore** — Max 3 concurrent API requests to avoid 429 rate limits.
5. **Single-flight news refresh** — Concurrent callers to `/api/news` share one in-flight refresh promise.

### Potential Bottlenecks
1. **Match detail page** — Still makes 5 sequential API calls after lookup (keyEvents, events, statistics, home form, away form). All run in parallel via `Promise.all`, but each is a separate HTTP request.
2. **Homepage** — Makes 10 parallel data fetches including `getAllTeams()` which fetches clubs from 3 leagues via `fetchAllClubs()`.
3. **Leagues page** — Fetches standings for up to 8 major leagues in parallel on first load.

### Recommendations
- Add `Next.js` Image component with priority for above-the-fold logos
- Consider SWR/stale-while-revalidate for match detail data
- Cache match detail results server-side with `unstable_cache`

## Architecture Score

| Area | Score (0-100) | Notes |
|------|--------------|-------|
| Code Quality | 82 | Clean separation, some duplication |
| Security | 78 | Headers + rate limiting added; Next.js CVEs pending |
| Performance | 80 | Good caching/deduplication; match detail could be optimized |
| Maintainability | 85 | Clear module boundaries, documented patterns |
| Testing | 60 | Basic unit tests added; no E2E or integration tests |
| **Overall** | **77** | |

## Recommended Improvements

1. **Upgrade Next.js** to resolve CVEs (issue #2)
2. **Add E2E tests** with Playwright for critical user flows
3. **Refactor shared logic** between `api/leagues` route and `leagues` page
4. **Add Redis-backed rate limiting** for multi-instance deployments
5. **Cache match detail** server-side to reduce API calls
6. **Add monitoring/alerting** for API rate limit exhaustion
