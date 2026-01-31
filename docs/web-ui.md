# Web UI Usage Guide

## Overview

Oh My Copilot includes a modern, real-time web dashboard that provides a visual interface for monitoring and managing your multi-agent workflows. The Web UI offers live updates via WebSocket connections, comprehensive task management, agent monitoring, and cost analytics.

**Key Features:**
- 📊 Real-time dashboard with live metrics
- 📋 Full task lifecycle management (create, view, filter, update, delete)
- 🤖 Agent status monitoring and performance tracking
- 💰 Cost analysis and token usage analytics
- 🔌 WebSocket real-time updates
- 🎨 Clean, responsive interface
- 🔄 Auto-refresh capabilities

## Getting Started

### How to Launch

Start the Web UI using the CLI command:

```bash
omc web
```

By default, the server starts on port 3000. To specify a custom port:

```bash
omc web --port 8080
```

Once started, you'll see:

```
🌐 Web UI running at http://localhost:3000
📊 Dashboard: http://localhost:3000
🔌 WebSocket: ws://localhost:3000
```

Open your browser and navigate to `http://localhost:3000` to access the dashboard.

### Connection Status

The Web UI maintains a WebSocket connection for real-time updates. The connection status is displayed in the header:

- 🟢 **Connected** (green dot): WebSocket connection is active
- 🔴 **Disconnected** (red dot): WebSocket connection is lost (automatic reconnection will be attempted)

## Dashboard Features

The main dashboard provides an at-a-glance view of your system's current state.

### Overview Statistics

Four key metrics are displayed as stat cards:

1. **Total Tasks** (📋): Total number of tasks in the system
2. **Active Agents** (🤖): Number of agents currently processing tasks
3. **Total Cost** (💰): Cumulative cost across all operations
4. **Success Rate** (✅): Percentage of successfully completed tasks

*These statistics update automatically every 30 seconds and in real-time via WebSocket when changes occur.*

### Recent Tasks Preview

Shows the most recent tasks with their current status. Click on any task to view full details.

### Agent Status Preview

Displays a quick overview of all available agents and their current operational status:
- **Idle**: Agent is available for new tasks
- **Active**: Agent is currently processing a task
- **Busy**: Agent is at capacity

## Tasks Section

The Tasks section provides comprehensive task management capabilities.

### Viewing Tasks

Access the Tasks section by clicking "Tasks" in the navigation menu. The task list displays:

- Task title and description
- Current status (pending, in_progress, completed, failed)
- Priority level (low, medium, high)
- Assigned agent
- Creation and update timestamps

### Creating Tasks

To create a new task:

1. Click the **"+ New Task"** button
2. Fill in the task details:
   - **Title** (required): Short descriptive title
   - **Description** (optional): Detailed task information
   - **Priority**: Select Low, Medium, or High
   - **Assign Agent**: Choose from available agents:
     - Executor: Code implementation
     - Architect: Strategic planning and system design
     - QA Tester: Testing and quality assurance
     - Security: Security review and vulnerability detection
     - Designer: UI/UX design
3. Click **"Create Task"** to submit

The new task will appear immediately in the task list with status "pending".

### Filtering Tasks

Use the status filter dropdown to view specific task categories:

- **All Tasks**: Shows all tasks regardless of status
- **Pending**: Tasks waiting to be processed
- **In Progress**: Tasks currently being executed
- **Completed**: Successfully finished tasks
- **Failed**: Tasks that encountered errors

The filter updates the task list instantly without page refresh.

### Managing Tasks

Each task in the list supports the following actions:

- **View Details**: Click on a task to see full information
- **Update Status**: Modify task status via the API
- **Edit Details**: Update title, description, priority, or assigned agent
- **Delete**: Remove tasks from the system

### Refresh Button

Click the **"🔄 Refresh"** button to manually reload the task list and get the latest updates from the server.

## Agents Section

The Agents section provides detailed information about all available agents in the system.

### Agent Information Display

Each agent card shows:

- **Display Name**: Human-readable agent name
- **Model**: The AI model being used (e.g., gpt-4o, gpt-4o-mini)
- **Status**: Current operational state (idle, active, busy)
- **Description**: Agent's primary function and capabilities
- **Tasks Completed**: Total number of tasks processed
- **Total Cost**: Cumulative cost for this agent's operations

### Available Agents

The system includes five specialized agents:

