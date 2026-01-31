import { describe, it, expect, vi } from 'vitest';
import {
  sleep,
  formatDuration,
  formatBytes,
  calculateCost,
  formatCost,
  truncate,
  deepClone,
  isEmpty,
  safeJsonParse,
  generateId,
  debounce,
  throttle
} from '../../src/utils/helpers.js';

describe('Helpers', () => {
  describe('sleep', () => {
    it('should sleep for specified duration', async () => {
      const start = Date.now();
      await sleep(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(90);
      expect(elapsed).toBeLessThan(150);
    });
  });

  describe('formatDuration', () => {
    it('should format milliseconds', () => {
      expect(formatDuration(500)).toBe('500ms');
    });

    it('should format seconds', () => {
      expect(formatDuration(1500)).toBe('1.5s');
    });

    it('should format minutes', () => {
      expect(formatDuration(90000)).toBe('1.5m');
    });

    it('should format hours', () => {
      expect(formatDuration(5400000)).toBe('1.5h');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes', () => {
      expect(formatBytes(500)).toBe('500B');
    });

    it('should format kilobytes', () => {
      expect(formatBytes(1536)).toBe('1.5KB');
    });

    it('should format megabytes', () => {
      expect(formatBytes(1572864)).toBe('1.5MB');
    });

    it('should format gigabytes', () => {
      expect(formatBytes(1610612736)).toBe('1.5GB');
    });
  });

  describe('calculateCost', () => {
    it('should calculate cost for gpt-4o-mini', () => {
      const cost = calculateCost({
        model: 'gpt-4o-mini',
        promptTokens: 1000,
        completionTokens: 500
      });
      // (1000 / 1M * 0.15) + (500 / 1M * 0.6) = 0.00015 + 0.0003 = 0.00045
      expect(cost).toBeCloseTo(0.00045, 6);
    });

    it('should calculate cost for claude-3-5-sonnet', () => {
      const cost = calculateCost({
        model: 'claude-3-5-sonnet-20241022',
        promptTokens: 1000,
        completionTokens: 500
      });
      // (1000 / 1M * 3.0) + (500 / 1M * 15.0) = 0.003 + 0.0075 = 0.0105
      expect(cost).toBeCloseTo(0.0105, 6);
    });

    it('should calculate zero cost for local models', () => {
      const cost = calculateCost({
        model: 'llama3',
        promptTokens: 1000,
        completionTokens: 500
      });
      expect(cost).toBe(0);
    });

    it('should use fallback pricing for unknown models', () => {
      const cost = calculateCost({
        model: 'unknown-model',
        promptTokens: 1000,
        completionTokens: 500
      });
      expect(cost).toBeGreaterThan(0);
    });
  });

  describe('formatCost', () => {
    it('should format small costs with 4 decimals', () => {
      expect(formatCost(0.001234)).toBe('$0.0012');
    });

    it('should format larger costs with 2 decimals', () => {
      expect(formatCost(1.5)).toBe('$1.50');
    });
  });

  describe('truncate', () => {
    it('should not truncate short strings', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('should truncate long strings', () => {
      expect(truncate('hello world', 8)).toBe('hello...');
    });

    it('should handle exact length', () => {
      expect(truncate('hello', 5)).toBe('hello');
    });
  });

  describe('deepClone', () => {
    it('should deep clone an object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);
      
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('should deep clone an array', () => {
      const arr = [1, [2, 3]];
      const cloned = deepClone(arr);
      
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[1]).not.toBe(arr[1]);
    });
  });

  describe('isEmpty', () => {
    it('should return true for null', () => {
      expect(isEmpty(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty(0)).toBe(false);
    });
  });

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      const result = safeJsonParse('{"a":1}', {});
      expect(result).toEqual({ a: 1 });
    });

    it('should return fallback for invalid JSON', () => {
      const result = safeJsonParse('invalid', { default: true });
      expect(result).toEqual({ default: true });
    });
  });

  describe('generateId', () => {
    it('should generate unique ids', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      await sleep(60);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should call with latest arguments', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50);

      debounced(1);
      debounced(2);
      debounced(3);

      await sleep(60);

      expect(fn).toHaveBeenCalledWith(3);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 50);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      await sleep(60);

      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
