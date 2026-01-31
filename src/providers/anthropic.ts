/**
 * Anthropic Provider Implementation
 */

import Anthropic from '@anthropic-ai/sdk';
import type { ProviderClient } from './base.js';
import type { Message, ChatCompletionResponse, StreamChunk } from '../sdk/types.js';
import { RequestCache } from '../cache/request-cache.js';

export class AnthropicProvider implements ProviderClient {
  private client: Anthropic;
  private cache: RequestCache;

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey
    });
    this.cache = new RequestCache({
      enabled: process.env.ENABLE_CACHE !== 'false',
      ttl: 86400000,  // 24 hours
      maxSize: 500
    });
  }

  async createChatCompletion(options: {
    model: string;
    messages: Message[];
    temperature?: number;
    maxTokens?: number;
  }): Promise<ChatCompletionResponse> {
    // Only cache deterministic requests (temperature = 0)
    if (options.temperature === 0) {
      const cached = await this.cache.get(
        options.model,
        options.messages,
        options.temperature
      );
      
      if (cached) {
        console.log('📦 Cache hit! Saved API call.');
        return {
          id: 'cached',
          model: cached.model,
          choices: [{
            index: 0,
            message: {
              role: 'assistant',
              content: cached.content
            },
            finishReason: 'stop'
          }],
          usage: cached.usage
        };
      }
    }

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

    const result: ChatCompletionResponse = {
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

    // Cache the result if temperature = 0
    if (options.temperature === 0) {
      await this.cache.set(
        options.model,
        options.messages,
        {
          content: contentText,
          usage: result.usage,
          model: result.model,
          cachedAt: Date.now()
        },
        options.temperature
      );
    }

    return result;
  }

  async *createChatCompletionStream(options: {
    model: string;
    messages: Message[];
    temperature?: number;
    maxTokens?: number;
  }): AsyncGenerator<StreamChunk, void, unknown> {
    const systemMessage = options.messages.find(m => m.role === 'system');
    const conversationMessages = options.messages.filter(m => m.role !== 'system');

    const stream = await this.client.messages.stream({
      model: options.model,
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature,
      system: systemMessage?.content,
      messages: conversationMessages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield {
          id: 'stream',
          model: options.model,
          choices: [{
            index: 0,
            delta: {
              content: event.delta.text
            },
            finishReason: undefined
          }]
        };
      } else if (event.type === 'message_stop') {
        yield {
          id: 'stream',
          model: options.model,
          choices: [{
            index: 0,
            delta: {},
            finishReason: 'stop'
          }]
        };
      }
    }
  }

  getProviderName(): string {
    return 'anthropic';
  }
  
  getCacheStats() {
    return this.cache.getStats();
  }
}
