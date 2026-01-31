/**
 * Web API 整合範例
 * 
 * 展示如何使用 Web Server 和 WebSocket 功能
 */

import { startWebServer } from '../src/web/server.js';

async function webServerExample() {
  console.log('🌐 Web Server Example\n');
  console.log('='.repeat(50) + '\n');

  // 啟動 Web 伺服器
  const port = 3000;
  
  console.log(`Starting web server on port ${port}...`);
  console.log('\nAvailable endpoints:');
  console.log(`  - http://localhost:${port}/ - Dashboard`);
  console.log(`  - http://localhost:${port}/api/agents - List agents`);
  console.log(`  - http://localhost:${port}/api/tasks - Task management`);
  console.log(`  - http://localhost:${port}/api/analytics - Analytics data`);
  console.log(`  - ws://localhost:${port} - WebSocket for real-time updates`);
  
  console.log('\n按 Ctrl+C 停止伺服器\n');

  // 啟動伺服器
  await startWebServer(port);
}

// 範例 2: API 客戶端
async function apiClientExample() {
  console.log('\n🌐 API Client Example\n');
  console.log('='.repeat(50) + '\n');

  const baseUrl = 'http://localhost:3000';

  // 取得代理列表
  console.log('Fetching agents...');
  const agentsResponse = await fetch(`${baseUrl}/api/agents`);
  const agents = await agentsResponse.json();
  console.log('Agents:', agents);

  // 建立任務
  console.log('\nCreating task...');
  const createTaskResponse = await fetch(`${baseUrl}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Test Task',
      description: 'This is a test task',
      priority: 2
    })
  });
  const newTask = await createTaskResponse.json();
  console.log('Created task:', newTask);

  // 取得分析數據
  console.log('\nFetching analytics...');
  const analyticsResponse = await fetch(`${baseUrl}/api/analytics`);
  const analytics = await analyticsResponse.json();
  console.log('Analytics:', analytics);
}

// 範例 3: WebSocket 客戶端
async function websocketExample() {
  console.log('\n🌐 WebSocket Example\n');
  console.log('='.repeat(50) + '\n');

  const WebSocket = (await import('ws')).default;
  const ws = new WebSocket('ws://localhost:3000');

  ws.on('open', () => {
    console.log('✅ Connected to WebSocket server');
    
    // 訂閱事件
    ws.send(JSON.stringify({
      type: 'subscribe',
      events: ['task.created', 'task.completed', 'agent.started']
    }));
  });

  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📨 Received:', message);
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });

  ws.on('close', () => {
    console.log('👋 Disconnected from WebSocket server');
  });

  // 保持連接 10 秒
  setTimeout(() => {
    ws.close();
  }, 10000);
}

async function main() {
  // 注意：這些範例需要伺服器運行
  // 先運行: npm run web
  // 然後執行相應的範例
  
  try {
    // await webServerExample();     // 啟動伺服器
    // await apiClientExample();     // 需要伺服器運行
    // await websocketExample();     // 需要伺服器運行
    
    console.log('\n✅ Web integration examples ready!');
    console.log('\n使用方法:');
    console.log('  1. 啟動伺服器: npm run web');
    console.log('  2. 在另一個終端執行客戶端範例');
    console.log('\n註: 請取消註解函數來執行範例');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
