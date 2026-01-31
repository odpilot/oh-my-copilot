/**
 * 串流輸出範例
 * 
 * 展示如何使用串流模式即時獲取輸出
 */

import { ExecutorAgent } from '../src/agents/index.js';

// 範例 1: 基本串流輸出
async function basicStreamingExample() {
  console.log('🌊 Basic Streaming Example\n');
  console.log('='.repeat(50) + '\n');

  const executor = new ExecutorAgent('gpt-4o-mini');

  try {
    // 注意：這需要 SDK 支援串流
    // 這是概念性的範例，展示串流模式的使用方式
    
    console.log('Starting streaming response...\n');
    
    // 模擬串流輸出
    const response = await executor.execute({
      task: 'Write a short story about a robot learning to code'
    });

    // 在實際實作中，這會是即時串流
    console.log('Response:');
    console.log(response.content);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 2: 進度指示器
async function streamingWithProgress() {
  console.log('\n🌊 Streaming with Progress Indicator\n');
  console.log('='.repeat(50) + '\n');

  const executor = new ExecutorAgent('gpt-4o-mini');

  try {
    let progress = 0;
    const progressBar = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let frame = 0;

    // 模擬串流處理
    const interval = setInterval(() => {
      process.stdout.write(`\r${progressBar[frame]} Processing... ${progress}%`);
      frame = (frame + 1) % progressBar.length;
      progress = Math.min(progress + 5, 100);
      
      if (progress >= 100) {
        clearInterval(interval);
        console.log('\n✅ Complete!\n');
      }
    }, 100);

    const response = await executor.execute({
      task: 'Explain how async/await works in JavaScript'
    });

    clearInterval(interval);
    console.log('\nResponse:');
    console.log(response.content);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 3: 即時顯示輸出
async function realtimeDisplay() {
  console.log('\n🌊 Realtime Display Example\n');
  console.log('='.repeat(50) + '\n');

  const executor = new ExecutorAgent('gpt-4o-mini');

  try {
    console.log('Streaming output:\n');
    console.log('-'.repeat(50));

    // 模擬即時輸出（在實際實作中會是真正的串流）
    const response = await executor.execute({
      task: 'List the steps to build a REST API'
    });

    // 模擬逐字元顯示
    const content = response.content;
    for (let i = 0; i < content.length; i++) {
      process.stdout.write(content[i]);
      
      // 模擬串流延遲
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    console.log('\n' + '-'.repeat(50));
    console.log('\n✅ Streaming complete!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 4: 多段落串流
async function multiChunkStreaming() {
  console.log('\n🌊 Multi-Chunk Streaming\n');
  console.log('='.repeat(50) + '\n');

  const executor = new ExecutorAgent('gpt-4o-mini');

  try {
    console.log('Receiving chunks:\n');

    const response = await executor.execute({
      task: 'Explain the SOLID principles with examples'
    });

    // 模擬分塊顯示
    const chunks = response.content.split('\n\n');
    
    for (let i = 0; i < chunks.length; i++) {
      console.log(`\n📦 Chunk ${i + 1}/${chunks.length}:`);
      console.log('-'.repeat(40));
      console.log(chunks[i]);
      
      // 模擬接收延遲
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('\n✅ All chunks received!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 5: 串流與取消
class StreamController {
  private cancelled = false;

  cancel() {
    this.cancelled = true;
    console.log('\n⚠️  Stream cancelled by user');
  }

  isCancelled(): boolean {
    return this.cancelled;
  }
}

async function streamingWithCancellation() {
  console.log('\n🌊 Streaming with Cancellation\n');
  console.log('='.repeat(50) + '\n');

  const executor = new ExecutorAgent('gpt-4o-mini');
  const controller = new StreamController();

  // 模擬 5 秒後取消
  setTimeout(() => {
    controller.cancel();
  }, 5000);

  try {
    console.log('Streaming (will cancel in 5 seconds)...\n');

    const response = await executor.execute({
      task: 'Write a detailed explanation of design patterns'
    });

    // 檢查是否被取消
    if (controller.isCancelled()) {
      console.log('❌ Stream was cancelled, partial result:');
    } else {
      console.log('✅ Stream completed:');
    }
    
    console.log(response.content.substring(0, 200) + '...');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 6: 串流統計
interface StreamStats {
  startTime: number;
  endTime?: number;
  chunkCount: number;
  totalChars: number;
  bytesPerSecond?: number;
}

async function streamingWithStats() {
  console.log('\n🌊 Streaming with Statistics\n');
  console.log('='.repeat(50) + '\n');

  const executor = new ExecutorAgent('gpt-4o-mini');

  const stats: StreamStats = {
    startTime: Date.now(),
    chunkCount: 0,
    totalChars: 0
  };

  try {
    console.log('Streaming with statistics tracking...\n');

    const response = await executor.execute({
      task: 'Explain microservices architecture'
    });

    stats.endTime = Date.now();
    stats.totalChars = response.content.length;
    stats.chunkCount = 1; // In real streaming, this would be incremented per chunk
    
    const duration = (stats.endTime - stats.startTime) / 1000;
    stats.bytesPerSecond = stats.totalChars / duration;

    console.log('Response received!\n');
    console.log('📊 Stream Statistics:');
    console.log('-'.repeat(40));
    console.log(`  Duration: ${duration.toFixed(2)}s`);
    console.log(`  Chunks: ${stats.chunkCount}`);
    console.log(`  Total characters: ${stats.totalChars}`);
    console.log(`  Speed: ${stats.bytesPerSecond.toFixed(0)} chars/sec`);
    console.log(`  Tokens: ${response.usage.totalTokens}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 7: 並行串流
async function parallelStreaming() {
  console.log('\n🌊 Parallel Streaming\n');
  console.log('='.repeat(50) + '\n');

  const tasks = [
    'Explain REST API',
    'Explain GraphQL',
    'Explain WebSockets'
  ];

  console.log('Starting 3 parallel streams...\n');

  const promises = tasks.map(async (task, index) => {
    const executor = new ExecutorAgent('gpt-4o-mini');
    
    console.log(`[Stream ${index + 1}] Started: ${task}`);
    
    const result = await executor.execute({ task });
    
    console.log(`[Stream ${index + 1}] Completed: ${result.usage.totalTokens} tokens`);
    
    return result;
  });

  const results = await Promise.all(promises);

  console.log('\n✅ All streams completed!');
  console.log('\nSummary:');
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. ${tasks[i]}: ${r.content.length} chars, ${r.usage.totalTokens} tokens`);
  });
}

async function main() {
  try {
    // 注意：這些範例需要設定 API key
    // 某些功能可能需要實際的串流支援
    
    // await basicStreamingExample();
    // await streamingWithProgress();
    // await realtimeDisplay();
    // await multiChunkStreaming();
    // await streamingWithCancellation();
    // await streamingWithStats();
    // await parallelStreaming();
    
    console.log('\n✅ Streaming examples ready!');
    console.log('\n註: 請取消註解函數並設定 API key 來執行');
    console.log('注意: 某些功能可能需要實際的串流 API 支援');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
