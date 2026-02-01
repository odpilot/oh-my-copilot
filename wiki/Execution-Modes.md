# Execution Modes

Oh My Copilot offers four distinct execution modes, each optimized for different workflows and use cases.

## Overview

| Mode | Use Case | Speed | Cost | Complexity |
|------|----------|-------|------|------------|
| **Autopilot** | Full pipeline | Medium | High | Complete solution |
| **Ultrawork** | Parallel tasks | Fast | Medium | Multiple tasks |
| **Swarm** | Dynamic allocation | Scalable | Variable | Large workloads |
| **Economy** | Simple tasks | Fast | Low | Quick fixes |

## 1. Autopilot Mode

**Full automated pipeline with multiple specialized agents working together.**

### Workflow

```
Architect → Executor → QA Tester → Security Reviewer
   ↓           ↓           ↓            ↓
 Planning   Coding    Testing     Security
```

### Usage

```bash
# Basic usage
omc autopilot "Build a REST API for user management"

# With options
omc autopilot "Build authentication system" \
  --skip-security \
  --output ./result.txt \
  --model gpt-4o

# Short alias
omc ap "Your task"
```

### When to Use

✅ Building new features
✅ Need comprehensive solution  
✅ Want automatic testing
✅ Require security review
✅ Complex implementations

### Phases

1. **Planning (Architect Agent)**
   - Analyzes requirements
   - Creates system design
   - Plans implementation steps

2. **Implementation (Executor Agent)**
   - Writes production code
   - Handles edge cases
   - Follows best practices

3. **Testing (QA Tester Agent)**
   - Generates test cases
   - Validates functionality
   - Ensures coverage

4. **Security Review (Security Agent)**
   - Identifies vulnerabilities
   - Checks for security issues
   - Recommends fixes

### Configuration

```json
{
  "execution": {
    "autopilot": {
      "skipSecurity": false,
      "skipTests": false,
      "maxRetries": 3,
      "timeout": 600000
    }
  }
}
```

### Example

```bash
omc autopilot "Create a user authentication system with JWT tokens, password hashing, and role-based access control"
```

**Output includes:**
- System architecture
- Implementation code
- Test suite
- Security analysis
- Cost report

## 2. Economy Mode

**Cost-optimized execution for simple, straightforward tasks.**

### Usage

```bash
# Basic usage
omc eco "Add error handling to this function"

# Economy mode features
omc eco "Refactor to use async/await" \
  --max-cost 0.05 \
  --model fast
```

### When to Use

✅ Simple, well-defined tasks
✅ Want to minimize costs
✅ Quick implementations
✅ Code improvements
✅ Bug fixes

### Features

- Uses cost-effective models
- Streamlined workflow
- No redundant steps
- Fast execution
- Budget controls

### Configuration

```json
{
  "execution": {
    "eco": {
      "maxCostThreshold": 0.10,
      "preferredModels": ["gpt-4o-mini", "claude-3-haiku-20240307"],
      "timeout": 180000
    }
  }
}
```

### Examples

```bash
# Add logging
omc eco "Add console.log statements for debugging"

# Format code
omc eco "Format this code according to Prettier standards"

# Add comments
omc eco "Add JSDoc comments to all functions"

# Fix typos
omc eco "Fix typos in variable names and comments"
```

## 3. Ultrawork Mode

**Execute multiple independent tasks in parallel for maximum speed.**

### Usage

```bash
# Multiple tasks (use --concurrency for CLI, maxConcurrency in config)
omc ultrawork "Task 1" "Task 2" "Task 3"

# From file
omc ultrawork --tasks-file tasks.json

# With concurrency limit (CLI parameter)
omc ultrawork --concurrency 5 "Task 1" "Task 2" "Task 3"

# Short alias
omc ulw "Task 1" "Task 2"
```

### When to Use

✅ Multiple independent tasks
✅ Want maximum speed
✅ Tasks can run in parallel
✅ Batch processing
✅ Time-sensitive work

### Task File Format

```json
[
  {
    "title": "Build user API",
    "description": "Create CRUD endpoints for users",
    "agent": "executor",
    "priority": "high"
  },
  {
    "title": "Write tests",
    "description": "Create test suite for user API",
    "agent": "qa-tester",
    "priority": "medium"
  },
  {
    "title": "Generate docs",
    "description": "Create API documentation",
    "agent": "architect",
    "priority": "low"
  }
]
```

### Configuration

Configuration file uses `maxConcurrency`, while CLI uses `--concurrency`:

```json
{
  "execution": {
    "ultrawork": {
      "maxConcurrency": 3,  // Used in config file
      "timeout": 300000,
      "stopOnError": false,
      "retryFailedTasks": true
    }
  }
}
```

CLI example:
```bash
omc ultrawork --concurrency 5 "Task 1" "Task 2"
```

### Examples

```bash
# Parallel feature development
omc ultrawork \
  "Implement user registration" \
  "Implement login endpoint" \
  "Implement password reset"

# Multiple file processing
omc ultrawork \
  "Refactor utils.js" \
  "Refactor helpers.js" \
  "Refactor validators.js"

# Batch code review
omc ultrawork --tasks-file code-review-tasks.json
```

