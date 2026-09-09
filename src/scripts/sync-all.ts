import { syncNews, SyncResult as NewsSyncResult } from './sync-news';
import { syncMatches, SyncResult as MatchSyncResult } from './sync-matches';

export interface RunResult {
  news?: NewsSyncResult;
  matches?: MatchSyncResult;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
}

export async function runFullSync(include: Array<'news' | 'matches'> = ['news', 'matches']): Promise<RunResult> {
  const startedAt = new Date();
  console.log('====================================');
  console.log('  PITCHINTEL DATA SYNC');
  console.log('====================================');
  console.log(`Started: ${startedAt.toISOString()}`);
  console.log('');

  const result: RunResult = {
    startedAt: startedAt.toISOString(),
    finishedAt: '',
    durationSeconds: 0,
  };

  if (include.includes('news')) {
    console.log('--- Syncing News ---');
    result.news = await syncNews();
    console.log(`  Found: ${result.news.itemsFound}`);
    console.log(`  Added: ${result.news.itemsAdded}`);
    console.log(`  Duplicates removed: ${result.news.duplicatesRemoved}`);
    printErrors(result.news.errors);
  }

  if (include.includes('matches')) {
    console.log('--- Syncing Matches ---');
    result.matches = await syncMatches('all');
    printErrors(result.matches.errors);
  }

  const finishedAt = new Date();
  result.finishedAt = finishedAt.toISOString();
  result.durationSeconds = Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000);

  console.log('');
  console.log(`Completed in ${result.durationSeconds}s`);
  console.log('====================================');

  return result;
}

function printErrors(errors: string[]) {
  if (errors.length === 0) return;
  console.log(`  ⚠ ${errors.length} errors:`);
  for (const error of errors) {
    console.log(`    - ${error}`);
  }
}

export async function runNewsSync(): Promise<RunResult> {
  return runFullSync(['news']);
}

export async function runMatchSync(): Promise<RunResult> {
  return runFullSync(['matches']);
}