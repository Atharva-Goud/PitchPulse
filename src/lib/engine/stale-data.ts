import { DataStatus, ScraperHealth } from '@/lib/schemas/enhanced';

export interface StaleDataCheck {
  isStale: boolean;
  status: DataStatus;
  lastSuccessfulUpdate: string | null;
  lastAttemptedUpdate: string | null;
  ageMinutes: number;
  reason: string | null;
}

export function checkDataFreshness(
  lastUpdated: string,
  maxAgeMinutes: number = 60
): StaleDataCheck {
  const now = new Date();
  const lastUpdateTime = new Date(lastUpdated);
  const ageMinutes = Math.floor((now.getTime() - lastUpdateTime.getTime()) / 60000);
  
  const isStale = ageMinutes > maxAgeMinutes;
  
  let status: DataStatus;
  if (!isStale) {
    status = 'FRESH';
  } else if (ageMinutes > maxAgeMinutes * 3) {
    status = 'ERROR';
  } else {
    status = 'STALE';
  }
  
  return {
    isStale,
    status,
    lastSuccessfulUpdate: lastUpdated,
    lastAttemptedUpdate: lastUpdated,
    ageMinutes,
    reason: isStale ? `Data is ${ageMinutes} minutes old (max: ${maxAgeMinutes})` : null,
  };
}

export function evaluateScraperHealth(health: ScraperHealth): {
  healthy: boolean;
  issues: string[];
  severity: 'none' | 'warning' | 'critical';
} {
  const issues: string[] = [];
  let severity: 'none' | 'warning' | 'critical' = 'none';
  
  if (health.status === 'FAILURE') {
    issues.push('Scraper failed on last run');
    severity = 'critical';
  } else if (health.status === 'PARTIAL') {
    issues.push('Scraper partially succeeded');
    severity = 'warning';
  }
  
  if (health.errors.length > 0) {
    issues.push(`${health.errors.length} errors recorded`);
    if (severity === 'none') severity = 'warning';
  }
  
  if (health.itemsFound === 0 && health.status === 'SUCCESS') {
    issues.push('No items found - possible source change');
    if (severity === 'none') severity = 'warning';
  }
  
  if (health.lastSuccessfulRun) {
    const lastSuccess = new Date(health.lastSuccessfulRun);
    const hoursSinceSuccess = (Date.now() - lastSuccess.getTime()) / 3600000;
    
    if (hoursSinceSuccess > 24) {
      issues.push(`No successful run in ${Math.floor(hoursSinceSuccess)} hours`);
      severity = 'critical';
    } else if (hoursSinceSuccess > 6) {
      issues.push(`Last successful run ${Math.floor(hoursSinceSuccess)} hours ago`);
      if (severity === 'none') severity = 'warning';
    }
  }
  
  return {
    healthy: severity === 'none',
    issues,
    severity,
  };
}

export function shouldShowStaleWarning(check: StaleDataCheck): boolean {
  return check.status === 'STALE' || check.status === 'ERROR';
}

export function getStaleDataMessage(check: StaleDataCheck): string {
  if (check.status === 'FRESH') return '';
  
  if (check.ageMinutes < 120) {
    return `Last updated ${check.ageMinutes} minutes ago`;
  }
  
  const hours = Math.floor(check.ageMinutes / 60);
  if (hours < 24) {
    return `Last updated ${hours} hours ago`;
  }
  
  const days = Math.floor(hours / 24);
  return `Last updated ${days} days ago. Data may not reflect current state.`;
}

export function createDefaultScraperHealth(scraperId: string): ScraperHealth {
  return {
    scraperId,
    status: 'UNKNOWN',
    lastRun: new Date().toISOString(),
    itemsFound: 0,
    itemsAdded: 0,
    duplicatesRemoved: 0,
    errors: [],
  };
}