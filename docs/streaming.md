# Streaming Output Guide

This document describes streaming support in oh-my-copilot.

## Overview

Streaming provides real-time output as the model generates responses, improving user experience with:
- Immediate feedback
- Progressive rendering
- Better perceived performance
- Ability to stop generation early

## Streaming Support

### Provider Support

The following providers support streaming:
- ✅ OpenAI
- ✅ Anthropic
- ⏳ Google (future)
- ⏳ Azure OpenAI (future)
- ❌ Ollama (depends on backend)

## Using Streaming

### Basic Stream Example

```typescript
import { UnifiedAgent } from './sdk/index.js';

const agent = new UnifiedAgent({
  name: 'assistant',
  model: 'gpt-4',
  systemPrompt: 'You are a helpful assistant',
  temperature: 0.7
});

// Stream the response
process.stdout.write('🤖 ');

for await (const chunk of agent.chatStream('What is TypeScript?')) {
  process.stdout.write(chunk);
}

console.log('\n✅ Done!');
```

Output:
```
🤖 TypeScript is a strongly typed programming language...
✅ Done!
```

### Stream Handler

Use the `StreamHandler` for more control:

```typescript
import { StreamHandler } from './utils/stream.js';

const handler = new StreamHandler({
  onToken: (token) => {
    process.stdout.write(token);
  },
  onComplete: (fullContent) => {
    console.log('\n\n✅ Complete!');
    console.log(`Total length: ${fullContent.length} characters`);
  },
  onError: (error) => {
    console.error('❌ Error:', error.message);
  }
});

// Use with provider streaming
const stream = provider.createChatCompletionStream({
  model: 'gpt-4',
  messages: [...]
});

for await (const chunk of stream) {
  handler.handleChunk(chunk);
}
```

### Agent Streaming

Use `executeStream` with agents:

```typescript
import { BaseAgent } from './agents/base-agent.js';

const agent = new BaseAgent(config);

const taskContext = {
  task: 'Write a short story about a robot',
  context: { genre: 'sci-fi', length: 'short' }
};

// Stream the execution
for await (const chunk of agent.executeStream(taskContext)) {
  process.stdout.write(chunk);
}
```

## Provider-Level Streaming

### OpenAI Streaming

```typescript
import { OpenAIProvider } from './providers/openai.js';

const provider = new OpenAIProvider(apiKey);

const stream = provider.createChatCompletionStream({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are helpful' },
    { role: 'user', content: 'Tell me a joke' }
  ],
  temperature: 0.7
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    process.stdout.write(content);
  }
  
  if (chunk.choices[0]?.finishReason === 'stop') {
    console.log('\n[Stream ended]');
  }
}
```

### Anthropic Streaming

```typescript
import { AnthropicProvider } from './providers/anthropic.js';

const provider = new AnthropicProvider(apiKey);

const stream = provider.createChatCompletionStream({
  model: 'claude-3-sonnet-20240229',
  messages: [
    { role: 'user', content: 'Explain quantum computing' }
  ],
  temperature: 0.7
});

let fullResponse = '';

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    fullResponse += content;
    process.stdout.write(content);
  }
}

console.log(`\n\nFull response length: ${fullResponse.length}`);
```

## CLI Streaming

### Interactive Chat with Streaming

```typescript
import inquirer from 'inquirer';
import { UnifiedAgent } from './sdk/index.js';

async function interactiveChat() {
  const agent = new UnifiedAgent({
    name: 'assistant',
    model: 'gpt-4',
    systemPrompt: 'You are a helpful assistant'
  });

  while (true) {
    const { message } = await inquirer.prompt([
      {
        type: 'input',
        name: 'message',
        message: 'You:',
      }
    ]);

    if (message.toLowerCase() === 'exit') break;

    process.stdout.write('\n🤖 ');
    
    for await (const chunk of agent.chatStream(message)) {
      process.stdout.write(chunk);
    }
    
    console.log('\n');
  }
}
```

### Progress Indicators with Streaming

```typescript
import ora from 'ora';

async function streamWithSpinner(agent: UnifiedAgent, prompt: string) {
  const spinner = ora('Thinking...').start();
  
  let isFirstChunk = true;
  
  for await (const chunk of agent.chatStream(prompt)) {
    if (isFirstChunk) {
      spinner.stop();
      process.stdout.write('🤖 ');
      isFirstChunk = false;
    }
    process.stdout.write(chunk);
  }
  
  console.log('\n');
}
```

## Advanced Streaming Patterns

### Streaming with Token Counting

