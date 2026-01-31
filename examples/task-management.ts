/**
 * 任務池管理範例
 * 
 * 展示 SQLite 任務池的完整功能
 */

import { TaskPool } from '../src/tasks/task-pool.js';
import { TaskPriority, TaskStatus } from '../src/tasks/task-types.js';

async function taskManagementExample() {
  console.log('=== Task Pool Management ===\n');

  // 初始化任務池 (使用檔案持久化)
  const taskPool = new TaskPool('./my-tasks.db');

  // 建立多個任務
  console.log('Creating tasks...\n');
  
  const task1 = taskPool.createTask({
    title: 'Implement user login',
    description: 'Create login endpoint with JWT',
    priority: TaskPriority.HIGH
  });

  const task2 = taskPool.createTask({
    title: 'Add password reset',
    description: 'Implement password reset flow',
    priority: TaskPriority.MEDIUM
  });

  const task3 = taskPool.createTask({
    title: 'Update documentation',
    description: 'Update API docs',
    priority: TaskPriority.LOW
  });

  console.log(`Created ${3} tasks\n`);

  // 查看統計
  console.log('Task Statistics:');
  const stats = taskPool.getStats();
  console.log(`  Total: ${stats.total}`);
  console.log(`  Pending: ${stats.pending}`);
  console.log(`  Completed: ${stats.completed}\n`);

  // 認領任務 (原子操作)
  console.log('Claiming tasks...\n');
  
  const claimed = taskPool.claimTask('agent-executor-1');
  if (claimed) {
    console.log(`Agent claimed: "${claimed.title}" (Priority: ${claimed.priority})`);
    
    // 模擬處理
    taskPool.updateTask(claimed.id, {
      status: TaskStatus.IN_PROGRESS
    });
    
    // 完成任務
    taskPool.updateTask(claimed.id, {
      status: TaskStatus.COMPLETED,
      result: 'Login endpoint implemented successfully'
    });
  }

  // 列出所有任務
  console.log('\nAll Tasks:');
  const allTasks = taskPool.getTasks();
  allTasks.forEach(task => {
    console.log(`  [${task.status.toUpperCase()}] ${task.title}`);
  });

  // 過濾任務
  console.log('\nPending Tasks:');
  const pendingTasks = taskPool.getTasks({ status: TaskStatus.PENDING });
  pendingTasks.forEach(task => {
    console.log(`  - ${task.title}`);
  });

  // 最終統計
  console.log('\nFinal Statistics:');
  const finalStats = taskPool.getStats();
  console.log(`  Completed: ${finalStats.completed}/${finalStats.total}`);

  // 清理
  taskPool.close();
}

// 範例 2: 多個代理同時處理任務
async function multiAgentExample() {
  console.log('\n=== Multi-Agent Task Processing ===\n');

  const taskPool = new TaskPool(':memory:');

  // 建立多個任務
  for (let i = 1; i <= 10; i++) {
    taskPool.createTask({
      title: `Task ${i}`,
      description: `Process item ${i}`,
      priority: i % 3 === 0 ? TaskPriority.HIGH : TaskPriority.MEDIUM
    });
  }

  // 模擬多個代理認領任務
  const agents = ['agent-1', 'agent-2', 'agent-3'];
  
  console.log('Agents claiming tasks:\n');
  
  for (const agent of agents) {
    const task = taskPool.claimTask(agent);
    if (task) {
      console.log(`${agent} claimed: ${task.title}`);
      
      // 模擬處理並完成
      setTimeout(() => {
        taskPool.updateTask(task.id, {
          status: TaskStatus.COMPLETED,
          result: `Processed by ${agent}`
        });
      }, 100);
    }
  }

  // 等待處理完成
  await new Promise(resolve => setTimeout(resolve, 200));

  // 顯示結果
  console.log('\nTask Status:');
  const stats = taskPool.getStats();
  console.log(`  Completed: ${stats.completed}`);
  console.log(`  Pending: ${stats.pending}`);

  taskPool.close();
}

// 範例 3: 任務優先級管理
async function priorityExample() {
  console.log('\n=== Task Priority Management ===\n');

  const taskPool = new TaskPool(':memory:');

  // 建立不同優先級的任務
  taskPool.createTask({
    title: 'Low priority task',
    description: 'Can wait',
    priority: TaskPriority.LOW
  });

  taskPool.createTask({
    title: 'Critical bug fix',
    description: 'Fix ASAP',
    priority: TaskPriority.CRITICAL
  });

  taskPool.createTask({
    title: 'Medium priority feature',
    description: 'New feature',
    priority: TaskPriority.MEDIUM
  });

  // 認領任務 - 應該先取得 CRITICAL
  console.log('Claiming tasks by priority:\n');
  
  for (let i = 0; i < 3; i++) {
    const task = taskPool.claimTask(`agent-${i + 1}`);
    if (task) {
      console.log(`  ${i + 1}. ${task.title} (Priority: ${task.priority})`);
    }
  }

  taskPool.close();
}

// 範例 4: 任務元數據和篩選
async function metadataExample() {
  console.log('\n=== Task Metadata & Filtering ===\n');

  const taskPool = new TaskPool(':memory:');

  // 建立帶有元數據的任務
  taskPool.createTask({
    title: 'Process user data',
    description: 'Handle user uploads',
    priority: TaskPriority.HIGH,
    metadata: {
      type: 'data-processing',
      user: 'user-123',
      files: ['file1.csv', 'file2.csv']
    }
  });

  taskPool.createTask({
    title: 'Send notification',
    description: 'Email notification',
    priority: TaskPriority.MEDIUM,
    metadata: {
      type: 'notification',
      recipients: ['user@example.com']
    }
  });

  // 查詢所有任務並檢查元數據
  const tasks = taskPool.getTasks();
  
  console.log('Tasks with metadata:\n');
  tasks.forEach(task => {
    console.log(`  ${task.title}`);
    console.log(`    Metadata:`, JSON.stringify(task.metadata, null, 4));
  });

  taskPool.close();
}

async function main() {
  try {
    await taskManagementExample();
    await multiAgentExample();
    await priorityExample();
    await metadataExample();
    
    console.log('\n✅ All task management examples completed!');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
