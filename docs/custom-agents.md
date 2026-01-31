# Custom Agents Guide

## Table of Contents
1. [Overview](#overview)
2. [Why Create Custom Agents](#why-create-custom-agents)
3. [BaseAgent Class Documentation](#baseagent-class-documentation)
4. [Creating Your First Custom Agent](#creating-your-first-custom-agent)
5. [Configuration Options](#configuration-options)
6. [Advanced Features](#advanced-features)
7. [Best Practices](#best-practices)
8. [Example Agents](#example-agents)
9. [Testing Custom Agents](#testing-custom-agents)
10. [Integration with Orchestration](#integration-with-orchestration)

---

## Overview

Custom agents in oh-my-copilot are specialized AI assistants designed to handle specific tasks in your workflow. Each agent is built on the `BaseAgent` class and can be configured with unique personalities, capabilities, and behaviors through system prompts and configuration options.

### Key Concepts

- **BaseAgent**: The foundational class that all custom agents extend
- **AgentConfig**: Configuration object defining the agent's behavior
- **TaskContext**: Input structure containing the task, context, and previous results
- **AgentResult**: Output structure containing the agent's response and metadata
- **UnifiedAgent**: Internal wrapper that handles provider communication

---

## Why Create Custom Agents

Creating custom agents allows you to:

1. **Specialize Workflows**: Build agents optimized for specific domains (database design, API integration, code review, etc.)
2. **Enforce Standards**: Embed company-specific coding standards, design patterns, or best practices in agent behavior
3. **Optimize Costs**: Use different models for different tasks (cheaper models for simple tasks, advanced models for complex reasoning)
4. **Improve Accuracy**: Fine-tune agent prompts and temperatures for specific use cases
5. **Enable Collaboration**: Create agent teams that work together in pipeline or swarm modes
6. **Extend Functionality**: Add custom tools and capabilities beyond general-purpose AI assistants

### Common Use Cases

- **Domain Experts**: DatabaseExpert, APIIntegrator, DevOpsAgent
- **Code Quality**: CodeReviewer, RefactoringAgent, DocumentationAgent
- **Testing**: UnitTestWriter, E2ETestGenerator, PerformanceTester
- **Architecture**: MicroserviceArchitect, FrontendArchitect, CloudArchitect
- **Security**: VulnerabilityScanner, ComplianceChecker, ThreatModeler

---

## BaseAgent Class Documentation

### Class Structure

```typescript
export class BaseAgent {
  protected agent: UnifiedAgent;
  protected config: AgentConfig;
  protected name: string;

  constructor(config: AgentConfig, providerKeys?: ProviderKeys);
  async execute(taskContext: TaskContext): Promise<AgentResult>;
  protected buildPrompt(taskContext: TaskContext): string;
  reset(): void;
  getName(): string;
  getConfig(): AgentConfig;
  getProvider(): string;
}
```

### Key Methods

#### `constructor(config: AgentConfig, providerKeys?: ProviderKeys)`

Initializes the agent with configuration and optional provider keys.

**Parameters:**
- `config`: Agent configuration object (see [Configuration Options](#configuration-options))
- `providerKeys` (optional): Custom provider API keys

#### `execute(taskContext: TaskContext): Promise<AgentResult>`

Executes a task and returns the result.

**Parameters:**
- `taskContext`: Object containing:
  - `task` (string): The task description
  - `context` (object, optional): Additional context data
  - `previousResults` (array, optional): Results from previous agents in pipeline

**Returns:**
- `AgentResult` object with:
  - `agentName`: Name of the agent
  - `success`: Whether execution succeeded
  - `content`: Agent's response
  - `usage`: Token usage statistics
  - `model`: Model used
  - `executionTime`: Time taken in milliseconds
  - `error` (optional): Error message if failed
  - `provider` (optional): Provider name

#### `buildPrompt(taskContext: TaskContext): string`

Protected method that constructs the prompt from task context. Override this to customize prompt building.

#### `reset(): void`

Resets the agent's conversation history.

#### `getName(): string`

Returns the agent's configured name.

#### `getConfig(): AgentConfig`

Returns a copy of the agent's configuration.

#### `getProvider(): string`

Returns the current provider being used (e.g., 'openai', 'anthropic').

### Type Definitions

```typescript
export interface TaskContext {
  task: string;
  context?: Record<string, any>;
  previousResults?: any[];
}

export interface AgentResult {
  agentName: string;
  success: boolean;
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  executionTime: number;
  error?: string;
  provider?: string;
}
```

---

## Creating Your First Custom Agent

### Step 1: Create the Agent File

Create a new file in `src/agents/` (or your custom agents directory):

```typescript
// src/agents/database-expert.ts
import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class DatabaseExpertAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'database-expert',
      model,
      systemPrompt: `You are a database expert specializing in schema design, optimization, and SQL.

Your responsibilities:
- Design efficient database schemas
- Write optimized SQL queries
- Suggest indexing strategies
- Identify N+1 query problems
- Recommend database best practices
- Consider data normalization and denormalization trade-offs

Always provide:
1. Clear schema definitions with data types
2. Indexed columns for performance
3. Relationship definitions (foreign keys, constraints)
4. Sample queries for common operations
5. Migration scripts when applicable`,
      temperature: 0.3, // Lower temperature for technical precision
      maxTokens: 4000
    };
    
    super(config);
  }
}
```

### Step 2: Export the Agent

Add your agent to `src/agents/index.ts`:

```typescript
export * from './database-expert.js';
```

### Step 3: Use the Agent

```typescript
import { DatabaseExpertAgent } from './agents/database-expert.js';

const dbAgent = new DatabaseExpertAgent();

const result = await dbAgent.execute({
  task: 'Design a schema for a multi-tenant SaaS application with users, organizations, and subscriptions',
  context: {
    database: 'PostgreSQL',
    requirements: ['Row-level security', 'Audit logging', 'Soft deletes']
  }
});

console.log(result.content);
```

### Step 4: Test the Agent

```typescript
// tests/agents/database-expert.test.ts
import { describe, it, expect } from 'vitest';
import { DatabaseExpertAgent } from '../../src/agents/database-expert.js';

describe('DatabaseExpertAgent', () => {
  it('should generate a database schema', async () => {
    const agent = new DatabaseExpertAgent();
    
    const result = await agent.execute({
      task: 'Create a simple user authentication schema'
    });
    
    expect(result.success).toBe(true);
    expect(result.content).toContain('users');
    expect(result.content).toContain('password');
  });
});
```

---

## Configuration Options

### AgentConfig Interface

```typescript
interface AgentConfig {
  name: string;           // Agent identifier
  model: string;          // AI model to use
  systemPrompt: string;   // Agent's personality and instructions
  tools?: Tool[];         // Optional: Custom tools
  temperature?: number;   // Optional: Response randomness (0-1)
  maxTokens?: number;     // Optional: Maximum response length
}
```

### Configuration Properties

#### `name` (required)
Unique identifier for the agent. Use kebab-case naming.

**Examples:**
- `'database-expert'`
- `'api-integrator'`
- `'code-reviewer'`

#### `model` (required)
The AI model to use. Different models have different capabilities and costs.

**Common choices:**
- `'gpt-4o'`: Best reasoning, higher cost
- `'gpt-4o-mini'`: Good balance of speed and cost
- `'claude-3-5-sonnet-20241022'`: Strong coding and reasoning
- `'claude-3-5-haiku-20241022'`: Fast and cost-effective

**Model selection guidance:**
- **Complex reasoning/architecture**: `gpt-4o`, `claude-3-5-sonnet-20241022`
- **Code implementation**: `gpt-4o-mini`, `claude-3-5-haiku-20241022`
- **Testing/QA**: `gpt-4o-mini`, `claude-3-5-haiku-20241022`
- **Code review**: `gpt-4o`, `claude-3-5-sonnet-20241022`

#### `systemPrompt` (required)
The most important configuration. Defines agent personality, responsibilities, and output format.

**Best practices:**
- Start with "You are a [role]" to set identity
- List specific responsibilities clearly
- Define expected output format
- Include domain-specific knowledge
- Add constraints and quality criteria

**Example structure:**
```typescript
systemPrompt: `You are a [ROLE] specializing in [DOMAIN].

Your responsibilities:
- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]

Guidelines:
- [Guideline 1]
- [Guideline 2]

Always provide:
1. [Required output 1]
2. [Required output 2]
3. [Required output 3]`
```

#### `temperature` (optional, default: varies by provider)
Controls response randomness (0.0 - 1.0):

- **0.0 - 0.3**: Deterministic, focused, technical
  - Use for: Code generation, SQL queries, configuration files
- **0.4 - 0.7**: Balanced creativity and consistency
  - Use for: Architecture, design, documentation
- **0.8 - 1.0**: Creative, diverse, explorative
  - Use for: Brainstorming, ideation, creative writing

**Examples:**
```typescript
// Code executor - precise and deterministic
temperature: 0.3

// Architect - balanced reasoning
temperature: 0.7

// Creative designer - more exploratory
temperature: 0.8
```

#### `maxTokens` (optional, default: varies by provider)
Maximum length of the response. Set based on expected output size.

**Guidelines:**
- **1000-2000**: Simple tasks, focused responses
- **2000-4000**: Standard tasks, detailed explanations
- **4000-8000**: Complex tasks, multiple files
- **8000+**: Comprehensive documentation, large codebases

```typescript
maxTokens: 4000 // Standard for most agents
```

#### `tools` (optional)
Array of custom tools the agent can use. Advanced feature covered in [Advanced Features](#advanced-features).

---

## Advanced Features

### Context and Memory

#### Using Context
Pass contextual information to guide agent behavior:

```typescript
const result = await agent.execute({
  task: 'Optimize this API endpoint',
  context: {
    framework: 'Express.js',
    database: 'MongoDB',
    currentPerformance: '500ms avg response time',
    targetPerformance: '100ms',
    constraints: ['Cannot change database', 'Must maintain backward compatibility']
  }
});
```

#### Using Previous Results
Agents can build on work from previous agents:

```typescript
// First agent: Architect
const architectResult = await architectAgent.execute({
  task: 'Design a REST API for user management'
});

// Second agent: Executor (uses architect's plan)
const executorResult = await executorAgent.execute({
  task: 'Implement the user management API',
  previousResults: [architectResult]
});
```

#### Conversation History
BaseAgent maintains conversation history through the UnifiedAgent:

```typescript
const agent = new CustomAgent();

// First interaction
await agent.execute({ task: 'Create a user model' });

// Second interaction - agent remembers previous context
await agent.execute({ task: 'Add validation to the user model' });

// Reset conversation if needed
agent.reset();
```

### Custom Tools

Define custom tools that agents can use:

```typescript
import { BaseAgent } from './base-agent.js';
import type { AgentConfig, Tool } from '../sdk/index.js';

export class APIIntegratorAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    // Define custom tools
    const tools: Tool[] = [
      {
        name: 'fetch_api_schema',
        description: 'Fetch OpenAPI/Swagger schema from a URL',
        parameters: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL of the API schema'
            }
          },
          required: ['url']
        },
        execute: async (args) => {
          const response = await fetch(args.url);
          return await response.json();
        }
      },
      {
        name: 'validate_endpoint',
        description: 'Validate an API endpoint',
        parameters: {
          type: 'object',
          properties: {
            url: { type: 'string' },
            method: { type: 'string' },
            headers: { type: 'object' }
          },
          required: ['url', 'method']
        },
        execute: async (args) => {
          const response = await fetch(args.url, {
            method: args.method,
            headers: args.headers
          });
          return {
            status: response.status,
            ok: response.ok,
            headers: Object.fromEntries(response.headers)
          };
        }
      }
    ];

    const config: AgentConfig = {
      name: 'api-integrator',
      model,
      systemPrompt: `You are an API integration expert...`,
      tools, // Pass tools to config
      temperature: 0.5,
      maxTokens: 4000
    };
    
    super(config);
  }
}
```

### Custom Prompt Building

Override `buildPrompt` to customize how task context is formatted:

```typescript
export class CustomAgent extends BaseAgent {
  constructor() {
    super({
      name: 'custom-agent',
      model: 'gpt-4o',
      systemPrompt: 'You are a custom agent.'
    });
  }

  protected buildPrompt(taskContext: TaskContext): string {
    let prompt = `# Task\n${taskContext.task}\n\n`;
    
    if (taskContext.context) {
      prompt += `## Context\n`;
      
      // Custom formatting for specific context keys
      if (taskContext.context.codeSnippet) {
        prompt += `\`\`\`\n${taskContext.context.codeSnippet}\n\`\`\`\n\n`;
      }
      
      if (taskContext.context.requirements) {
        prompt += `### Requirements\n`;
        taskContext.context.requirements.forEach((req: string, i: number) => {
          prompt += `${i + 1}. ${req}\n`;
        });
        prompt += '\n';
      }
    }
    
    if (taskContext.previousResults?.length) {
      prompt += `## Previous Work\n`;
      taskContext.previousResults.forEach((result, index) => {
        prompt += `### ${result.agentName}\n${result.content}\n\n`;
      });
    }
    
    return prompt;
  }
}
```

### Multi-Provider Support

Agents automatically use available providers through the UnifiedAgent:

```typescript
// Uses default provider from environment
const agent = new CustomAgent();

// Specify provider explicitly
const agent = new CustomAgent();
// Provider is set through environment: DEFAULT_PROVIDER=openai
```

Provider keys are loaded from:
1. Environment variables (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.)
2. Configuration file (`omc.config.json`)

---

## Best Practices

### 1. System Prompt Design

**DO:**
- ✅ Use clear, specific language
- ✅ Define exact responsibilities
- ✅ Specify output format
- ✅ Include domain knowledge
- ✅ Add quality criteria

**DON'T:**
- ❌ Be vague or ambiguous
- ❌ Include contradictory instructions
- ❌ Make prompts too long (>500 words)
- ❌ Assume implicit knowledge

**Example - Good:**
```typescript
systemPrompt: `You are a React component designer.

Responsibilities:
- Create functional React components using TypeScript
- Follow React hooks best practices
- Ensure components are accessible (ARIA labels)
- Use Tailwind CSS for styling
- Include PropTypes and TypeScript interfaces

Output format:
1. Component code with full TypeScript types
2. Usage example
3. Props documentation
4. Accessibility notes`
```

**Example - Bad:**
```typescript
systemPrompt: `You write React code. Make it good.` // Too vague!
```

### 2. Temperature Selection

Match temperature to task type:

```typescript
// Deterministic tasks
const codeGenerator = new CodeGeneratorAgent('gpt-4o-mini');
// Uses temperature: 0.3

// Creative tasks
const architectAgent = new ArchitectAgent('gpt-4o');
// Uses temperature: 0.7

// Highly creative tasks
const ideationAgent = new IdeationAgent('gpt-4o');
// Uses temperature: 0.9
```

### 3. Model Selection

Balance cost vs. capability:

```typescript
// High-value tasks - use best models
class ArchitectAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') { // Default to premium model
    // ...
  }
}

// High-volume tasks - use efficient models
class CodeFormatterAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') { // Default to cost-effective model
    // ...
  }
}
```

### 4. Error Handling

Always handle execution failures gracefully:

```typescript
const result = await agent.execute({ task: 'Complex task' });

if (!result.success) {
  console.error(`Agent failed: ${result.error}`);
  // Implement retry logic, fallback, or user notification
} else {
  console.log(`Success! (${result.executionTime}ms)`);
  processResult(result.content);
}
```

### 5. Resource Management

Reset conversation history when starting new tasks:

```typescript
const agent = new CustomAgent();

for (const task of tasks) {
  agent.reset(); // Clear history between independent tasks
  await agent.execute({ task: task.description });
}
```

### 6. Token Management

Monitor token usage to control costs:

```typescript
const result = await agent.execute({ task });

console.log(`Tokens used: ${result.usage.totalTokens}`);
console.log(`Prompt: ${result.usage.promptTokens}`);
console.log(`Completion: ${result.usage.completionTokens}`);

// Calculate cost (helper function available)
const cost = calculateCost(result.usage, result.model);
console.log(`Cost: $${cost.toFixed(4)}`);
```

### 7. Naming Conventions

Use consistent, descriptive names:

```typescript
// Good names
'database-expert'
'api-integrator'
'code-reviewer'
'security-scanner'

// Bad names
'agent1'
'helper'
'ai'
```

### 8. Single Responsibility

Each agent should have one clear purpose:

```typescript
// Good - focused responsibility
class SQLOptimizerAgent extends BaseAgent { }
class SchemaDesignerAgent extends BaseAgent { }

// Bad - too many responsibilities
class DatabaseAndAPIAndSecurityAgent extends BaseAgent { }
```

---

## Example Agents

### 1. DatabaseExpert

Database schema design and optimization specialist.

```typescript
import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class DatabaseExpertAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'database-expert',
      model,
      systemPrompt: `You are a database expert specializing in relational and NoSQL databases.

Your responsibilities:
- Design efficient, normalized database schemas
- Write optimized SQL queries and indexes
- Recommend database technologies for specific use cases
- Identify and fix performance bottlenecks
- Ensure data integrity with proper constraints
- Design migration strategies

Focus areas:
1. Schema design (tables, relationships, constraints)
2. Query optimization (indexes, query plans)
3. Data modeling (normalization, denormalization)
4. Scalability (sharding, replication, partitioning)
5. Security (encryption, access control, SQL injection prevention)

Always provide:
- Complete schema definitions with data types
- Index recommendations with rationale
- Sample queries for common operations
- Performance considerations
- Migration scripts when applicable`,
      temperature: 0.3,
      maxTokens: 5000
    };
    
    super(config);
  }
}
```

**Usage:**
```typescript
const dbExpert = new DatabaseExpertAgent();

const result = await dbExpert.execute({
  task: 'Design a schema for an e-commerce platform',
  context: {
    database: 'PostgreSQL',
    features: ['Products', 'Orders', 'Inventory', 'Customers', 'Reviews'],
    scale: '1M+ products, 10K orders/day'
  }
});
```

### 2. APIIntegrator

API integration and client generation specialist.

```typescript
import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class APIIntegratorAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'api-integrator',
      model,
      systemPrompt: `You are an API integration expert.

Your responsibilities:
- Analyze API documentation and specifications
- Generate type-safe API clients
- Implement authentication flows (OAuth, JWT, API keys)
- Handle rate limiting and retries
- Create comprehensive error handling
- Write integration tests

Expertise in:
1. REST API design and consumption
2. GraphQL queries and mutations
3. WebSocket connections
4. OpenAPI/Swagger specifications
5. Authentication mechanisms
6. HTTP client libraries (fetch, axios, etc.)

Always provide:
- Type definitions for requests/responses
- Authentication implementation
- Error handling with retry logic
- Rate limiting strategies
- Usage examples
- Integration tests`,
      temperature: 0.4,
      maxTokens: 4000
    };
    
    super(config);
  }
}
```

**Usage:**
```typescript
const apiIntegrator = new APIIntegratorAgent();

