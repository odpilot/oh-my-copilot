/**
 * Token Optimizer
 * Provides utilities to optimize token usage
 */

import type { Message } from '../sdk/types.js';

export class TokenOptimizer {
  /**
   * Compress conversation history, keeping important content
   */
  static compressHistory(
    messages: Message[], 
    maxTokens: number,
    strategy: 'truncate' | 'summarize' | 'sliding-window' = 'sliding-window'
  ): Message[] {
    const estimatedTokens = this.estimateTokens(messages);
    
    if (estimatedTokens <= maxTokens) {
      return messages;
    }
    
    switch (strategy) {
      case 'truncate':
        return this.truncateHistory(messages, maxTokens);
      case 'summarize':
        return this.summarizeHistory(messages, maxTokens);
      case 'sliding-window':
      default:
        return this.slidingWindowHistory(messages, maxTokens);
    }
  }
  
  /**
   * Estimate token count (approximate)
   */
  static estimateTokens(messages: Message[]): number {
    let total = 0;
    for (const msg of messages) {
      // Rough estimate: 1 token ≈ 4 characters (English) or 1-2 characters (Chinese)
      total += Math.ceil(msg.content.length / 3);
      total += 4; // role overhead
    }
    return total;
  }
  
  /**
   * Sliding window: keep system messages and recent conversation
   */
  private static slidingWindowHistory(messages: Message[], maxTokens: number): Message[] {
    const systemMessages = messages.filter(m => m.role === 'system');
    const nonSystemMessages = messages.filter(m => m.role !== 'system');
    
    const result: Message[] = [...systemMessages];
    let currentTokens = this.estimateTokens(systemMessages);
    
    // Add messages from most recent
    for (let i = nonSystemMessages.length - 1; i >= 0; i--) {
      const msg = nonSystemMessages[i];
      const msgTokens = this.estimateTokens([msg]);
      
      if (currentTokens + msgTokens <= maxTokens) {
        result.splice(systemMessages.length, 0, msg);
        currentTokens += msgTokens;
      } else {
        break;
      }
    }
    
    return result;
  }
  
  /**
   * Truncate: keep system messages and truncate from the start
   */
  private static truncateHistory(messages: Message[], maxTokens: number): Message[] {
    const systemMessages = messages.filter(m => m.role === 'system');
    const nonSystemMessages = messages.filter(m => m.role !== 'system');
    
    const result: Message[] = [...systemMessages];
    let currentTokens = this.estimateTokens(systemMessages);
    
    for (const msg of nonSystemMessages) {
      const msgTokens = this.estimateTokens([msg]);
      if (currentTokens + msgTokens <= maxTokens) {
        result.push(msg);
        currentTokens += msgTokens;
      } else {
        break;
      }
    }
    
    return result;
  }
  
  /**
   * Summarize: placeholder for future implementation
   */
  private static summarizeHistory(messages: Message[], maxTokens: number): Message[] {
    // For now, use sliding window
    // Future: implement actual summarization using LLM
    return this.slidingWindowHistory(messages, maxTokens);
  }
  
  /**
   * Optimize prompt, remove unnecessary whitespace and duplicates
   */
  static optimizePrompt(prompt: string): string {
    return prompt
      .replace(/\n{3,}/g, '\n\n')     // Multiple newlines become two
      .replace(/[ \t]+/g, ' ')         // Multiple spaces become one
      .replace(/^\s+|\s+$/gm, '')      // Remove leading/trailing whitespace
      .trim();
  }
}
