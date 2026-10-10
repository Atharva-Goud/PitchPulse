/**
 * Diagnostic: report which registered teams resolve to an uploaded logo file
 * and which need an explicit `logoFile` override (filename differs from the
 * canonical id/name), plus which uploaded files are unused.
 *
 * Run: npx tsx scripts/diagnose-logos.ts
 */

import { LOGO_MAPPINGS, toFindableStem } from '../src/lib/utils/logo-mapping';
import { LOGO_ASSETS_BY_STEM, LOGO_ASSETS } from '../src/lib/data/logo-manifest';

/** Mirror of findAssetForEntry so the diagnostic can show the candidate tried. */
function candidates(m: any): string[] {
  return [m.logoFile, m.id, m.name, ...(m.aliases || []), m.shortName].filter(Boolean);
}

const matched: Array<{ name: string; stem: string; competition: string }> = [];
const needOverride: Array<{ name: string; id: string; tried: string }> = [];

for (const m of LOGO_MAPPINGS) {
  let hit: string | null = null;
  for (const c of candidates(m)) {
    const stem = toFindableStem(c);
    if (LOGO_ASSETS_BY_STEM[stem]) { hit = stem; break; }
  }
  if (hit) matched.push({ name: m.name, stem: hit, competition: LOGO_ASSETS_BY_STEM[hit].competition });
  else needOverride.push({ name: m.name, id: m.id, tried: candidates(m).join(', ') });
}

// Which uploaded files are claimed by a mapping?
const claimed = new Set(matched.map(x => x.stem));
const unused = LOGO_ASSETS.filter(a => !claimed.has(a.stem));

console.log(`Registered teams:      ${LOGO_MAPPINGS.length}`);
console.log(`Resolved to a file:    ${matched.length}`);
console.log(`Need logoFile override: ${needOverride.length}`);
console.log(`Uploaded files:        ${LOGO_ASSETS.length}`);
console.log(`Unclaimed files:       ${unused.length}`);

if (needOverride.length) {
  console.log(`\n=== Teams needing explicit logoFile (no file matches id/name/alias) ===`);
  for (const n of needOverride) {
    console.log(`  ${n.name.padEnd(34)} id=${n.id.padEnd(24)} tried: ${n.tried}`);
  }
}

if (unused.length) {
  console.log(`\n=== Uploaded files not claimed by any mapping ===`);
  for (const u of unused) {
    console.log(`  ${u.stem.padEnd(40)} [${u.competition}]`);
  }
}

// Sanity: any two different teams pointing at the same file?
const byFile = new Map<string, string[]>();
for (const m of matched) {
  if (!byFile.has(m.stem)) byFile.set(m.stem, []);
  byFile.get(m.stem)!.push(m.name);
}
console.log(`\n=== Files claimed by more than one team ===`);
let conflicts = 0;
for (const [stem, names] of byFile) {
  if (names.length > 1) {
    conflicts++;
    console.log(`  ${stem}: ${names.join(' | ')}`);
  }
}
if (!conflicts) console.log('  (none)');