const result = await apiIntegrator.execute({
  task: 'Create a client for the Stripe API',
  context: {
    language: 'TypeScript',
    features: ['Payments', 'Subscriptions', 'Webhooks'],
    authentication: 'API Key'
  }
});
```

### 3. CodeReviewer

Code quality and best practices reviewer.

```typescript
import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class CodeReviewerAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'code-reviewer',
      model,
      systemPrompt: `You are an expert code reviewer focusing on quality, maintainability, and best practices.

Review criteria:
1. Code Quality
   - Readability and clarity
   - Naming conventions
   - Code organization
   - DRY principle adherence

2. Best Practices
   - Design patterns usage
   - SOLID principles
   - Error handling
   - Resource management

3. Performance
   - Algorithm efficiency
   - Memory usage
   - Database query optimization
   - Caching strategies

4. Security
   - Input validation
   - Authentication/authorization
   - Data sanitization
   - Secrets management

5. Testing
   - Test coverage
   - Edge cases
   - Integration points
   - Mocking strategies

6. Documentation
   - Code comments
   - Function documentation
   - README updates
   - API documentation

Provide:
- Severity levels (Critical, Major, Minor, Suggestion)
- Specific line numbers and code snippets
- Recommended fixes with examples
- Positive feedback for good practices
- Overall quality score`,
      temperature: 0.2,
      maxTokens: 6000
    };
    
    super(config);
  }
}
```

**Usage:**
```typescript
const reviewer = new CodeReviewerAgent();

