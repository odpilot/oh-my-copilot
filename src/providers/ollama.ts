/**
 * Ollama Provider Implementation
 */

import { Ollama } from 'ollama';
import type { ProviderClient } from './base.js';
import type { Message, ChatCompletionResponse } from '../sdk/types.js';

export class OllamaProvider implements ProviderClient {
  private client: Ollama;

  constructor(baseURL?: string) {
    this.client = new Ollama({
      host: baseURL || 'http://localhost:11434'
    });
  }

  async createChatCompletion(options: {
    model: string;
    messages: Message[];
    temperature?: number;
    maxTokens?: number;
  }): Promise<ChatCompletionResponse> {
    const response = await this.client.chat({
      model: options.model,
      messages: options.messages.map(m => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content
      })),
      options: {
        temperature: options.temperature,
        num_predict: options.maxTokens
      }
    });

    return {
      id: `ollama-${Date.now()}`,
      model: options.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: response.message.content
          },
          finishReason: 'stop'
        }
      ],
      usage: {
        promptTokens: response.prompt_eval_count || 0,
        completionTokens: response.eval_count || 0,
        totalTokens: (response.prompt_eval_count || 0) + (response.eval_count || 0)
      }
    };
  }

  getProviderName(): string {
    return 'ollama';
  }
}
