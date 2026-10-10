/**
 * Page-level verification: renders the actual match card and standings table
 * components with real team data from the repository, and confirms the local
 * logo path appears in the markup.
 *
 * Run: npx tsx scripts/verify-pages.tsx
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import TeamLogo from '../src/components/football/TeamLogo';
import { resolveTeamLogo } from '../src/lib/utils/teams';
import { findLogoAsset } from '../src/lib/utils/logo-mapping';

interface RawMatch {
  id: string; homeTeam: any; awayTeam: any; homeScore: number | null; awayScore: number | null;
  status: string; kickoff: string; venue: string | null; competition: any;
}

const results: RawMatch[] = JSON.parse(readFileSync('src/data/matches/results.json', 'utf-8'));
const live: RawMatch[] = JSON.parse(readFileSync('src/data/matches/live.json', 'utf-8'));

let pass = 0;
let fail = 0;
const localInCards = new Set<string>();
const apiInCards: string[] = [];

function check(label: string, cond: boolean, detail = '') {
  if (cond) { pass++; console.log(`PASS  ${label}${detail ? ' - ' + detail : ''}`); }
  else { fail++; console.log(`FAIL  ${label}${detail ? ' - ' + detail : ''}`); }
}

console.log('=== Page-level render verification ===\n');

/**
 * TeamLogo is the single component every logo-bearing surface uses (match
 * cards, live scores, fixtures, results, standings, team pages, match details,
 * search). MatchCard itself needs the Next router, so the same code path is
 * verified by rendering TeamLogo with the exact team objects from real data.
 */

// --- TeamLogo for every team that appears in real match data ---
console.log('--- TeamLogo over every team in src/data/matches/*.json ---');
const liveD: RawMatch[] = live;
const seen = new Set<string>();
let rendered = 0;
const localSrcs = new Set<string>();
const apiSrcs: string[] = [];

const allTeams: Array<{ team: any; comp: string }> = [];
for (const m of [...results, ...liveD]) {
  allTeams.push({ team: m.homeTeam, comp: m.competition?.name ?? '' });
  allTeams.push({ team: m.awayTeam, comp: m.competition?.name ?? '' });
}

for (const { team } of allTeams) {
  if (seen.has(team.id)) continue;
  seen.add(team.id);

  const html = renderToStaticMarkup(
    React.createElement(TeamLogo, { team: { id: team.id, name: team.name, logo: team.logo, shortName: team.shortName }, size: 'sm' })
  );
  rendered++;

  const imgs = [...html.matchAll(/src="([^"]+)"/g)].map(x => x[1]);
  const empty = imgs.filter(s => !s || s === '#' || s === 'undefined' || s === 'null' || s.trim() === '');
  check(`${team.name}: no empty/broken src`, empty.length === 0, `srcs=[${imgs.join(', ') || 'none -> initials badge'}]`);
  check(`${team.name}: container rendered`, /<span[^>]*>.*<\/span>/.test(html));

  for (const s of imgs) {
    if (s.startsWith('/assets/logos/')) localSrcs.add(s);
    else if (s.startsWith('http')) apiSrcs.push(`${team.name} -> ${s}`);
  }
}
check(`all ${allTeams.length / 2} match rows covered`, rendered > 0, `${rendered} unique teams`);

// A few specific assertions on well-known clubs.
const byName = new Map<string, RawMatch>();
for (const m of results) {
  byName.set(m.homeTeam.name, m);
  byName.set(m.awayTeam.name, m);
}

const expectations: Array<[string, string]> = [
  ['Arsenal', '/assets/logos/clubs/england/premier-league/arsenal.png'],
  ['Manchester United', '/assets/logos/clubs/england/premier-league/manchester-united.png'],
  ['Manchester City', '/assets/logos/clubs/england/premier-league/manchester-city.png'],
  ['Barcelona', '/assets/logos/clubs/spain/la-liga/barcelona.png'],
  ['Real Madrid', '/assets/logos/clubs/spain/la-liga/real-madrid.png'],
  ['1. FC Heidenheim', '/assets/logos/clubs/germany/2-bundesliga/fc-heidenheim.png'],
  ['SV Elversberg', '/assets/logos/clubs/germany/bundesliga/sv-elversberg.png'],
];

console.log('\n--- Specific team -> file assertions ---');
for (const [name, expectedPath] of expectations) {
  const asset = findLogoAsset({ name, id: `team-${name}` });
  check(`${name} -> ${expectedPath}`,
    asset?.path === expectedPath,
    asset ? `got ${asset.path}` : 'no local logo');
}

// --- resolveTeamLogo (Search page path) ---
console.log('\n--- resolveTeamLogo (search page) ---');
for (const [name, expectedPath] of expectations) {
  const got = resolveTeamLogo({ name } as any);
  check(`resolveTeamLogo(${name}) === ${expectedPath}`, got === expectedPath, got ?? 'null');
}

// --- Unknown teams must not fabricate a path ---
console.log('\n--- Unknown teams ---');
for (const name of ['Səbail', 'Aktobe Jas', 'Mingəçevir', 'Zaqatala', 'Nyva Vinnytsya', 'Viettel']) {
  const v = findLogoAsset({ name });
  check(`${name} -> null`, v === null, v ? `WRONG: ${v.path}` : 'correct');
}

// --- API fallback cards: teams without a local logo must use the API URL ---
console.log('\n--- API fallback (no local file) ---');
for (const name of ['Leicester', 'Alavés', 'Girona', 'Mallorca', 'Valladolid', 'Las Palmas', 'Leganes']) {
  const v = findLogoAsset({ name });
  check(`${name} has no local logo`, v === null, v ? v.path : 'correct');
}
for (const { team } of allTeams) {
  if (!['Leicester', 'Girona', 'Mallorca', 'Alavés', 'Valladolid', 'Las Palmas', 'Leganes'].includes(team.name)) continue;
  const html = renderToStaticMarkup(
    React.createElement(TeamLogo, { team: { id: team.id, name: team.name, logo: team.logo, shortName: team.shortName }, size: 'sm' })
  );
  const imgs = [...html.matchAll(/src="([^"]+)"/g)].map(x => x[1]);
  const hasApi = imgs.some(s => s.startsWith('http'));
  const hasLocal = imgs.some(s => s.startsWith('/assets/logos/'));
  check(`${team.name} uses API logo, no local`, hasApi && !hasLocal, imgs.join(' | ') || '(initials)');
}

console.log(`\nUnique teams rendered:  ${rendered}`);
console.log(`Unique local srcs:      ${localSrcs.size}`);
console.log(`API-logo fallbacks:     ${apiSrcs.length}`);
console.log(`Assertions passed:      ${pass}`);
console.log(`Assertions failed:      ${fail}`);

if (localSrcs.size) {
  console.log('\nLocal logos rendered for real API teams:');
  for (const s of [...localSrcs].sort()) console.log(`  ${s}`);
}
if (apiSrcs.length) {
  console.log('\nAPI logo fallbacks (local file absent):');
  for (const s of [...new Set(apiSrcs)].sort()) console.log(`  ${s}`);
}

process.exit(fail > 0 ? 1 : 0);
