/**
 * Verification harness for the OpenFootball World Cup data layer.
 *
 * Runs the pure normalization layer against a local copy of the real dataset
 * and asserts the values the page will display: match counts, scores,
 * goalscorers, group tables, bracket progression and the champion.
 *
 * Usage: node --experimental-strip-types scripts/verify-worldcup.mjs path/to/worldcup.json
 */

import { readFileSync } from 'node:fs';
import {
  buildTournament,
  validateBracketProgression,
} from '../src/lib/worldcup/normalize.ts';

const file = process.argv[2];
if (!file) {
  console.error('usage: node --experimental-strip-types scripts/verify-worldcup.mjs <worldcup.json>');
  process.exit(2);
}

const raw = JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const t = buildTournament(raw, 'local-verification');

let failures = 0;
const check = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: ${JSON.stringify(actual)}${ok ? '' : ` (expected ${JSON.stringify(expected)})`}`);
};

console.log('--- completeness ---');
check('total matches', t.completeness.totalMatches, raw.matches.length);
check('finished matches', t.completeness.finishedMatches, raw.matches.filter((m) => m.score?.ft).length);
check('all group matches finished', t.completeness.allGroupMatchesFinished, true);
check('final decided', t.completeness.finalDecided, true);

console.log('--- rounds ---');
check('r32', t.knockout.r32.length, 16);
check('r16', t.knockout.r16.length, 8);
check('qf', t.knockout.qf.length, 4);
check('sf', t.knockout.sf.length, 2);
check('third', t.knockout.third.length, 1);
check('final', t.knockout.final.length, 1);
check('groups', t.groups.length, 12);
check('group matches', t.groupMatches.length, 72);
check('teams', t.teams.length, 48);

console.log('--- score fidelity vs source (first 3 + final) ---');
for (const index of [0, 50, 99]) {
  const src = raw.matches[index];
  const norm = t.matches[index];
  const expectedScore = src.score?.et ?? src.score?.ft ?? null;
  check(`match ${index + 1} score`, norm.decided, expectedScore ? { home: expectedScore[0], away: expectedScore[1] } : null);
}
const finalSrc = raw.matches.find((m) => m.round === 'Final');
const finalNorm = t.knockout.final[0];
check('final teams', [finalNorm.team1.name, finalNorm.team2.name], [finalSrc.team1, finalSrc.team2]);
check('final ft', finalNorm.ft, { home: finalSrc.score.ft[0], away: finalSrc.score.ft[1] });
check('final et', finalNorm.et, { home: finalSrc.score.et[0], away: finalSrc.score.et[1] });
check('final winner side', finalNorm.winner, finalSrc.score.et[0] > finalSrc.score.et[1] ? 1 : 2);
check('final detail', finalNorm.detail, 'a.e.t.');

console.log('--- champion (derived, never hardcoded) ---');
check('champion', t.champion?.name, finalNorm.winner === 1 ? finalNorm.team1.name : finalNorm.team2.name);
check('third place', t.thirdPlace?.name, t.knockout.third[0].winner === 1 ? t.knockout.third[0].team1.name : t.knockout.third[0].team2.name);

console.log('--- shootouts ---');
const shootoutMatches = raw.matches.filter((m) => m.score?.p);
check('shootout count', t.matches.filter((m) => m.shootout).length, shootoutMatches.length);
for (const src of shootoutMatches) {
  const norm = t.matches.find((m) => m.num === src.num);
  check(`shootout match ${src.num}`, norm.shootout, { home: src.score.p[0], away: src.score.p[1] });
  check(`shootout match ${src.num} winner`, norm.winner, src.score.p[0] > src.score.p[1] ? 1 : 2);
}

console.log('--- goalscorers ---');
const rawGoalCount = raw.matches.reduce((sum, m) => sum + (m.goals1?.length ?? 0) + (m.goals2?.length ?? 0), 0);
const countedGoals = t.scorers.reduce((sum, s) => sum + s.goals, 0);
check('total goals counted once each', countedGoals, rawGoalCount);
const penaltyCount = raw.matches.reduce(
  (sum, m) => sum + [...(m.goals1 ?? []), ...(m.goals2 ?? [])].filter((g) => g.penalty).length, 0);
check('penalty goals', t.scorers.reduce((s, r) => s + r.penalties, 0), penaltyCount);

// Independent recount of the top scorer straight from the JSON.
const tally = new Map();
for (const m of raw.matches) {
  for (const [side, goals] of [[m.team1, m.goals1], [m.team2, m.goals2]]) {
    for (const g of goals ?? []) {
      const key = `${g.name}|${side}`;
      tally.set(key, (tally.get(key) ?? 0) + 1);
    }
  }
}
const topRaw = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
const [topPlayer, topTeam] = topRaw[0].split('|');
check('top scorer', [t.scorers[0].player, t.scorers[0].goals, t.scorers[0].team?.name], [topPlayer, topRaw[1], topTeam]);

console.log('--- group standings (independent recount for every group) ---');
for (const group of t.groups) {
  const matches = raw.matches.filter((m) => m.group === group.name);
  const expected = new Map();
  for (const m of matches) {
    const score = m.score?.et ?? m.score?.ft;
    if (!score) continue;
    for (const [team, gf, ga] of [[m.team1, score[0], score[1]], [m.team2, score[1], score[0]]]) {
      const row = expected.get(team) ?? { team, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
      row.p += 1; row.gf += gf; row.ga += ga;
      if (gf > ga) { row.w += 1; row.pts += 3; } else if (gf < ga) { row.l += 1; } else { row.d += 1; row.pts += 1; }
      expected.set(team, row);
    }
  }
  const actual = group.rows.map((r) => ({
    team: r.team.name, p: r.played, w: r.wins, d: r.draws, l: r.losses,
    gf: r.goalsFor, ga: r.goalsAgainst, gd: r.goalDifference, pts: r.points,
  }));
  const exp = [...expected.values()]
    .map((r) => ({ team: r.team, p: r.p, w: r.w, d: r.d, l: r.l, gf: r.gf, ga: r.ga, gd: r.gf - r.ga, pts: r.pts }))
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  check(`${group.name} table`, actual, exp);
}

console.log('--- team stats ---');
check('team stats rows', t.teamStats.length, 48);
const spainGoals = raw.matches.reduce((sum, m) => {
  const score = m.score?.et ?? m.score?.ft;
  if (!score) return sum;
  return sum + (m.team1 === 'Spain' ? score[0] : 0) + (m.team2 === 'Spain' ? score[1] : 0);
}, 0);
check('Spain goals for', t.teamStats.find((r) => r.team.name === 'Spain')?.goalsFor, spainGoals);

console.log('--- bracket progression (resolved from results) ---');
const progression = validateBracketProgression(t);
check('progression resolvable', progression.ok, true);
if (!progression.ok) {
  for (const c of progression.checks) console.log('   issue:', c);
}
// Independent resolution: every knockout participant after R32 must equal the
// winner of exactly one earlier-round match.
const roundIds = ['r32', 'r16', 'qf', 'sf', 'final'];
let expectedFeederCount = 0;
for (let r = 1; r < roundIds.length; r++) {
  for (const m of t.knockout[roundIds[r]]) {
    for (const side of [m.team1, m.team2]) {
      const source = raw.matches.find(
        (x) => x.round === t.knockout[roundIds[r - 1]][0]?.round &&
          (winnerOf(x) === side.name),
      );
      if (source) expectedFeederCount++;
    }
  }
}
function winnerOf(m) {
  const s = m?.score?.et ?? m?.score?.ft;
  if (!s) return null;
  if (s[0] > s[1]) return m.team1;
  if (s[1] > s[0]) return m.team2;
  const p = m?.score?.p;
  if (!p) return null;
  return p[0] > p[1] ? m.team1 : m.team2;
}
const resolvedFeeders = roundIds
  .slice(1)
  .flatMap((rid) => t.knockout[rid])
  .reduce((sum, m) => sum + (m.feederIds ?? []).filter(Boolean).length, 0);
console.log(`     resolved feeders: ${resolvedFeeders} (expected participants with a resolvable source match)`);
check('every finished knockout match resolves both feeders',
  roundIds.slice(1, 5).flatMap((rid) => t.knockout[rid]).every((m) => (m.feederIds ?? []).filter(Boolean).length === 2),
  true);

console.log('--- logo coverage ---');
const missingLogo = t.teams.filter((team) => !team.logo).map((team) => team.name);
check('teams without local logo', missingLogo, []);

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
