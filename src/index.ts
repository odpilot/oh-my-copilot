/**
 * Main entry point for Oh My Copilot
 */

// Core exports
export { OhMyCopilot } from './oh-my-copilot.js';

// Agents
export * from './agents/index.js';

// Orchestrators
export * from './orchestrator/index.js';

// Tasks
export * from './tasks/index.js';

// Keywords
export * from './keywords/detector.js';
export * from './keywords/patterns.js';

// Analytics
export * from './analytics/cost-tracker.js';
export * from './analytics/metrics.js';
export * from './analytics/dashboard.js';

// Config
export * from './config/types.js';
export * from './config/default.js';
export * from './config/models.js';
export * from './config/keys.js';
export * from './config/user-config.js';

// Providers
export * from './providers/index.js';

// Utils
export * from './utils/logger.js';
export * from './utils/helpers.js';
export * from './utils/retry.js';

// SDK
export * from './sdk/index.js';

// MCP
export * from './mcp/index.js';

// Templates
export * from './templates/index.js';

// Plugins
export * from './plugins/index.js';
