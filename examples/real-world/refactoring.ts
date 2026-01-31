/**
 * 真實世界範例：程式碼重構
 * 
 * 使用 AI 協助重構和改進程式碼
 */

import { ExecutorAgent } from '../../src/agents/index.js';

async function refactorLegacyCode() {
  console.log('♻️  Code Refactoring with Oh My Copilot\n');
  console.log('='.repeat(50) + '\n');

  const executor = new ExecutorAgent('gpt-4o');

  // 舊的程式碼
  const legacyCode = `
    function processData(data) {
      var result = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].active == true) {
          var item = {
            id: data[i].id,
            name: data[i].name,
            value: data[i].value * 2
          };
          result.push(item);
        }
      }
      return result;
    }
  `;

  try {
    const result = await executor.execute({
      task: `
        Refactor this legacy JavaScript code to modern TypeScript.
        
        Requirements:
        - Use const/let instead of var
        - Use arrow functions
        - Use array methods (filter, map)
        - Add type definitions
        - Use strict equality (===)
        - Make it more functional
        
        Legacy code:
        ${legacyCode}
      `
    });

    console.log('📋 REFACTORED CODE\n');
    console.log('-'.repeat(50));
    console.log(result.content);
    console.log('\n' + '-'.repeat(50));

  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 2: 提取可重用函數
async function extractReusableFunctions() {
  console.log('\n♻️  Extracting Reusable Functions\n');
  console.log('='.repeat(50) + '\n');

  const executor = new ExecutorAgent('gpt-4o-mini');

  const duplicateCode = `
    function createUser(data) {
      const errors = [];
      
      if (!data.email || !data.email.includes('@')) {
        errors.push('Invalid email');
      }
      
      if (!data.password || data.password.length < 8) {
        errors.push('Password too short');
      }
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }
      
      return db.users.create(data);
    }

    function updateUser(id, data) {
      const errors = [];
      
      if (data.email && !data.email.includes('@')) {
        errors.push('Invalid email');
      }
      
      if (data.password && data.password.length < 8) {
        errors.push('Password too short');
      }
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }
      
      return db.users.update(id, data);
    }
  `;

  try {
    const result = await executor.execute({
      task: `
        Refactor this code by extracting the validation logic into reusable functions.
        
        Requirements:
        - Create separate validation functions
        - Remove code duplication
        - Make validators composable
        - Add TypeScript types
        
        Code:
        ${duplicateCode}
      `
    });

    console.log('📋 REFACTORED CODE\n');
    console.log('-'.repeat(50));
    console.log(result.content);

  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 3: 改進錯誤處理
async function improveErrorHandling() {
  console.log('\n♻️  Improving Error Handling\n');
  console.log('='.repeat(50) + '\n');

  const executor = new ExecutorAgent('gpt-4o-mini');

  const poorErrorHandling = `
    async function fetchUserData(userId) {
      try {
        const response = await fetch('/api/users/' + userId);
        const data = await response.json();
        return data;
      } catch (error) {
        console.log('Error:', error);
        return null;
      }
    }
  `;

  try {
    const result = await executor.execute({
      task: `
        Improve the error handling in this function.
        
        Requirements:
        - Check response status
        - Handle different error types
        - Provide meaningful error messages
        - Use proper error types
        - Add logging
        - Use template literals
        
        Code:
        ${poorErrorHandling}
      `
    });

    console.log('📋 IMPROVED CODE\n');
    console.log('-'.repeat(50));
    console.log(result.content);

  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 4: 性能優化
async function optimizePerformance() {
  console.log('\n♻️  Performance Optimization\n');
  console.log('='.repeat(50) + '\n');

  const executor = new ExecutorAgent('gpt-4o');

  const slowCode = `
    function findDuplicates(array) {
      const duplicates = [];
      
      for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
          if (array[i] === array[j] && !duplicates.includes(array[i])) {
            duplicates.push(array[i]);
          }
        }
      }
      
      return duplicates;
    }
  `;

  try {
    const result = await executor.execute({
      task: `
        Optimize this function for better performance.
        
        Requirements:
        - Reduce time complexity
        - Use appropriate data structures (Set, Map)
        - Add TypeScript types
        - Explain the performance improvement
        
        Code:
        ${slowCode}
      `
    });

    console.log('📋 OPTIMIZED CODE\n');
    console.log('-'.repeat(50));
    console.log(result.content);

  } catch (error) {
    console.error('Error:', error);
  }
}

async function main() {
  try {
    // 注意：此範例需要設定 OpenAI API key
    // await refactorLegacyCode();
    // await extractReusableFunctions();
    // await improveErrorHandling();
    // await optimizePerformance();
    
    console.log('\n✅ Refactoring examples ready!');
    console.log('\n註: 請取消註解函數並設定 API key 來執行');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
