/**
 * WebSocket Real-time Updates
 */

import { WebSocketServer, WebSocket } from 'ws';

export interface WebSocketMessage {
  type: 'task_update' | 'agent_status' | 'cost_update' | 'error' | 'ping';
  data?: any;
  timestamp: number;
}

const clients = new Set<WebSocket>();

/**
 * Setup WebSocket server and handle connections
 */
export function setupWebSocket(wss: WebSocketServer): void {
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    clients.add(ws);

    // Send welcome message
    sendToClient(ws, {
      type: 'ping',
      timestamp: Date.now()
    });

    // Handle messages from client
    ws.on('message', (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        handleClientMessage(ws, data);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clients.delete(ws);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Keep-alive ping every 30 seconds
  const pingInterval = setInterval(() => {
    broadcast({
      type: 'ping',
      timestamp: Date.now()
    });
  }, 30000);

  // Cleanup on server close
  wss.on('close', () => {
    clearInterval(pingInterval);
  });
}

/**
 * Handle messages from clients
 */
function handleClientMessage(ws: WebSocket, message: any): void {
  // Echo back for now - can be extended for client commands
  if (message.type === 'ping') {
    sendToClient(ws, {
      type: 'ping',
      timestamp: Date.now()
    });
  }
}

/**
 * Send message to a specific client
 */
function sendToClient(ws: WebSocket, message: WebSocketMessage): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

/**
 * Broadcast message to all connected clients
 */
export function broadcast(message: WebSocketMessage): void {
  const messageStr = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

/**
 * Broadcast task update
 */
export function broadcastTaskUpdate(taskId: string, status: string, data?: any): void {
  broadcast({
    type: 'task_update',
    data: { taskId, status, ...data },
    timestamp: Date.now()
  });
}

/**
 * Broadcast agent status
 */
export function broadcastAgentStatus(agentName: string, status: string, data?: any): void {
  broadcast({
    type: 'agent_status',
    data: { agentName, status, ...data },
    timestamp: Date.now()
  });
}

/**
 * Broadcast cost update
 */
export function broadcastCostUpdate(cost: number, tokens: number, model?: string): void {
  broadcast({
    type: 'cost_update',
    data: { cost, tokens, model },
    timestamp: Date.now()
  });
}

/**
 * Broadcast error
 */
export function broadcastError(error: string, details?: any): void {
  broadcast({
    type: 'error',
    data: { error, details },
    timestamp: Date.now()
  });
}
