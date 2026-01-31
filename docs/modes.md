# Execution Modes

Oh My Copilot supports multiple execution modes, each optimized for different use cases.

## Mode Comparison

| Mode | Use Case | Agents | Parallelism | Cost |
|------|----------|--------|-------------|------|
| **Autopilot** | Complete features | Multiple | Sequential | High |
| **Ultrawork** | Many small tasks | Custom | Full | Medium |
| **Swarm** | Dynamic workload | Pool | Concurrent | Variable |
| **Ecomode** | Cost-sensitive | Minimal | Sequential | Low |

---

## 1. Autopilot Mode (Pipeline)

**Best for**: Complete feature implementation with quality assurance

### Workflow

```
Planning (Architect) 
    ↓
Implementation (Executor)
    ↓
Testing (QA Tester)
    ↓
Security Review (Security)
    ↓
Final Validation
```

### Usage

```typescript
const result = await omc.autopilot(
  'Build a user authentication system',
  { 
    framework: 'Express',
    database: 'PostgreSQL' 
  },
  {
    skipSecurity: false,  // Include security review
    skipTests: false,     // Include testing
    continueOnFailure: false
  }
);

console.log(result.summary);
console.log(`Total cost: $${result.totalCost}`);
console.log(`Total time: ${result.totalTime}ms`);
```

### CLI

```bash
# Full pipeline
omc autopilot "Build user authentication"

# Skip security review
omc ap "Quick implementation" --skip-security

# Skip tests
omc ap "Prototype feature" --skip-tests

# Save output
omc ap "Feature" --output result.json
```

### Result Structure

```typescript
interface PipelineResult {
  success: boolean;
  results: AgentResult[];  // Results from each agent
  totalCost: number;
  totalTime: number;
  summary: string;
}
```

---

## 2. Ultrawork Mode

**Best for**: Executing multiple independent tasks simultaneously

### Features

- Full parallelism or controlled concurrency
- Independent task execution
- Aggregated results

### Usage

```typescript
import { ExecutorAgent, QATesterAgent } from 'oh-my-copilot';

const tasks = [
  {
    title: 'User Service',
    description: 'Create user service',
    agent: new ExecutorAgent()
  },
  {
    title: 'Product Service',
    description: 'Create product service',
    agent: new ExecutorAgent()
  },
  {
    title: 'Integration Tests',
    description: 'Write integration tests',
    agent: new QATesterAgent()
  }
];

// Unlimited parallelism
const result = await omc.ultra(tasks);

// Or with concurrency limit
const result = await omc.ultra(tasks, 2); // Max 2 concurrent
```

### CLI

```bash
# Multiple tasks
omc ultrawork "Task 1" "Task 2" "Task 3"

# With concurrency limit
omc ulw --concurrency 2 "Task 1" "Task 2" "Task 3" "Task 4"

# From file
omc ulw --tasks-file tasks.json
```

### Task File Format

```json
[
  {
    "title": "User API",
    "description": "Implement user CRUD operations",
    "context": {
      "framework": "Express",
      "database": "MongoDB"
    }
  },
  {
    "title": "Product API",
    "description": "Implement product endpoints"
  }
]
```

---

## 3. Swarm Mode

**Best for**: Dynamic workloads with varying task complexity

### Features

- SQLite task pool for atomic task claiming
- Dynamic agent registration
- Automatic task distribution
- Real-time progress tracking

### Workflow

```
Task Pool (SQLite)
    ↓
Agents continuously claim tasks
    ↓
Process in parallel
    ↓
Update results atomically
```

### Usage

