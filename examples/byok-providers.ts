/**
 * BYOK (Bring Your Own Key) 多提供商範例
 * 
 * 展示如何配置和使用不同的 AI 提供商
 */

import { OhMyCopilot } from '../src/oh-my-copilot.js';
import { 
  ArchitectAgent, 
  ExecutorAgent,
  QATesterAgent 
} from '../src/agents/index.js';

// 範例 1: 使用 OpenAI
async function useOpenAI() {
  console.log('=== Using OpenAI ===\n');
  
  const omc = new OhMyCopilot({
    defaultProvider: 'openai',
    defaultModel: 'gpt-4o-mini',
    trackCosts: true
  });

  const result = await omc.run('Create a hello world function');
  console.log(result.summary);
  console.log(omc.getCostReport());
  
  omc.cleanup();
}

// 範例 2: 使用 Anthropic Claude
async function useAnthropic() {
  console.log('\n=== Using Anthropic Claude ===\n');
  
  const omc = new OhMyCopilot({
    defaultProvider: 'anthropic',
    defaultModel: 'claude-3-5-sonnet-20241022',
    trackCosts: true
  });

  const result = await omc.run('Explain async/await in JavaScript');
  console.log(result.summary);
  console.log(omc.getCostReport());
  
  omc.cleanup();
}

// 範例 3: 使用 Google Gemini
async function useGemini() {
  console.log('\n=== Using Google Gemini ===\n');
  
  const omc = new OhMyCopilot({
    defaultProvider: 'google',
    defaultModel: 'gemini-2.0-flash',
    trackCosts: true
  });

  const result = await omc.run('Create a TypeScript interface');
  console.log(result.summary);
  console.log(omc.getCostReport());
  
  omc.cleanup();
}

// 範例 4: 混合使用多個提供商
async function mixedProviders() {
  console.log('\n=== Mixed Providers Workflow ===\n');
  
  // 架構師使用 Claude (擅長規劃)
  const architect = new ArchitectAgent('claude-3-5-sonnet-20241022');
  
  // 執行者使用 GPT-4o-mini (便宜快速)
  const executor = new ExecutorAgent('gpt-4o-mini');
  
  // QA 使用 Gemini (高 context window)
  const qaTester = new QATesterAgent('gemini-2.0-flash');

  console.log('Planning with Claude...');
  const plan = await architect.execute({
    task: 'Design a user authentication system'
  });

  console.log('Implementing with GPT-4o-mini...');
  const implementation = await executor.execute({
    task: 'Implement the authentication system',
    context: { plan: plan.content }
  });

  console.log('Testing with Gemini...');
  const tests = await qaTester.execute({
    task: 'Write tests for the implementation',
    context: { implementation: implementation.content }
  });

  console.log('\n✅ Workflow completed with 3 different providers!');
}

// 範例 5: 使用本地 Ollama 模型
async function useOllama() {
  console.log('\n=== Using Local Ollama ===\n');
  
  const omc = new OhMyCopilot({
    defaultProvider: 'ollama',
    defaultModel: 'llama3:8b',
    trackCosts: true  // 本地模型成本為 $0
  });

  const result = await omc.run('Write a simple sorting algorithm');
  console.log(result.summary);
  console.log(omc.getCostReport()); // 應該顯示 $0.00
  
  omc.cleanup();
}

// 執行所有範例
async function main() {
  try {
    // 注意：這些範例需要在 .env 中設定對應的 API keys
    // 請根據需要註解掉不需要執行的範例
    
    // await useOpenAI();
    // await useAnthropic();
    // await useGemini();
    // await mixedProviders();
    // await useOllama(); // 需要本地安裝 Ollama
    
    console.log('\n✅ All examples completed!');
    console.log('\n註: 請取消註解要執行的範例，並確保已設定相應的 API keys');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
