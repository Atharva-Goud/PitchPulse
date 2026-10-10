/**
 * Edge-case tests for the OpenFootball World Cup data layer.
 *
 * Uses scripts/fixtures/partial-worldcup.json: a deliberately partial
 * tournament with matches that have no score yet, an undecided-final-less
 * bracket, an unresolved knockout tie, and a group table that is still in
 * progress. Nothing here is real tournament data.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildTournament, validateBracketProgression } from '../src/lib/worldcup/normalize.ts';

// Resolved from the working directory so the script also works when bundled.
const fixture = JSON.parse(
  readFileSync(join(process.cwd(), 'scripts/fixtures/partial-worldcup.json'), 'utf8').replace(/^\uFEFF/, ''),
);
const t = buildTournament(fixture, 'test-fixture');

let failures = 0;
const check = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: ${JSON.stringify(actual)}${ok ? '' : ` (expected ${JSON.stringify(expected)})`}`);
};

console.log('--- scheduled (scoreless) match ---');
const scheduled = t.matches.find((m) => m.num === 2);
check('status is scheduled', scheduled.status, 'scheduled');
check('no fabricated score', [scheduled.ft, scheduled.decided, scheduled.ht], [null, null, null]);
check('no winner', scheduled.winner, null);
check('detail', scheduled.detail, 'Scheduled');
check('kickoff parsed to UTC (13:00 UTC-6 => 19:00Z)', scheduled.kickoff, '2026-06-11T19:00:00.000Z');

console.log('--- undecided knockout match ---');
const undecided = t.matches.find((m) => m.num === 102);
check('undecided has no winner', undecided.winner, null);
check('undecided detail', undecided.detail, 'Scheduled');
check('feeds nothing', undecided.feederIds, null);

console.log('--- shootout + extra time resolution ---');
const pens = t.matches.find((m) => m.num === 101);
check('pens detail', pens.detail, 'Pens 4-3');
check('pens winner', pens.winner, 1);
check('shootout score', pens.shootout, { home: 4, away: 3 });
check('decided score is extra time', pens.decided, { home: 1, away: 1 });

console.log('--- champions are never guessed ---');
check('no final match => no champion', t.champion, null);
check('no third-place match => no third place', t.thirdPlace, null);
check('finalDecided flag', t.completeness.finalDecided, false);

console.log('--- unresolved feeders ---');
const r16 = t.matches.find((m) => m.num === 103);
check('r16 teams', [r16.team1.name, r16.team2.name], ['Mexico', 'South Africa']);
check('Mexico feeder resolved (won match 101)', r16.feederIds[0], 'wc2026-101');
check('South Africa feeder unresolved (match 102 undecided)', r16.feederIds[1], null);
// Validation only complains when a FINISHED match cannot resolve its
// participants; an unresolved feeder in a scheduled match is expected.
const validation = validateBracketProgression(t);
check('scheduled match with unresolved feeder is not an error', validation.ok, true);
check('validation reports no issue for scheduled matches', validation.checks.length, 0);

console.log('--- partial group table ---');
const group = t.groups.find((g) => g.name === 'Group A');
check('group marked incomplete', group.complete, false);
// South Korea (GD 0) ranks above South Africa (GD -2) on the calculated
// tiebreakers, so the sorted order differs from match order — verified here.
check('rows counted only from finished matches',
  group.rows.map((r) => [r.team.name, r.played, r.points, r.goalDifference]),
  [['Mexico', 1, 3, 2], ['South Korea', 1, 1, 0], ['South Africa', 2, 1, -2], ['Czech Republic', 0, 0, 0]]);
check('goals not counted for scoreless match',
  group.rows.find((r) => r.team.name === 'South Korea').goalsFor, 1);

console.log('--- scorer aggregation from partial data ---');
check('top scorer', [t.scorers[0].player, t.scorers[0].team?.name, t.scorers[0].goals], ['Julián Quiñones', 'Mexico', 1]);
check('penalties detected', t.scorers.find((s) => s.player === 'Raúl Jiménez').penalties, 1);
check('total goals counted (only goals the fixture lists)', t.scorers.reduce((s, r) => s + r.goals, 0), 2);

console.log('--- team stats from partial data ---');
// Mexico: 2-0 win (match 1) + 1-1 R32 tie won on penalties (match 101).
check('Mexico record', [t.teamStats.find((r) => r.team.name === 'Mexico').played, t.teamStats.find((r) => r.team.name === 'Mexico').goalsFor], [2, 3]);
check('Mexico wins', t.teamStats.find((r) => r.team.name === 'Mexico').wins, 1);
check('scoreless match not counted for Czech Republic', t.teamStats.find((r) => r.team.name === 'Czech Republic').played, 0);

console.log(failures === 0 ? '\nALL EDGE-CASE CHECKS PASSED' : `\n${failures} EDGE-CASE CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
