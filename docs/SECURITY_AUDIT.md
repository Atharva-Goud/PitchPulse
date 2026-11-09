# Security Audit

## Overview

Security audit of PitchPulse repository covering authentication, API security, input validation, dependencies, and configuration.

## Vulnerabilities Fixed

### Critical — Next.js CVEs (deferred, requires major-version upgrade)
| CVE | Advisory | Status |
|-----|----------|--------|
| GHSA-2464-fhr4-w9xw | Unauthenticated RCE in Image Optimization API (SVG) | Deferred — requires `npm audit fix --force` (Next.js 16.4.2+, breaking change) |
| GHSA-cjq9-62q9-8jv4 | SSRF in Image Optimization | Deferred — same as above |
| GHSA-mcj8-r9mp-w47p | Cache poisoning in SSG/ISR | Deferred — same as above |
| GHSA-p3m5-59mp-jv5r | DoS in App Router using Server Actions | Deferred — same as above |
| GHSA-f87g-xv8r-7p7x | Information disclosure in App Router metadata image routes | Deferred — same as above |
| GHSA-h694-7cp9-m8p3 | Cache leak across root param values | Deferred — same as above |
| GHSA-673q-mjm6-r5xr | RCE in `use cache` functions returning typed arrays | Deferred — same as above |

**Remediation:** Run `npm audit fix --force` to upgrade Next.js to 16.4.2+. Test thoroughly before deploying — this is a major version bump with potential breaking changes. Tracked in GitHub issue #2.

### High — Resolved

| Issue | Location | Fix |
|-------|----------|-----|
| Missing security headers | `next.config.ts` | Added X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy, HSTS |
| Unrestricted CORS on local API proxy | `local-api-server.js` | Restricted to `localhost:3000`, GET-only, path validation, 1MB body limit |
| No rate limiting on API routes | `src/app/api/*/route.ts` | Added in-memory rate limiter (30 req/min per IP) via `src/lib/security/rate-limit.ts` |
| No input validation on match lookup | `src/app/api/matches/lookup/route.ts` | Added alphanumeric ID validation |
| Match detail O(n*m) API calls | `src/components/football/MatchDetailClient.tsx` | Replaced client-side league iteration with server-side `/api/matches/lookup?id=` route with request deduplication |
| Standings query param mismatch | `src/components/home/HomepageSections.tsx` | Changed `?competition=` to `?league=` to match standings page |

### Dependencies

`npm audit fix` resolved:
- `sharp` < 0.35.5 (CVE-2026-96889) → fixed
- `source-map-js` 1.0.0-1.2.1 (event-loop DoS) → fixed

Remaining: Next.js CVEs require `--force` major upgrade (see Critical above).

## Security Headers

All routes receive:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

## API Rate Limiting

Applied to `/api/news`, `/api/standings`, `/api/leagues`, `/api/test-leagues`, `/api/matches/lookup`:
- 30 requests per minute per IP (in-memory sliding window)
- 429 response with `retryAfter` when exceeded

## Input Validation

- `/api/matches/lookup?id=`: ID must match `/^[a-zA-Z0-9_-]+$/` (prevents path traversal/injection)
- News API: `page` (1+), `limit` (1-100), `category` (string)
- Image hostnames restricted via `next.config.ts` `images.remotePatterns`

## Secrets

- No hardcoded secrets in repository.
- `NEWS_API_KEY` is optional and only used by sync scripts (not client code).
- `.env.local` is gitignored; `.env.local.example` provides template.

## Remaining Risks

1. **Next.js major-version upgrade** — Required to resolve 7 CVEs (1 critical, 6 high). Deferred due to breaking changes. See issue #2.
2. **Rate limiter is in-memory** — Not effective across multiple serverless instances. Consider Redis for multi-node deployments.
3. **No authentication/authorization** — Site is public read-only; no user accounts or protected routes currently exist.
