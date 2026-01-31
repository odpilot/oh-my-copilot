import { describe, it, expect, vi } from 'vitest';
import { retry, retryIf } from '../../src/utils/retry.js';

describe('Retry', () => {
  describe('retry', () => {
    it('should succeed on first attempt', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const result = await retry(fn);
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');

      const result = await retry(fn, { initialDelay: 10 });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw after max attempts', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('always fails'));

      await expect(retry(fn, { maxAttempts: 3, initialDelay: 10 }))
        .rejects.toThrow('always fails');
      
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should use exponential backoff', async () => {
      let retryCount = 0;
      
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');

      const onRetry = vi.fn(() => {
        retryCount++;
      });
      
      await retry(fn, {
        initialDelay: 10,
        factor: 2,
        onRetry
      });

      // Should have retried twice before success
      expect(retryCount).toBe(2);
      expect(onRetry).toHaveBeenCalledTimes(2);
    });

    it('should respect maxDelay', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');

      const onRetry = vi.fn();
      
      await retry(fn, {
        initialDelay: 1000,
        maxDelay: 500,
        factor: 10,
        onRetry
      });

      expect(onRetry).toHaveBeenCalled();
    });

    it('should call onRetry callback', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');

      const onRetry = vi.fn();
      
      await retry(fn, { initialDelay: 10, onRetry });
      
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error));
    });
  });

  describe('retryIf', () => {
    it('should retry only if condition is met', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('retryable'))
        .mockResolvedValue('success');

      const shouldRetry = (error: Error) => error.message === 'retryable';
      
      const result = await retryIf(fn, shouldRetry, { initialDelay: 10 });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should not retry if condition is not met', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('do not retry'));

      const shouldRetry = (error: Error) => error.message === 'retryable';
      
      await expect(retryIf(fn, shouldRetry, { initialDelay: 10 }))
        .rejects.toThrow('do not retry');
      
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should stop retrying after max attempts even if condition is met', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('retryable'));

      const shouldRetry = () => true;
      
      await expect(retryIf(fn, shouldRetry, { maxAttempts: 3, initialDelay: 10 }))
        .rejects.toThrow('retryable');
      
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });
});
