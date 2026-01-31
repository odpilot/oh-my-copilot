/**
 * Cache System
 * Provides in-memory caching with TTL and size limits
 */

export interface CacheOptions {
  ttl?: number;           // Time to live in milliseconds
  maxSize?: number;       // Maximum number of entries
  storage?: 'memory' | 'file' | 'sqlite';
  path?: string;          // For file/sqlite storage
}

export interface CacheEntry<T> {
  value: T;
  createdAt: number;
  expiresAt: number;
  hits: number;
}

export interface CacheStats {
  size: number;
  maxSize: number;
  totalHits: number;
  expired: number;
}

export class Cache<T = any> {
  private store: Map<string, CacheEntry<T>> = new Map();
  private options: Required<CacheOptions>;
  
  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl ?? 3600000,  // 1 hour default
      maxSize: options.maxSize ?? 1000,
      storage: options.storage ?? 'memory',
      path: options.path ?? '.cache'
    };
  }
  
  async get(key: string): Promise<T | undefined> {
    const entry = this.store.get(key);
    
    if (!entry) return undefined;
    
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    
    entry.hits++;
    return entry.value;
  }
  
  async set(key: string, value: T, ttl?: number): Promise<void> {
    // Evict if at capacity
    if (this.store.size >= this.options.maxSize) {
      this.evictLRU();
    }
    
    const now = Date.now();
    this.store.set(key, {
      value,
      createdAt: now,
      expiresAt: now + (ttl ?? this.options.ttl),
      hits: 0
    });
  }
  
  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== undefined;
  }
  
  async delete(key: string): Promise<boolean> {
    return this.store.delete(key);
  }
  
  async clear(): Promise<void> {
    this.store.clear();
  }
  
  async getOrSet(key: string, factory: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = await this.get(key);
    if (cached !== undefined) {
      return cached;
    }
    
    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }
  
  private evictLRU(): void {
    let oldest: { key: string; hits: number } | null = null;
    
    for (const [key, entry] of this.store) {
      if (!oldest || entry.hits < oldest.hits) {
        oldest = { key, hits: entry.hits };
      }
    }
    
    if (oldest) {
      this.store.delete(oldest.key);
    }
  }
  
  getStats(): CacheStats {
    let hits = 0;
    let expired = 0;
    const now = Date.now();
    
    for (const entry of this.store.values()) {
      hits += entry.hits;
      if (now > entry.expiresAt) expired++;
    }
    
    return {
      size: this.store.size,
      maxSize: this.options.maxSize,
      totalHits: hits,
      expired
    };
  }
}
