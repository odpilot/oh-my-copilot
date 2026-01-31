# Agents Guide

## Overview

Oh My Copilot uses specialized AI agents powered by OpenAI models to handle different aspects of software development.

## Built-in Agents

### Architect Agent

**Model**: GPT-4o  
**Role**: Strategic planning and system design

**Responsibilities**:
- Analyze problems and requirements
- Create detailed implementation plans
- Design system architecture
- Break down complex tasks
- Define interfaces and contracts

**Usage**:
```typescript
import { ArchitectAgent } from 'oh-my-copilot';

const architect = new ArchitectAgent();
const result = await architect.execute({
  task: 'Design a microservices architecture for an e-commerce platform'
});
```

**System Prompt**:
> "You are an expert software architect. Your responsibilities include analyzing problems, creating detailed implementation plans, designing system architecture, and breaking down complex tasks into manageable steps..."

---

### Executor Agent

**Model**: GPT-4o-mini  
**Role**: Code implementation

**Responsibilities**:
- Implement code based on specifications
- Write clean, testable code
- Handle edge cases and errors
- Create and update files
- Follow coding standards

**Usage**:
```typescript
import { ExecutorAgent } from 'oh-my-copilot';

const executor = new ExecutorAgent();
const result = await executor.execute({
  task: 'Implement user authentication with JWT',
  previousResults: [architectResult] // Optional context
});
```

---

### QA Tester Agent

**Model**: GPT-4o-mini  
**Role**: Testing and quality assurance

**Responsibilities**:
- Write comprehensive unit tests
- Create integration tests
- Validate implementations
- Identify edge cases
- Ensure code coverage

**Usage**:
```typescript
import { QATesterAgent } from 'oh-my-copilot';

const qaTester = new QATesterAgent();
const result = await qaTester.execute({
  task: 'Write tests for the authentication module',
  previousResults: [executorResult]
});
```

---

### Security Agent

**Model**: GPT-4o  
**Role**: Security review and vulnerability detection

**Responsibilities**:
- Review code for vulnerabilities
- Identify attack vectors
- Suggest security improvements
- Validate authentication/authorization
- Check for security anti-patterns

**Usage**:
```typescript
import { SecurityAgent } from 'oh-my-copilot';

const security = new SecurityAgent();
const result = await security.execute({
  task: 'Review the API implementation for security issues',
  previousResults: [executorResult]
});
```

---

### Designer Agent

**Model**: GPT-4o  
**Role**: UI/UX design

**Responsibilities**:
- Design user interfaces
- Create responsive layouts
- Define color schemes
- Ensure accessibility
- Optimize for usability

**Usage**:
```typescript
import { DesignerAgent } from 'oh-my-copilot';

const designer = new DesignerAgent();
const result = await designer.execute({
  task: 'Design a dashboard for analytics'
});
```

---

## Creating Custom Agents

You can create specialized agents for your specific needs:

### Example: Database Expert

```typescript
import { BaseAgent } from 'oh-my-copilot';
import type { AgentConfig } from 'oh-my-copilot';

class DatabaseExpertAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'database-expert',
      model,
      systemPrompt: `You are a database optimization expert specializing in:
- SQL query optimization
- Index strategies
- Schema design
- Performance tuning
- Data modeling

Provide detailed, production-ready solutions.`,
      temperature: 0.3,
      maxTokens: 4000
    };
    
    super(config);
  }
}

// Usage
const dbExpert = new DatabaseExpertAgent();
const result = await dbExpert.execute({
  task: 'Optimize this slow query: SELECT * FROM orders...'
});
```

### Example: DevOps Agent

```typescript
class DevOpsAgent extends BaseAgent {
  constructor() {
    super({
      name: 'devops-engineer',
      model: 'gpt-4o-mini',
      systemPrompt: `You are a DevOps engineer expert in:
- CI/CD pipelines
- Docker and Kubernetes
- Infrastructure as Code
- Monitoring and logging

Provide practical, implementable solutions.`,
      temperature: 0.4
    });
  }
}
```

## Agent Configuration

### AgentConfig Interface

```typescript
interface AgentConfig {
  name: string;           // Agent identifier
  model: string;          // Model to use (gpt-4o, gpt-4o-mini)
  systemPrompt: string;   // System prompt defining behavior
  tools?: Tool[];         // Optional tools (future)
  temperature?: number;   // 0-1, controls randomness
  maxTokens?: number;     // Max tokens in response
}
```

### Temperature Guidelines

- **0.0-0.3**: Deterministic, factual (good for code, security)
- **0.4-0.7**: Balanced creativity (good for architecture, design)
- **0.8-1.0**: High creativity (good for brainstorming)

### Model Selection

- **GPT-4o**: Best for complex reasoning, architecture, security
- **GPT-4o-mini**: Fast and cost-effective for implementation, testing

## Agent Communication

Agents can build on each other's work through `previousResults`:

```typescript
// Step 1: Planning
const plan = await architect.execute({ task: 'Design API' });

// Step 2: Implementation (with context from planning)
const code = await executor.execute({
  task: 'Implement the API',
  previousResults: [plan]
});

// Step 3: Testing (with context from implementation)
const tests = await qaTester.execute({
  task: 'Write tests',
  previousResults: [plan, code]
});
```

## Best Practices

1. **Use appropriate models**: GPT-4o for complex tasks, GPT-4o-mini for simple ones
2. **Provide context**: Use `previousResults` to give agents context
3. **Clear prompts**: Be specific about what you want
4. **Chain agents**: Let agents build on each other's work
5. **Monitor costs**: Track token usage with cost tracking

## Agent Lifecycle

```typescript
// Create
const agent = new ExecutorAgent();

// Execute
const result = await agent.execute({ task: '...' });

// Check result
if (result.success) {
  console.log(result.content);
  console.log(`Cost: $${calculateCost(result.usage)}`);
}

// Reset conversation (if needed)
agent.reset();
```

## Error Handling

```typescript
const result = await agent.execute({ task: '...' });

if (!result.success) {
  console.error('Agent failed:', result.error);
  console.log('Execution time:', result.executionTime);
} else {
  console.log('Success!');
  console.log(result.content);
}
```
