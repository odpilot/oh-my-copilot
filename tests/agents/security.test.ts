import { describe, it, expect, beforeEach } from 'vitest';
import { SecurityAgent } from '../../src/agents/security.js';

describe('SecurityAgent', () => {
  let agent: SecurityAgent;

  beforeEach(() => {
    agent = new SecurityAgent('gpt-4o-mini');
  });

  describe('constructor', () => {
    it('should initialize with correct name', () => {
      expect(agent.getName()).toBe('security-reviewer');
    });

    it('should use default model when not specified', () => {
      const defaultAgent = new SecurityAgent();
      expect(defaultAgent.getConfig().model).toBe('gpt-4o');
    });

    it('should use custom model when specified', () => {
      expect(agent.getConfig().model).toBe('gpt-4o-mini');
    });

    it('should have security-specific system prompt', () => {
      const config = agent.getConfig();
      expect(config.systemPrompt).toContain('security');
      expect(config.systemPrompt).toContain('vulnerabilit');
    });

    it('should have appropriate configuration', () => {
      const config = agent.getConfig();
      expect(config.name).toBe('security-reviewer');
    });
  });
});
