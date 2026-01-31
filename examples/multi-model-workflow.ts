/**
 * 多模型工作流範例
 * 
 * 展示如何在工作流中使用不同的模型
 */

import { 
  ArchitectAgent, 
  ExecutorAgent, 
  QATesterAgent,
  SecurityAgent,
  DesignerAgent 
} from '../src/agents/index.js';

// 範例 1: 完整的軟體開發工作流
async function fullDevelopmentWorkflow() {
  console.log('🔄 Multi-Model Development Workflow\n');
  console.log('='.repeat(50) + '\n');

  // 1. 架構階段 - 使用最強的模型進行規劃
  console.log('1️⃣  Architecture Phase (Claude Sonnet)');
  const architect = new ArchitectAgent('claude-3-5-sonnet-20241022');
  
  const architectResult = await architect.execute({
    task: 'Design a real-time chat application architecture'
  });
  
  console.log('✅ Architecture completed\n');

  // 2. 實作階段 - 使用快速且便宜的模型
  console.log('2️⃣  Implementation Phase (GPT-4o-mini)');
  const executor = new ExecutorAgent('gpt-4o-mini');
  
  const implementationResult = await executor.execute({
    task: 'Implement the chat application',
    previousResults: [architectResult]
  });
  
  console.log('✅ Implementation completed\n');

  // 3. 測試階段 - 使用具有高 context window 的模型
  console.log('3️⃣  Testing Phase (Gemini Flash)');
  const qaTester = new QATesterAgent('gemini-2.0-flash');
  
  const testingResult = await qaTester.execute({
    task: 'Create comprehensive tests',
    previousResults: [architectResult, implementationResult]
  });
  
  console.log('✅ Testing completed\n');

  // 4. 安全審查 - 使用專門的安全模型
  console.log('4️⃣  Security Review (GPT-4o)');
  const security = new SecurityAgent('gpt-4o');
  
  const securityResult = await security.execute({
    task: 'Review for security vulnerabilities',
    previousResults: [implementationResult]
  });
  
  console.log('✅ Security review completed\n');

  // 5. 文件階段 - 使用文檔專用模型
  console.log('5️⃣  Documentation Phase (GPT-4o-mini)');
  const designer = new DesignerAgent('gpt-4o-mini');
  
  const docsResult = await designer.execute({
    task: 'Generate user documentation',
    previousResults: [architectResult, implementationResult]
  });
  
  console.log('✅ Documentation completed\n');

  // 總結
  console.log('='.repeat(50));
  console.log('📊 Workflow Summary');
  console.log('='.repeat(50));
  console.log(`Total stages: 5`);
  console.log(`Models used: 4 different models`);
  console.log(`Total cost: $${calculateTotalCost([
    architectResult,
    implementationResult,
    testingResult,
    securityResult,
    docsResult
  ])}`);
}

// 範例 2: 成本優化工作流
async function costOptimizedWorkflow() {
  console.log('\n🔄 Cost-Optimized Workflow\n');
  console.log('='.repeat(50) + '\n');

  const task = 'Build a simple todo list API';

  // 策略：先用便宜的模型嘗試，失敗則升級
  const models = [
    { name: 'gemini-2.0-flash', cost: 'lowest' },
    { name: 'gpt-4o-mini', cost: 'low' },
    { name: 'gpt-4o', cost: 'medium' },
    { name: 'claude-3-5-sonnet-20241022', cost: 'high' }
  ];

  for (const model of models) {
    console.log(`Trying ${model.name} (${model.cost} cost)...`);
    
    try {
      const executor = new ExecutorAgent(model.name);
      const result = await executor.execute({ task });
      
      if (result.success && isQualityAcceptable(result.content)) {
        console.log(`✅ Success with ${model.name}`);
        console.log(`Cost: ${calculateCost(result.usage)}`);
        break;
      } else {
        console.log(`⚠️  Quality not acceptable, trying next model...`);
      }
    } catch (error) {
      console.log(`❌ Failed with ${model.name}, trying next...`);
    }
  }
}

// 範例 3: 並行多模型比較
async function parallelModelComparison() {
  console.log('\n🔄 Parallel Model Comparison\n');
  console.log('='.repeat(50) + '\n');

  const task = 'Explain recursion in simple terms';

  // 同時使用多個模型
  const models = [
    new ExecutorAgent('gpt-4o-mini'),
    new ExecutorAgent('claude-3-5-sonnet-20241022'),
    new ExecutorAgent('gemini-2.0-flash')
  ];

  console.log('Running task on 3 models in parallel...\n');

  const results = await Promise.all(
    models.map(async (agent, i) => {
      const startTime = Date.now();
      const result = await agent.execute({ task });
      const duration = Date.now() - startTime;
      
      return {
        model: agent.getConfig().model,
        result,
        duration
      };
    })
  );

  // 比較結果
  console.log('='.repeat(50));
  console.log('Results Comparison:');
  console.log('='.repeat(50));
  
  results.forEach((r, i) => {
    console.log(`\n${i + 1}. ${r.model}`);
    console.log(`   Duration: ${r.duration}ms`);
    console.log(`   Tokens: ${r.result.usage.totalTokens}`);
    console.log(`   Cost: ${calculateCost(r.result.usage)}`);
    console.log(`   Preview: ${r.result.content.substring(0, 100)}...`);
  });

  // 選擇最佳結果（可以基於成本、速度或質量）
  const best = results.reduce((best, current) => {
    return current.duration < best.duration ? current : best;
  });
  
  console.log(`\n🏆 Fastest model: ${best.model}`);
}

// 範例 4: 專業化模型分配
async function specializedModelAllocation() {
  console.log('\n🔄 Specialized Model Allocation\n');
  console.log('='.repeat(50) + '\n');

  const tasks = [
    { type: 'architecture', task: 'Design system', model: 'claude-3-5-sonnet-20241022' },
    { type: 'coding', task: 'Implement feature', model: 'gpt-4o-mini' },
    { type: 'review', task: 'Code review', model: 'gpt-4o' },
    { type: 'docs', task: 'Write docs', model: 'gpt-4o-mini' }
  ];

  for (const t of tasks) {
    console.log(`${t.type}: ${t.task} (using ${t.model})`);
    
    const executor = new ExecutorAgent(t.model);
    const result = await executor.execute({ task: t.task });
    
    console.log(`  ✅ Completed in ${result.executionTime}ms`);
    console.log(`  💰 Cost: ${calculateCost(result.usage)}\n`);
  }
}

// Helper functions
function calculateTotalCost(results: any[]): string {
  const total = results.reduce((sum, r) => {
    return sum + (r.usage ? calculateCostValue(r.usage) : 0);
  }, 0);
  return total.toFixed(4);
}

function calculateCost(usage: any): string {
  return `$${calculateCostValue(usage).toFixed(4)}`;
}

function calculateCostValue(usage: any): number {
  // Simple estimation - actual cost depends on model
  return (usage.promptTokens * 0.0000015 + usage.completionTokens * 0.000006);
}

function isQualityAcceptable(content: string): boolean {
  // Simple quality check - in practice, this would be more sophisticated
  return content.length > 100 && !content.includes('error');
}

async function main() {
  try {
    // 注意：這些範例需要設定多個 API keys
    // await fullDevelopmentWorkflow();
    // await costOptimizedWorkflow();
    // await parallelModelComparison();
    // await specializedModelAllocation();
    
    console.log('\n✅ Multi-model workflow examples ready!');
    console.log('\n註: 請取消註解函數並設定 API keys 來執行');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
