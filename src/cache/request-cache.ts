/**
 * Request Cache
 * Caches API requests to reduce redundant calls
 */

import { Cache } from './index.js';
import crypto from 'crypto';

export interface CachedResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  cachedAt: number;
}

export class RequestCache {
  private cache: Cache<CachedResponse>;
  private enabled: boolean;
  
  constructor(options: { enabled?: boolean; ttl?: number; maxSize?: number } = {}) {
    this.enabled = options.enabled ?? true;
    this.cache = new Cache<CachedResponse>({
      ttl: options.ttl ?? 86400000,  // 24 hours
      maxSize: options.maxSize ?? 500
    });
  }
  
  private generateKey(
    model: string, 
    messages: Array<{ role: string; content: string }>,
    temperature?: number
  ): string {
    const data = JSON.stringify({ model, messages, temperature });
    return crypto.createHash('sha256').update(data).digest('hex');
  }
  
  async get(
    model: string,
    messages: Array<{ role: string; content: string }>,
    temperature?: number
  ): Promise<CachedResponse | undefined> {
    if (!this.enabled) return undefined;
    
    const key = this.generateKey(model, messages, temperature);
    return this.cache.get(key);
  }
  
  async set(
    model: string,
    messages: Array<{ role: string; content: string }>,
    response: CachedResponse,
    temperature?: number
  ): Promise<void> {
    if (!this.enabled) return;
    
    const key = this.generateKey(model, messages, temperature);
    await this.cache.set(key, {
      ...response,
      cachedAt: Date.now()
    });
  }
  
  enable(): void { this.enabled = true; }
  disable(): void { this.enabled = false; }
  isEnabled(): boolean { return this.enabled; }
  
  getStats() {
    return {
      enabled: this.enabled,
      ...this.cache.getStats()
    };
  }
}
