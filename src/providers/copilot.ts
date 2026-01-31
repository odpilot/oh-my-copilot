/**
 * GitHub Copilot SDK Provider Implementation
 */

import type { ProviderClient } from './base.js';
import type { Message, ChatCompletionResponse } from '../sdk/types.js';

// Note: @github/copilot-sdk types will be imported when the package is properly published
// For now, we'll use a placeholder implementation

export class CopilotProvider implements ProviderClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createChatCompletion(options: {
    model: string;
    messages: Message[];
    temperature?: number;
    maxTokens?: number;
  }): Promise<ChatCompletionResponse> {
    // TODO: Replace with actual @github/copilot-sdk implementation when available
    // For now, this is a placeholder that will use the SDK when it's properly installed
    
    throw new Error(
      'GitHub Copilot SDK integration is not yet available. ' +
      'Please use another provider or set USE_MOCK_SDK=true to use mock SDK.'
    );
  }

  getProviderName(): string {
    return 'copilot';
  }
}
