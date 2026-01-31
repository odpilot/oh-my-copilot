# Performance Optimization Guide

This document describes performance optimization utilities in oh-my-copilot.

## Overview

Performance optimization features include:
- Token usage optimization
- Batch processing with concurrency control
- Conversation history compression
- Prompt optimization

## Token Optimizer

The `TokenOptimizer` class helps manage token usage effectively.

### Compressing Conversation History

Long conversation histories can exceed model context limits. The optimizer provides strategies to compress them:

```typescript
import { TokenOptimizer } from './utils/token-optimizer.js';

const messages = [
  { role: 'system', content: 'You are a helpful assistant' },
  { role: 'user', content: 'Question 1' },
  { role: 'assistant', content: 'Answer 1' },
  // ... many more messages
];

// Compress to fit within token limit
const compressed = TokenOptimizer.compressHistory(
  messages,
  4000,  // Max tokens
  'sliding-window'  // Strategy
);
```

### Compression Strategies

#### 1. Sliding Window (Default)
Keeps system messages and most recent conversation:

```typescript
const compressed = TokenOptimizer.compressHistory(
  messages,
  4000,
  'sliding-window'
);
```

**Best for**: Maintaining recent context while respecting token limits

#### 2. Truncate
Keeps system messages and truncates from the beginning:

```typescript
const compressed = TokenOptimizer.compressHistory(
  messages,
  4000,
  'truncate'
);
```

**Best for**: Maintaining early context (e.g., initial instructions)

#### 3. Summarize (Placeholder)
Future: Uses LLM to summarize old messages:

```typescript
const compressed = TokenOptimizer.compressHistory(
  messages,
  4000,
  'summarize'
);
```

**Note**: Currently falls back to sliding-window

### Estimating Tokens

Get approximate token count for messages:

```typescript
const messages = [
  { role: 'user', content: 'Hello, world!' }
];

const estimatedTokens = TokenOptimizer.estimateTokens(messages);
console.log(`Approximately ${estimatedTokens} tokens`);
```

**Note**: This is an approximation. Actual token count may vary.

Estimation formula:
- ~1 token per 3 characters (average for English/Chinese)
- +4 tokens per message for role overhead

### Optimizing Prompts

Remove unnecessary whitespace and formatting:

```typescript
const messy = `
  This    is   a   messy


  prompt   with    lots    of    whitespace
`;

const clean = TokenOptimizer.optimizePrompt(messy);
// "This is a messy\n\nprompt with lots of whitespace"
```

Optimizations:
- Multiple spaces → single space
- 3+ newlines → 2 newlines
- Trim leading/trailing whitespace per line

## Batch Processor

The `BatchProcessor` class handles concurrent batch processing with progress tracking.

### Basic Usage

```typescript
import { BatchProcessor } from './utils/batch-processor.js';

const items = ['item1', 'item2', 'item3', 'item4', 'item5'];

const results = await BatchProcessor.process(
  items,
  async (item) => {
    // Process each item
    return await processItem(item);
  },
  {
    concurrency: 2,  // Process 2 items at a time
    delayBetweenBatches: 1000,  // 1 second delay between batches
    onProgress: (completed, total) => {
      console.log(`Progress: ${completed}/${total}`);
    }
  }
);
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `concurrency` | number | required | Items to process concurrently |
| `delayBetweenBatches` | number | 0 | Delay in ms between batches |
| `onProgress` | function | undefined | Progress callback |
| `onError` | function | 'skip' | Error handling strategy |

### Error Handling

Control how errors are handled:

```typescript
await BatchProcessor.process(
  items,
  processor,
  {
    concurrency: 3,
    onError: (error, item) => {
      console.error(`Error processing ${item}:`, error);
      
      // Return action to take
      return 'skip';   // Skip this item and continue
      // return 'abort'; // Stop processing immediately
      // return 'retry'; // Retry this item (future)
    }
  }
);
```

### Results Format

Results include both successful and failed items:

```typescript
const results = await BatchProcessor.process(items, processor, options);

results.forEach(({ item, result, error }) => {
  if (error) {
    console.log(`Failed: ${item}`, error);
  } else {
    console.log(`Success: ${item}`, result);
  }
});
```

### Advanced Example

```typescript
import { BatchProcessor } from './utils/batch-processor.js';
import ora from 'ora';