1. **Architect Agent**
   - Model: gpt-4o
   - Purpose: Strategic planning and system design

2. **Executor Agent**
   - Model: gpt-4o-mini
   - Purpose: Code implementation

3. **QA Tester Agent**
   - Model: gpt-4o-mini
   - Purpose: Testing and quality assurance

4. **Security Agent**
   - Model: gpt-4o
   - Purpose: Security review and vulnerability detection

5. **Designer Agent**
   - Model: gpt-4o
   - Purpose: UI/UX design

### Real-time Agent Updates

Agent status updates automatically via WebSocket when:
- An agent starts processing a task
- An agent completes a task
- An agent becomes idle

## Analytics Section

The Analytics section provides detailed cost tracking and performance metrics.

### Cost Overview

Track your API usage costs with detailed breakdowns:

**By Model:**
- gpt-4o costs
- gpt-4o-mini costs
- Total across all models

**By Agent:**
- Individual cost tracking for each agent
- Identify which agents consume the most resources

**Cost History:**
- Time-series data of costs
- Filter by time period:
  - Last 1 hour
  - Last 24 hours
  - Last 7 days

### Performance Metrics

Monitor system performance with key indicators:

- **Total Requests**: Number of API calls made
- **Total Tokens**: Cumulative token usage
- **Average Response Time**: Mean response time across all requests
- **Success Rate**: Percentage of successful operations

### Dashboard Data

The analytics dashboard endpoint (`/api/analytics/dashboard`) provides a complete snapshot of all analytics data in a single request, useful for comprehensive reporting.

## WebSocket Real-Time Updates

The Web UI uses WebSocket connections for instant updates without polling.

### Message Types

The system broadcasts the following message types:

1. **task_update**: Notifies when task status changes
   - Includes: taskId, new status, timestamp
   
2. **agent_status**: Updates agent operational state
   - Includes: agentName, status, timestamp
   
3. **cost_update**: Reports new costs incurred
   - Includes: cost amount, tokens used, model
   
4. **error**: Broadcasts system errors
   - Includes: error message, details
   
5. **ping**: Keep-alive messages (every 30 seconds)
   - Maintains connection health

### Automatic Reconnection

If the WebSocket connection is lost:
- The connection status indicator turns red
- The system automatically attempts to reconnect
- Upon reconnection, data is refreshed from the server

### Real-time Features

With WebSocket enabled, the UI updates instantly when:
- Tasks are created, updated, or completed
- Agents change status
- New costs are recorded
- Errors occur in the system

## API Endpoints

The Web UI connects to a RESTful API. All endpoints are prefixed with `/api`.

### Health Check

```
GET /api/health
```
Returns server status and version information.

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1234567890,
  "version": "0.1.0"
}
```

### Task Endpoints

#### Get Task Statistics
```
GET /api/tasks/stats
```
Returns aggregate task statistics.

**Response:**
```json
{
  "total": 10,
  "pending": 2,
  "in_progress": 3,
  "completed": 4,
  "failed": 1,
  "success_rate": "40.0%"
}
```

#### List Tasks
```
GET /api/tasks?status=<status>&limit=<limit>&offset=<offset>
```
Returns paginated task list with optional status filter.

**Query Parameters:**
- `status` (optional): Filter by status (pending, in_progress, completed, failed)
- `limit` (optional): Number of results per page (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "tasks": [...],
  "total": 50,
  "limit": 100,
  "offset": 0
}
```

#### Create Task
```
POST /api/tasks
```
Creates a new task.

**Request Body:**
```json
{
  "title": "Implement feature X",
  "description": "Add new functionality...",
  "priority": "high",
  "agent": "executor"
}
```

**Response:** Returns the created task object with status 201.

#### Get Task Details
```
GET /api/tasks/:id
```
Returns detailed information for a specific task.

#### Update Task
```
PATCH /api/tasks/:id
```
Updates task properties.

**Request Body:** (partial update supported)
```json
{
  "status": "completed",
  "priority": "low"
}
```

#### Delete Task
```
DELETE /api/tasks/:id
```
Removes a task from the system.

### Agent Endpoints

#### List Agents
```
GET /api/agents
```
Returns all available agents.

**Response:**
```json
{
  "agents": [...],
  "total": 5,
  "active": 2
}
```

#### Get Agent Details
```
GET /api/agents/:name
```
Returns detailed information for a specific agent.

