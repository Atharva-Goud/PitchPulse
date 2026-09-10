/**
 * Strip placeholder Unsplash URLs from static data files.
 *
 * The sync scripts used to inject hardcoded images.unsplash.com URLs as
 * fallbacks. Those URLs return 404. This script removes them so the
 * fallback components (Image.tsx / TeamLogo.tsx) render initials instead
 * of broken images.
 *
 * Run: npx tsx scripts/strip-placeholder-images.ts
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const PLACEHOLDER_HOSTS = [
  'images.unsplash.com',
  'unsplash.com',
];

function isPlaceholder(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return true;
  try {
    const parsed = new URL(url);
    return PLACEHOLDER_HOSTS.some(host => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`));
  } catch {
    return true;
  }
}

interface CleanSpec {
  direct?: string[];
  nested?: Record<string, string[]>;
}

async function cleanFile(path: string, spec: CleanSpec): Promise<number> {
  const data = JSON.parse(await readFile(path, 'utf-8'));
  let removed = 0;

  const clean = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(clean);

    for (const [key, value] of Object.entries(obj)) {
      // Recurse into nested objects that have fields to clean
      const nestedFields = spec.nested?.[key];
      if (nestedFields && value && typeof value === 'object' && !Array.isArray(value)) {
        const nestedObj = value as Record<string, unknown>;
        for (const field of nestedFields) {
          if (typeof nestedObj[field] === 'string' && isPlaceholder(nestedObj[field] as string)) {
            nestedObj[field] = null;
            removed++;
          }
        }
      }
      // Direct fields on this object
      if (spec.direct?.includes(key) && typeof value === 'string' && isPlaceholder(value)) {
        obj[key] = null;
        removed++;
      }
    }
    return obj;
  };

  const cleaned = clean(data);
  await writeFile(path, JSON.stringify(cleaned, null, 2), 'utf-8');
  return removed;
}

async function main() {
  const dataDir = join(process.cwd(), 'src', 'data');
  const tasks: [string, CleanSpec][] = [
    [join(dataDir, 'news', 'latest.json'), { direct: ['image'] }],
    [join(dataDir, 'news', 'trending.json'), { direct: ['image'] }],
    [join(dataDir, 'teams', 'teams.json'), { direct: ['logo'] }],
    [join(dataDir, 'competitions', 'competitions.json'), { direct: ['logo'] }],
    [join(dataDir, 'transfers', 'rumours.json'), { nested: { player: ['image'], fromClub: ['logo'], toClub: ['logo'] } }],
    [join(dataDir, 'transfers', 'confirmed.json'), { nested: { player: ['image'], fromClub: ['logo'], toClub: ['logo'] } }],
  ];

  let total = 0;
  for (const [file, spec] of tasks) {
    try {
      const removed = await cleanFile(file, spec);
      console.log(`✓ ${file}: removed ${removed} placeholder URLs`);
      total += removed;
    } catch (e) {
      console.error(`✗ ${file}: ${e}`);
    }
  }

  console.log(`\nTotal: ${total} placeholder URLs removed`);
}

main().catch(console.error);