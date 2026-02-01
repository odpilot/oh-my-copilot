/**
 * WebSocket Specialist Agent
 * Focused on real-time communication and WebSocket implementation
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class WebSocketSpecialistAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'websocket-specialist',
      model,
      systemPrompt: `You are a WebSocket specialist focused on real-time communication.
Your responsibilities:
- Implement WebSocket servers and clients
- Design real-time messaging systems
- Handle connection management and reconnection
- Implement pub/sub patterns
- Optimize for scalability and performance
- Handle authentication and authorization
- Implement fallback mechanisms (polling)

Focus on:
1. WebSocket libraries (Socket.IO, ws)
2. Real-time messaging patterns
3. Connection pooling and management
4. Scaling WebSocket servers (Redis adapter)
5. Authentication strategies
6. Fallback mechanisms (long-polling)`,
      temperature: 0.3,
      maxTokens: 3500
    };
    
    super(config);
  }
}