const result = await reviewer.execute({
  task: 'Review this user authentication implementation',
  context: {
    code: `/* code snippet */`,
    language: 'TypeScript',
    framework: 'Express.js'
  }
});
```

### 4. DevOpsAgent

Infrastructure and deployment automation specialist.

```typescript
import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class DevOpsAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'devops-engineer',
      model,
      systemPrompt: `You are a DevOps engineer specializing in cloud infrastructure and CI/CD.

Your responsibilities:
- Design cloud infrastructure (AWS, Azure, GCP)
- Create Docker containers and orchestration
- Build CI/CD pipelines
- Implement monitoring and logging
- Ensure security and compliance
- Optimize costs and performance

Technologies:
1. Containerization (Docker, Kubernetes)
2. CI/CD (GitHub Actions, GitLab CI, Jenkins)
3. Infrastructure as Code (Terraform, CloudFormation)
4. Cloud Platforms (AWS, Azure, GCP)
5. Monitoring (Prometheus, Grafana, DataDog)
6. Configuration Management (Ansible, Chef, Puppet)

Always provide:
- Complete configuration files
- Step-by-step deployment instructions
- Security best practices
- Cost optimization tips
- Monitoring and alerting setup
- Rollback procedures`,
      temperature: 0.3,
      maxTokens: 5000
    };
    
    super(config);
  }
}
```

**Usage:**
```typescript
const devops = new DevOpsAgent();