```typescript
async function streamWithTokenCount(agent: UnifiedAgent, prompt: string) {
  let tokenCount = 0;
  let fullContent = '';
  
  for await (const chunk of agent.chatStream(prompt)) {
    fullContent += chunk;
    tokenCount = Math.ceil(fullContent.length / 4); // Rough estimate
    
    process.stdout.write(chunk);
  }
  
  console.log(`\n\n📊 Estimated tokens: ${tokenCount}`);
}
```

### Streaming to Multiple Outputs

```typescript
import fs from 'fs';

async function streamToMultiple(agent: UnifiedAgent, prompt: string) {
  const fileStream = fs.createWriteStream('output.txt');
  let fullContent = '';
  
  for await (const chunk of agent.chatStream(prompt)) {
    // Write to console
    process.stdout.write(chunk);
    
    // Write to file
    fileStream.write(chunk);
    
    // Store in memory
    fullContent += chunk;
  }
  
  fileStream.end();
  
  return fullContent;
}
```

### Streaming with Markdown Rendering

```typescript
import marked from 'marked';

async function streamMarkdown(agent: UnifiedAgent, prompt: string) {
  let buffer = '';
  
  for await (const chunk of agent.chatStream(prompt)) {
    buffer += chunk;
    
    // Clear previous output
    process.stdout.write('\x1Bc');
    
    // Render markdown
    const html = marked.parse(buffer);
    console.log(html);
  }
}
```

### Cancellable Streaming

```typescript
async function cancellableStream(agent: UnifiedAgent, prompt: string) {
  let cancelled = false;
  
  // Set up cancellation handler
  process.on('SIGINT', () => {
    cancelled = true;
    console.log('\n\n⚠️  Stream cancelled by user');
  });
  
  for await (const chunk of agent.chatStream(prompt)) {
    if (cancelled) break;
    process.stdout.write(chunk);
  }
}
```

## Stream Handler Options

The `StreamHandler` class accepts these callbacks:

```typescript
interface StreamOptions {
  onToken?: (token: string) => void;        // Called for each token
  onComplete?: (fullContent: string) => void; // Called when done
  onError?: (error: Error) => void;         // Called on error
  onUsage?: (usage: TokenUsage) => void;    // Called with token usage
}
```

### Complete Example

```typescript
import { StreamHandler } from './utils/stream.js';

const handler = new StreamHandler({
  onToken: (token) => {
    // Real-time token processing
    process.stdout.write(token);
  },
  onComplete: (fullContent) => {
    // Final processing
    console.log('\n\n✅ Generation complete');
    console.log(`Length: ${fullContent.length} characters`);
    
    // Save to database, file, etc.
    saveToDatabase(fullContent);
  },
  onError: (error) => {
    // Error handling
    console.error('\n❌ Stream error:', error.message);
    logError(error);
  }
});
```

## Best Practices

### 1. Buffer Management

```typescript
// Good: Process chunks immediately
for await (const chunk of stream) {
  process.stdout.write(chunk);
}

// Avoid: Building large strings in memory unnecessarily
let huge = '';
for await (const chunk of stream) {
  huge += chunk; // Only if you need the full text
}
```

### 2. Error Handling

```typescript
try {
  for await (const chunk of agent.chatStream(prompt)) {
    process.stdout.write(chunk);
  }
} catch (error) {
  console.error('\n❌ Streaming failed:', error);
  // Fallback or retry logic
}
```

### 3. User Feedback

```typescript
// Show immediate feedback
process.stdout.write('🤖 '); // Before streaming

// Indicate completion
console.log('\n✅ Done'); // After streaming
```

### 4. Performance

```typescript
// Use streaming for long responses
if (expectedLength > 500) {
  // Stream for better UX
  for await (const chunk of agent.chatStream(prompt)) {
    process.stdout.write(chunk);
  }
} else {
  // Regular call for short responses
  const response = await agent.chat(prompt);
  console.log(response.content);
}
```

## Limitations

1. **No caching**: Streamed responses are not cached (by design)
2. **No token usage**: Token counts not available during streaming
3. **Provider support**: Not all providers support streaming
4. **Temperature > 0**: Streaming works best with non-zero temperature

## Fallback Behavior

If streaming is not supported, the system automatically falls back to regular completion:

```typescript
// Automatically handles non-streaming providers
for await (const chunk of agent.chatStream(prompt)) {
  // Works with both streaming and non-streaming providers
  process.stdout.write(chunk);
}
```

## Future Enhancements

Planned streaming features:
- Server-Sent Events (SSE) for web UI
- WebSocket streaming support
- Streaming with function calling
- Partial JSON parsing during stream
- Stream resumption after network errors
