import { describe, it, expect, beforeEach } from 'vitest';
import { DesignerAgent } from '../../src/agents/designer.js';

describe('DesignerAgent', () => {
  let agent: DesignerAgent;

  beforeEach(() => {
    agent = new DesignerAgent('gpt-4o-mini');
  });

  describe('constructor', () => {
    it('should initialize with correct name', () => {
      expect(agent.getName()).toBe('designer');
    });

    it('should use default model when not specified', () => {
      const defaultAgent = new DesignerAgent();
      expect(defaultAgent.getConfig().model).toBe('gpt-4o');
    });

    it('should use custom model when specified', () => {
      expect(agent.getConfig().model).toBe('gpt-4o-mini');
    });

    it('should have designer-specific system prompt', () => {
      const config = agent.getConfig();
      expect(config.systemPrompt).toContain('designer');
      expect(config.systemPrompt).toContain('design');
    });

    it('should have appropriate configuration', () => {
      const config = agent.getConfig();
      expect(config.name).toBe('designer');
    });
  });
});
