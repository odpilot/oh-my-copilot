/**
 * 錯誤處理範例
 * 
 * 展示如何處理各種錯誤情況
 */

import { OhMyCopilot } from '../src/oh-my-copilot.js';
import { ExecutorAgent } from '../src/agents/index.js';
import { retry } from '../src/utils/retry.js';

// 範例 1: 基本錯誤處理
async function basicErrorHandling() {
  console.log('🛡️  Basic Error Handling\n');
  console.log('='.repeat(50) + '\n');

  const omc = new OhMyCopilot();

  try {
    const result = await omc.run('Process this task');
    console.log('Success:', result.summary);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Task failed:', error.message);
      console.error('Stack trace:', error.stack);
    }
  } finally {
    omc.cleanup();
  }
}

// 範例 2: API 錯誤處理
async function apiErrorHandling() {
  console.log('\n🛡️  API Error Handling\n');
  console.log('='.repeat(50) + '\n');

  const executor = new ExecutorAgent('gpt-4o-mini');

  try {
    const result = await executor.execute({
      task: 'Test task'
    });
    
    if (!result.success) {
      console.error('Agent execution failed:', result.error);
      // 處理失敗情況
      console.log('Attempting fallback strategy...');
    } else {
      console.log('Success:', result.content);
    }
  } catch (error) {
    // 處理網路錯誤、API 錯誤等
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        console.error('❌ API Key error - Please check your credentials');
      } else if (error.message.includes('rate limit')) {
        console.error('❌ Rate limit exceeded - Please wait and retry');
      } else if (error.message.includes('network')) {
        console.error('❌ Network error - Please check your connection');
      } else {
        console.error('❌ Unexpected error:', error.message);
      }
    }
  }
}

// 範例 3: 使用 Retry 機制
async function retryErrorHandling() {
  console.log('\n🛡️  Retry Error Handling\n');
  console.log('='.repeat(50) + '\n');

  const executor = new ExecutorAgent('gpt-4o-mini');

  try {
    const result = await retry(
      async () => {
        const r = await executor.execute({
          task: 'Potentially unstable task'
        });
        
        if (!r.success) {
          throw new Error('Task execution failed');
        }
        
        return r;
      },
      {
        maxAttempts: 3,
        initialDelay: 1000,
        factor: 2,
        onRetry: (attempt, error) => {
          console.log(`⚠️  Attempt ${attempt} failed: ${error.message}`);
          console.log('Retrying...');
        }
      }
    );

    console.log('✅ Success after retries:', result.content);
  } catch (error) {
    console.error('❌ All retry attempts failed:', error);
  }
}

// 範例 4: 條件重試
async function conditionalRetry() {
  console.log('\n🛡️  Conditional Retry\n');
  console.log('='.repeat(50) + '\n');

  const executor = new ExecutorAgent('gpt-4o-mini');

  try {
    const result = await retry(
      async () => {
        const r = await executor.execute({
          task: 'Task that may fail'
        });
        
        if (!r.success) {
          throw new Error(r.error || 'Unknown error');
        }
        
        return r;
      },
      {
        maxAttempts: 5,
        initialDelay: 500,
        onRetry: (attempt, error) => {
          console.log(`Retry ${attempt}: ${error.message}`);
          
          // 根據錯誤類型決定是否繼續重試
          if (error.message.includes('invalid')) {
            console.log('Invalid input - stopping retries');
            throw error; // 停止重試
          }
        }
      }
    );

    console.log('✅ Success:', result.content);
  } catch (error) {
    console.error('❌ Failed:', error);
  }
}

// 範例 5: 優雅降級
async function gracefulDegradation() {
  console.log('\n🛡️  Graceful Degradation\n');
  console.log('='.repeat(50) + '\n');

  const models = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'];
  
  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);
      const executor = new ExecutorAgent(model);
      
      const result = await executor.execute({
        task: 'Simple task'
      });
      
      if (result.success) {
        console.log(`✅ Success with ${model}`);
        console.log(`Result: ${result.content}`);
        break; // 成功後停止
      }
    } catch (error) {
      console.log(`⚠️  ${model} failed, trying next model...`);
      
      // 如果是最後一個模型，拋出錯誤
      if (model === models[models.length - 1]) {
        console.error('❌ All models failed');
        throw error;
      }
    }
  }
}

// 範例 6: 超時處理
async function timeoutHandling() {
  console.log('\n🛡️  Timeout Handling\n');
  console.log('='.repeat(50) + '\n');

  const executor = new ExecutorAgent('gpt-4o-mini');

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), 10000);
  });

  try {
    const taskPromise = executor.execute({
      task: 'Long running task'
    });

    const result = await Promise.race([taskPromise, timeoutPromise]);
    console.log('✅ Completed within timeout:', result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('timeout')) {
      console.error('❌ Operation timed out after 10 seconds');
      // 執行清理或補救措施
    } else {
      console.error('❌ Other error:', error);
    }
  }
}

// 範例 7: 錯誤聚合和報告
class ErrorCollector {
  private errors: Array<{ timestamp: Date; error: Error; context: any }> = [];

  collect(error: Error, context?: any) {
    this.errors.push({
      timestamp: new Date(),
      error,
      context
    });
  }

  getReport() {
    return {
      totalErrors: this.errors.length,
      errors: this.errors.map(e => ({
        time: e.timestamp.toISOString(),
        message: e.error.message,
        context: e.context
      }))
    };
  }

  clear() {
    this.errors = [];
  }
}

async function errorAggregation() {
  console.log('\n🛡️  Error Aggregation\n');
  console.log('='.repeat(50) + '\n');

  const errorCollector = new ErrorCollector();
  const executor = new ExecutorAgent('gpt-4o-mini');

  const tasks = ['Task 1', 'Task 2', 'Task 3'];

  for (const task of tasks) {
    try {
      await executor.execute({ task });
    } catch (error) {
      errorCollector.collect(error as Error, { task });
    }
  }

  // 生成錯誤報告
  const report = errorCollector.getReport();
  console.log('Error Report:');
  console.log(JSON.stringify(report, null, 2));
}

async function main() {
  try {
    // 注意：這些範例需要設定 API keys
    // await basicErrorHandling();
    // await apiErrorHandling();
    // await retryErrorHandling();
    // await conditionalRetry();
    // await gracefulDegradation();
    // await timeoutHandling();
    // await errorAggregation();
    
    console.log('\n✅ Error handling examples ready!');
    console.log('\n註: 請取消註解函數並設定 API key 來執行');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
