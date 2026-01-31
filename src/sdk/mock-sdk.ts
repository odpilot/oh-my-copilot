/**
 * Mock implementation of GitHub Copilot SDK
 * This provides a compatible interface for development and testing
 * Replace with official SDK when available
 */

import type {
  ChatCompletionOptions,
  ChatCompletionResponse,
  AgentConfig,
  AgentResponse,
  Message,
  StreamChunk
} from './types.js';

/**
 * Mock Copilot client for chat completions
 */
export class MockCopilotClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.COPILOT_API_KEY || 'mock-api-key';
  }

  /**
   * Create a chat completion
   */
  async createChatCompletion(
    options: ChatCompletionOptions
  ): Promise<ChatCompletionResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const promptTokens = this.estimateTokens(
      options.messages.map(m => m.content).join(' ')
    );
    const completionTokens = Math.floor(Math.random() * 500) + 100;

    // Mock response based on the last message
    const lastMessage = options.messages[options.messages.length - 1];
    const mockContent = this.generateMockResponse(lastMessage.content, options.model);

    return {
      id: `chatcmpl-${Date.now()}`,
      model: options.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: mockContent
          },
          finishReason: 'stop'
        }
      ],
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens
      }
    };
  }

  /**
   * Create a streaming chat completion
   */
  async *createChatCompletionStream(
    options: ChatCompletionOptions
  ): AsyncGenerator<StreamChunk> {
    const response = await this.createChatCompletion(options);
    const content = response.choices[0].message.content;
    const words = content.split(' ');

    // Simulate streaming by yielding word by word
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      
      yield {
        id: response.id,
        model: response.model,
        choices: [
          {
            index: 0,
            delta: {
              content: words[i] + (i < words.length - 1 ? ' ' : '')
            },
            finishReason: i === words.length - 1 ? 'stop' : undefined
          }
        ]
      };
    }
  }

  /**
   * Generate a mock response based on input
   */
  private generateMockResponse(input: string, model: string): string {
    // Simple mock responses based on keywords
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('plan') || lowerInput.includes('architect')) {
      return `# Implementation Plan

Based on the requirements, here's the architectural approach:

1. **Core Components**
   - Design modular architecture
   - Define clear interfaces
   - Ensure scalability

2. **Implementation Steps**
   - Step 1: Setup foundation
   - Step 2: Implement core logic
   - Step 3: Add tests
   - Step 4: Documentation

3. **Best Practices**
   - Follow SOLID principles
   - Write clean, maintainable code
   - Comprehensive error handling

This plan ensures a robust and scalable solution.`;
    }

    if (lowerInput.includes('implement') || lowerInput.includes('code')) {
      return `Here's the implementation:

\`\`\`typescript
// Implementation following best practices
export class Solution {
  constructor(private config: Config) {}

  async execute(): Promise<Result> {
    try {
      // Main logic here
      const result = await this.processTask();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  private async processTask(): Promise<any> {
    // Processing logic
    return { processed: true };
  }
}
\`\`\`

This implementation includes proper error handling and follows TypeScript best practices.`;
    }

    if (lowerInput.includes('test') || lowerInput.includes('qa')) {
      return `# Test Suite

\`\`\`typescript
import { describe, it, expect } from 'vitest';

describe('Feature Tests', () => {
  it('should handle normal case', () => {
    expect(result).toBeDefined();
  });

  it('should handle edge cases', () => {
    expect(edgeCase).toBeNull();
  });

  it('should handle errors', () => {
    expect(() => errorCase()).toThrow();
  });
});
\`\`\`

All tests pass with 100% coverage.`;
    }

    if (lowerInput.includes('security') || lowerInput.includes('review')) {
      return `# Security Review

**Findings:**
✅ No SQL injection vulnerabilities
✅ Proper input validation
✅ Secure authentication
✅ No hardcoded secrets

**Recommendations:**
- Add rate limiting
- Implement CSRF protection
- Use parameterized queries

Overall: Code is secure with minor improvements suggested.`;
    }

    // Default response
    return `Based on your request, I've analyzed the requirements and here's my response:

The solution involves careful consideration of:
- Technical requirements
- Best practices
- Scalability concerns
- Maintainability

I recommend proceeding with a modular approach that ensures flexibility and robustness.`;
  }

  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokens(text: string): number {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}

/**
 * Mock Agent class for agent-based interactions
 */
export class MockAgent {
  private client: MockCopilotClient;
  private config: AgentConfig;
  private conversationHistory: Message[] = [];

  constructor(config: AgentConfig) {
    this.config = config;
    this.client = new MockCopilotClient();
    
    // Add system prompt to conversation
    this.conversationHistory.push({
      role: 'system',
      content: config.systemPrompt
    });
  }

  /**
   * Send a message to the agent
   */
  async chat(message: string): Promise<AgentResponse> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: message
    });

    // Get response from client
    const response = await this.client.createChatCompletion({
      model: this.config.model,
      messages: this.conversationHistory,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens
    });

    // Add assistant response to history
    const assistantMessage = response.choices[0].message;
    this.conversationHistory.push(assistantMessage);

    return {
      content: assistantMessage.content,
      usage: response.usage,
      model: response.model
    };
  }

  /**
   * Reset conversation history
   */
  resetConversation(): void {
    this.conversationHistory = [
      {
        role: 'system',
        content: this.config.systemPrompt
      }
    ];
  }

  /**
   * Get conversation history
   */
  getHistory(): Message[] {
    return [...this.conversationHistory];
  }
}

/**
 * Create a new Copilot client
 */
export function createCopilotClient(apiKey?: string): MockCopilotClient {
  return new MockCopilotClient(apiKey);
}

/**
 * Create a new agent
 */
export function createAgent(config: AgentConfig): MockAgent {
  return new MockAgent(config);
}
