/**
 * Type definitions for the mock GitHub Copilot SDK
 * This is a placeholder until the official SDK is released
 */

export interface AgentModelConfig {
  name: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  model: string;
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: Message;
    finishReason: string;
  }>;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamChunk {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finishReason?: string;
  }>;
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: any) => Promise<any>;
}

export interface AgentConfig {
  name: string;
  model: string;
  systemPrompt: string;
  tools?: Tool[];
  temperature?: number;
  maxTokens?: number;
}

export interface AgentResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
}
