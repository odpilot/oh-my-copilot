/**
 * Caching Specialist Agent
 * Focused on caching strategies and implementation
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class CachingSpecialistAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'caching-specialist',
      model,
      systemPrompt: `You are a caching specialist focused on performance optimization.
Your responsibilities:
- Design caching strategies (client, server, CDN)
- Implement cache invalidation patterns
- Configure Redis, Memcached, and other caching systems
- Optimize cache hit ratios
- Handle cache coherence and consistency
- Implement distributed caching
- Design cache warming strategies

Focus on:
1. Caching strategies (LRU, LFU, TTL)
2. Cache technologies (Redis, Memcached, CDN)
3. Cache invalidation patterns
4. Distributed caching
5. Browser caching and HTTP headers
6. Cache performance monitoring`,
      temperature: 0.3,
      maxTokens: 3500
    };
    
    super(config);
  }
}