```typescript
import { TaskPriority } from 'oh-my-copilot';
import { ExecutorAgent, QATesterAgent } from 'oh-my-copilot';

// Setup
const swarm = omc.getSwarm();
const taskPool = omc.getTaskPool();

// Register agents
for (let i = 0; i < 5; i++) {
  swarm.registerAgent(new ExecutorAgent());
}
swarm.registerAgent(new QATesterAgent());

// Add tasks
taskPool.createTask({
  title: 'Implement login',
  description: 'Build JWT-based login',
  priority: TaskPriority.HIGH
});

taskPool.createTask({
  title: 'Add logging',
  description: 'Implement application logging',
  priority: TaskPriority.LOW
});

// Start swarm
await swarm.start({
  pollInterval: 1000,        // Check for tasks every 1s
  stopWhenEmpty: true,       // Stop when no tasks left
  maxConcurrency: 5          // Max 5 concurrent agents
});

// Check status
const status = swarm.getStatus();
console.log(`Active agents: ${status.agents.filter(a => a.isActive).length}`);

// Get statistics
const stats = taskPool.getStats();
console.log(`Completed: ${stats.completed}/${stats.total}`);
```

### CLI

```bash
# With inline tasks
omc swarm --agents 5 "Task 1" "Task 2" "Task 3"

# From file
omc swarm --agents 3 --tasks-file tasks.json

# Custom poll interval
omc swarm --agents 5 --poll-interval 500 --tasks-file tasks.json
```

### Task Priorities

```typescript
enum TaskPriority {
  LOW = 0,      // Background tasks
  MEDIUM = 1,   // Normal tasks
  HIGH = 2,     // Important tasks
  CRITICAL = 3  // Urgent tasks
}
```

Tasks are claimed in priority order (CRITICAL → HIGH → MEDIUM → LOW).

---

## 4. Ecomode (Economy)

**Best for**: Cost-sensitive operations

### Features

- Uses GPT-4o-mini for cost efficiency
- Optional cost thresholds
- Skips non-essential steps
- Tracks cost savings

### Usage

```typescript
const result = await omc.eco(
  'Implement a simple logging utility',
  { language: 'TypeScript' },
  {
    maxCostThreshold: 0.10,    // Stop if exceeds $0.10
    preferMiniModels: true,    // Use mini models
    skipSecurityReview: true   // Skip security (optional)
  }
);

console.log(`Cost: $${result.totalCost}`);
console.log(`Savings: $${result.costSavings}`);
```

### CLI

```bash
# Economy mode
omc eco "Simple implementation task"

# With output
omc eco "Task" --output result.json
```

### Cost Optimization Tips

1. Use ecomode for simple tasks
2. Set cost thresholds
3. Skip optional steps (security, advanced testing)
4. Use concise, specific prompts

---

## Mode Selection Guide

### Use Autopilot when:
- Building complete features
- Quality is critical
- Security review needed
- Budget is not primary concern

### Use Ultrawork when:
- Multiple independent tasks
- Speed is priority
- Tasks can run in parallel

### Use Swarm when:
- Dynamic task generation
- Variable task complexity
- Need task persistence
- Distributed workload

### Use Ecomode when:
- Simple implementations
- Budget constraints
- Prototyping
- Non-critical features

---

## Keyword Detection

Oh My Copilot automatically detects mode from input:

```typescript
// Autopilot
omc.run('autopilot: build me a REST API');
omc.run('build me a complete authentication system');

// Ultrawork
omc.run('ultrawork: process these tasks in parallel');
omc.run('ulw: handle multiple endpoints');

// Swarm
omc.run('swarm: distribute these tasks');

// Ecomode
omc.run('eco: simple implementation');
omc.run('budget mode: add basic logging');
```

---

## Performance Comparison

Based on implementing a typical REST API:

| Mode | Time | Cost | Quality | Use Case |
|------|------|------|---------|----------|
| Autopilot | ~3-5 min | $0.05-0.15 | ★★★★★ | Production |
| Ultrawork | ~1-2 min | $0.03-0.10 | ★★★★☆ | Speed priority |
| Swarm | ~2-4 min | $0.04-0.12 | ★★★★☆ | Dynamic tasks |
| Ecomode | ~2-3 min | $0.01-0.05 | ★★★☆☆ | Budget priority |

*Times and costs are approximate and depend on task complexity.*
