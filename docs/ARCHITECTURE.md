# Architecture

> How oh-my-copilot orchestrates multi-agent workflows with intelligent routing and skill composition.

## Overview

oh-my-copilot is a sophisticated multi-agent orchestration system that enables specialized AI agents to work together through intelligent routing, skill composition, and automatic delegation.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         OH-MY-COPILOT                                    │
│              Intelligent Multi-Agent Orchestration                       │
└─────────────────────────────────────────────────────────────────────────┘

  User Input                  Mode Detection              Agent Routing
  ──────────                  ──────────────              ─────────────
       │                            │                           │
       ▼                            ▼                           ▼
┌─────────────┐          ┌──────────────────┐      ┌──────────────────┐
│  "ultrapilot│          │  Keyword         │      │  Smart Model     │
│   build API │─────────▶│  Detector        │─────▶│  Routing         │
│   with auto │          │                  │      │                  │
│   delegate" │          │  Mode: ultrapilot│      │  HIGH: GPT-4o    │
└─────────────┘          │  Skills: auto-   │      │  MEDIUM: mini    │
                         │  delegate, smart │      │  LOW: Haiku-tier │
                         │  routing         │      │                  │
                         └──────────────────┘      └──────────────────┘
                                  │                          │
                                  ▼                          ▼
                         ┌──────────────────┐      ┌──────────────────┐
                         │  Skill           │      │  Agent           │
                         │  Composition     │      │  Delegation      │
                         │                  │      │                  │
                         │  • Execution     │      │  32 Specialized  │
                         │  • Enhancement   │      │  Agents Ready    │
                         │  • Guarantee     │      │                  │
                         └──────────────────┘      └──────────────────┘
```

## Core Concepts

### 1. Multi-Tier Agent System

Agents are organized by complexity tier for intelligent model routing:

| Tier | Model | Use For | Example Agents |
|------|-------|---------|----------------|
| **HIGH** | GPT-4o, Opus | Complex reasoning, architecture, critical decisions | Architect, Security, ML Engineer, Microservices Architect |
| **MEDIUM** | GPT-4o-mini, Sonnet | Standard implementations, testing, reviews | Executor, QA Tester, API Specialist, DevOps |
| **LOW** | Haiku-tier | Quick lookups, simple operations, basic tasks | Documentation helpers, simple configurations |

### 2. Execution Modes

Six execution modes optimized for different scenarios:

#### Autopilot (Pipeline)
Sequential pipeline with quality gates:
```
Planning (Architect) → Implementation (Executor) → Testing (QA) → Security Review
```

#### Ultrapilot (Advanced Orchestration)
Advanced mode with skill composition and intelligent routing:
- **Skill Layers**: Execution + Enhancement + Guarantee
- **Smart Routing**: Automatic model tier selection based on complexity
- **Auto-Delegation**: Intelligent task routing to specialized agents
- **Parallel Execution**: Optional concurrent task processing

#### Ralph (Guarantee Completion)
Verification-driven mode ensuring task completion:
- **Verification Checks**: BUILD, TEST, LINT, FUNCTIONALITY, SECURITY
- **Evidence-Based**: Requires proof of completion
- **Retry Logic**: Automatic retry on verification failure
- **Strict Mode**: Comprehensive validation

#### Ultrawork (Parallel)
Maximum speed through parallel execution:
- Independent task processing
- Configurable concurrency limits
- Aggregated results

#### Swarm (Distributed)
Dynamic task claiming from shared pool:
- SQLite-based task pool
- Atomic task claiming
- Priority-based execution
- Real-time progress tracking

#### Ecomode (Cost-Optimized)
Budget-conscious execution:
- Mini models (GPT-4o-mini)
- Cost thresholds
- Skipped optional steps
- Savings tracking

### 3. Skill Composition (Ultrapilot)

Skills compose in three layers:

```
┌─────────────────────────────────────────────────────────────┐
│  GUARANTEE LAYER (optional)                                  │
│  ralph: "Cannot stop until verified done"                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  ENHANCEMENT LAYER (0-N skills)                              │
│  ultrawork (parallel) | git-master (commits) | frontend-ui-ux│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  EXECUTION LAYER (primary skill)                             │
│  default (build) | orchestrate (coordinate) | planner (plan) │
└─────────────────────────────────────────────────────────────┘
```

**Available Skills:**
- **Execution**: `default`, `planner`, `orchestrate`
- **Enhancement**: `ultrawork`, `git-master`, `frontend-ui-ux`
- **Guarantee**: `ralph`

### 4. Smart Model Routing

Automatic model tier selection based on task analysis:

```typescript
// Complexity indicators
HIGH: architecture, design patterns, algorithms, microservices, distributed
MEDIUM: standard implementation, APIs, testing, integration
LOW: simple tasks, basic fixes, documentation updates

