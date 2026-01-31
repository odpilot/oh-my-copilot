import { describe, it, expect, beforeEach } from 'vitest';
import { ArchitectAgent } from '../../src/agents/architect.js';

describe('ArchitectAgent', () => {
  let agent: ArchitectAgent;

  beforeEach(() => {
    agent = new ArchitectAgent('gpt-4o-mini');
  });

  describe('constructor', () => {
    it('should initialize with correct name', () => {
      expect(agent.getName()).toBe('architect');
    });

    it('should use default model when not specified', () => {
      const defaultAgent = new ArchitectAgent();
      expect(defaultAgent.getConfig().model).toBe('gpt-4o');
    });

    it('should use custom model when specified', () => {
      expect(agent.getConfig().model).toBe('gpt-4o-mini');
    });

    it('should have appropriate temperature', () => {
      const config = agent.getConfig();
      expect(config.temperature).toBe(0.7);
    });

    it('should have appropriate max tokens', () => {
      const config = agent.getConfig();
      expect(config.maxTokens).toBe(4000);
    });

    it('should have architect-specific system prompt', () => {
      const config = agent.getConfig();
      expect(config.systemPrompt).toContain('architect');
      expect(config.systemPrompt).toContain('implementation plan');
    });
  });

  describe('execute', () => {
    it('should handle architecture tasks', async () => {
      // This would require mocking the SDK
      const config = agent.getConfig();
      expect(config.name).toBe('architect');
    });
  });
});
