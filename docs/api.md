# API Reference

## Table of Contents

- [OhMyCopilot](#ohmycopilot)
- [Agents](#agents)
- [Orchestrators](#orchestrators)
- [Task Management](#task-management)
- [Types](#types)

---

## OhMyCopilot

Main class for the multi-agent system.

### Constructor

```typescript
new OhMyCopilot(config?: OhMyCopilotConfig)
```

**Parameters**:
- `config` (optional): Configuration object

**Example**:
```typescript
const omc = new OhMyCopilot({
  dbPath: './tasks.db',
  trackCosts: true,
  logLevel: 'info'
});
```

### Methods

#### `run(input, context?)`

Auto-detect mode and execute task.

```typescript
run(input: string, context?: Record<string, any>): Promise<any>
```

#### `autopilot(task, context?, config?)`

Execute in autopilot mode (full pipeline).

```typescript
autopilot(
  task: string,
  context?: Record<string, any>,
  config?: PipelineConfig
): Promise<PipelineResult>
```

#### `ultra(tasks, concurrencyLimit?)`

Execute tasks in parallel (ultrawork mode).

```typescript
ultra(
  tasks: UltraworkTask[],
  concurrencyLimit?: number
): Promise<UltraworkResult>
```

#### `eco(task, context?, config?)`

Execute in economy mode (cost-optimized).

```typescript
eco(
  task: string,
  context?: Record<string, any>,
  config?: EcomodeConfig
): Promise<EcomodeResult>
```

#### `getSwarm()`

Get swarm orchestrator instance.

```typescript
getSwarm(): Swarm
```

#### `getTaskPool()`

Get task pool instance.

```typescript
getTaskPool(): TaskPool
```

#### `getCostReport()`

Get formatted cost tracking report.

```typescript
getCostReport(): string
```

#### `getMetricsReport()`

Get formatted metrics report.

```typescript
getMetricsReport(): string
```

#### `getDashboard()`

Get dashboard instance.

```typescript
getDashboard(): Dashboard
```

#### `cleanup()`

Clean up resources (close database, etc.).

```typescript
cleanup(): void
```

---

## Agents

### BaseAgent

Base class for all agents.

```typescript
class BaseAgent {
  constructor(config: AgentConfig)
  execute(taskContext: TaskContext): Promise<AgentResult>
  reset(): void
  getName(): string
  getConfig(): AgentConfig
}
```

### Specialized Agents

All specialized agents extend `BaseAgent`:

- **ArchitectAgent(model?)** - GPT-4o by default
- **ExecutorAgent(model?)** - GPT-4o-mini by default
- **QATesterAgent(model?)** - GPT-4o-mini by default
- **SecurityAgent(model?)** - GPT-4o by default
- **DesignerAgent(model?)** - GPT-4o by default

**Example**:
```typescript
const architect = new ArchitectAgent();
const executor = new ExecutorAgent('gpt-4o'); // Override model

const result = await architect.execute({
  task: 'Design a microservices architecture',
  context: { scale: 'large' }
});
```

---

## Orchestrators

### Pipeline

Automated sequential pipeline.

```typescript
class Pipeline {
  execute(
    task: string,
    context?: Record<string, any>,
    config?: PipelineConfig
  ): Promise<PipelineResult>
}
```

### Ultrawork

Parallel task execution.

```typescript
class Ultrawork {
  execute(tasks: UltraworkTask[]): Promise<UltraworkResult>
  executeWithLimit(
    tasks: UltraworkTask[],
    limit: number
  ): Promise<UltraworkResult>
}
```

### Swarm

Dynamic task claiming from pool.

```typescript
class Swarm {
  registerAgent(agent: BaseAgent): void
  unregisterAgent(agentName: string): void
  start(config?: SwarmConfig): Promise<void>
  stop(): void
  getStatus(): SwarmStatus
}
```

### Ecomode

Cost-optimized execution.

```typescript
class Ecomode {
  execute(
    task: string,
    context?: Record<string, any>,
    config?: EcomodeConfig
  ): Promise<EcomodeResult>
}
```

---

## Task Management

### TaskPool

SQLite-based task pool with atomic operations.

```typescript
class TaskPool {
  createTask(input: CreateTaskInput): Task
  claimTask(agentName: string): Task | null
  getTask(id: string): Task | null
  updateTask(id: string, update: UpdateTaskInput): Task | null
  getTasks(filter?: TaskFilter): Task[]
  getStats(): TaskStats
  deleteTask(id: string): boolean
  clearAll(): void
  close(): void
}
```

**Example**:
```typescript
const taskPool = omc.getTaskPool();

const task = taskPool.createTask({
  title: 'Implement feature',
  description: 'Full description...',
  priority: TaskPriority.HIGH
});

const claimed = taskPool.claimTask('executor-1');
if (claimed) {
  // Process task
  taskPool.updateTask(claimed.id, {
    status: TaskStatus.COMPLETED,
    result: 'Done!'
  });
}
```

---

## Types

### Configuration Types

```typescript
interface OhMyCopilotConfig {
  dbPath?: string;
  architectModel?: string;
  executorModel?: string;
  qaTesterModel?: string;
  securityModel?: string;
  designerModel?: string;
  trackCosts?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  logFile?: string;
  apiKey?: string;
  githubToken?: string;
}
```

### Agent Types

```typescript
interface AgentConfig {
  name: string;
  model: string;
  systemPrompt: string;
  tools?: Tool[];
  temperature?: number;
  maxTokens?: number;
}

interface TaskContext {
  task: string;
  context?: Record<string, any>;
  previousResults?: AgentResult[];
}

interface AgentResult {
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
}
```

### Task Types

```typescript
enum TaskStatus {
  PENDING = 'pending',
  CLAIMED = 'claimed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

enum TaskPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  CRITICAL = 3
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedAgent?: string;
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  completedAt?: number;
  result?: string;
  error?: string;
  metadata?: Record<string, any>;
}
```

### Result Types

```typescript
interface PipelineResult {
  success: boolean;
  results: AgentResult[];
  totalCost: number;
  totalTime: number;
  summary: string;
}

interface UltraworkResult {
  success: boolean;
  results: Array<AgentResult & { title: string }>;
  totalCost: number;
  totalTime: number;
  summary: string;
}

interface EcomodeResult {
  success: boolean;
  results: AgentResult[];
  totalCost: number;
  totalTime: number;
  summary: string;
  costSavings: number;
}
```

### Analytics Types

```typescript
interface CostEntry {
  timestamp: number;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  agentName?: string;
  taskId?: string;
}

interface CostSummary {
  totalCost: number;
  totalTokens: number;
  totalRequests: number;
  costByModel: Record<string, number>;
  costByAgent: Record<string, number>;
}
```

---

## Utility Functions

### Cost Calculation

```typescript
calculateCost(usage: TokenCost): number
formatCost(cost: number): string
```

### Time Formatting

```typescript
formatDuration(ms: number): string
```

### Retry Logic

```typescript
retry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T>
```

---

## CLI Commands

```bash
# Autopilot
omc autopilot <task> [options]
omc ap <task> [--skip-security] [--skip-tests] [-o <file>]

# Chat
omc chat

# Ultrawork
omc ultrawork [tasks...] [options]
omc ulw [-c <num>] [--tasks-file <file>]

# Swarm
omc swarm [tasks...] [options]
omc swarm [-a <num>] [--tasks-file <file>] [--poll-interval <ms>]

# Economy
omc eco <task> [options]
omc eco <task> [-o <file>]
```

---

## Events & Hooks

Currently not implemented. Future versions may include:

```typescript
// Future API (not yet available)
omc.on('agent:start', (agent, task) => {});
omc.on('agent:complete', (agent, result) => {});
omc.on('cost:threshold', (cost) => {});
```

---

## Best Practices

1. **Always cleanup**: Call `omc.cleanup()` when done
2. **Handle errors**: Check `result.success` before using content
3. **Track costs**: Enable cost tracking for production
4. **Use appropriate models**: GPT-4o for complex, GPT-4o-mini for simple
5. **Provide context**: Use `context` and `previousResults` for better results
6. **Set limits**: Use concurrency limits for ultrawork
7. **Monitor progress**: Check swarm status and task stats

---

## TypeScript Support

Oh My Copilot is written in TypeScript and provides full type definitions:

```typescript
import type {
  OhMyCopilotConfig,
  AgentConfig,
  AgentResult,
  Task,
  TaskStatus,
  TaskPriority,
  PipelineResult,
  UltraworkResult,
  EcomodeResult
} from 'oh-my-copilot';
```
