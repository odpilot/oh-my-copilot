/**
 * Express Server Main Entry Point
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer, Server } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { setupWebSocket } from './websocket.js';
import { setupRoutes } from './routes/index.js';

const getPublicPath = () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    // When running from built code, resolve relative to the web module
    const publicPath = path.join(__dirname, 'public');
    // If this is being imported from CLI, adjust the path
    if (__dirname.includes('/dist/cli')) {
      return path.join(__dirname, '..', 'web', 'public');
    }
    return publicPath;
  } catch {
    // Fallback for environments where import.meta is not available
    return path.join(process.cwd(), 'dist', 'web', 'public');
  }
};

export interface ServerConfig {
  port?: number;
  enableCors?: boolean;
}

let httpServer: Server | null = null;
let wsServer: WebSocketServer | null = null;

/**
 * Create and configure the Express application
 */
export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS support
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Static files - serve from public directory
  const publicPath = getPublicPath();
  console.log('Serving static files from:', publicPath);
  app.use(express.static(publicPath));

  // Setup API routes
  setupRoutes(app);

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  });

  return app;
}

/**
 * Start the web server
 */
export function startServer(config: ServerConfig = {}): Server {
  const port = config.port || 3000;
  const app = createApp();

  // Create HTTP server
  httpServer = createServer(app);

  // Create WebSocket server
  wsServer = new WebSocketServer({ server: httpServer });
  setupWebSocket(wsServer);

  // Start listening
  httpServer.listen(port, () => {
    console.log(`🌐 Web UI running at http://localhost:${port}`);
    console.log(`📊 Dashboard: http://localhost:${port}`);
    console.log(`🔌 WebSocket: ws://localhost:${port}`);
  });

  return httpServer;
}

/**
 * Stop the web server
 */
export function stopServer(): void {
  if (wsServer) {
    wsServer.close();
    wsServer = null;
  }
  if (httpServer) {
    httpServer.close();
    httpServer = null;
  }
}

