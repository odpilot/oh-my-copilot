/**
 * 成本優化範例
 * 
 * 展示如何有效控制 API 成本
 */

import { OhMyCopilot } from '../src/oh-my-copilot.js';

// 範例 1: 使用 Ecomode 節省成本
async function ecomodeExample() {
  console.log('=== Ecomode: Cost-Optimized Execution ===\n');
  
  const omc = new OhMyCopilot({ trackCosts: true });

  // Ecomode 自動使用便宜的 mini 模型
  const result = await omc.eco('Add input validation to the form', {
    maxCostThreshold: 0.05  // 設定成本上限 $0.05
  });

  console.log(`Task completed: ${result.success}`);
  console.log(`Total cost: $${result.totalCost.toFixed(4)}`);
  console.log(`Cost savings: $${result.costSavings?.toFixed(4) || '0.0000'} (compared to premium models)`);
  
  omc.cleanup();
}

// 範例 2: 模型別名快速切換
async function modelAliasExample() {
  console.log('\n=== Model Aliases ===\n');
  
  // 在 omc.config.json 中配置別名:
  // {
  //   "models": {
  //     "aliases": {
  //       "fast": "gpt-4o-mini",
  //       "smart": "gpt-4o",
  //       "cheap": "gemini-2.0-flash"
  //     }
  //   }
  // }

  const omc = new OhMyCopilot({
    defaultModel: 'gpt-4o-mini',  // 使用快速模型
    trackCosts: true
  });

  const result = await omc.run('Quick task using fast model');
  console.log(omc.getCostReport());
  
  omc.cleanup();
}

// 範例 3: 批次處理降低成本
async function batchProcessing() {
  console.log('\n=== Batch Processing ===\n');
  
  const omc = new OhMyCopilot({ trackCosts: true });

  // 使用 Ultrawork 批次處理，共享上下文
  const tasks = [
    'Add email validation',
    'Add phone validation', 
    'Add address validation'
  ].map(task => ({
    title: task,
    description: task
  }));

  const result = await omc.ultra(tasks, 3);
  
  console.log(`Processed ${tasks.length} tasks`);
  console.log(`Total cost: $${result.totalCost.toFixed(4)}`);
  console.log(`Cost per task: $${(result.totalCost / tasks.length).toFixed(4)}`);
  
  omc.cleanup();
}

// 範例 4: 成本報告分析
async function costAnalysis() {
  console.log('\n=== Cost Analysis ===\n');
  
  const omc = new OhMyCopilot({ trackCosts: true });

  // 執行幾個任務
  await omc.autopilot('Build a simple calculator');
  await omc.eco('Add documentation');

  // 取得詳細成本報告
  console.log(omc.getCostReport());

  // 取得結構化數據
  const dashboard = omc.getDashboard();
  const data = dashboard.getData();
  
  console.log('\nCost breakdown:');
  console.log(JSON.stringify(data.costs, null, 2));
  
  omc.cleanup();
}

// 範例 5: 成本限制與監控
async function costLimitsExample() {
  console.log('\n=== Cost Limits & Monitoring ===\n');
  
  const omc = new OhMyCopilot({ 
    trackCosts: true,
    maxTotalCost: 1.00  // 設定最大總成本 $1.00
  });

  try {
    // 執行任務，自動監控成本
    await omc.run('Simple task 1');
    console.log('Current cost:', omc.getCurrentCost());
    
    await omc.run('Simple task 2');
    console.log('Current cost:', omc.getCurrentCost());
    
    // 如果超過成本限制，會拋出錯誤
  } catch (error) {
    console.error('Cost limit exceeded:', error.message);
  }
  
  console.log('\nFinal cost report:');
  console.log(omc.getCostReport());
  
  omc.cleanup();
}

async function main() {
  try {
    // await ecomodeExample();
    // await modelAliasExample();
    // await batchProcessing();
    // await costAnalysis();
    // await costLimitsExample();
    
    console.log('\n✅ Cost optimization examples completed!');
    console.log('\n註: 請取消註解要執行的範例');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
