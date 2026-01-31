/**
 * 真實世界範例：測試生成
 * 
 * 自動為現有程式碼生成測試
 */

import { QATesterAgent } from '../../src/agents/index.js';

async function generateTests() {
  console.log('🧪 Test Generation with Oh My Copilot\n');
  console.log('='.repeat(50) + '\n');

  const qaTester = new QATesterAgent('gpt-4o-mini');

  // 要生成測試的程式碼
  const sourceCode = `
    export class Calculator {
      add(a: number, b: number): number {
        return a + b;
      }

      subtract(a: number, b: number): number {
        return a - b;
      }

      multiply(a: number, b: number): number {
        return a * b;
      }

      divide(a: number, b: number): number {
        if (b === 0) {
          throw new Error('Cannot divide by zero');
        }
        return a / b;
      }
    }
  `;

  try {
    const result = await qaTester.execute({
      task: `
        Generate comprehensive unit tests for this Calculator class using Vitest.
        
        Requirements:
        - Test all methods
        - Include edge cases
        - Test error handling
        - Use describe/it blocks
        - Add meaningful test descriptions
        
        Source code:
        ${sourceCode}
      `
    });

    console.log('📋 GENERATED TESTS\n');
    console.log('-'.repeat(50));
    console.log(result.content);
    console.log('\n' + '-'.repeat(50));
    
    console.log('\n📊 STATISTICS');
    console.log(`  Tokens used: ${result.usage.totalTokens}`);
    console.log(`  Execution time: ${result.executionTime}ms`);

  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 2: 為 React 組件生成測試
async function generateReactTests() {
  console.log('\n🧪 Generating React Component Tests\n');
  console.log('='.repeat(50) + '\n');

  const qaTester = new QATesterAgent('gpt-4o-mini');

  const componentCode = `
    import { useState } from 'react';

    export function Counter() {
      const [count, setCount] = useState(0);

      return (
        <div>
          <p>Count: {count}</p>
          <button onClick={() => setCount(count + 1)}>Increment</button>
          <button onClick={() => setCount(count - 1)}>Decrement</button>
          <button onClick={() => setCount(0)}>Reset</button>
        </div>
      );
    }
  `;

  try {
    const result = await qaTester.execute({
      task: `
        Generate React Testing Library tests for this Counter component.
        
        Requirements:
        - Test initial render
        - Test all button clicks
        - Test state changes
        - Use @testing-library/react
        
        Component code:
        ${componentCode}
      `
    });

    console.log('📋 GENERATED REACT TESTS\n');
    console.log('-'.repeat(50));
    console.log(result.content);

  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 3: 為 API 端點生成整合測試
async function generateIntegrationTests() {
  console.log('\n🧪 Generating Integration Tests\n');
  console.log('='.repeat(50) + '\n');

  const qaTester = new QATesterAgent('gpt-4o-mini');

  const apiCode = `
    import express from 'express';
    
    const router = express.Router();

    router.get('/users', async (req, res) => {
      const users = await db.users.findAll();
      res.json(users);
    });

    router.post('/users', async (req, res) => {
      const user = await db.users.create(req.body);
      res.status(201).json(user);
    });

    export default router;
  `;

  try {
    const result = await qaTester.execute({
      task: `
        Generate integration tests for these API endpoints using supertest.
        
        Requirements:
        - Test GET /users endpoint
        - Test POST /users endpoint
        - Include happy path and error cases
        - Mock the database
        
        API code:
        ${apiCode}
      `
    });

    console.log('📋 GENERATED INTEGRATION TESTS\n');
    console.log('-'.repeat(50));
    console.log(result.content);

  } catch (error) {
    console.error('Error:', error);
  }
}

async function main() {
  try {
    // 注意：此範例需要設定 OpenAI API key
    // await generateTests();
    // await generateReactTests();
    // await generateIntegrationTests();
    
    console.log('\n✅ Test generation examples ready!');
    console.log('\n註: 請取消註解函數並設定 API key 來執行');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
