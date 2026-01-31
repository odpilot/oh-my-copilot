import { describe, it, expect } from 'vitest';
import { keywordDetector } from '../../src/keywords/detector.js';

describe('KeywordDetector', () => {
  describe('detect', () => {
    it('should detect autopilot mode', () => {
      const result = keywordDetector.detect('autopilot: build an API');
      expect(result.mode).toBe('autopilot');
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.matchedKeywords.length).toBeGreaterThan(0);
    });

    it('should detect ultrawork mode', () => {
      const result = keywordDetector.detect('ultrawork these tasks');
      expect(result.mode).toBe('ultrawork');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should detect ecomode', () => {
      const result = keywordDetector.detect('budget mode: simple task');
      expect(result.mode).toBe('ecomode');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should detect swarm mode', () => {
      const result = keywordDetector.detect('use swarm to process');
      expect(result.mode).toBe('swarm');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should return default mode for unknown input', () => {
      const result = keywordDetector.detect('just do something');
      expect(result.mode).toBe('default');
      expect(result.confidence).toBe(1.0);
      expect(result.matchedKeywords).toHaveLength(0);
    });

    it('should be case insensitive', () => {
      const result1 = keywordDetector.detect('AUTOPILOT: build');
      const result2 = keywordDetector.detect('autopilot: build');
      expect(result1.mode).toBe(result2.mode);
    });

    it('should calculate confidence based on matches', () => {
      const result = keywordDetector.detect('autopilot');
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('getAvailableModes', () => {
    it('should return all available modes', () => {
      const modes = keywordDetector.getAvailableModes();
      expect(modes.length).toBeGreaterThan(0);
      expect(modes.every(m => m.mode && m.keywords)).toBe(true);
    });
  });

  describe('matchesMode', () => {
    it('should return true when input matches mode', () => {
      expect(keywordDetector.matchesMode('autopilot: task', 'autopilot')).toBe(true);
    });

    it('should return false when input does not match mode', () => {
      expect(keywordDetector.matchesMode('just do it', 'autopilot')).toBe(false);
    });
  });
});
