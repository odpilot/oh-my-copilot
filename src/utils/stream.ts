/**
 * Stream Handler
 * Provides utilities for handling streaming responses
 */

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
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
    finishReason?: string | null;
  }>;
}

export interface StreamOptions {
  onToken?: (token: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: Error) => void;
  onUsage?: (usage: TokenUsage) => void;
}

export class StreamHandler {
  private buffer = '';
  private options: StreamOptions;
  
  constructor(options: StreamOptions = {}) {
    this.options = options;
  }
  
  handleChunk(chunk: StreamChunk): void {
    const content = chunk.choices[0]?.delta?.content;
    
    if (content) {
      this.buffer += content;
      this.options.onToken?.(content);
    }
    
    if (chunk.choices[0]?.finishReason === 'stop') {
      this.options.onComplete?.(this.buffer);
    }
  }
  
  handleError(error: Error): void {
    this.options.onError?.(error);
  }
  
  getBuffer(): string {
    return this.buffer;
  }
  
  reset(): void {
    this.buffer = '';
  }
}
