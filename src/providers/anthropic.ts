/**
 * Anthropic Provider Implementation
 */

import Anthropic from '@anthropic-ai/sdk';
import type { ProviderClient } from './base.js';
import type { Message, ChatCompletionResponse } from '../sdk/types.js';

export class AnthropicProvider implements ProviderClient {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey
    });
  }

  async createChatCompletion(options: {
    model: string;
    messages: Message[];
    temperature?: number;
    maxTokens?: number;
  }): Promise<ChatCompletionResponse> {
    // Separate system message from other messages
    const systemMessage = options.messages.find(m => m.role === 'system');
    const conversationMessages = options.messages.filter(m => m.role !== 'system');

    const response = await this.client.messages.create({
      model: options.model,
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature,
      system: systemMessage?.content,
      messages: conversationMessages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    });

    // Extract content safely
    const firstContent = response.content[0];
    const contentText = firstContent?.type === 'text' ? firstContent.text : '';

    return {
      id: response.id,
      model: response.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: contentText
          },
          finishReason: response.stop_reason || 'stop'
        }
      ],
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens
      }
    };
  }

  getProviderName(): string {
    return 'anthropic';
  }
}
