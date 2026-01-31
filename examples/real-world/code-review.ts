/**
 * 真實世界範例：程式碼審查
 * 
 * 使用 QA Tester 代理進行全面的程式碼審查
 */

import { QATesterAgent } from '../../src/agents/index.js';

async function reviewCode() {
  console.log('🔍 Code Review with Oh My Copilot\n');
  console.log('='.repeat(50) + '\n');

  const qaTester = new QATesterAgent('gpt-4o');

  // 待審查的程式碼
  const codeToReview = `
    // User authentication service
    class AuthService {
      private users = [];

      async login(username, password) {
        const user = this.users.find(u => u.username === username);
        
        if (!user || user.password !== password) {
          throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user);
        return { token, user };
      }

      generateToken(user) {
        return btoa(JSON.stringify({ id: user.id, username: user.username }));
      }

      async register(username, password) {
        if (this.users.find(u => u.username === username)) {
          throw new Error('User already exists');
        }

        const user = {
          id: Date.now(),
          username,
          password
        };

        this.users.push(user);
        return user;
      }
    }
  `;

  try {
    // 執行程式碼審查
    const result = await qaTester.execute({
      task: `
        Review the following code and provide feedback on:
        1. Security vulnerabilities
        2. Best practices violations
        3. Potential bugs
        4. Performance issues
        5. Code quality improvements
        
        Code to review:
        ${codeToReview}
      `
    });

    console.log('📋 REVIEW RESULTS\n');
    console.log('-'.repeat(50));
    console.log(result.content);
    console.log('\n' + '-'.repeat(50));
    
    console.log('\n📊 REVIEW STATISTICS');
    console.log(`  Model: ${result.model}`);
    console.log(`  Tokens used: ${result.usage.totalTokens}`);
    console.log(`  Execution time: ${result.executionTime}ms`);

  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 2: 審查多個檔案
async function reviewMultipleFiles() {
  console.log('\n🔍 Reviewing Multiple Files\n');
  console.log('='.repeat(50) + '\n');

  const qaTester = new QATesterAgent('gpt-4o-mini');

  const files = [
    {
      name: 'api.ts',
      code: `export async function fetchData(url: string) { return await fetch(url).then(r => r.json()); }`
    },
    {
      name: 'utils.ts', 
      code: `export function parseJSON(str: string) { return JSON.parse(str); }`
    }
  ];

  for (const file of files) {
    console.log(`\nReviewing ${file.name}...`);
    
    const result = await qaTester.execute({
      task: `Review this ${file.name} file for issues:\n\n${file.code}`
    });

    console.log(result.content.substring(0, 200) + '...\n');
  }
}

async function main() {
  try {
    // 注意：此範例需要設定 OpenAI API key
    // await reviewCode();
    // await reviewMultipleFiles();
    
    console.log('\n✅ Code review examples ready!');
    console.log('\n註: 請取消註解函數並設定 API key 來執行');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
