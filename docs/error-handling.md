# Error Handling Guide

This document describes the error handling system in oh-my-copilot.

## Overview

The error handling system provides:
- Unified error classes with consistent structure
- Helpful error messages with suggestions
- Centralized error formatting and handling
- Improved retry logic with intelligent retryable error detection

## Error Classes

### Base Error Class: `OMCError`

All custom errors extend from `OMCError`:

```typescript
import { OMCError } from './errors/index.js';

throw new OMCError('Something went wrong', 'CUSTOM_ERROR', { 
  detail1: 'value1' 
});
```

### Available Error Types

#### `APIError`
Used for API-related errors with provider information:

```typescript
import { APIError } from './errors/index.js';

throw new APIError(
  'Request failed',
  'openai',      // provider name
  429,           // HTTP status code
  { limit: 100 } // additional details
);
```

Automatically provides helpful suggestions based on status code:
- **401**: Check your API key configuration
- **429**: Rate limit exceeded - wait or upgrade
- **500**: Server error - try again later

#### `ConfigError`
For configuration-related issues:

```typescript
import { ConfigError } from './errors/index.js';

throw new ConfigError('Invalid model configuration', {
  model: 'gpt-4',
  reason: 'Not available in current plan'
});
```

#### `ValidationError`
For input validation failures:

```typescript
import { ValidationError } from './errors/index.js';

throw new ValidationError(
  'Temperature must be between 0 and 2',
  'temperature',
  { provided: 3.5 }
);
```

#### `TaskError`
For task execution failures:

```typescript
import { TaskError } from './errors/index.js';

throw new TaskError(
  'Task execution failed',
  'task-123',
  { reason: 'Timeout' }
);
```

#### `TimeoutError`
For timeout-related issues:

```typescript
import { TimeoutError } from './errors/index.js';

throw new TimeoutError('Operation timed out', 30000);
```

## Error Handler

The `ErrorHandler` class provides centralized error handling:

### Handling Errors

```typescript
import { ErrorHandler } from './errors/handler.js';

try {
  // Your code
} catch (error) {
  ErrorHandler.handle(error); // Formats and exits
}
```

Output example:
```
❌ APIError: Request failed
   Code: API_ERROR
   💡 Suggestion: Rate limit exceeded. Wait a moment or upgrade your API plan
   Details: {
     "limit": 100
   }
```

### Wrapping Async Operations

```typescript
import { ErrorHandler } from './errors/handler.js';

const result = await ErrorHandler.wrap(
  async () => {
    // Your async operation
  },
  'Context: Database operation' // Optional context
);
```

## Retry Logic with Error Handling

The enhanced retry system intelligently determines which errors are retryable:

```typescript
import { retry } from './utils/retry.js';

const result = await retry(
  async () => {
    // Operation that might fail
    return await apiCall();
  },
  {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    factor: 2,
    // Custom retry condition (optional)
    retryIf: (error) => error instanceof APIError && error.statusCode === 429,
    // Custom retry callback (optional)
    onRetry: (attempt, error, nextDelay) => {
      console.log(`Retry attempt ${attempt} after ${nextDelay}ms`);
    }
  }
);
```

### Default Retryable Errors

The retry system automatically retries these errors:
- `APIError` with status codes: 429, 500, 502, 503, 504
- `TimeoutError`
- Network errors: ECONNRESET, ETIMEDOUT
- Rate limit errors

### Retry Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxAttempts` | number | 3 | Maximum retry attempts |
| `initialDelay` | number | 1000 | Initial delay in ms |
| `maxDelay` | number | 30000 | Maximum delay in ms |
| `factor` | number | 2 | Exponential backoff factor |
| `retryIf` | function | isRetryable | Custom retry condition |
| `onRetry` | function | defaultOnRetry | Callback on retry |

## Best Practices

1. **Use specific error types**: Choose the most appropriate error class for your situation
2. **Provide context**: Include relevant details in the error details object
3. **Let the handler format**: Use `ErrorHandler.handle()` for consistent formatting
4. **Wrap critical operations**: Use `ErrorHandler.wrap()` for important async operations
5. **Configure retry wisely**: Adjust retry parameters based on your use case

## Example Usage

```typescript
import { APIError, TaskError, ErrorHandler } from './errors/index.js';
import { retry } from './utils/retry.js';

async function executeTask(taskId: string) {
  try {
    const result = await retry(
      async () => {
        const response = await fetch('https://api.example.com/task');
        
        if (!response.ok) {
          throw new APIError(
            `API request failed: ${response.statusText}`,
            'example-api',
            response.status
          );
        }
        
        return response.json();
      },
      { maxAttempts: 3 }
    );
    
    return result;
  } catch (error) {
    throw new TaskError(
      'Failed to execute task',
      taskId,
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
}

// Use it
executeTask('task-123').catch(ErrorHandler.handle);
```
