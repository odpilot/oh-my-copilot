import { describe, it, expect, vi } from 'vitest';
import { retry } from '../../src/utils/retry.js';
import { APIError } from '../../src/errors/index.js';

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
        .mockRejectedValueOnce(new APIError('fail 1', 'test', 500))
        .mockRejectedValueOnce(new APIError('fail 2', 'test', 500))
        .mockResolvedValue('success');

      const result = await retry(fn, { initialDelay: 10 });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw after max attempts', async () => {
      const fn = vi.fn().mockRejectedValue(new APIError('always fails', 'test', 500));

      await expect(retry(fn, { maxAttempts: 3, initialDelay: 10 }))
        .rejects.toThrow('always fails');
      
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should use exponential backoff', async () => {
      let retryCount = 0;
      
      const fn = vi.fn()
        .mockRejectedValueOnce(new APIError('fail', 'test', 500))
        .mockRejectedValueOnce(new APIError('fail', 'test', 500))
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
        .mockRejectedValueOnce(new APIError('fail', 'test', 500))
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

    it('should call onRetry callback with delay', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new APIError('fail', 'test', 500))
        .mockResolvedValue('success');

      const onRetry = vi.fn();
      
      await retry(fn, { initialDelay: 10, onRetry });
      
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error), expect.any(Number));
    });

    it('should retry only if custom condition is met', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('retryable'))
        .mockResolvedValue('success');

      const shouldRetry = (error: Error) => error.message === 'retryable';
      
      const result = await retry(fn, { 
        initialDelay: 10,
        retryIf: shouldRetry
      });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should not retry if custom condition is not met', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('do not retry'));

      const shouldRetry = (error: Error) => error.message === 'retryable';
      
      await expect(retry(fn, { 
        initialDelay: 10,
        retryIf: shouldRetry 
      }))
        .rejects.toThrow('do not retry');
      
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should stop retrying after max attempts even if condition is met', async () => {
      const fn = vi.fn().mockRejectedValue(new APIError('retryable', 'test', 500));

      const shouldRetry = () => true;
      
      await expect(retry(fn, { 
        maxAttempts: 3, 
        initialDelay: 10,
        retryIf: shouldRetry
      }))
        .rejects.toThrow('retryable');
      
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });
});
