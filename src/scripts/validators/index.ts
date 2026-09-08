import { validateData } from '@/lib/schemas';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export interface ValidationResult<T> {
  valid: T[];
  invalid: number;
  errors: string[];
}

export function validateNewsData(data: any[]): ValidationResult<any> {
  const { NewsArticleSchema } = require('@/lib/schemas');
  const valid: any[] = [];
  const errors: string[] = [];
  let invalid = 0;

  for (const item of data) {
    const result = NewsArticleSchema.safeParse(item);
    if (result.success) {
      valid.push(result.data);
    } else {
      invalid++;
      errors.push(`Invalid news item: ${result.error.message}`);
    }
  }

  return { valid, invalid, errors };
}

export function validateTransferData(data: any[]): ValidationResult<any> {
  const { TransferSchema } = require('@/lib/schemas');
  const valid: any[] = [];
  const errors: string[] = [];
  let invalid = 0;

  for (const item of data) {
    const result = TransferSchema.safeParse(item);
    if (result.success) {
      valid.push(result.data);
    } else {
      invalid++;
      errors.push(`Invalid transfer item: ${result.error.message}`);
    }
  }

  return { valid, invalid, errors };
}

export function validateMatchData(data: any[]): ValidationResult<any> {
  const { MatchSchema } = require('@/lib/schemas');
  const valid: any[] = [];
  const errors: string[] = [];
  let invalid = 0;

  for (const item of data) {
    const result = MatchSchema.safeParse(item);
    if (result.success) {
      valid.push(result.data);
    } else {
      invalid++;
      errors.push(`Invalid match item: ${result.error.message}`);
    }
  }

  return { valid, invalid, errors };
}

export async function logValidationErrors(errors: string[], filename: string) {
  const logsDir = join(process.cwd(), 'logs');
  const logPath = join(logsDir, `${filename}-${Date.now()}.log`);
  
  try {
    await writeFile(logPath, errors.join('\n'), 'utf-8');
    console.log(`📝 Validation errors logged to ${logPath}`);
  } catch (error) {
    console.error('Failed to write validation log:', error);
  }
}