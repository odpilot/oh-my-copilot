/**
 * Oh My Copilot Dashboard - Frontend Application
 */

// API Base URL
const API_BASE = window.location.origin + '/api';

// WebSocket connection
let ws = null;
let wsReconnectTimer = null;

// State
const state = {
  tasks: [],
  agents: [],
  analytics: {},
  currentSection: 'dashboard'
};

/**
 * Initialize the application
 */
function init() {
  setupNavigation();
  setupWebSocket();
  setupEventListeners();
  loadInitialData();
  
  // Auto-refresh every 30 seconds
  setInterval(() => {
    if (state.currentSection === 'dashboard') {
      loadDashboardData();
    } else if (state.currentSection === 'tasks') {
      loadTasks();
    } else if (state.currentSection === 'agents') {
      loadAgents();
    } else if (state.currentSection === 'analytics') {
      loadAnalytics();
    }
  }, 30000);
}

/**
 * Setup navigation
 */
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all links and sections
      navLinks.forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      
      // Add active class to clicked link
      link.classList.add('active');
      
      // Show corresponding section
      const sectionId = link.dataset.section;
      const section = document.getElementById(sectionId);
      if (section) {
        section.classList.add('active');
        state.currentSection = sectionId;
        
        // Load section data
        if (sectionId === 'tasks') {
          loadTasks();
        } else if (sectionId === 'agents') {
          loadAgents();
        } else if (sectionId === 'analytics') {
          loadAnalytics();
        } else if (sectionId === 'dashboard') {
          loadDashboardData();
        }
      }
    });
  });
}

/**
 * Setup WebSocket connection
 */
function setupWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}`;
  
  try {
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      updateConnectionStatus(true);
      
      // Clear reconnect timer
      if (wsReconnectTimer) {
        clearTimeout(wsReconnectTimer);
        wsReconnectTimer = null;
      }
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      updateConnectionStatus(false);
      
      // Attempt to reconnect after 5 seconds
      wsReconnectTimer = setTimeout(() => {
        console.log('Attempting to reconnect WebSocket...');
        setupWebSocket();
      }, 5000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      updateConnectionStatus(false);
    };
  } catch (error) {
    console.error('Failed to create WebSocket:', error);
    updateConnectionStatus(false);
  }
}

/**
 * Handle WebSocket messages
 */
function handleWebSocketMessage(message) {
  console.log('WebSocket message:', message);
  
  switch (message.type) {
    case 'task_update':
      handleTaskUpdate(message.data);
      break;
    case 'agent_status':
      handleAgentStatus(message.data);
      break;
    case 'cost_update':
      handleCostUpdate(message.data);
      break;
    case 'error':
      handleError(message.data);
      break;
  }
}

/**
 * Handle task update from WebSocket
 */
function handleTaskUpdate(data) {
  // Reload tasks if on tasks page
  if (state.currentSection === 'tasks') {
    loadTasks();
  }
  // Update dashboard
  loadDashboardData();
}

/**
 * Handle agent status update
 */
function handleAgentStatus(data) {
  if (state.currentSection === 'agents') {
    loadAgents();
  }
}

/**
 * Handle cost update
 */
function handleCostUpdate(data) {
  if (state.currentSection === 'analytics' || state.currentSection === 'dashboard') {
    loadAnalytics();
  }
}

/**
 * Handle error notification
 */
function handleError(data) {
  console.error('Error notification:', data);
  showNotification('Error: ' + data.error, 'error');
}

/**
 * Update WebSocket connection status
 */
function updateConnectionStatus(connected) {
  const statusDot = document.getElementById('ws-status');
  const statusText = document.getElementById('ws-text');
  
  if (connected) {
    statusDot.className = 'status-dot online';
    statusText.textContent = 'Connected';
  } else {
    statusDot.className = 'status-dot offline';
    statusText.textContent = 'Disconnected';
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // New Task Button
  document.getElementById('new-task-btn').addEventListener('click', () => {
    showModal('new-task-modal');
  });
  
  // Task Filter
  document.getElementById('task-filter').addEventListener('change', (e) => {
    loadTasks(e.target.value);
  });
  
  // Refresh Tasks
  document.getElementById('refresh-tasks-btn').addEventListener('click', () => {
    loadTasks();
  });
  
  // Modal Close
  document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      closeModal(e.target.closest('.modal').id);
    });
  });
  
  // Cancel Task Button
  document.getElementById('cancel-task-btn').addEventListener('click', () => {
    closeModal('new-task-modal');
  });
  
  // New Task Form
  document.getElementById('new-task-form').addEventListener('submit', handleNewTask);
  
  // Close modal on outside click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      closeModal(e.target.id);
    }
  });
}

/**
 * Load initial data
 */
function loadInitialData() {
  loadDashboardData();
}

/**
 * Load dashboard data
 */
async function loadDashboardData() {
  try {
    // Load task stats
    const statsRes = await fetch(`${API_BASE}/tasks/stats`);
    const stats = await statsRes.json();
    
    document.getElementById('total-tasks').textContent = stats.total;
    document.getElementById('success-rate').textContent = stats.success_rate;
    
    // Load agents
    const agentsRes = await fetch(`${API_BASE}/agents`);
    const agentsData = await agentsRes.json();
    document.getElementById('active-agents').textContent = agentsData.active;
    
    // Load analytics
    const analyticsRes = await fetch(`${API_BASE}/analytics/dashboard`);
    const analyticsData = await analyticsRes.json();
    document.getElementById('total-cost').textContent = `$${analyticsData.costs.total.toFixed(2)}`;
    
    // Load recent tasks preview
    loadRecentTasks();
    
    // Load agent status preview
    loadAgentStatusPreview(agentsData.agents);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
}

/**
 * Load recent tasks for dashboard
 */
async function loadRecentTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks?limit=5`);
    const data = await res.json();
    
    const container = document.getElementById('recent-tasks');
    
    if (data.tasks.length === 0) {
      container.innerHTML = '<p class="empty-state">No tasks yet</p>';
      return;
    }
    
    container.innerHTML = data.tasks.map(task => `
      <div class="task-item-preview">
        <div class="task-status status-${task.status}"></div>
        <div class="task-info">
          <div class="task-title">${escapeHtml(task.title)}</div>
          <div class="task-meta">${task.agent} • ${task.priority}</div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load recent tasks:', error);
  }
}

/**
 * Load agent status preview for dashboard
 */
function loadAgentStatusPreview(agents) {
  const container = document.getElementById('agent-status-preview');
  
  container.innerHTML = agents.slice(0, 5).map(agent => `
    <div class="agent-item-preview">
      <div class="agent-status status-${agent.status}"></div>
      <div class="agent-info">
        <div class="agent-name">${agent.displayName}</div>
        <div class="agent-meta">${agent.model}</div>
      </div>
    </div>
  `).join('');
}

/**
 * Load tasks
 */
async function loadTasks(status = 'all') {
  try {
    const url = status === 'all' 
      ? `${API_BASE}/tasks`
      : `${API_BASE}/tasks?status=${status}`;
    
    const res = await fetch(url);
    const data = await res.json();
    state.tasks = data.tasks;
    
    renderTasks();
  } catch (error) {
    console.error('Failed to load tasks:', error);
    showNotification('Failed to load tasks', 'error');
  }
}

/**
 * Render tasks list
 */
function renderTasks() {
  const container = document.getElementById('task-list');
  
  if (state.tasks.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No tasks found</p></div>';
    return;
  }
  
  container.innerHTML = state.tasks.map(task => `
    <div class="task-card" data-task-id="${task.id}">
      <div class="task-header">
        <h3>${escapeHtml(task.title)}</h3>
        <span class="task-badge status-${task.status}">${task.status.replace('_', ' ')}</span>
      </div>
      <div class="task-body">
        <p>${escapeHtml(task.description || 'No description')}</p>
        <div class="task-meta-row">
          <span class="task-meta-item">🤖 ${task.agent}</span>
          <span class="task-meta-item">⚡ ${task.priority}</span>
          <span class="task-meta-item">📅 ${new Date(task.created_at).toLocaleString()}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn btn-sm btn-secondary" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

/**
 * Load agents
 */
async function loadAgents() {
  try {
    const res = await fetch(`${API_BASE}/agents`);
    const data = await res.json();
    state.agents = data.agents;
    
    renderAgents();
  } catch (error) {
    console.error('Failed to load agents:', error);
    showNotification('Failed to load agents', 'error');
  }
}

/**
 * Render agents grid
 */
function renderAgents() {
  const container = document.getElementById('agent-list');
  
  container.innerHTML = state.agents.map(agent => `
    <div class="agent-card">
      <div class="agent-header">
        <h3>${agent.displayName}</h3>
        <span class="agent-badge status-${agent.status}">${agent.status}</span>
      </div>
      <div class="agent-body">
        <p>${agent.description}</p>
        <div class="agent-stats">
          <div class="agent-stat">
            <span class="agent-stat-label">Model</span>
            <span class="agent-stat-value">${agent.model}</span>
          </div>
          <div class="agent-stat">
            <span class="agent-stat-label">Tasks</span>
            <span class="agent-stat-value">${agent.tasksCompleted}</span>
          </div>
          <div class="agent-stat">
            <span class="agent-stat-label">Cost</span>
            <span class="agent-stat-value">$${agent.totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Load analytics
 */
async function loadAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/analytics/dashboard`);
    const data = await res.json();
    state.analytics = data;
    
    renderAnalytics();
  } catch (error) {
    console.error('Failed to load analytics:', error);
    showNotification('Failed to load analytics', 'error');
  }
}

