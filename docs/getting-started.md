# Getting Started with Oh My Copilot

## Installation

### From npm

```bash
npm install oh-my-copilot
```

### From Source

```bash
git clone https://github.com/odpilot/oh-my-copilot.git
cd oh-my-copilot
npm install
npm run build
```

### CLI Installation

```bash
npm install -g oh-my-copilot
```

## First Steps

### 1. Basic Usage

Create a simple script:

```typescript
import { OhMyCopilot } from 'oh-my-copilot';

const omc = new OhMyCopilot();

const result = await omc.run('Create a hello world function');
console.log(result.summary);

omc.cleanup();
```

### 2. Using the CLI

```bash
# Interactive chat mode
omc chat

# Autopilot mode
omc autopilot "Build a REST API"

# Get help
omc --help
```

### 3. Configuration

Create a `.env` file in your project root:

```env
COPILOT_API_KEY=your_api_key_here
GITHUB_TOKEN=your_github_token
LOG_LEVEL=info
TRACK_COSTS=true
```

Or configure programmatically:

```typescript
const omc = new OhMyCopilot({
  trackCosts: true,
  logLevel: 'debug',
  dbPath: './my-tasks.db'
});
```

## Key Concepts

### Agents

Oh My Copilot uses specialized agents for different tasks:

- **Architect**: Plans and designs solutions
- **Executor**: Implements code
- **QA Tester**: Writes tests
- **Security**: Reviews for vulnerabilities
- **Designer**: Creates UI/UX

### Execution Modes

1. **Autopilot**: Automated pipeline (Planning → Execution → Testing → Security)
2. **Ultrawork**: Parallel task execution
3. **Swarm**: Dynamic task claiming
4. **Ecomode**: Cost-optimized execution

### Task Management

Tasks are managed through an SQLite database with atomic operations for claiming and state management.

## Next Steps

- Read the [Agents Guide](./agents.md)
- Learn about [Execution Modes](./modes.md)
- Explore the [API Reference](./api.md)
- Check out the [Examples](../examples/)

## Common Patterns

### Running a Quick Task

```typescript
const omc = new OhMyCopilot();
const result = await omc.autopilot('Add error handling to the API');
console.log(result.summary);
omc.cleanup();
```

### Parallel Tasks

```typescript
import { ExecutorAgent } from 'oh-my-copilot';

const tasks = [
  { title: 'Feature A', description: '...', agent: new ExecutorAgent() },
  { title: 'Feature B', description: '...', agent: new ExecutorAgent() }
];

const result = await omc.ultra(tasks);
```

### Cost Tracking

```typescript
const omc = new OhMyCopilot({ trackCosts: true });
await omc.autopilot('Build feature');
console.log(omc.getCostReport());
```

## Troubleshooting

### Issue: "Cannot find module"

Make sure you've built the project:
```bash
npm run build
```

### Issue: Database locked

Close any existing instances and clear the database:
```typescript
const omc = new OhMyCopilot({ dbPath: ':memory:' }); // Use in-memory DB
```

### Issue: High costs

Use economy mode or limit task complexity:
```typescript
const result = await omc.eco('Simple task', { maxCostThreshold: 0.10 });
```

## Support

- GitHub Issues: Report bugs
- Discussions: Ask questions
- Documentation: Read the docs
