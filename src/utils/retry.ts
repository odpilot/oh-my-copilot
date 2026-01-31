/**
 * Retry utility
 * Provides retry logic with exponential backoff
 */

import { logger } from './logger.js';
import { APIError, TimeoutError } from '../errors/index.js';

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  factor?: number;
  retryIf?: (error: Error) => boolean;
  onRetry?: (attempt: number, error: Error, nextDelay: number) => void;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'retryIf'>> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  factor: 2,
  onRetry: defaultOnRetry
};

function isRetryable(error: Error): boolean {
  // Retry on rate limits, timeouts, and server errors
  if (error instanceof APIError) {
    return [429, 500, 502, 503, 504].includes(error.statusCode || 0);
  }
  if (error instanceof TimeoutError) {
    return true;
  }
  return error.message.includes('ECONNRESET') || 
         error.message.includes('ETIMEDOUT') ||
         error.message.includes('rate limit');
}

function defaultOnRetry(attempt: number, error: Error, nextDelay: number): void {
  console.warn(
    `⚠️  Attempt ${attempt} failed: ${error.message}. ` +
    `Retrying in ${(nextDelay / 1000).toFixed(1)}s...`
  );
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const retryIf = options.retryIf ?? isRetryable;
  let lastError: Error;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === opts.maxAttempts || !retryIf(lastError)) {
        logger.error(`All ${opts.maxAttempts} retry attempts failed`);
        throw lastError;
      }

      const delay = Math.min(
        opts.initialDelay * Math.pow(opts.factor, attempt - 1) + Math.random() * 1000,
        opts.maxDelay
      );

      logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      opts.onRetry(attempt, lastError, delay);

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Alias for backward compatibility
 */
export const retryWithBackoff = retry;


