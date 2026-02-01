# Execution Modes

Oh My Copilot supports six execution modes, each optimized for different use cases.

## Mode Comparison

| Mode | Use Case | Agents | Parallelism | Cost | Guarantee |
|------|----------|--------|-------------|------|-----------|
| **Autopilot** | Complete features | Multiple | Sequential | High | No |
| **Ultrapilot** | Complex orchestration | Dynamic | Optional | Medium-High | Optional |
| **Ralph** | Guaranteed completion | Multiple + Retries | Sequential | High | Yes |
| **Ultrawork** | Many small tasks | Custom | Full | Medium | No |
| **Swarm** | Dynamic workload | Pool | Concurrent | Variable | No |
| **Ecomode** | Cost-sensitive | Minimal | Sequential | Low | No |

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

## 2. Ultrapilot Mode

**Best for**: Complex tasks requiring intelligent orchestration, smart routing, and auto-delegation

### Features

- **Skill Composition**: Combine execution, enhancement, and guarantee skills
- **Smart Model Routing**: Automatic tier selection (HIGH/MEDIUM/LOW) based on complexity
- **Auto-Delegation**: Intelligent routing to specialized agents
- **Parallel Execution**: Optional concurrent task processing
- **Flexible Configuration**: Enable/disable features as needed

### Skill Layers

```
┌─────────────────────────────────────┐
│  GUARANTEE (optional)               │
│  ralph: Verification enforcement    │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  ENHANCEMENT (0-N)                  │
│  ultrawork, git-master, etc.        │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  EXECUTION (primary)                │
│  default, planner, orchestrate      │
└─────────────────────────────────────┘
```

### Usage

```typescript
const result = await omc.ultrapilotMode(
  'Build a scalable microservices API',
  { framework: 'Express' },
  {
    skills: ['default', 'ultrawork', 'git-master'], // Skill composition
    smartRouting: true,      // Enable intelligent model routing
    autoDelegate: true,      // Auto-delegate to specialists
    parallelExecution: true  // Enable parallel processing
  }
);

console.log(result.summary);
console.log(`Skills used: ${result.skillsUsed.map(s => s.name).join(', ')}`);
console.log(`Delegations: ${result.delegations}`);
```

### CLI

```bash
# Full features
omc ultrapilot "Build microservices API" --smart-routing --auto-delegate --parallel

# With specific skills
omc up "Complex task" --skills "default,ultrawork,ralph"

# Disable features
omc up "Task" --no-smart-routing --no-auto-delegate
```

### Smart Routing

Automatically selects model tier based on task complexity:

- **HIGH Tier** (GPT-4o): Complex reasoning, architecture, distributed systems
- **MEDIUM Tier** (GPT-4o-mini): Standard implementation, APIs, testing
- **LOW Tier** (Efficient): Simple tasks, documentation, basic fixes

### Auto-Delegation

Detects keywords and routes to specialists:

| Keywords | Delegated Agent |
|----------|----------------|
| database, sql, query | Database Expert |
| frontend, react, ui | Frontend Engineer |
| api, endpoint, rest | API Specialist |
| test, unit test | Unit Test Specialist |
| security, auth | Authentication Specialist |

---

## 3. Ralph Mode

**Best for**: Critical tasks requiring guaranteed completion with verification

### Features

- **Verification Protocol**: BUILD, TEST, LINT, FUNCTIONALITY, SECURITY, ERROR_FREE
- **Evidence-Based**: Requires proof of completion
- **Automatic Retry**: Retry on verification failure (up to maxRetries)
- **Strict Mode**: All checks must pass (not just required ones)
- **Completion Guarantee**: Ensures task is done with evidence

### Verification Flow

```
1. Execute task
   ↓
2. Run verification checks
   ↓
3. All required checks pass? → COMPLETE ✓
   ↓
4. Some checks fail? → Retry with feedback
   ↓
5. Repeat until complete or max retries
```

### Verification Checks

