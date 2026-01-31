/**
 * 真實世界範例：建立完整的 REST API
 * 
 * 使用 Autopilot 模式自動完成：
 * 1. 架構設計
 * 2. 程式碼實作
 * 3. 測試撰寫
 * 4. 安全審查
 */

import { OhMyCopilot } from '../../src/oh-my-copilot.js';

async function buildRestAPI() {
  console.log('🚀 Building REST API with Oh My Copilot\n');
  console.log('='.repeat(50) + '\n');

  const omc = new OhMyCopilot({
    trackCosts: true,
    logLevel: 'info'
  });

  // 定義 API 需求
  const requirements = `
    Build a REST API for a Todo application with:
    
    ## Endpoints
    - GET /api/todos - List all todos
    - POST /api/todos - Create a todo
    - GET /api/todos/:id - Get a todo by ID
    - PUT /api/todos/:id - Update a todo
    - DELETE /api/todos/:id - Delete a todo
    
    ## Requirements
    - Use Express.js
    - Use TypeScript
    - Include input validation
    - Add error handling
    - Use in-memory storage (array)
    
    ## Todo Schema
    {
      id: string,
      title: string,
      completed: boolean,
      createdAt: Date,
      updatedAt: Date
    }
  `;

  try {
    // 執行 Autopilot 模式
    const result = await omc.autopilot(requirements, {
      framework: 'Express',
      language: 'TypeScript'
    });

    console.log('\n' + '='.repeat(50));
    console.log('📋 RESULTS');
    console.log('='.repeat(50) + '\n');

    // 顯示每個階段的結果
    if (result.results && result.results.length > 0) {
      result.results.forEach((r, i) => {
        const stages = ['🎯 Architecture', '⚙️ Implementation', '🧪 Testing', '🔒 Security'];
        console.log(`\n${stages[i] || `Step ${i + 1}`}`);
        console.log('-'.repeat(40));
        console.log(r.content.substring(0, 500) + '...\n');
      });
    }

    // 顯示統計
    console.log('\n' + '='.repeat(50));
    console.log('📊 STATISTICS');
    console.log('='.repeat(50));
    console.log(result.summary);
    console.log('\n' + omc.getCostReport());

  } catch (error) {
    console.error('Error:', error);
  } finally {
    omc.cleanup();
  }
}

// 執行範例
async function main() {
  try {
    // 注意：此範例需要設定 OpenAI API key
    // await buildRestAPI();
    
    console.log('\n✅ REST API build example ready!');
    console.log('\n註: 請取消註解 buildRestAPI() 並設定 API key 來執行');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