const result = await devops.execute({
  task: 'Create a Kubernetes deployment for a Node.js microservice',
  context: {
    platform: 'AWS EKS',
    requirements: ['Auto-scaling', 'Health checks', 'Rolling updates'],
    monitoring: 'Prometheus'
  }
});
```

### 5. DocumentationAgent

Technical documentation specialist.

```typescript
import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class DocumentationAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'documentation-writer',
      model,
      systemPrompt: `You are a technical documentation specialist.

Your responsibilities:
- Write clear, comprehensive documentation
- Create API references
- Develop user guides and tutorials
- Document architecture and design decisions
- Generate code examples
- Maintain consistency across documentation

Documentation types:
1. API Documentation (endpoints, parameters, responses)
2. User Guides (step-by-step instructions)
3. Architecture Documentation (diagrams, decisions)
4. Code Documentation (inline comments, JSDoc)
5. README files (project overview, setup)
6. Contributing Guidelines

Principles:
- Write for your audience (developers, users, stakeholders)
- Use clear, concise language
- Include practical examples
- Maintain consistent formatting
- Keep documentation up-to-date
- Add diagrams where helpful

Always provide:
- Well-structured content with headings
- Code examples with syntax highlighting
- Prerequisites and requirements
- Common troubleshooting tips
- Links to related documentation`,
      temperature: 0.6,
      maxTokens: 6000
    };
    
    super(config);
  }
}
```

**Usage:**
```typescript
const docAgent = new DocumentationAgent();

