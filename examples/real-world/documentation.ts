/**
 * 真實世界範例：文件生成
 * 
 * 自動生成 API 文件、README、和程式碼註釋
 */

import { DesignerAgent } from '../../src/agents/index.js';

async function generateAPIDocumentation() {
  console.log('📚 API Documentation Generation\n');
  console.log('='.repeat(50) + '\n');

  const designer = new DesignerAgent('gpt-4o-mini');

  // API 程式碼
  const apiCode = `
    export class UserService {
      async getUser(id: string) {
        return await db.users.findById(id);
      }

      async createUser(data: { name: string; email: string }) {
        return await db.users.create(data);
      }

      async updateUser(id: string, data: Partial<{ name: string; email: string }>) {
        return await db.users.update(id, data);
      }

      async deleteUser(id: string) {
        return await db.users.delete(id);
      }
    }
  `;

  try {
    const result = await designer.execute({
      task: `
        Generate comprehensive API documentation for this UserService class.
        
        Include:
        - Method descriptions
        - Parameter details
        - Return types
        - Example usage
        - Error handling
        
        Use Markdown format with code examples.
        
        Code:
        ${apiCode}
      `
    });

    console.log('📋 GENERATED DOCUMENTATION\n');
    console.log('-'.repeat(50));
    console.log(result.content);
    console.log('\n' + '-'.repeat(50));

  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 2: 生成 README
async function generateREADME() {
  console.log('\n📚 README Generation\n');
  console.log('='.repeat(50) + '\n');

  const designer = new DesignerAgent('gpt-4o-mini');

  const projectInfo = `
    Project Name: TaskMaster
    Description: A task management application with REST API
    
    Features:
    - Create, read, update, delete tasks
    - Task prioritization
    - Task assignment to users
    - Due date tracking
    - REST API with Express.js
    - SQLite database
    
    Tech Stack:
    - Node.js
    - TypeScript
    - Express.js
    - SQLite
    - Vitest for testing
  `;

  try {
    const result = await designer.execute({
      task: `
        Generate a professional README.md for this project.
        
        Include:
        - Project title and description
        - Features list
        - Installation instructions
        - Usage examples
        - API documentation
        - Testing instructions
        - License
        
        Project info:
        ${projectInfo}
      `
    });

    console.log('📋 GENERATED README\n');
    console.log('-'.repeat(50));
    console.log(result.content);

  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 3: 生成 JSDoc 註釋
async function generateJSDoc() {
  console.log('\n📚 JSDoc Comments Generation\n');
  console.log('='.repeat(50) + '\n');

  const designer = new DesignerAgent('gpt-4o-mini');

  const code = `
    export async function processPayment(userId: string, amount: number, currency: string) {
      const user = await getUser(userId);
      const payment = await createPaymentIntent(amount, currency);
      
      if (payment.status === 'succeeded') {
        await recordTransaction(userId, amount, currency);
        await sendConfirmationEmail(user.email);
        return { success: true, transactionId: payment.id };
      }
      
      throw new Error('Payment failed');
    }
  `;

  try {
    const result = await designer.execute({
      task: `
        Add comprehensive JSDoc comments to this function.
        
        Include:
        - Function description
        - @param tags with types and descriptions
        - @returns tag with description
        - @throws tag for errors
        - Usage example
        
        Code:
        ${code}
      `
    });

    console.log('📋 CODE WITH JSDOC\n');
    console.log('-'.repeat(50));
    console.log(result.content);

  } catch (error) {
    console.error('Error:', error);
  }
}

// 範例 4: 生成變更日誌
async function generateChangelog() {
  console.log('\n📚 Changelog Generation\n');
  console.log('='.repeat(50) + '\n');

  const designer = new DesignerAgent('gpt-4o-mini');

  const commits = `
    - feat: Add user authentication
    - feat: Add task prioritization
    - fix: Fix date formatting bug
    - chore: Update dependencies
    - docs: Update API documentation
    - test: Add integration tests
  `;

  try {
    const result = await designer.execute({
      task: `
        Generate a CHANGELOG.md entry for version 1.2.0 based on these commits.
        
        Use Keep a Changelog format with sections:
        - Added
        - Changed
        - Fixed
        
        Commits:
        ${commits}
      `
    });

    console.log('📋 GENERATED CHANGELOG\n');
    console.log('-'.repeat(50));
    console.log(result.content);

  } catch (error) {
    console.error('Error:', error);
  }
}

async function main() {
  try {
    // 注意：此範例需要設定 OpenAI API key
    // await generateAPIDocumentation();
    // await generateREADME();
    // await generateJSDoc();
    // await generateChangelog();
    
    console.log('\n✅ Documentation generation examples ready!');
    console.log('\n註: 請取消註解函數並設定 API key 來執行');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