/**
 * Render analytics
 */
function renderAnalytics() {
  // Cost Breakdown
  const costContainer = document.getElementById('cost-breakdown');
  const costs = state.analytics.costs;
  
  costContainer.innerHTML = `
    <div class="analytics-stat">
      <span class="analytics-label">Total Cost</span>
      <span class="analytics-value">$${costs.total.toFixed(4)}</span>
    </div>
    <div class="analytics-section">
      <h4>By Model</h4>
      ${Object.entries(costs.by_model).map(([model, cost]) => `
        <div class="analytics-item">
          <span>${model}</span>
          <span>$${cost.toFixed(4)}</span>
        </div>
      `).join('')}
    </div>
    <div class="analytics-section">
      <h4>By Agent</h4>
      ${Object.entries(costs.by_agent).map(([agent, cost]) => `
        <div class="analytics-item">
          <span>${agent}</span>
          <span>$${cost.toFixed(4)}</span>
        </div>
      `).join('')}
    </div>
  `;
  
  // Metrics
  const metricsContainer = document.getElementById('metrics-content');
  const metrics = state.analytics.metrics;
  
  metricsContainer.innerHTML = `
    <div class="analytics-stat">
      <span class="analytics-label">Total Requests</span>
      <span class="analytics-value">${metrics.total_requests}</span>
    </div>
    <div class="analytics-stat">
      <span class="analytics-label">Total Tokens</span>
      <span class="analytics-value">${metrics.total_tokens.toLocaleString()}</span>
    </div>
    <div class="analytics-stat">
      <span class="analytics-label">Avg Response Time</span>
      <span class="analytics-value">${metrics.avg_response_time}ms</span>
    </div>
    <div class="analytics-stat">
      <span class="analytics-label">Success Rate</span>
      <span class="analytics-value">${metrics.success_rate}%</span>
    </div>
  `;
}

/**
 * Handle new task form submission
 */
async function handleNewTask(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const taskData = {
    title: formData.get('title'),
    description: formData.get('description'),
    priority: formData.get('priority'),
    agent: formData.get('agent')
  };
  
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    
    if (!res.ok) {
      throw new Error('Failed to create task');
    }
    
    const newTask = await res.json();
    
    showNotification('Task created successfully!', 'success');
    closeModal('new-task-modal');
    e.target.reset();
    
    // Reload tasks if on tasks page
    if (state.currentSection === 'tasks') {
      loadTasks();
    }
    loadDashboardData();
  } catch (error) {
    console.error('Failed to create task:', error);
    showNotification('Failed to create task', 'error');
  }
}

/**
 * Delete a task
 */
async function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }
  
  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    
    if (!res.ok) {
      throw new Error('Failed to delete task');
    }
    
    showNotification('Task deleted successfully!', 'success');
    loadTasks();
    loadDashboardData();
  } catch (error) {
    console.error('Failed to delete task:', error);
    showNotification('Failed to delete task', 'error');
  }
}

/**
 * Show modal
 */
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
  }
}

/**
 * Close modal
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  // Simple console notification for now
  // Can be enhanced with toast notifications
  console.log(`[${type.toUpperCase()}] ${message}`);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