const result = await docAgent.execute({
  task: 'Create API documentation for our user management endpoints',
  context: {
    format: 'Markdown',
    endpoints: ['GET /users', 'POST /users', 'PUT /users/:id', 'DELETE /users/:id'],
    authentication: 'JWT Bearer token'
  }
});
```

### 6. RefactoringAgent

Code refactoring and optimization specialist.

```typescript
import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class RefactoringAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'refactoring-expert',
      model,
      systemPrompt: `You are a code refactoring expert focused on improving code quality without changing functionality.

Your responsibilities:
- Identify code smells and anti-patterns
- Apply appropriate design patterns
- Improve code readability and maintainability
- Extract reusable components and utilities
- Reduce code duplication
- Simplify complex logic

Refactoring techniques:
1. Extract Method/Function
2. Rename Variables/Functions for clarity
3. Replace Magic Numbers with Constants
4. Simplify Conditional Logic
5. Remove Dead Code
6. Apply Design Patterns (Factory, Strategy, etc.)
7. Improve Error Handling
8. Optimize Performance

Principles:
- Maintain existing functionality (no behavior changes)
- Improve one thing at a time
- Keep changes small and focused
- Ensure backward compatibility
- Add tests before refactoring
- Document significant changes

Always provide:
- Before/After code comparison
- Explanation of changes and rationale
- Impact on performance/readability
- Suggested tests to verify behavior
- Migration guide if needed`,
      temperature: 0.3,
      maxTokens: 5000
    };
    
    super(config);
  }
}
```

**Usage:**
```typescript
const refactorer = new RefactoringAgent();

