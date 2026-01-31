import { describe, it, expect, beforeEach } from 'vitest';
import { QATesterAgent } from '../../src/agents/qa-tester.js';

describe('QATesterAgent', () => {
  let agent: QATesterAgent;

  beforeEach(() => {
    agent = new QATesterAgent('gpt-4o-mini');
  });

  describe('constructor', () => {
    it('should initialize with correct name', () => {
      expect(agent.getName()).toBe('qa-tester');
    });

    it('should use default model when not specified', () => {
      const defaultAgent = new QATesterAgent();
      expect(defaultAgent.getConfig().model).toBe('gpt-4o-mini');
    });

    it('should use custom model when specified', () => {
      expect(agent.getConfig().model).toBe('gpt-4o-mini');
    });

    it('should have qa-tester-specific system prompt', () => {
      const config = agent.getConfig();
      expect(config.systemPrompt).toContain('QA');
      expect(config.systemPrompt).toContain('test');
    });

    it('should have appropriate configuration', () => {
      const config = agent.getConfig();
      expect(config.name).toBe('qa-tester');
      expect(config.model).toBe('gpt-4o-mini');
    });
  });
});
