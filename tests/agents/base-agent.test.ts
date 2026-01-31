import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseAgent } from '../../src/agents/base-agent.js';

describe('BaseAgent', () => {
  let agent: BaseAgent;

  beforeEach(() => {
    agent = new BaseAgent({
      name: 'test-agent',
      model: 'gpt-4o-mini',
      systemPrompt: 'You are a test agent.'
    });
  });

  describe('constructor', () => {
    it('should initialize with correct config', () => {
      expect(agent.getName()).toBe('test-agent');
      expect(agent.getConfig().model).toBe('gpt-4o-mini');
    });
  });

  describe('getName', () => {
    it('should return agent name', () => {
      expect(agent.getName()).toBe('test-agent');
    });
  });

  describe('getConfig', () => {
    it('should return agent configuration', () => {
      const config = agent.getConfig();
      expect(config.name).toBe('test-agent');
      expect(config.model).toBe('gpt-4o-mini');
      expect(config.systemPrompt).toBe('You are a test agent.');
    });
  });

  describe('getProvider', () => {
    it('should return current provider', () => {
      const provider = agent.getProvider();
      expect(typeof provider).toBe('string');
    });
  });

  describe('buildPrompt', () => {
    it('should build prompt with task only', () => {
      const prompt = (agent as any).buildPrompt({ task: 'Test task' });
      expect(prompt).toContain('Task: Test task');
    });

    it('should build prompt with task and context', () => {
      const prompt = (agent as any).buildPrompt({
        task: 'Test task',
        context: { key: 'value' }
      });
      expect(prompt).toContain('Task: Test task');
      expect(prompt).toContain('Context:');
      expect(prompt).toContain('"key"');
    });

    it('should build prompt with previous results', () => {
      const prompt = (agent as any).buildPrompt({
        task: 'Test task',
        previousResults: [{
          agentName: 'previous-agent',
          content: 'Previous result'
        }]
      });
      expect(prompt).toContain('Previous Results:');
      expect(prompt).toContain('previous-agent');
      expect(prompt).toContain('Previous result');
    });
  });

  describe('reset', () => {
    it('should reset conversation history', () => {
      expect(() => agent.reset()).not.toThrow();
    });
  });
});
