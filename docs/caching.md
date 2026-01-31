# Caching Guide

This document describes the caching system in oh-my-copilot.

## Overview

The caching system provides:
- In-memory caching with TTL (Time To Live)
- LRU (Least Recently Used) eviction
- Request-level caching for API calls
- Automatic cache management

## Cache System

### Basic Cache Usage

```typescript
import { Cache } from './cache/index.js';

// Create a cache
const cache = new Cache<string>({
  ttl: 3600000,      // 1 hour in milliseconds
  maxSize: 1000,     // Maximum 1000 entries
  storage: 'memory'  // Storage type (currently only 'memory' is implemented)
});

// Set a value
await cache.set('key', 'value');

// Get a value
const value = await cache.get('key');

// Check if key exists
const exists = await cache.has('key');

// Delete a key
await cache.delete('key');

// Clear all cache
await cache.clear();
```

### Get or Set Pattern

Use `getOrSet` to fetch from cache or compute if missing:

```typescript
const result = await cache.getOrSet(
  'expensive-computation',
  async () => {
    // This only runs if not in cache
    return await expensiveOperation();
  },
  7200000 // Custom TTL for this entry (2 hours)
);
```

### Cache Statistics

Monitor cache performance:

```typescript
const stats = cache.getStats();
console.log(stats);
// {
//   size: 150,         // Current entries
//   maxSize: 1000,     // Maximum capacity
//   totalHits: 450,    // Total cache hits
//   expired: 5         // Expired entries
// }
```

## Request Cache

The `RequestCache` class provides specialized caching for API requests:

### Features

- Automatically generates cache keys from request parameters
- Only caches deterministic requests (temperature = 0)
- Can be enabled/disabled dynamically
- Provides cache statistics

### Usage

```typescript
import { RequestCache } from './cache/request-cache.js';

const requestCache = new RequestCache({
  enabled: true,
  ttl: 86400000,  // 24 hours
  maxSize: 500
});

// Check cache before making request
const cached = await requestCache.get(
  'gpt-4',
  [
    { role: 'system', content: 'You are a helpful assistant' },
    { role: 'user', content: 'What is TypeScript?' }
  ],
  0 // temperature
);

if (cached) {
  console.log('Cache hit!', cached);
} else {
  // Make API call and cache result
  const response = await makeAPICall();
  await requestCache.set(
    'gpt-4',
    messages,
    {
      content: response.content,
      usage: response.usage,
      model: 'gpt-4',
      cachedAt: Date.now()
    },
    0
  );
}
```

### Enable/Disable Cache

```typescript
requestCache.disable(); // Temporarily disable
requestCache.enable();  // Re-enable
console.log(requestCache.isEnabled()); // Check status
```

## Provider Integration

The cache is automatically integrated into providers (OpenAI, Anthropic):

### Automatic Caching in Providers

```typescript
// In OpenAI/Anthropic providers
const response = await provider.createChatCompletion({
  model: 'gpt-4',
  messages: [...],
  temperature: 0  // Only temperature=0 requests are cached
});
```

When a request is cached, you'll see:
```
📦 Cache hit! Saved API call.
```

### Environment Variable Control

Control caching via environment variable:

```bash
# Disable cache
ENABLE_CACHE=false

# Enable cache (default)
ENABLE_CACHE=true
```

### View Cache Statistics

```typescript
// For providers with cache support
const stats = provider.getCacheStats();
console.log(stats);
// {
//   enabled: true,
//   size: 45,
//   maxSize: 500,
//   totalHits: 120,
//   expired: 2
// }
```

## Cache Options

### Cache Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ttl` | number | 3600000 | Time to live in milliseconds (1 hour) |
| `maxSize` | number | 1000 | Maximum number of entries |
| `storage` | string | 'memory' | Storage type (future: 'file', 'sqlite') |
| `path` | string | '.cache' | Path for file/sqlite storage |

### RequestCache Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | true | Enable/disable caching |
| `ttl` | number | 86400000 | Time to live (24 hours) |
| `maxSize` | number | 500 | Maximum cached requests |

## Cache Eviction

The cache uses LRU (Least Recently Used) eviction:

1. When cache reaches `maxSize`, least recently used entry is removed
2. Expired entries are automatically removed when accessed
3. Manual clearing is available via `clear()`

## Best Practices

1. **Cache deterministic operations**: Only cache requests with `temperature: 0`
2. **Set appropriate TTL**: Balance between freshness and hit rate
3. **Monitor cache stats**: Use `getStats()` to optimize cache configuration
4. **Use reasonable maxSize**: Prevent memory issues
5. **Consider cache warming**: Pre-populate frequently used data

## Example: Custom Cache Implementation

```typescript
import { Cache } from './cache/index.js';

class ComputationCache {
  private cache: Cache<number>;
  
  constructor() {
    this.cache = new Cache<number>({
      ttl: 600000,  // 10 minutes
      maxSize: 100
    });
  }
  
  async fibonacci(n: number): Promise<number> {
    const key = `fib:${n}`;
    
    return this.cache.getOrSet(key, async () => {
      // Expensive computation
      if (n <= 1) return n;
      return await this.fibonacci(n - 1) + await this.fibonacci(n - 2);
    });
  }
  
  getStats() {
    return this.cache.getStats();
  }
}

// Usage
const cache = new ComputationCache();
const result = await cache.fibonacci(40); // Computed
const result2 = await cache.fibonacci(40); // From cache
console.log(cache.getStats());
```

## Future Enhancements

Planned features for caching:
- File-based persistent cache
- SQLite cache for larger datasets
- Redis integration for distributed caching
- Cache compression
- Advanced eviction policies (LFU, FIFO)