## 4. Swarm Mode

**Autonomous agents dynamically claim and process tasks from a shared pool.**

### Usage

```bash
# Basic swarm
omc swarm --agents 5 "Task 1" "Task 2" "Task 3"

# From file
omc swarm --agents 3 --tasks-file tasks.json

# With options
omc swarm \
  --agents 5 \
  --polling-interval 1000 \
  --stop-when-empty \
  "Task 1" "Task 2" "Task 3"
```

### When to Use

✅ Large number of tasks
✅ Need dynamic allocation
✅ Unpredictable task complexity
✅ Want self-organizing system
✅ Long-running workloads

### How It Works

1. **Task Pool**: Tasks are added to SQLite database
2. **Agent Claiming**: Agents claim available tasks
3. **Execution**: Agents execute claimed tasks
4. **Completion**: Results are stored
5. **Repeat**: Agents claim next task

### Architecture

```
Task Pool (SQLite)
       ↓
   ┌───┴───┬───────┬───────┬───────┐
   ↓       ↓       ↓       ↓       ↓
Agent 1  Agent 2  Agent 3  Agent 4  Agent 5
   ↓       ↓       ↓       ↓       ↓
Results  Results Results Results  Results
```

### Configuration

```json
{
  "execution": {
    "swarm": {
      "defaultAgents": 3,
      "pollingInterval": 1000,
      "stopWhenEmpty": true,
      "maxTaskRetries": 3,
      "claimTimeout": 60000
    }
  }
}
```

### Task Priorities

Tasks support priority levels:

```typescript
enum TaskPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  URGENT = 3
}
```

Higher priority tasks are claimed first.

### Examples

```bash
# Process backlog
omc swarm --agents 10 \
  "Fix bug #123" \
  "Fix bug #124" \
  "Fix bug #125" \
  ...

# Code generation batch
omc swarm --agents 5 --tasks-file features.json

# Data processing
omc swarm --agents 8 \
  "Process dataset A" \
  "Process dataset B" \
  "Process dataset C"
```

## Programmatic Usage

### Autopilot

```typescript
import { OhMyCopilot } from 'oh-my-copilot';

const omc = new OhMyCopilot();
const result = await omc.autopilot('Build a calculator');
console.log(result.summary);
```

### Economy

```typescript
const result = await omc.eco('Add error handling', {
  maxCostThreshold: 0.05
});
```

### Ultrawork

```typescript
const tasks = [
  { title: 'Task 1', description: '...', agent: null },
  { title: 'Task 2', description: '...', agent: null },
  { title: 'Task 3', description: '...', agent: null }
];

const result = await omc.ultra(tasks, 3); // max 3 concurrent
```

### Swarm

```typescript
const swarm = omc.getSwarm();
const taskPool = omc.getTaskPool();

// Add tasks
taskPool.createTask({
  title: 'Task 1',
  description: '...',
  priority: TaskPriority.HIGH
});

// Start swarm
await swarm.start({
  agentCount: 5,
  stopWhenEmpty: true
});
```

## Mode Comparison

### Cost Comparison

| Mode | Typical Cost | Models Used |
|------|-------------|-------------|
| Autopilot | $$$ | Multiple premium models |
| Economy | $ | Single efficient model |
| Ultrawork | $$ | Multiple efficient models |
| Swarm | $$-$$$ | Variable based on tasks |

### Speed Comparison

| Mode | Execution Time | Parallelization |
|------|----------------|-----------------|
| Autopilot | Sequential | No |
| Economy | Fast | No |
| Ultrawork | Fast | Yes |
| Swarm | Scalable | Yes |

### Use Case Matrix

| Scenario | Recommended Mode |
|----------|------------------|
| Build new feature | Autopilot |
| Fix simple bug | Economy |
| Multiple features | Ultrawork |
| Process backlog | Swarm |
| Quick refactor | Economy |
| Full project | Autopilot |
| Batch operations | Swarm or Ultrawork |

## Best Practices

### Choosing the Right Mode

1. **Single complex task** → Autopilot
2. **Single simple task** → Economy
3. **Few independent tasks** → Ultrawork
4. **Many tasks** → Swarm
5. **Cost-sensitive** → Economy
6. **Time-sensitive** → Ultrawork or Swarm

### Optimization Tips

**Autopilot:**
- Use `--skip-tests` for rapid prototyping
- Use `--skip-security` for internal tools
- Cache results with `--output`

**Economy:**
- Set `maxCostThreshold` to control spending
- Use `--model cheap` for maximum savings
- Batch similar tasks

**Ultrawork:**
- Adjust `maxConcurrency` based on API limits
- Group related tasks
- Use task files for large batches

**Swarm:**
- Scale agents based on task count
- Use priorities for important tasks
- Monitor task pool with web UI

## Next Steps

- [Agent System](Agent-System) - Understanding the agents
- [Templates](Templates) - Pre-built workflows
- [CLI Reference](CLI-Reference) - All command options
- [Cost Tracking](Cost-Tracking) - Monitor expenses
