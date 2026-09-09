#!/usr/bin/env node

import { runFullSync, runNewsSync, runMatchSync } from './sync-all';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  try {
    switch (command) {
      case 'news':
        await runNewsSync();
        break;
      case 'matches':
        await runMatchSync();
        break;
      case 'all':
      default:
        await runFullSync();
        break;
    }
  } catch (error) {
    console.error('Sync failed:', error);
    process.exit(1);
  }
}

main();