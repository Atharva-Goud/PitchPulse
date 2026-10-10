# Football Logos

Local team and competition logos served from `public/assets/logos/`.

## Folder structure

```
public/assets/logos/
├── clubs/
│   ├── england/
│   │   ├── premier-league/      # Premier League clubs
│   │   └── championship/        # Championship clubs
│   ├── germany/
│   │   ├── bundesliga/          # Bundesliga clubs
│   │   └── 2-bundesliga/        # 2. Bundesliga clubs
│   ├── spain/
│   │   └── la-liga/             # La Liga clubs
│   ├── france/
│   │   └── ligue-1/             # Ligue 1 clubs
│   └── italy/
│       └── serie-a/             # Serie A clubs
├── international/
│   ├── world-cup-2026/          # FIFA World Cup 2026 national teams
│   └── nations-league/          # UEFA Nations League national teams
└── uefa/
    ├── champions-league/        # UEFA Champions League
    ├── europa-league/           # UEFA Europa League
    └── conference-league/       # UEFA Conference League
```

Each competition folder holds one PNG per team, named after the team slug:

```
clubs/england/premier-league/arsenal.png
clubs/spain/la-liga/real-madrid.png
international/world-cup-2026/england-national-team.png
uefa/champions-league/real-madrid.png
```

## Filename conventions

- **Format:** PNG (the uploaded set is PNG; 256×256, 3–15 KB each)
- **Naming:** lowercase kebab-case, matching the team slug
- Examples: `arsenal.png`, `real-madrid.png`, `bayern-munchen.png`,
  `england-national-team.png`
- Filenames are the team slug **as uploaded** — they are not always the same
  string as the team's canonical id (e.g. Bayern Munich's file is
  `bayern-munchen.png`, Portugal's is `portuguese-football-federation.png`).
  Those differences are handled by the `logoFile` field in the mapping.

## How resolution works

```
Team (id / apiId / name / shortName)
   │
   ├── 1. Look up the team in LOGO_MAPPINGS (exact id, apiId, name or alias)
   │        └── map to a file: logoFile → id → name → aliases → shortName
   ├── 2. Otherwise, exact filename-stem match against uploaded files
   │
   └── 3. Otherwise no local logo → API logo → initials badge
```

Every step is **exact matching only** — never partial or substring — so a team
cannot be given another club's logo. And because every candidate file must
exist in the generated manifest, a path can never point at a missing file.

Resulting URL: `/assets/logos/clubs/england/premier-league/arsenal.png`

## The generated manifest

`src/lib/data/logo-manifest.ts` is generated from the files on disk. It is the
single source of truth for which logos exist — the resolver never returns a path
that is absent from it.

Regenerate it whenever logos are added, removed or renamed:

```bash
npx tsx scripts/generate-logo-manifest.ts
```

When a club appears in several folders (e.g. Arsenal in both `premier-league/`
and `uefa/champions-league/`), the manifest keeps exactly one asset, preferring
domestic competitions over European ones. A club's crest does not change between
competitions, so club logos are not duplicated into `uefa/` — that folder holds
only clubs that appear in no domestic folder here.

## Adding a new logo

1. Put the PNG in the right competition folder,
   e.g. `public/assets/logos/clubs/england/premier-league/leicester.png`
2. Regenerate the manifest (command above)
3. If the team is not already in `LOGO_MAPPINGS`, add an entry in
   `src/lib/utils/logo-mapping.ts`:

```typescript
{ id: 'leicester', name: 'Leicester City', shortName: 'LEI',
  country: 'England', competition: 'premier-league', type: 'club' }
```

   If the uploaded filename differs from the id, add `logoFile`:

```typescript
{ id: 'bayern-munich', name: 'Bayern Munich', shortName: 'BAY',
  country: 'Germany', competition: 'bundesliga', type: 'club',
  logoFile: 'bayern-munchen' }
```

Steps 2 and 3 are optional for clubs whose slug is self-explanatory, because
step 2 of resolution (exact filename match) already covers them.

## Registering a team

A mapping entry in `src/lib/utils/logo-mapping.ts` is:

```typescript
{
  id: 'team-slug',              // canonical id; also the SVG/PNG filename stem
  name: 'Official Team Name',
  shortName: 'ABC',
  country: 'England',
  competition: 'premier-league',
  type: 'club',                 // 'club' | 'national'
  apiId: '42',                  // only if verified against real API data
  aliases: ['Arsenal FC'],      // other exact names seen in real data
  logoFile: 'arsenal',          // only when the filename differs from `id`
}
```

Do not invent ids or api ids. A wrong `logoFile` is harmless (it is ignored if
no such file exists), but a wrong `apiId` can attach the wrong crest, so leave
that field empty unless you have verified the number.

## Fallback behaviour

`src/components/football/TeamLogo.tsx` and `src/components/ui/TeamLogo.tsx`
render one `<img>` and react to `onError` by advancing to the next candidate:

1. Local PNG from `public/assets/logos/`
2. API-provided logo URL
3. Team initials badge (e.g. "ARS") in a slate circle

Because the candidates are tried in order and exhausting them shows the
initials badge, there is never a broken-image icon and the layout never shifts.
This logic lives in the shared components only — no other place implements its
own fallback.

Raster logos are displayed with `object-contain` inside a fixed circular
container sized by the `size` prop (`xs` → `xl`), so aspect ratios and
responsive layout are preserved for both square club crests and taller national
team badges.

## Verification

```bash
npx tsx scripts/generate-logo-manifest.ts   # rescan the folder
npx tsx scripts/diagnose-logos.ts           # coverage: mapped vs. uploaded
npx tsx scripts/verify-logos.ts             # correctness against real API data
npx tsc --noEmit                            # type check
npx next build                              # build
```

## Notes

- Logos are served from the app's own origin; none are fetched at runtime from
  third-party sites. The API logo URL is only used as a fallback when no local
  file is available, exactly as it was before local logos existed.
- Verify licensing/rights before shipping these crests publicly.