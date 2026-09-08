import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function saveToJson(data: any, filename: string) {
  const dataDir = join(process.cwd(), 'src', 'data');
  const filePath = join(dataDir, filename);
  
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Saved ${filename}`);
  } catch (error) {
    console.error(`❌ Failed to save ${filename}:`, error);
    throw error;
  }
}

export function deduplicateByField<T>(items: T[], field: keyof T): T[] {
  const seen = new Set();
  return items.filter(item => {
    const value = item[field];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

export function deduplicateByMultipleFields<T>(
  items: T[], 
  fields: (keyof T)[]
): T[] {
  const seen = new Set();
  return items.filter(item => {
    const key = fields.map(f => item[f]).join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function sortByDate<T>(items: T[], dateField: keyof T, order: 'asc' | 'desc' = 'desc'): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[dateField] as any).getTime();
    const dateB = new Date(b[dateField] as any).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

export function removeNullUndefined<T extends Record<string, unknown>>(obj: T): T {
  Object.keys(obj).forEach(key => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
}