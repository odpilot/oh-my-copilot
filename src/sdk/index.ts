/**
 * SDK exports and integration layer
 * Provides a unified interface for both real providers and mock SDK
 */

export * from './types.js';
export * from './mock-sdk.js';

import type {
  ChatCompletionOptions,
  ChatCompletionResponse,
  AgentConfig,
  AgentResponse,
  Message
} from './types.js';
import { MockCopilotClient, MockAgent } from './mock-sdk.js';
import { createProviderClient } from '../providers/index.js';
import { loadKeys, validateKeys, getAvailableProviders } from '../config/keys.js';
import { getModelConfig } from '../config/models.js';
import type { ProviderKeys, ProviderType } from '../config/types.js';

/**
 * Unified Copilot client that can use either real providers or mock SDK
 */
export class UnifiedCopilotClient {
  private providerClient: any;
  private useMock: boolean;
  private provider: string;

  constructor(options?: {
    provider?: string;
    apiKey?: string;
    useMock?: boolean;
    providerKeys?: ProviderKeys;
  }) {
    // Check if we should use mock SDK
    this.useMock = options?.useMock || process.env.USE_MOCK_SDK === 'true';

    if (this.useMock) {
      this.providerClient = new MockCopilotClient(options?.apiKey);
      this.provider = 'mock';
      return;
    }

    // Load API keys
    const keys = options?.providerKeys || loadKeys();
    const availableProviders = getAvailableProviders(keys);

    // Determine which provider to use
    if (options?.provider) {
      this.provider = options.provider;
    } else if (process.env.DEFAULT_PROVIDER) {
      this.provider = process.env.DEFAULT_PROVIDER;
    } else if (availableProviders.length > 0) {
      // Use first available provider
      this.provider = availableProviders[0];
    } else {
      // Fallback to mock if no keys available
      console.warn('No API keys found. Falling back to mock SDK.');
      this.providerClient = new MockCopilotClient();
      this.provider = 'mock';
      this.useMock = true;
      return;
    }

    // Validate and create provider client
    try {
      validateKeys(keys, this.provider);
      this.providerClient = createProviderClient(this.provider, keys);
    } catch (error) {
      console.warn(`Failed to initialize ${this.provider} provider: ${error}`);
      console.warn('Falling back to mock SDK.');
      this.providerClient = new MockCopilotClient();
      this.provider = 'mock';
      this.useMock = true;
    }
  }

  /**
   * Create a chat completion
   */
  async createChatCompletion(
    options: ChatCompletionOptions
  ): Promise<ChatCompletionResponse> {
    return this.providerClient.createChatCompletion(options);
  }

  /**
   * Get the current provider name
   */
  getProvider(): string {
    return this.provider;
  }

  /**
   * Check if using mock SDK
   */
  isMock(): boolean {
    return this.useMock;
  }
}

/**
 * Unified Agent class that can use either real providers or mock SDK
 */
export class UnifiedAgent {
  private agent: any;
  private client: UnifiedCopilotClient;
  private config: AgentConfig;
  private conversationHistory: Message[] = [];

  constructor(config: AgentConfig, clientOptions?: {
    provider?: string;
    apiKey?: string;
    useMock?: boolean;
    providerKeys?: ProviderKeys;
  }) {
    this.config = config;
    this.client = new UnifiedCopilotClient(clientOptions);

    // Add system prompt to conversation
    this.conversationHistory.push({
      role: 'system',
      content: config.systemPrompt
    });

    // If using mock, create mock agent
    if (this.client.isMock()) {
      this.agent = new MockAgent(config);
    }
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

    // If using mock agent, delegate to it
    if (this.agent) {
      return this.agent.chat(message);
    }

    // Otherwise use the provider client
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

    if (this.agent) {
      this.agent.resetConversation();
    }
  }

  /**
   * Get conversation history
   */
  getHistory(): Message[] {
    if (this.agent) {
      return this.agent.getHistory();
    }
    return [...this.conversationHistory];
  }

  /**
   * Get current provider
   */
  getProvider(): string {
    return this.client.getProvider();
  }
}

/**
 * Create a new Copilot client (backwards compatible)
 */
export function createCopilotClient(apiKey?: string): UnifiedCopilotClient {
  return new UnifiedCopilotClient({ apiKey });
}

/**
 * Create a new agent (backwards compatible)
 */
export function createAgent(config: AgentConfig): UnifiedAgent {
  return new UnifiedAgent(config);
}

