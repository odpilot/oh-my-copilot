# Examples: Using New Features

This directory contains examples demonstrating the new features added to oh-my-copilot.

## Error Handling Example

```typescript
import { UnifiedAgent } from 'oh-my-copilot';
import { APIError, ErrorHandler } from 'oh-my-copilot/errors';
import { retry } from 'oh-my-copilot/utils/retry';

async function robustChatWithRetry() {
  const agent = new UnifiedAgent({
    name: 'assistant',
    model: 'gpt-4',
    systemPrompt: 'You are a helpful assistant',
    temperature: 0
  });

  try {
    const result = await retry(
      async () => {
        return await agent.chat('Explain quantum computing in simple terms');
      },
      {
        maxAttempts: 3,
        initialDelay: 1000,
        onRetry: (attempt, error, delay) => {
          console.log(`⚠️  Retry attempt ${attempt} after ${delay}ms: ${error.message}`);
        }
      }
    );

    console.log('✅ Success:', result.content);
  } catch (error) {
    ErrorHandler.handle(error);
  }
}

robustChatWithRetry();
```

## Caching Example

```typescript
import { UnifiedAgent } from 'oh-my-copilot';

// Cache is automatically enabled for temperature=0 requests
const agent = new UnifiedAgent({
  name: 'assistant',
  model: 'gpt-4',
  systemPrompt: 'You are a helpful assistant',
  temperature: 0  // Important: only temperature=0 requests are cached
});

async function cachedQueries() {
  console.log('First call (will hit API):');
  const response1 = await agent.chat('What is TypeScript?');
  console.log(response1.content);

  console.log('\nSecond call (will use cache):');
  const response2 = await agent.chat('What is TypeScript?');
  // You'll see: "📦 Cache hit! Saved API call."
  console.log(response2.content);
}

cachedQueries();
```

## Streaming Example

```typescript
import { UnifiedAgent } from 'oh-my-copilot';

const agent = new UnifiedAgent({
  name: 'storyteller',
  model: 'gpt-4',
  systemPrompt: 'You are a creative storyteller',
  temperature: 0.7
});

async function streamingStory() {
  console.log('🤖 Once upon a time...\n');
  
  for await (const chunk of agent.chatStream('Tell me a short story about a brave robot')) {
    process.stdout.write(chunk);
  }
  
  console.log('\n\n✅ Story complete!');
}

streamingStory();
```

## Token Optimization Example

```typescript
import { UnifiedAgent } from 'oh-my-copilot';
import { TokenOptimizer } from 'oh-my-copilot/utils/token-optimizer';

const agent = new UnifiedAgent({
  name: 'assistant',
  model: 'gpt-4',
  systemPrompt: 'You are a helpful assistant'
});

// Simulate a long conversation
const conversationHistory = [
  { role: 'system', content: 'You are a helpful assistant' },
  { role: 'user', content: 'Question 1...' },
  { role: 'assistant', content: 'Answer 1...' },
  // ... many more messages
];

// Compress history to fit within token limits
const compressed = TokenOptimizer.compressHistory(
  conversationHistory,
  4000,  // Max tokens
  'sliding-window'
);

console.log(`Original: ${conversationHistory.length} messages`);
console.log(`Compressed: ${compressed.length} messages`);
console.log(`Estimated tokens: ${TokenOptimizer.estimateTokens(compressed)}`);
```

## Batch Processing Example

```typescript
import { BatchProcessor } from 'oh-my-copilot/utils/batch-processor';
import { UnifiedAgent } from 'oh-my-copilot';

const agent = new UnifiedAgent({
  name: 'translator',
  model: 'gpt-4',
  systemPrompt: 'You are a translator. Translate to French.'
});

async function batchTranslate() {
  const texts = [
    'Hello, world!',
    'How are you?',
    'Good morning!',
    'Thank you!',
    'Goodbye!'
  ];

  const results = await BatchProcessor.process(
    texts,
    async (text) => {
      const response = await agent.chat(text);
      return response.content;
    },
    {
      concurrency: 2,  // Process 2 at a time
      delayBetweenBatches: 1000,  // 1 second delay
      onProgress: (completed, total) => {
        console.log(`Progress: ${completed}/${total}`);
      },
      onError: (error, item) => {
        console.error(`Failed to translate: ${item}`);
        return 'skip';
      }
    }
  );

  results.forEach(({ item, result, error }) => {
    if (result) {
      console.log(`"${item}" → "${result}"`);
    }
  });
}

batchTranslate();
```

## Enhanced Logging Example

```typescript
import { Logger, LogLevel } from 'oh-my-copilot/utils/logger';

// Create a custom logger with file output
const logger = new Logger(LogLevel.DEBUG, './logs/app.log');

// Set options for JSON format and file rotation
logger.setOptions({
  format: 'json',
  output: 'both',  // Both console and file
  maxFileSize: 5 * 1024 * 1024,  // 5MB
  maxFiles: 3
});

// Log with context
logger.info('Task started', {
  taskId: 'task-123',
  agentName: 'architect',
  user: 'john@example.com'
});

// Log task completion
logger.taskEnd('task-123', 'architect', 1500, true);
```

## Complete Example: Chat with All Features

```typescript
import { UnifiedAgent } from 'oh-my-copilot';
import { retry } from 'oh-my-copilot/utils/retry';
import { TokenOptimizer } from 'oh-my-copilot/utils/token-optimizer';
import { Logger, LogLevel } from 'oh-my-copilot/utils/logger';
import { ErrorHandler } from 'oh-my-copilot/errors';

const logger = new Logger(LogLevel.INFO);

async function advancedChat() {
  const agent = new UnifiedAgent({
    name: 'assistant',
    model: 'gpt-4',
    systemPrompt: 'You are a helpful AI assistant',
    temperature: 0  // Enable caching
  });

  const taskId = `task-${Date.now()}`;
  const startTime = Date.now();

  try {
    logger.taskStart(taskId, 'assistant', 'Process user query');

    // Use retry with error handling
    const result = await retry(
      async () => {
        // Get conversation history
        const history = agent.getHistory();
        
        // Optimize tokens if needed
        const estimatedTokens = TokenOptimizer.estimateTokens(history);
        if (estimatedTokens > 7000) {
          logger.warn('Token limit approaching, compressing history');
          // Note: In real implementation, you'd compress before sending
        }

        // Stream the response
        console.log('🤖 ');
        let fullResponse = '';
        
        for await (const chunk of agent.chatStream('What are the key benefits of TypeScript?')) {
          process.stdout.write(chunk);
          fullResponse += chunk;
        }
        
        console.log('\n');
        return fullResponse;
      },
      {
        maxAttempts: 3,
        onRetry: (attempt, error, delay) => {
          logger.warn(`Retry attempt ${attempt}`, { 
            error: error.message, 
            delay 
          });
        }
      }
    );

    const duration = Date.now() - startTime;
    logger.taskEnd(taskId, 'assistant', duration, true);
    
    console.log(`✅ Task completed in ${duration}ms`);

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.taskEnd(taskId, 'assistant', duration, false);
    ErrorHandler.handle(error);
  }
}

advancedChat();
```

## Running the Examples

Make sure you have your API keys configured in `.env`:

```bash
OPENAI_API_KEY=your_key_here
# or
ANTHROPIC_API_KEY=your_key_here
```

Then run any example:

```bash
# Make sure to build first
npm run build

# Run example (create a file with the code above)
node examples/streaming-example.js
```