// Automatic routing
Task: "Design microservices architecture" → HIGH tier (GPT-4o)
Task: "Implement REST endpoint" → MEDIUM tier (GPT-4o-mini)
Task: "Fix typo in docs" → LOW tier (efficient model)
```

### 5. Automatic Delegation

Intelligent task routing to specialized agents:

```typescript
// Detection keywords → Agent
"database", "sql", "query" → database-expert
"frontend", "react", "ui" → frontend-engineer
"api", "endpoint", "rest" → api-specialist
"test", "unit test" → unit-test-specialist
"security", "authentication" → authentication-specialist
```

### 6. Agent Categories

32 specialized agents organized by domain:

**Core** (8): Architect, Executor, QA Tester, Security, Designer, DevOps, Data Analyst, Reviewer

**Engineering** (6): Frontend, Backend, Database, API, Mobile, ML

**Testing** (3): Unit Test, Integration Test, Testing Automation

**Infrastructure** (4): Infrastructure Engineer, CI/CD, Monitoring, Serverless

**Architecture** (4): Microservices Architect, UX Designer, Refactoring, Code Reviewer

**Specialized** (4): GraphQL, WebSocket, Blockchain, Authentication

**Support** (7): Documentation, Accessibility, Localization, Migration, Performance, Error Handling, Configuration

**Tools** (2): Caching Specialist, Git Expert

## Verification Protocol (Ralph Mode)

Ralph mode ensures task completion with evidence:

**Standard Checks:**
- **BUILD**: Code compiles/builds successfully
- **TEST**: All tests pass
- **LINT**: No linting errors
- **FUNCTIONALITY**: Feature works as expected
- **SECURITY**: No vulnerabilities detected
- **ERROR_FREE**: No unresolved errors

**Verification Flow:**
```
1. Execute task
2. Run verification checks
3. If all required checks pass → COMPLETE
4. If checks fail → Retry with feedback (up to maxRetries)
5. Final verification with evidence
```

## State Management

State is managed at multiple levels:

**Session State:**
- Active mode and configuration
- Current agent execution context
- Cost tracking and metrics

**Task State (Swarm):**
- SQLite-based task pool
- Atomic state transitions
- Priority queues
- Completion tracking

**Analytics State:**
- Real-time cost tracking
- Performance metrics
- Agent utilization
- Success rates

## Cost Tracking

Comprehensive cost analysis across all providers:

```typescript
// Per-agent tracking
architect: $0.0089
executor: $0.0045
qa-tester: $0.0056

// Per-model tracking
gpt-4o: $0.0156
gpt-4o-mini: $0.0078

// Mode comparisons
Autopilot: ~$0.05-0.15 (high quality)
Ultrapilot: ~$0.04-0.12 (balanced)
Ralph: ~$0.06-0.18 (guaranteed completion)
Ecomode: ~$0.01-0.05 (budget-friendly)
```

## Plugin System

Extensible architecture with plugin support:

**Built-in Plugins:**
- GitHub integration
- Jira integration
- Slack notifications

**Custom Plugins:**
```typescript
class CustomPlugin {
  name: string;
  version: string;
  hooks: {
    beforeExecution?: () => void;
    afterExecution?: () => void;
  };
}
```

## MCP Integration

Model Context Protocol support for enhanced capabilities:

- Tool usage across agents
- Context sharing
- External service integration
- Dynamic capability extension

## For More Details

- **API Reference**: See [API Documentation](./api.md)
- **Agent Guide**: See [Agents](./agents.md)
- **Mode Guide**: See [Execution Modes](./modes.md)
- **Configuration**: See [BYOK Configuration](./byok.md)
- **Examples**: See [Examples Directory](../examples/)