const result = await refactorer.execute({
  task: 'Refactor this function to be more maintainable',
  context: {
    code: `/* complex function */`,
    language: 'TypeScript',
    issues: ['Too long', 'Multiple responsibilities', 'Hard to test']
  }
});
```

---

## Testing Custom Agents

### Unit Testing

Test individual agents using the testing framework:

```typescript
// tests/agents/custom-agent.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { CustomAgent } from '../../src/agents/custom-agent.js';

describe('CustomAgent', () => {
  let agent: CustomAgent;

  beforeEach(() => {
    agent = new CustomAgent();
  });

  it('should initialize with correct configuration', () => {
    expect(agent.getName()).toBe('custom-agent');
    expect(agent.getConfig().model).toBe('gpt-4o');
  });

  it('should execute a simple task', async () => {
    const result = await agent.execute({
      task: 'Create a simple function'
    });

    expect(result.success).toBe(true);
    expect(result.content).toBeTruthy();
    expect(result.agentName).toBe('custom-agent');
  });

  it('should handle context properly', async () => {
    const result = await agent.execute({
      task: 'Generate code',
      context: {
        language: 'TypeScript',
        framework: 'React'
      }
    });

    expect(result.success).toBe(true);
    expect(result.content.toLowerCase()).toContain('typescript');
  });

  it('should handle errors gracefully', async () => {
    // Mock an error scenario
    const result = await agent.execute({
      task: '' // Invalid empty task
    });

    // Agent should either succeed with a clarification request
    // or fail gracefully
    expect(result).toBeDefined();
    expect(result.agentName).toBe('custom-agent');
  });

  it('should reset conversation history', async () => {
    await agent.execute({ task: 'First task' });
    
    agent.reset();
    
    const history = agent.getHistory?.() || [];
    // After reset, should only have system message
    expect(history.length).toBeLessThanOrEqual(1);
  });

  it('should track token usage', async () => {
    const result = await agent.execute({
      task: 'Simple task'
    });

    expect(result.usage).toBeDefined();
    expect(result.usage.totalTokens).toBeGreaterThan(0);
    expect(result.usage.promptTokens).toBeGreaterThan(0);
    expect(result.usage.completionTokens).toBeGreaterThan(0);
  });

  it('should use correct model', async () => {
    const result = await agent.execute({
      task: 'Test task'
    });

    expect(result.model).toBe('gpt-4o');
  });
});
```

### Integration Testing

Test agents working together:

```typescript
// tests/integration/agent-collaboration.test.ts
import { describe, it, expect } from 'vitest';
import { ArchitectAgent } from '../../src/agents/architect.js';
import { ExecutorAgent } from '../../src/agents/executor.js';

describe('Agent Collaboration', () => {
  it('should pass work between architect and executor', async () => {
    const architect = new ArchitectAgent();
    const executor = new ExecutorAgent();

    // Architect creates plan
    const plan = await architect.execute({
      task: 'Design a simple user authentication system'
    });

    expect(plan.success).toBe(true);

    // Executor implements plan
    const implementation = await executor.execute({
      task: 'Implement the authentication system',
      previousResults: [plan]
    });

    expect(implementation.success).toBe(true);
    expect(implementation.content).toBeTruthy();
  });
});
```

### Mock Testing

Use mock SDK for testing without API calls:

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { CustomAgent } from '../../src/agents/custom-agent.js';

describe('CustomAgent (Mock)', () => {
  beforeAll(() => {
    // Enable mock SDK
    process.env.USE_MOCK_SDK = 'true';
  });

  it('should work with mock SDK', async () => {
    const agent = new CustomAgent();
    
    const result = await agent.execute({
      task: 'Test task'
    });

    expect(result.success).toBe(true);
    expect(agent.getProvider()).toBe('mock');
  });
});
```

### Testing Best Practices

1. **Test Configuration**: Verify agent name, model, and system prompt
2. **Test Execution**: Ensure agents can execute tasks successfully
3. **Test Context Handling**: Verify context is properly used
4. **Test Error Handling**: Ensure graceful failure
5. **Test Token Tracking**: Verify usage statistics are accurate
6. **Use Mocks**: Test logic without API calls when possible
7. **Test Integration**: Verify agents work together in pipelines