#### Get Agent Status
```
GET /api/agents/:name/status
```
Returns current status of an agent.

**Response:**
```json
{
  "name": "executor",
  "status": "idle",
  "model": "gpt-4o-mini",
  "timestamp": 1234567890
}
```

### Analytics Endpoints

#### Get Cost Analysis
```
GET /api/analytics/costs?period=<period>
```
Returns cost breakdown with optional time period filter.

**Query Parameters:**
- `period` (optional): Time period (1h, 24h, 7d) - default: 24h

**Response:**
```json
{
  "total": 5.25,
  "by_model": {
    "gpt-4o": 3.50,
    "gpt-4o-mini": 1.75
  },
  "by_agent": {
    "architect": 2.00,
    "executor": 1.50,
    ...
  },
  "history": [...],
  "period": "24h"
}
```

#### Get Performance Metrics
```
GET /api/analytics/metrics
```
Returns system performance metrics.

**Response:**
```json
{
  "total_requests": 1000,
  "total_tokens": 50000,
  "avg_response_time": 250,
  "success_rate": 95.5
}
```

#### Get Dashboard Data
```
GET /api/analytics/dashboard
```
Returns complete analytics snapshot.

**Response:**
```json
{
  "costs": {...},
  "metrics": {...},
  "timestamp": 1234567890
}
```

## Tips for Using the Web UI

### 1. Monitor Real-Time Updates
Keep the dashboard open to watch tasks progress in real-time. The WebSocket connection ensures you see updates immediately without refreshing.

### 2. Use Filters Effectively
When managing many tasks, use the status filter to focus on specific categories. This is especially useful for monitoring in-progress tasks or reviewing failures.

### 3. Cost Tracking
Regularly check the Analytics section to monitor API costs. Use the time period filters to analyze spending patterns over different timeframes.

### 4. Agent Assignment
Choose the appropriate agent for each task:
- Use **Architect** for high-level design and planning
- Use **Executor** for implementation tasks (cost-effective with gpt-4o-mini)
- Use **Security** for security-critical reviews
- Use **QA Tester** for testing and validation
- Use **Designer** for UI/UX work

### 5. Priority Management
Set task priorities appropriately:
- **High**: Critical tasks requiring immediate attention
- **Medium**: Standard tasks in the normal queue
- **Low**: Nice-to-have tasks that can wait

### 6. Refresh Strategy
The UI auto-refreshes every 30 seconds, but you can manually refresh at any time using the refresh button when you need immediate updates.

### 7. Browser Compatibility
For the best experience, use modern browsers (Chrome, Firefox, Edge, Safari) with WebSocket support.

### 8. Multiple Sessions
You can open multiple browser tabs/windows to the dashboard. All instances will receive real-time updates simultaneously via WebSocket.

### 9. Network Issues
If you experience disconnections:
- Check the connection status indicator in the header
- The system will automatically attempt to reconnect
- Manual page refresh will re-establish connections if auto-reconnect fails

### 10. API Integration
The Web UI is built on a RESTful API that you can also access programmatically. Use the documented endpoints to integrate with your own tools and scripts.

## Screenshots

*Note: Screenshots would be captured at the following key sections:*

1. **Dashboard Overview** - Showing the main statistics cards and recent activity
2. **Tasks List** - Displaying the task management interface with filters
3. **New Task Modal** - The task creation form
4. **Agents Grid** - Agent status cards with model and performance info
5. **Analytics Charts** - Cost breakdown and performance metrics
6. **WebSocket Connection Status** - Header showing active connection
7. **Mobile View** - Responsive design on smaller screens

## Troubleshooting

### WebSocket Won't Connect
- Verify the server is running (`omc web`)
- Check firewall settings aren't blocking WebSocket connections
- Ensure you're accessing via the correct URL (check protocol http vs https)

### Tasks Not Updating
- Check the WebSocket connection status
- Try manual refresh using the refresh button
- Verify API endpoints are accessible at `/api/health`

### High Memory Usage
- Large task lists can consume memory
- Use filters to reduce visible items
- Consider archiving old completed tasks

### Slow Performance
- Disable auto-refresh if monitoring many tasks
- Use pagination when listing tasks
- Check network latency to the server

---

For more information about Oh My Copilot, see the [main README](../README.md) or visit the [GitHub repository](https://github.com/odpilot/oh-my-copilot).
