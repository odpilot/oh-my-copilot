/**
 * Azure OpenAI Provider Implementation
 */

import OpenAI from 'openai';
import type { ProviderClient } from './base.js';
import type { Message, ChatCompletionResponse } from '../sdk/types.js';

export class AzureProvider implements ProviderClient {
  private client: OpenAI;

  constructor(apiKey: string, endpoint: string) {
    // Azure uses a different URL format
    const baseURL = endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
    
    this.client = new OpenAI({
      apiKey,
      baseURL,
      defaultQuery: { 'api-version': '2024-02-01' },
      defaultHeaders: { 'api-key': apiKey }
    });
  }

  async createChatCompletion(options: {
    model: string;
    messages: Message[];
    temperature?: number;
    maxTokens?: number;
  }): Promise<ChatCompletionResponse> {
    const response = await this.client.chat.completions.create({
      model: options.model,
      messages: options.messages as any,
      temperature: options.temperature,
      max_tokens: options.maxTokens
    });

    return {
      id: response.id,
      model: response.model,
      choices: response.choices.map(choice => ({
        index: choice.index,
        message: {
          role: choice.message.role as 'assistant',
          content: choice.message.content || ''
        },
        finishReason: choice.finish_reason || 'stop'
      })),
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0
      }
    };
  }

  getProviderName(): string {
    return 'azure';
  }
}