---

## Integration with Orchestration

### Pipeline Mode

Integrate custom agents into sequential pipelines:

```typescript
// src/orchestrator/custom-pipeline.ts
import { BaseAgent } from '../agents/base-agent.js';
import type { AgentResult } from '../agents/base-agent.js';
import { DatabaseExpertAgent } from '../agents/database-expert.js';
import { APIIntegratorAgent } from '../agents/api-integrator.js';
import { CodeReviewerAgent } from '../agents/code-reviewer.js';

export class CustomPipeline {
  private agents: BaseAgent[];

  constructor() {
    this.agents = [
      new DatabaseExpertAgent(),
      new APIIntegratorAgent(),
      new CodeReviewerAgent()
    ];
  }

  async execute(task: string, context?: Record<string, any>): Promise<AgentResult[]> {
    const results: AgentResult[] = [];

    for (const agent of this.agents) {
      const result = await agent.execute({
        task,
        context,
        previousResults: results
      });

      results.push(result);

      // Stop on failure
      if (!result.success) {
        break;
      }
    }

    return results;
  }
}
```

**Usage:**
```typescript
const pipeline = new CustomPipeline();

const results = await pipeline.execute(
  'Build a full-stack user management system',
  { framework: 'Next.js', database: 'PostgreSQL' }
);

results.forEach(result => {
  console.log(`${result.agentName}: ${result.success ? 'Success' : 'Failed'}`);
});
```

### Swarm Mode

Register custom agents to work on tasks from a pool:

```typescript
import { Swarm } from '../orchestrator/swarm.js';
import { TaskPool } from '../tasks/index.js';
import { DatabaseExpertAgent } from '../agents/database-expert.js';
import { APIIntegratorAgent } from '../agents/api-integrator.js';
import { CodeReviewerAgent } from '../agents/code-reviewer.js';

// Create task pool
const taskPool = new TaskPool('./tasks.db');
await taskPool.initialize();

// Create swarm
const swarm = new Swarm(taskPool);

// Register custom agents
swarm.registerAgent(new DatabaseExpertAgent());
swarm.registerAgent(new APIIntegratorAgent());
swarm.registerAgent(new CodeReviewerAgent());

// Start swarm
await swarm.start({
  maxConcurrency: 3,
  pollInterval: 1000,
  stopWhenEmpty: true
});
```

### Dynamic Agent Selection

Create a system that selects the right agent for each task:

```typescript
export class AgentRouter {
  private agents: Map<string, BaseAgent>;

  constructor() {
    this.agents = new Map([
      ['database', new DatabaseExpertAgent()],
      ['api', new APIIntegratorAgent()],
      ['review', new CodeReviewerAgent()],
      ['devops', new DevOpsAgent()],
      ['docs', new DocumentationAgent()]
    ]);
  }

  async route(task: string, taskType: string): Promise<AgentResult> {
    const agent = this.agents.get(taskType);
    
    if (!agent) {
      throw new Error(`No agent found for task type: ${taskType}`);
    }

    return await agent.execute({ task });
  }

  async autoRoute(task: string): Promise<AgentResult> {
    // Use a classifier agent to determine task type
    const taskType = this.classifyTask(task);
    return await this.route(task, taskType);
  }

  private classifyTask(task: string): string {
    // Simple keyword-based classification
    const keywords = {
      database: ['schema', 'sql', 'query', 'database', 'table'],
      api: ['api', 'endpoint', 'rest', 'graphql', 'integration'],
      review: ['review', 'refactor', 'optimize', 'improve'],
      devops: ['deploy', 'docker', 'kubernetes', 'ci/cd', 'infrastructure'],
      docs: ['document', 'readme', 'guide', 'tutorial']
    };

    const taskLower = task.toLowerCase();
    
    for (const [type, words] of Object.entries(keywords)) {
      if (words.some(word => taskLower.includes(word))) {
        return type;
      }
    }

    return 'review'; // Default
  }
}
```

**Usage:**
```typescript
const router = new AgentRouter();

// Manual routing
const result1 = await router.route(
  'Design a schema for user authentication',
  'database'
);

// Auto routing
const result2 = await router.autoRoute(
  'Create API client for Stripe payments'
);
```

### Custom Orchestration Mode

Build your own orchestration pattern:

