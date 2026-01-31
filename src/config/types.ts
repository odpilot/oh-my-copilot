/**
 * Configuration types
 */

export interface OhMyCopilotConfig {
  // Database
  dbPath?: string;
  
  // Models
  architectModel?: string;
  executorModel?: string;
  qaTesterModel?: string;
  securityModel?: string;
  designerModel?: string;
  
  // Cost tracking
  trackCosts?: boolean;
  
  // Logging
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  logFile?: string;
  
  // API
  apiKey?: string;
  githubToken?: string;
}
