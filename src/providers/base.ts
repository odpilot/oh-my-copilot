/**
 * Provider base types and interfaces
 */

import type { Message, ChatCompletionResponse } from '../sdk/types.js';

export interface ProviderClient {
  /**
   * Create a chat completion
   */
  createChatCompletion(options: {
    model: string;
    messages: Message[];
    temperature?: number;
    maxTokens?: number;
  }): Promise<ChatCompletionResponse>;

  /**
   * Get provider name
   */
  getProviderName(): string;
}

/**
 * Common configuration for all providers
 */
export interface BaseProviderConfig {
  apiKey: string;
  baseURL?: string;
}
