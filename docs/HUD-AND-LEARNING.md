# HUD Statusline and Skill Learning Demo

This document demonstrates the new HUD statusline and skill learning features.

## HUD Statusline

The HUD statusline provides real-time feedback during task execution:

### Example Output

When running `omc ralph "Implement user authentication"`:

```
╔════════════════════════════════════════════════════════════════╗
║ RALPH MODE - Live Status                                       ║
╚════════════════════════════════════════════════════════════════╝

Step 1/5: Planning with Architect
● 1/5 [████░░░░░░░░░░░░░░░░] 20% [architect] $0.0023 0:15

Step 2/5: Implementation with Executor
● 2/5 [████████░░░░░░░░░░░░] 40% [executor] $0.0056 0:42

Step 3/5: Testing with QA Tester
● 3/5 [████████████░░░░░░░░] 60% [qa-tester] $0.0089 1:15

Step 4/5: Security Review
● 4/5 [████████████████░░░░] 80% [security] $0.0134 1:48

Step 5/5: Running Verification Checks

Verification Checks:
  ✓ BUILD                  PASS
  ✓ TEST                   PASS
  ✓ LINT                   PASS
  ✓ FUNCTIONALITY          PASS
  ✓ SECURITY              PASS
  ✓ ERROR_FREE            PASS

✓ COMPLETED
All verifications passed
Total time: 2:15
Total cost: $0.0178
```

## State Management

### View Session History

```bash
$ omc state sessions

Recent Sessions
════════════════════════════════════════════════════════

ID                      Mode        Status  Agents  Cost      Time
ralph-1234567890...     ralph       ✓       4       $0.0178   2:15
ultrapilot-1234567891.. ultrapilot  ✓       5       $0.0245   3:42
ralph-1234567892...     ralph       ✗       3       $0.0089   1:30

Showing 3 of 3 sessions
Use --limit to show more
```

### View Captured Wisdom

```bash
$ omc state wisdom

Captured Wisdom
════════════════════════════════════════════════════════

[SUCCESS] 2026-02-01 07:15:32
Ralph mode completed successfully
Context: Ralph mode verification passed on first attempt
Tags: ralph, verification, success
Agents: architect, executor, qa-tester, security

[OPTIMIZATION] 2026-02-01 07:10:15
Identified 3 delegation opportunities: database-expert, frontend-engineer, api-specialist
Context: Ultrapilot auto-delegation analysis
Tags: ultrapilot, delegation, optimization
Agents: architect

[FAILURE] 2026-02-01 07:05:20
Verification checks failed: BUILD, TEST
Context: Ralph mode verification failed on attempt 1
Tags: ralph, verification, failure
Agents: architect, executor, qa-tester

Showing 3 of 3 wisdom entries
Categories: success, failure, optimization, insight
Use --category or --tags to filter
```

### View Agent Statistics

```bash
$ omc state stats

Agent Statistics
════════════════════════════════════════════════════════

Agent                    Uses  Success Rate  Avg Cost
architect                12    91.7%         $0.0045
executor                 11    90.9%         $0.0067
qa-tester                10    100.0%        $0.0034
security                 9     88.9%         $0.0078
frontend-engineer        3     100.0%        $0.0052
database-expert          2     100.0%        $0.0048

Summary:
  Total uses: 47
  Average success rate: 93.6%
  Total cost: $0.2489

Most used agent: architect (12 uses)
Best success rate: qa-tester (100.0%)
```

## Integration in Modes

### Ralph Mode with HUD

Ralph mode automatically:
1. Shows real-time progress for each step
2. Displays verification checks with visual feedback
3. Captures wisdom on success/failure
4. Saves session state to `.omc/state/`
5. Updates agent statistics

### Ultrapilot Mode with HUD

Ultrapilot mode automatically:
1. Shows skill composition in progress bar
2. Displays active agents during execution
3. Captures delegation opportunities as wisdom
4. Tracks performance optimizations
5. Saves metadata about skills used

## State File Structure

### Session State (.omc/state/ralph-1234567890.json)

```json
{
  "id": "ralph-1234567890",
  "mode": "ralph",
  "startTime": 1738395732000,
  "endTime": 1738395867000,
  "status": "completed",
  "totalCost": 0.0178,
  "agentsUsed": ["architect", "executor", "qa-tester", "security"],
  "tasks": [
    {
      "title": "Planning",
      "status": "completed",
      "agentName": "architect",
      "cost": 0.0023
    },
    {
      "title": "Implementation",
      "status": "completed",
      "agentName": "executor",
      "cost": 0.0067
    }
  ]
}
```

### Global State (~/.omc/state/global.json)

```json
{
  "totalExecutions": 47,
  "totalCost": 0.2489,
  "wisdomEntries": [
    {
      "id": "wisdom-1738395867-abc123",
      "timestamp": 1738395867000,
      "category": "success",
      "context": "Ralph mode completed successfully",
      "learning": "Task completed with all verifications passed",
      "tags": ["ralph", "verification", "success"],
      "relatedAgents": ["architect", "executor", "qa-tester", "security"]
    }
  ],
  "agentStats": {
    "architect": {
      "uses": 12,
      "successRate": 0.917,
      "averageCost": 0.0045
    }
  }
}
```

## CLI Usage

```bash
# Run with HUD (enabled by default)
omc ralph "Implement feature"

# View results
omc state sessions
omc state wisdom --category success
omc state stats

# Filter wisdom
omc state wisdom --tags ralph,optimization
omc state wisdom --category failure --limit 5

# Maintenance
omc state clean --days 30
```

## Benefits

### For Users
- **Immediate feedback** on task progress
- **Historical insights** from past executions
- **Performance tracking** per agent
- **Learning accumulation** over time

### For the System
- **Automatic optimization** through wisdom capture
- **Better agent selection** based on statistics
- **Failure pattern detection** from historical data
- **Cost optimization** through usage tracking

## Next Steps

The system will continue learning from every execution:
- Success patterns get reinforced
- Failures provide learning opportunities
- Optimizations get discovered and recorded
- Agent performance improves over time
