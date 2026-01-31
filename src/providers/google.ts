/**
 * Google Gemini Provider Implementation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ProviderClient } from './base.js';
import type { Message, ChatCompletionResponse } from '../sdk/types.js';

export class GoogleProvider implements ProviderClient {
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async createChatCompletion(options: {
    model: string;
    messages: Message[];
    temperature?: number;
    maxTokens?: number;
  }): Promise<ChatCompletionResponse> {
    const model = this.client.getGenerativeModel({
      model: options.model,
      generationConfig: {
        temperature: options.temperature,
        maxOutputTokens: options.maxTokens
      }
    });

    // Convert messages to Gemini format
    const systemMessage = options.messages.find(m => m.role === 'system');
    const conversationMessages = options.messages.filter(m => m.role !== 'system');

    const history = conversationMessages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const chat = model.startChat({
      history,
      systemInstruction: systemMessage?.content
    });

    const lastMessage = conversationMessages[conversationMessages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;

    // Estimate token usage (Gemini doesn't provide exact counts in all cases)
    const promptTokens = this.estimateTokens(options.messages.map(m => m.content).join(' '));
    const completionTokens = this.estimateTokens(response.text());

    return {
      id: `gemini-${Date.now()}`,
      model: options.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: response.text()
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

  private estimateTokens(text: string): number {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  getProviderName(): string {
    return 'google';
  }
}