| Check | Required | Purpose |
|-------|----------|---------|
| **BUILD** | Yes | Code compiles/builds successfully |
| **TEST** | Yes | All tests pass |
| **LINT** | No | No linting errors |
| **FUNCTIONALITY** | Yes | Feature works as expected |
| **SECURITY** | Strict mode | No vulnerabilities detected |
| **ERROR_FREE** | Yes | No unresolved errors |

### Usage

```typescript
const result = await omc.ralphMode(
  'Implement user authentication with full test coverage',
  { framework: 'Express' },
  {
    maxRetries: 3,
    requiredChecks: ['BUILD', 'TEST', 'FUNCTIONALITY', 'SECURITY'],
    strictMode: true,
    evidenceRequired: true
  }
);

console.log(result.summary);
console.log(`Completed: ${result.completed}`);
console.log(`Retries: ${result.retryCount}`);

// Check verification results
result.verificationChecks.forEach(check => {
  console.log(`${check.passed ? '✓' : '✗'} ${check.name}`);
});
```

### CLI

```bash
# Standard verification
omc ralph "Implement feature" --max-retries 3

# Strict mode (all checks must pass)
omc ralph "Critical feature" --strict --max-retries 5

# Custom verification checks
omc ralph "Task" --checks "BUILD,TEST,SECURITY"
```

### Exit Codes

- `0`: Task completed successfully with all verifications passed
- `1`: Task failed verification after maximum retries

---

## 4. Ultrawork Mode

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
- Standard pipeline workflow is sufficient

### Use Ultrapilot when:
- Complex tasks requiring intelligent orchestration
- Need smart model routing for cost optimization
- Want automatic delegation to specialists
- Task may benefit from skill composition
- Need flexible execution strategies

### Use Ralph when:
- Task absolutely must be completed correctly
- Need verification with evidence
- Critical production code
- Compliance or audit requirements
- Willing to retry for guaranteed completion

### Use Ultrawork when:
- Multiple independent tasks
- Speed is priority
- Tasks can run in parallel
- No interdependencies between tasks

### Use Swarm when:
- Dynamic task generation
- Variable task complexity
- Need task persistence
- Distributed workload
- Long-running task pool

### Use Ecomode when:
- Simple implementations
- Budget constraints
- Prototyping
- Non-critical features
- Cost is the primary concern

---

## Keyword Detection

Oh My Copilot automatically detects mode from input:

```typescript
// Autopilot
omc.run('autopilot: build me a REST API');
omc.run('build me a complete authentication system');

// Ultrapilot
omc.run('ultrapilot: build microservices with smart routing');
omc.run('auto delegate this complex task');

// Ralph
omc.run('ralph: implement authentication with verification');
omc.run('guarantee this feature is complete');

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

| Mode | Time | Cost | Quality | Guarantee | Use Case |
|------|------|------|---------|-----------|----------|
| Autopilot | ~3-5 min | $0.05-0.15 | ★★★★★ | No | Production |
| Ultrapilot | ~2-4 min | $0.04-0.12 | ★★★★★ | Optional | Complex tasks |
| Ralph | ~4-7 min | $0.06-0.18 | ★★★★★ | Yes | Critical features |
| Ultrawork | ~1-2 min | $0.03-0.10 | ★★★★☆ | No | Speed priority |
| Swarm | ~2-4 min | $0.04-0.12 | ★★★★☆ | No | Dynamic tasks |
| Ecomode | ~2-3 min | $0.01-0.05 | ★★★☆☆ | No | Budget priority |

*Times and costs are approximate and depend on task complexity.*

### Cost Optimization Tips

1. **Use Ecomode** for simple, non-critical tasks
2. **Use Ultrapilot with smart routing** to automatically select appropriate model tiers
3. **Use Autopilot** for balanced cost/quality
4. **Use Ralph** only when completion guarantee is essential
5. Set cost thresholds to prevent overspending
6. Use concise, specific prompts to reduce token usage
