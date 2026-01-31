# Cost Tracking Documentation

## Table of Contents
1. [Overview](#overview)
2. [How to Enable Cost Tracking](#how-to-enable-cost-tracking)
3. [Understanding the Cost Report](#understanding-the-cost-report)
4. [Cost Breakdown by Model and Agent](#cost-breakdown-by-model-and-agent)
5. [Real-Time Cost Monitoring](#real-time-cost-monitoring)
6. [Cost Optimization Strategies](#cost-optimization-strategies)
7. [Setting Cost Limits and Thresholds](#setting-cost-limits-and-thresholds)
8. [Cost Comparison Between Providers and Models](#cost-comparison-between-providers-and-models)
9. [Best Practices for Cost Management](#best-practices-for-cost-management)
10. [Examples of Cost Reports](#examples-of-cost-reports)
11. [Additional Resources](#additional-resources)
12. [Support](#support)

---

## Overview

Oh My Copilot includes a comprehensive cost tracking system that monitors API usage costs across all agent interactions. The system tracks:

- **Token usage** (prompt tokens and completion tokens)
- **Cost per request** calculated using current model pricing
- **Cost attribution** by agent and model
- **Historical cost data** for analysis over time

### Key Features

- 🎯 **Automatic Tracking**: Cost tracking is enabled by default
- 📊 **Detailed Reports**: Get comprehensive cost breakdowns
- 🔍 **Granular Analysis**: Filter by agent, model, task, or time range
- 💰 **Real-time Monitoring**: Track costs as they accumulate
- 📈 **Export Data**: Export cost data as JSON for external analysis

---

## How to Enable Cost Tracking

### Basic Configuration

Cost tracking is **enabled by default**. To explicitly configure it:

```typescript
import { OhMyCopilot } from 'oh-my-copilot';

const omc = new OhMyCopilot({
  trackCosts: true  // Default: true
});
```

### Disabling Cost Tracking

If you want to disable cost tracking (not recommended for production):

```typescript
const omc = new OhMyCopilot({
  trackCosts: false
});
```

### Configuration File

You can also configure cost tracking in your `omc.config.json`:

```json
{
  "trackCosts": true,
  "logLevel": "info"
}
```

---

## Understanding the Cost Report

### Getting a Cost Report

There are several ways to retrieve cost information:

#### 1. Simple Cost Report

```typescript
const report = omc.getCostReport();
console.log(report);
```

#### 2. Full Dashboard Report

Includes both costs and performance metrics:

```typescript
const dashboardReport = omc.getDashboardReport();
console.log(dashboardReport);
```

#### 3. Programmatic Access

Get raw cost data for custom analysis:

```typescript
const dashboard = omc.getDashboard();
const data = dashboard.getData();

console.log(data.costs.totalCost);
console.log(data.costs.totalTokens);
console.log(data.costs.costByModel);
console.log(data.costs.costByAgent);
```

### Cost Report Format

The standard cost report includes:

```
Cost Tracking Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Cost: $2.45
Total Tokens: 125,450
Total Requests: 15

Cost by Model:
  gpt-4o: $1.80
  gpt-4o-mini: $0.65

Cost by Agent:
  architect: $1.20
  executor: $0.85
  qa-tester: $0.40
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Cost Breakdown by Model and Agent

### Understanding Cost Attribution

Every API request is tracked with the following information:

- **Model**: Which AI model was used
- **Agent**: Which agent made the request (architect, executor, qa-tester, security, designer)
- **Task ID**: Associated task identifier (if applicable)
- **Token Usage**: Prompt tokens and completion tokens
- **Cost**: Calculated cost in USD

### Accessing Cost Breakdown

#### By Model

Models with higher costs typically provide better quality but are more expensive:

```typescript
const summary = omc.getDashboard().getData().costs;

for (const [model, cost] of Object.entries(summary.costByModel)) {
  console.log(`${model}: $${cost.toFixed(2)}`);
}
```

#### By Agent

Different agents have different cost profiles:

```typescript
const summary = omc.getDashboard().getData().costs;

for (const [agent, cost] of Object.entries(summary.costByAgent)) {
  console.log(`${agent}: $${cost.toFixed(2)}`);
}
```

#### Filtering by Time Range

Get costs for a specific time period:

```typescript
const startTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
const endTime = Date.now();

const entries = costTracker.getEntriesInRange(startTime, endTime);
const totalCost = entries.reduce((sum, entry) => sum + entry.cost, 0);

console.log(`Cost in last 24 hours: $${totalCost.toFixed(2)}`);
```

#### Filtering by Agent

Analyze costs for a specific agent:

```typescript
const architectEntries = costTracker.getEntriesByAgent('architect');
const architectCost = architectEntries.reduce((sum, entry) => sum + entry.cost, 0);

console.log(`Architect agent cost: $${architectCost.toFixed(2)}`);
```

#### Filtering by Task

Track costs for a specific task:

```typescript
const taskEntries = costTracker.getEntriesByTask('task-123');
const taskCost = taskEntries.reduce((sum, entry) => sum + entry.cost, 0);

console.log(`Task cost: $${taskCost.toFixed(2)}`);
```

---

## Real-Time Cost Monitoring

### Using the Web API

Oh My Copilot provides REST API endpoints for real-time cost monitoring:

#### Get Current Costs

```bash
curl http://localhost:3000/api/analytics/costs
```

Response:
```json
{
  "total": 2.45,
  "by_model": {
    "gpt-4o": 1.80,
    "gpt-4o-mini": 0.65
  },
  "by_agent": {
    "architect": 1.20,
    "executor": 0.85,
    "qa-tester": 0.40
  },
  "history": [],
  "period": "24h"
}
```

#### Filter by Time Period

```bash
# Last hour
curl http://localhost:3000/api/analytics/costs?period=1h

# Last 24 hours (default)
curl http://localhost:3000/api/analytics/costs?period=24h

# Last 7 days
curl http://localhost:3000/api/analytics/costs?period=7d
```

#### Get Complete Dashboard

```bash
curl http://localhost:3000/api/analytics/dashboard
```

### Programmatic Monitoring

Monitor costs during execution:

```typescript
import { OhMyCopilot } from 'oh-my-copilot';

const omc = new OhMyCopilot({ trackCosts: true });

// Execute task
await omc.autopilot('Create a REST API');

// Check costs immediately
const dashboard = omc.getDashboard();
const { totalCost } = dashboard.getData().costs;

if (totalCost > 5.0) {
  console.warn(`⚠️  Cost exceeded $5.00: $${totalCost.toFixed(2)}`);
}
```

---

## Cost Optimization Strategies

### 1. Use Ecomode for Cost-Sensitive Tasks

Ecomode uses cheaper models and skips non-essential steps:

```typescript
const result = await omc.ecomode('Create a simple utility function', {}, {
  preferMiniModels: true,
  maxCostThreshold: 0.50  // Stop if cost exceeds $0.50
});

console.log(`Cost: $${result.totalCost.toFixed(2)}`);
console.log(`Savings: $${result.costSavings.toFixed(2)}`);
```

**Expected Savings**: 70-80% compared to standard pipeline

### 2. Choose Cost-Effective Models

Configure agents to use cheaper models:

```typescript
const omc = new OhMyCopilot({
  executorModel: 'gpt-4o-mini',      // $0.15/$0.60 per 1M tokens
  qaTesterModel: 'gpt-4o-mini',      // Instead of gpt-4o
  architectModel: 'gpt-4o',          // Keep premium for planning
  securityModel: 'gpt-4o'            // Keep premium for security
});
```

### 3. Use Local Models with Ollama

For development or non-critical tasks, use free local models:

```typescript
const omc = new OhMyCopilot({
  defaultProvider: 'ollama',
  executorModel: 'llama3',      // Free, runs locally
  qaTesterModel: 'codellama'    // Free, runs locally
});
```

**Cost**: $0.00 (completely free)

### 4. Batch Similar Tasks with Ultrawork

Process multiple related tasks in parallel to reduce redundant planning:

```typescript
const tasks = [
  { id: '1', task: 'Create user model' },
  { id: '2', task: 'Create product model' },
  { id: '3', task: 'Create order model' }
];

const result = await omc.ultrawork(tasks);
console.log(`Total cost for ${tasks.length} tasks: $${result.totalCost.toFixed(2)}`);
```

### 5. Monitor and Adjust Model Selection

Regularly review which agents consume the most costs:

```typescript
const report = omc.getCostReport();
console.log(report);

// Adjust configuration based on cost breakdown
// If architect is too expensive, consider claude-3-5-sonnet instead of gpt-4o
```

---

## Setting Cost Limits and Thresholds

### Ecomode Cost Thresholds

Set maximum cost limits for economy mode execution:

```typescript
const result = await omc.ecomode('Build a feature', {}, {
  maxCostThreshold: 1.00  // Stop if cost exceeds $1.00
});

if (!result.success) {
  console.log('Task stopped: cost threshold exceeded');
}
```

### Custom Cost Monitoring

Implement your own cost guards:

```typescript
async function executeWithCostLimit(
  omc: OhMyCopilot,
  task: string,
  maxCost: number
): Promise<any> {
  const initialCost = omc.getDashboard().getData().costs.totalCost;
  
  const result = await omc.autopilot(task);
  
  const finalCost = omc.getDashboard().getData().costs.totalCost;
  const taskCost = finalCost - initialCost;
  
  if (taskCost > maxCost) {
    console.warn(`⚠️  Task cost $${taskCost.toFixed(2)} exceeded limit of $${maxCost}`);
  }
  
  return result;
}

// Usage
await executeWithCostLimit(omc, 'Create an API', 2.00);
```

### Budget Tracking

Track daily/monthly budgets:

```typescript
class BudgetTracker {
  private dailyBudget = 10.00;
  private dailySpent = 0;
  
  async executeWithBudget(omc: OhMyCopilot, task: string) {
    const before = omc.getDashboard().getData().costs.totalCost;
    
    if (this.dailySpent >= this.dailyBudget) {
      throw new Error('Daily budget exceeded');
    }
    
    const result = await omc.autopilot(task);
    
    const after = omc.getDashboard().getData().costs.totalCost;
    const cost = after - before;
    
    this.dailySpent += cost;
    console.log(`Spent: $${cost.toFixed(2)} | Remaining: $${(this.dailyBudget - this.dailySpent).toFixed(2)}`);
    
    return result;
  }
}
```

---

## Cost Comparison Between Providers and Models

### Model Pricing (per 1M tokens)

#### OpenAI

| Model | Input | Output | Best For |
|-------|--------|--------|----------|
| `gpt-4o` | $5.00 | $15.00 | Complex planning, architecture |
| `gpt-4o-mini` | $0.15 | $0.60 | Simple tasks, testing (97% cheaper) |
| `o1` | $15.00 | $60.00 | Advanced reasoning (not recommended for most tasks) |
| `o1-mini` | $3.00 | $12.00 | Cost-effective reasoning |
| `gpt-4-turbo` | $10.00 | $30.00 | Legacy, not recommended |
| `gpt-4` | $30.00 | $60.00 | Legacy, very expensive |
| `gpt-3.5-turbo` | $0.50 | $1.50 | Deprecated, use gpt-4o-mini |

#### Anthropic

| Model | Input | Output | Best For |
|-------|--------|--------|----------|
| `claude-3-5-sonnet-20241022` | $3.00 | $15.00 | Excellent balance of quality and cost |
| `claude-3-opus-20240229` | $15.00 | $75.00 | Highest quality (expensive) |
| `claude-3-haiku-20240307` | $0.25 | $1.25 | Fast, cheap tasks |

#### Google Gemini

| Model | Input | Output | Best For |
|-------|--------|--------|----------|
| `gemini-2.0-flash` | $0.10 | $0.40 | Ultra-fast, very cheap |
| `gemini-1.5-pro` | $1.25 | $5.00 | Good quality, reasonable cost |
| `gemini-1.5-flash` | $0.075 | $0.30 | Cheapest cloud option |

#### Ollama (Local)

| Model | Input | Output | Best For |
|-------|--------|--------|----------|
| `llama3` | $0.00 | $0.00 | Free, local development |
| `mistral` | $0.00 | $0.00 | Free, local development |
| `codellama` | $0.00 | $0.00 | Free, code-focused tasks |

### Cost Comparison Examples

#### Example Task: "Create a REST API with authentication"

Estimated token usage: 50,000 prompt tokens, 30,000 completion tokens

| Model | Input Cost | Output Cost | Total | Savings vs gpt-4o |
|-------|-----------|-------------|-------|-------------------|
| `gpt-4o` | $0.25 | $0.45 | **$0.70** | Baseline |
| `gpt-4o-mini` | $0.0075 | $0.018 | **$0.026** | 96% cheaper |
| `claude-3-5-sonnet` | $0.15 | $0.45 | **$0.60** | 14% cheaper |
| `claude-3-haiku` | $0.0125 | $0.0375 | **$0.05** | 93% cheaper |
| `gemini-2.0-flash` | $0.005 | $0.012 | **$0.017** | 98% cheaper |
| `gemini-1.5-flash` | $0.00375 | $0.009 | **$0.013** | 98% cheaper |
| `llama3` (Ollama) | $0.00 | $0.00 | **$0.00** | 100% cheaper |

### Provider Recommendations by Use Case

#### Production (Quality Priority)
- **Architecture/Planning**: `gpt-4o` or `claude-3-5-sonnet`
- **Execution**: `gpt-4o-mini` or `claude-3-haiku`
- **Testing**: `gpt-4o-mini`
- **Security**: `gpt-4o` or `claude-3-opus`

#### Production (Cost Priority)
- **Architecture/Planning**: `claude-3-5-sonnet` or `gemini-1.5-pro`
- **Execution**: `gpt-4o-mini` or `gemini-2.0-flash`
- **Testing**: `gemini-2.0-flash` or `claude-3-haiku`
- **Security**: `claude-3-5-sonnet`

#### Development/Testing
- **All agents**: `llama3` (Ollama) or `gemini-2.0-flash`

---

## Best Practices for Cost Management

### 1. **Start with Cost Tracking Enabled**

Always keep cost tracking on to understand your spending:

```typescript
const omc = new OhMyCopilot({ trackCosts: true });
```

### 2. **Use the Right Model for Each Agent**

Don't use expensive models where cheap ones suffice:

```typescript
const omc = new OhMyCopilot({
  architectModel: 'gpt-4o',          // Complex planning needs quality
  executorModel: 'gpt-4o-mini',      // Simple execution is fine with mini
  qaTesterModel: 'gpt-4o-mini',      // Testing doesn't need premium
  securityModel: 'gpt-4o',           // Security is critical, use best
  designerModel: 'gpt-4o-mini'       // Design can use mini for drafts
});
```

### 3. **Review Cost Reports Regularly**

Check costs after each major run:

```typescript
console.log(omc.getCostReport());
```

### 4. **Export and Analyze Cost Data**

Save cost data for historical analysis:

```typescript
import fs from 'fs';

const data = omc.getDashboard().getData();
fs.writeFileSync(
  `costs-${Date.now()}.json`,
  JSON.stringify(data, null, 2)
);
```

### 5. **Use Ecomode for Non-Critical Tasks**

Save 70-80% on costs for simple tasks:

```typescript
// Use ecomode for simple tasks
const result = await omc.ecomode('Create a utility function');

// Use autopilot only for complex tasks
const result = await omc.autopilot('Design a complete microservices architecture');
```

### 6. **Leverage Local Models for Development**

Use Ollama for free local development:

```typescript
const devOmc = new OhMyCopilot({
  defaultProvider: 'ollama',
  executorModel: 'llama3'
});

// Cost: $0.00
await devOmc.autopilot('Test task');
```

### 7. **Monitor Cost Trends**

Track cost over time to identify expensive operations:

```typescript
const entries = costTracker.getEntriesInRange(
  Date.now() - 7 * 24 * 60 * 60 * 1000,
  Date.now()
);

// Group by day
const dailyCosts = entries.reduce((acc, entry) => {
  const day = new Date(entry.timestamp).toDateString();
  acc[day] = (acc[day] || 0) + entry.cost;
  return acc;
}, {} as Record<string, number>);

console.log('Daily costs:', dailyCosts);
```

### 8. **Set Up Cost Alerts**

Notify when costs exceed thresholds:

```typescript
function checkCostAlert(omc: OhMyCopilot, threshold: number) {
  const { totalCost } = omc.getDashboard().getData().costs;
  
  if (totalCost > threshold) {
    console.error(`🚨 ALERT: Total cost $${totalCost.toFixed(2)} exceeds threshold $${threshold}`);
    // Send notification (email, Slack, etc.)
  }
}

// Check after each operation
await omc.autopilot('Task');
checkCostAlert(omc, 10.00);
```

### 9. **Optimize Prompt Length**

Shorter prompts = lower costs:

```typescript
// ❌ Verbose prompt (wastes tokens)
await omc.autopilot(`
  I would like you to please create a comprehensive REST API
  with authentication and authorization, including all the 
  necessary middleware, error handling, validation, and tests.
  Please make sure to follow best practices...
`);

// ✅ Concise prompt (saves tokens)
await omc.autopilot('Create a REST API with auth, middleware, validation, and tests');
```

### 10. **Clear Cost Tracker Periodically**

Reset tracking for fresh analysis:

```typescript
// Get final report
console.log(omc.getCostReport());

// Clear for next session
costTracker.clear();
```

---

## Examples of Cost Reports

### Example 1: Basic Task Cost Report

After running a simple task:

```typescript
const omc = new OhMyCopilot({ trackCosts: true });
await omc.autopilot('Create a hello world function');
console.log(omc.getCostReport());
```

**Output:**
```
Cost Tracking Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Cost: $0.0123
Total Tokens: 1,245
Total Requests: 4

Cost by Model:
  gpt-4o: $0.0089
  gpt-4o-mini: $0.0034

Cost by Agent:
  architect: $0.0089
  executor: $0.0024
  qa-tester: $0.0010
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 2: Ecomode Cost Report

With cost savings information:

```typescript
const omc = new OhMyCopilot({ trackCosts: true });
const result = await omc.ecomode('Create a utility function');
console.log(result.summary);
```

**Output:**
```
Ecomode Completed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Steps completed: 2
Total time: 12.4s
Total cost: $0.0045
Estimated savings: $0.0113 (vs. full pipeline)
1. executor: ✓ (8.2s)
2. qa-tester: ✓ (4.2s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 3: Ultrawork Multi-Task Report

After processing multiple tasks in parallel:

```typescript
const omc = new OhMyCopilot({ trackCosts: true });
const tasks = [
  { id: '1', task: 'Create user model' },
  { id: '2', task: 'Create product model' },
  { id: '3', task: 'Create order model' }
];
const result = await omc.ultrawork(tasks);
console.log(result.summary);
console.log('\n' + omc.getCostReport());
```

**Output:**
```
Ultrawork Completed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tasks completed: 3/3
Total time: 45.2s
Total cost: $0.3456
1. user model: ✓ (14.5s)
2. product model: ✓ (15.8s)
3. order model: ✓ (14.9s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cost Tracking Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Cost: $0.3456
Total Tokens: 45,678
Total Requests: 12

Cost by Model:
  gpt-4o: $0.2345
  gpt-4o-mini: $0.1111

Cost by Agent:
  architect: $0.0891
  executor: $0.1567
  qa-tester: $0.0998
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 4: Full Dashboard Report

Including metrics and costs:

```typescript
const omc = new OhMyCopilot({ trackCosts: true });
await omc.autopilot('Create a REST API');
console.log(omc.getDashboardReport());
```

**Output:**
```
Cost Tracking Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Cost: $1.2345
Total Tokens: 156,789
Total Requests: 18

Cost by Model:
  gpt-4o: $0.9876
  gpt-4o-mini: $0.2469

Cost by Agent:
  architect: $0.5678
  executor: $0.3456
  qa-tester: $0.2111
  security: $0.1100

Performance Metrics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Metric                   Count    Avg      Min      Max
─────────────────────────────────────────────────────
api_request              18       2.3s     0.8s     5.2s
agent_execution          5        8.7s     4.1s     15.3s
task_completion          1        52.4s    52.4s    52.4s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 5: JSON Export for Analysis

Exporting cost data programmatically:

```typescript
const omc = new OhMyCopilot({ trackCosts: true });
await omc.autopilot('Create models');

const data = omc.getDashboard().getData();
console.log(JSON.stringify(data, null, 2));
```

**Output:**
```json
{
  "costs": {
    "totalCost": 0.4567,
    "totalTokens": 58923,
    "totalRequests": 10,
    "costByModel": {
      "gpt-4o": 0.3234,
      "gpt-4o-mini": 0.1333
    },
    "costByAgent": {
      "architect": 0.2345,
      "executor": 0.1222,
      "qa-tester": 0.1000
    }
  },
  "metrics": [
    {
      "name": "api_request",
      "stats": {
        "count": 10,
        "average": 2134.5,
        "min": 892,
        "max": 4567
      }
    }
  ],
  "timestamp": 1704067200000
}
```

### Example 6: Cost Filtering by Time Range

Analyzing costs for a specific period:

```typescript
const omc = new OhMyCopilot({ trackCosts: true });

// Run multiple tasks throughout the day
await omc.autopilot('Task 1');
// ... wait some time ...
await omc.autopilot('Task 2');

// Get costs from last hour
const lastHour = Date.now() - (60 * 60 * 1000);
const entries = costTracker.getEntriesInRange(lastHour, Date.now());

const recentCost = entries.reduce((sum, e) => sum + e.cost, 0);
console.log(`Cost in last hour: $${recentCost.toFixed(2)}`);
console.log(`Requests in last hour: ${entries.length}`);
```

### Example 7: Agent-Specific Cost Analysis

Breaking down costs by individual agents:

```typescript
const omc = new OhMyCopilot({ trackCosts: true });
await omc.autopilot('Build a feature');

// Analyze each agent's costs
const agents = ['architect', 'executor', 'qa-tester', 'security', 'designer'];

console.log('Agent Cost Breakdown:');
for (const agent of agents) {
  const entries = costTracker.getEntriesByAgent(agent);
  const cost = entries.reduce((sum, e) => sum + e.cost, 0);
  const tokens = entries.reduce((sum, e) => sum + e.totalTokens, 0);
  
  if (entries.length > 0) {
    console.log(`  ${agent}:`);
    console.log(`    Cost: $${cost.toFixed(4)}`);
    console.log(`    Tokens: ${tokens.toLocaleString()}`);
    console.log(`    Requests: ${entries.length}`);
  }
}
```

---

## Additional Resources

- [Getting Started Guide](./getting-started.md)
- [API Documentation](./api.md)
- [BYOK Documentation](./byok.md)
- [Model Configuration](./models.md)

## Support

For questions or issues related to cost tracking:
- Open an issue on [GitHub](https://github.com/yourusername/oh-my-copilot)
- Check existing [discussions](https://github.com/yourusername/oh-my-copilot/discussions)

---

**Last Updated**: January 2025