```typescript
export class ParallelOrchestrator {
  private agents: BaseAgent[];

  constructor(agents: BaseAgent[]) {
    this.agents = agents;
  }

  async executeParallel(task: string, context?: Record<string, any>): Promise<AgentResult[]> {
    // Execute all agents in parallel
    const promises = this.agents.map(agent =>
      agent.execute({ task, context })
    );

    return await Promise.all(promises);
  }

  async executeRace(task: string, context?: Record<string, any>): Promise<AgentResult> {
    // Return first successful result
    const promises = this.agents.map(agent =>
      agent.execute({ task, context })
    );

    return await Promise.race(promises);
  }

  async executeConsensus(
    task: string,
    context?: Record<string, any>,
    threshold: number = 0.5
  ): Promise<AgentResult> {
    // Get results from all agents
    const results = await this.executeParallel(task, context);

    // Simple consensus: majority vote on success
    const successCount = results.filter(r => r.success).length;
    const consensusReached = successCount / results.length >= threshold;

    // Return best result if consensus reached
    if (consensusReached) {
      return results.reduce((best, current) =>
        current.usage.totalTokens < best.usage.totalTokens ? current : best
      );
    }

    throw new Error('No consensus reached among agents');
  }
}
```

---

## Advanced Patterns

### Agent Inheritance

Create specialized variants of existing agents:

```typescript
import { DatabaseExpertAgent } from './database-expert.js';
import type { AgentConfig } from '../sdk/index.js';

export class PostgreSQLExpertAgent extends DatabaseExpertAgent {
  constructor(model: string = 'gpt-4o') {
    super(model);
    
    // Override config to specialize for PostgreSQL
    this.config = {
      ...this.config,
      name: 'postgresql-expert',
      systemPrompt: this.config.systemPrompt + `

POSTGRESQL SPECIFIC EXPERTISE:
- Use PostgreSQL-specific features (JSONB, arrays, CTEs, window functions)
- Leverage full-text search capabilities
- Implement row-level security
- Use partitioning for large tables
- Optimize with PostgreSQL-specific indexes (GIN, GiST, BRIN)
- Handle PostGIS for spatial data when relevant`
    };
  }
}
```

### Composite Agents

Combine multiple agents into one:

```typescript
export class FullStackAgent extends BaseAgent {
  private dbAgent: DatabaseExpertAgent;
  private apiAgent: APIIntegratorAgent;
  private reviewAgent: CodeReviewerAgent;

  constructor(model: string = 'gpt-4o') {
    super({
      name: 'fullstack-expert',
      model,
      systemPrompt: 'You are a full-stack development coordinator.',
      temperature: 0.5,
      maxTokens: 8000
    });

    this.dbAgent = new DatabaseExpertAgent(model);
    this.apiAgent = new APIIntegratorAgent(model);
    this.reviewAgent = new CodeReviewerAgent(model);
  }

  async execute(taskContext: TaskContext): Promise<AgentResult> {
    // Coordinate between specialized agents
    const dbResult = await this.dbAgent.execute(taskContext);
    const apiResult = await this.apiAgent.execute({
      ...taskContext,
      previousResults: [dbResult]
    });
    const reviewResult = await this.reviewAgent.execute({
      ...taskContext,
      previousResults: [dbResult, apiResult]
    });

    // Combine results
    return {
      agentName: this.name,
      success: reviewResult.success,
      content: `Database:\n${dbResult.content}\n\nAPI:\n${apiResult.content}\n\nReview:\n${reviewResult.content}`,
      usage: {
        promptTokens: dbResult.usage.promptTokens + apiResult.usage.promptTokens + reviewResult.usage.promptTokens,
        completionTokens: dbResult.usage.completionTokens + apiResult.usage.completionTokens + reviewResult.usage.completionTokens,
        totalTokens: dbResult.usage.totalTokens + apiResult.usage.totalTokens + reviewResult.usage.totalTokens
      },
      model: this.config.model,
      executionTime: dbResult.executionTime + apiResult.executionTime + reviewResult.executionTime
    };
  }
}
```

---

## Conclusion

Custom agents are powerful tools for building specialized AI workflows in oh-my-copilot. By extending the `BaseAgent` class and configuring agents with targeted system prompts, you can create expert assistants for any domain.

### Key Takeaways

1. **Start Simple**: Begin with a clear agent purpose and basic configuration
2. **Iterate on Prompts**: Refine system prompts based on actual output quality
3. **Choose Models Wisely**: Balance cost and capability for each use case
4. **Test Thoroughly**: Verify agents work correctly and integrate well
5. **Monitor Usage**: Track tokens and costs to optimize performance
6. **Combine Agents**: Use orchestration modes for complex workflows

### Next Steps

- Explore the [existing agents](../src/agents/) for inspiration
- Review [orchestration modes](../src/orchestrator/) to see integration patterns
- Check the [SDK documentation](../src/sdk/) for advanced features
- Experiment with different models and configurations
- Share your custom agents with the community!

---

## Additional Resources

- [BaseAgent Source Code](../src/agents/base-agent.ts)
- [Built-in Agents](../src/agents/)
- [Orchestration Modes](../src/orchestrator/)
- [Configuration Guide](../README.md#configuration)
- [Examples](../examples/)

For questions or contributions, visit the [GitHub repository](https://github.com/odpilot/oh-my-copilot).