async function processLargeDataset(urls: string[]) {
  const spinner = ora('Processing URLs').start();
  
  const results = await BatchProcessor.process(
    urls,
    async (url) => {
      const response = await fetch(url);
      return response.json();
    },
    {
      concurrency: 5,
      delayBetweenBatches: 500,
      onProgress: (completed, total) => {
        spinner.text = `Processing URLs: ${completed}/${total}`;
      },
      onError: (error, url) => {
        spinner.warn(`Failed to fetch ${url}: ${error.message}`);
        return 'skip';
      }
    }
  );
  
  spinner.succeed('Processing complete!');
  
  const successful = results.filter(r => !r.error);
  const failed = results.filter(r => r.error);
  
  console.log(`Success: ${successful.length}, Failed: ${failed.length}`);
  
  return successful.map(r => r.result);
}
```

## Performance Best Practices

### 1. Token Management

**Compress Long Conversations**:
```typescript
// Before sending to API
const messages = TokenOptimizer.compressHistory(
  conversationHistory,
  8000,  // Keep under context limit
  'sliding-window'
);
```

**Monitor Token Usage**:
```typescript
const estimated = TokenOptimizer.estimateTokens(messages);
if (estimated > modelContextLimit * 0.8) {
  // Compress before sending
  messages = TokenOptimizer.compressHistory(messages, modelContextLimit * 0.7);
}
```

### 2. Batch Processing

**Rate Limiting**:
```typescript
// Respect API rate limits
await BatchProcessor.process(
  requests,
  processor,
  {
    concurrency: 3,  // Don't overwhelm API
    delayBetweenBatches: 1000  // 1 second between batches
  }
);
```

**Progress Indication**:
```typescript
// Keep users informed
await BatchProcessor.process(
  items,
  processor,
  {
    concurrency: 5,
    onProgress: (completed, total) => {
      const percent = Math.round((completed / total) * 100);
      console.log(`${percent}% complete`);
    }
  }
);
```

### 3. Prompt Optimization

**Clean Prompts**:
```typescript
// Before sending
const prompt = TokenOptimizer.optimizePrompt(userInput);
```

**Remove Redundancy**:
```typescript
// Combine similar instructions
const optimized = TokenOptimizer.optimizePrompt(`
  Please be helpful.
  
  
  Please be concise.
  Please be accurate.
`);
// Result: "Please be helpful.\n\nPlease be concise.\nPlease be accurate."
```

### 4. Memory Management

**Clear Old History**:
```typescript
// Periodically compress or clear history
if (conversationHistory.length > 100) {
  conversationHistory = TokenOptimizer.compressHistory(
    conversationHistory,
    maxTokens,
    'sliding-window'
  );
}
```

## Benchmarking

### Token Estimation Accuracy

```typescript
import { TokenOptimizer } from './utils/token-optimizer.js';

const messages = [...]; // Your messages
const estimated = TokenOptimizer.estimateTokens(messages);
const actual = getActualTokenCount(messages); // From API

const accuracy = (estimated / actual) * 100;
console.log(`Estimation accuracy: ${accuracy.toFixed(1)}%`);
```

### Batch Processing Performance

```typescript
const startTime = Date.now();

await BatchProcessor.process(items, processor, {
  concurrency: 5,
  onProgress: (completed, total) => {
    const elapsed = Date.now() - startTime;
    const rate = completed / (elapsed / 1000);
    console.log(`Processing rate: ${rate.toFixed(2)} items/sec`);
  }
});
```

## Common Patterns

### 1. API Call with Token Management

```typescript
async function chatWithTokenManagement(messages: Message[]) {
  // Ensure we don't exceed context limit
  const compressed = TokenOptimizer.compressHistory(
    messages,
    7000,  // Safe limit for 8k context
    'sliding-window'
  );
  
  const response = await api.chat({
    messages: compressed,
    model: 'gpt-4'
  });
  
  return response;
}
```

### 2. Batch API Calls with Rate Limiting

```typescript
async function batchTranslate(texts: string[]) {
  return BatchProcessor.process(
    texts,
    async (text) => {
      return await translateAPI.translate(text);
    },
    {
      concurrency: 10,  // 10 concurrent requests
      delayBetweenBatches: 100,  // Small delay
      onError: () => 'skip'
    }
  );
}
```

### 3. Progressive Summarization

```typescript
async function progressiveSummarization(documents: string[]) {
  // First pass: summarize each document
  const summaries = await BatchProcessor.process(
    documents,
    async (doc) => await summarize(doc),
    { concurrency: 5 }
  );
  
  // Second pass: combine summaries
  const combined = summaries
    .filter(s => !s.error)
    .map(s => s.result)
    .join('\n\n');
  
  // Final summary
  return await summarize(combined);
}
```
