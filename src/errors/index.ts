/**
 * Unified Error Classes for OMC
 * Provides consistent error handling across the application
 */

export class OMCError extends Error {
  code: string;
  details?: Record<string, any>;
  suggestion?: string;
  
  constructor(message: string, code: string, details?: Record<string, any>) {
    super(message);
    this.name = 'OMCError';
    this.code = code;
    this.details = details;
  }
}

export class APIError extends OMCError {
  provider: string;
  statusCode?: number;
  
  constructor(
    message: string, 
    provider: string, 
    statusCode?: number,
    details?: Record<string, any>
  ) {
    super(message, 'API_ERROR', details);
    this.name = 'APIError';
    this.provider = provider;
    this.statusCode = statusCode;
    this.suggestion = this.getSuggestion();
  }
  
  private getSuggestion(): string {
    if (this.statusCode === 401) {
      return `Check your ${this.provider.toUpperCase()}_API_KEY in .env file`;
    }
    if (this.statusCode === 429) {
      return 'Rate limit exceeded. Wait a moment or upgrade your API plan';
    }
    if (this.statusCode === 500) {
      return `${this.provider} server error. Try again later`;
    }
    return 'Check your API configuration and try again';
  }
}

export class ConfigError extends OMCError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'CONFIG_ERROR', details);
    this.name = 'ConfigError';
    this.suggestion = 'Run "omc config" to fix configuration issues';
  }
}

export class ValidationError extends OMCError {
  field: string;
  
  constructor(message: string, field: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class TaskError extends OMCError {
  taskId?: string;
  
  constructor(message: string, taskId?: string, details?: Record<string, any>) {
    super(message, 'TASK_ERROR', details);
    this.name = 'TaskError';
    this.taskId = taskId;
  }
}

export class TimeoutError extends OMCError {
  timeout: number;
  
  constructor(message: string, timeout: number) {
    super(message, 'TIMEOUT_ERROR', { timeout });
    this.name = 'TimeoutError';
    this.timeout = timeout;
    this.suggestion = 'Try increasing the timeout or simplifying the task';
  }
}
