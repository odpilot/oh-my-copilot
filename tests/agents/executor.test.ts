import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutorAgent } from '../../src/agents/executor.js';

describe('ExecutorAgent', () => {
  let agent: ExecutorAgent;

  beforeEach(() => {
    agent = new ExecutorAgent('gpt-4o-mini');
  });

  describe('constructor', () => {
    it('should initialize with correct name', () => {
      expect(agent.getName()).toBe('executor');
    });

    it('should use default model when not specified', () => {
      const defaultAgent = new ExecutorAgent();
      expect(defaultAgent.getConfig().model).toBe('gpt-4o-mini');
    });

    it('should use custom model when specified', () => {
      expect(agent.getConfig().model).toBe('gpt-4o-mini');
    });

    it('should have appropriate temperature', () => {
      const config = agent.getConfig();
      expect(config.temperature).toBeDefined();
    });

    it('should have executor-specific system prompt', () => {
      const config = agent.getConfig();
      expect(config.systemPrompt).toContain('implementer');
      expect(config.systemPrompt).toContain('implement');
    });
  });

  describe('getProvider', () => {
    it('should return current provider', () => {
      const provider = agent.getProvider();
      expect(typeof provider).toBe('string');
    });
  });
});
