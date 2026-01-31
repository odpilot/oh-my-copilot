/**
 * OpenAI Provider Implementation
 */

import OpenAI from 'openai';
import type { ProviderClient } from './base.js';
import type { Message, ChatCompletionResponse, StreamChunk } from '../sdk/types.js';
import { RequestCache } from '../cache/request-cache.js';

export class OpenAIProvider implements ProviderClient {
  private client: OpenAI;
  private cache: RequestCache;

  constructor(apiKey: string, baseURL?: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL
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

    const response = await this.client.chat.completions.create({
      model: options.model,
      messages: options.messages as any,
      temperature: options.temperature,
      max_tokens: options.maxTokens
    });

    const result: ChatCompletionResponse = {
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

    // Cache the result if temperature = 0
    if (options.temperature === 0 && result.choices[0]) {
      await this.cache.set(
        options.model,
        options.messages,
        {
          content: result.choices[0].message.content,
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
    const stream = await this.client.chat.completions.create({
      model: options.model,
      messages: options.messages as any,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      stream: true
    });

    for await (const chunk of stream) {
      yield {
        id: chunk.id,
        model: chunk.model,
        choices: chunk.choices.map(c => ({
          index: c.index,
          delta: {
            role: c.delta.role,
            content: c.delta.content || undefined
          },
          finishReason: c.finish_reason || undefined
        }))
      };
    }
  }

  getProviderName(): string {
    return 'openai';
  }
  
  getCacheStats() {
    return this.cache.getStats();
  }
}
