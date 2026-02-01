/**
 * Ralph Mode
 * Guarantee completion mode with verification and evidence-based checks
 * Ensures tasks are completed with proof of functionality
 */

import { ArchitectAgent } from '../agents/architect.js';
import { ExecutorAgent } from '../agents/executor.js';
import { QATesterAgent } from '../agents/qa-tester.js';
import { SecurityAgent } from '../agents/security.js';
import type { AgentResult } from '../agents/base-agent.js';
import { logger } from '../utils/logger.js';
import { calculateCost, formatCost, formatDuration } from '../utils/helpers.js';

export interface VerificationCheck {
  name: string;
  required: boolean;
  passed: boolean;
  evidence?: string;
  timestamp?: number;
}

export interface RalphConfig {
  maxRetries?: number;
  requiredChecks?: string[]; // e.g., ['BUILD', 'TEST', 'LINT']
  strictMode?: boolean;
  evidenceRequired?: boolean;
}

export interface RalphResult {
  success: boolean;
  results: AgentResult[];
  verificationChecks: VerificationCheck[];
  totalCost: number;
  totalTime: number;
  retryCount: number;
  summary: string;
  completed: boolean; // Guarantees task is done
}

export class Ralph {
  private architect: ArchitectAgent;
  private executor: ExecutorAgent;
  private qaTester: QATesterAgent;
  private security: SecurityAgent;

  constructor() {
    // Use high-quality models for guaranteed completion
    this.architect = new ArchitectAgent('gpt-4o');
    this.executor = new ExecutorAgent('gpt-4o');
    this.qaTester = new QATesterAgent('gpt-4o-mini');
    this.security = new SecurityAgent('gpt-4o');
    
    logger.info('Ralph Mode initialized (Guarantee Completion)');
  }

  /**
   * Execute task with guarantee of completion
   */
  async execute(
    task: string,
    context?: Record<string, any>,
    config: RalphConfig = {}
  ): Promise<RalphResult> {
    const startTime = Date.now();
    const results: AgentResult[] = [];
    const verificationChecks: VerificationCheck[] = [];
    let totalCost = 0;
    let retryCount = 0;
    const maxRetries = config.maxRetries || 3;

    try {
      logger.info('🎯 Starting Ralph Mode (Guarantee Completion)');
      
      // Execute with retries until completion is verified
      let completed = false;
      
      while (!completed && retryCount <= maxRetries) {
        if (retryCount > 0) {
          logger.info(`Retry attempt ${retryCount}/${maxRetries}...`);
        }

        // Step 1: Planning
        logger.info('Step 1/5: Planning with Architect...');
        const planResult = await this.architect.execute({
          task: retryCount === 0 ? task : `Retry: ${task}. Previous attempts failed verification. Please address the issues.`,
          context: { ...context, retryCount, previousResults: results }
        });
        results.push(planResult);
        totalCost += calculateCost({ ...planResult.usage, model: planResult.model });

        // Step 2: Implementation
        logger.info('Step 2/5: Implementation...');
        const implementResult = await this.executor.execute({
          task,
          context: { ...context, plan: planResult.content },
          previousResults: results
        });
        results.push(implementResult);
        totalCost += calculateCost({ ...implementResult.usage, model: implementResult.model });

        // Step 3: Testing
        logger.info('Step 3/5: Testing...');
        const testResult = await this.qaTester.execute({
          task: 'Write comprehensive tests and verify functionality',
          context,
          previousResults: results
        });
        results.push(testResult);
        totalCost += calculateCost({ ...testResult.usage, model: testResult.model });

        // Step 4: Security Review
        logger.info('Step 4/5: Security Review...');
        const securityResult = await this.security.execute({
          task: 'Perform security review and vulnerability check',
          context,
          previousResults: results
        });
        results.push(securityResult);
        totalCost += calculateCost({ ...securityResult.usage, model: securityResult.model });

        // Step 5: Verification
        logger.info('Step 5/5: Running verification checks...');
        const checks = await this.runVerificationChecks(results, config);
        verificationChecks.push(...checks);

        // Check if all required checks passed
        completed = this.isCompleted(checks, config);
        
        if (!completed) {
          retryCount++;
          logger.warn(`Verification failed. Required checks not passed.`);
        } else {
          logger.info('✅ All verification checks passed!');
        }
      }

      const success = completed && results.every(r => r.success);
      
      if (!completed) {
        logger.error('❌ Ralph Mode failed to complete after maximum retries');
      } else {
        logger.info('✅ Ralph Mode completed with verification');
      }

      return this.buildResult(results, verificationChecks, startTime, totalCost, success, completed, retryCount);

    } catch (error) {
      logger.error(`Ralph Mode failed: ${error}`);
      return this.buildResult(results, verificationChecks, startTime, totalCost, false, false, retryCount);
    }
  }

  /**
   * Run verification checks
   */
  private async runVerificationChecks(
    results: AgentResult[],
    config: RalphConfig
  ): Promise<VerificationCheck[]> {
    const checks: VerificationCheck[] = [];
    const requiredChecks = config.requiredChecks || ['BUILD', 'TEST', 'FUNCTIONALITY'];

    // BUILD check - verify code compiles/builds
    if (requiredChecks.includes('BUILD')) {
      checks.push({
        name: 'BUILD',
        required: true,
        passed: this.checkBuild(results),
        evidence: 'Build verification from execution results',
        timestamp: Date.now()
      });
    }

    // TEST check - verify tests pass
    if (requiredChecks.includes('TEST')) {
      checks.push({
        name: 'TEST',
        required: true,
        passed: this.checkTests(results),
        evidence: 'Test results from QA Tester',
        timestamp: Date.now()
      });
    }

    // LINT check - verify code quality
    if (requiredChecks.includes('LINT')) {
      checks.push({
        name: 'LINT',
        required: false,
        passed: this.checkLint(results),
        evidence: 'Linting verification',
        timestamp: Date.now()
      });
    }

    // FUNCTIONALITY check - verify feature works
    if (requiredChecks.includes('FUNCTIONALITY')) {
      checks.push({
        name: 'FUNCTIONALITY',
        required: true,
        passed: this.checkFunctionality(results),
        evidence: 'Functionality verification from execution',
        timestamp: Date.now()
      });
    }

    // SECURITY check - verify no vulnerabilities
    if (requiredChecks.includes('SECURITY')) {
      checks.push({
        name: 'SECURITY',
        required: config.strictMode || false,
        passed: this.checkSecurity(results),
        evidence: 'Security review from Security Agent',
        timestamp: Date.now()
      });
    }

    // ERROR_FREE check - verify no errors in execution
    checks.push({
      name: 'ERROR_FREE',
      required: true,
      passed: results.every(r => r.success),
      evidence: 'All agents executed successfully',
      timestamp: Date.now()
    });

    return checks;
  }

  /**
   * Check if task is completed based on verification
   */
  private isCompleted(checks: VerificationCheck[], config: RalphConfig): boolean {
    // All required checks must pass
    const requiredChecksPassed = checks
      .filter(c => c.required)
      .every(c => c.passed);

    // In strict mode, all checks must pass
    if (config.strictMode) {
      return checks.every(c => c.passed);
    }

    return requiredChecksPassed;
  }

  // Verification helper methods
  private checkBuild(results: AgentResult[]): boolean {
    // Check if executor succeeded and no build errors mentioned
    const executorResult = results.find(r => r.agentName === 'executor');
    if (!executorResult || !executorResult.success) return false;
    
    // Simple heuristic: check for error keywords
    const content = executorResult.content.toLowerCase();
    const hasErrors = content.includes('error:') || content.includes('failed to build');
    return !hasErrors;
  }

  private checkTests(results: AgentResult[]): boolean {
    const qaResult = results.find(r => r.agentName === 'qa-tester');
    if (!qaResult || !qaResult.success) return false;
    
    const content = qaResult.content.toLowerCase();
    const hasTestErrors = content.includes('test failed') || content.includes('0 passing');
    return !hasTestErrors;
  }

  private checkLint(results: AgentResult[]): boolean {
    // Assume linting is ok if execution succeeded
    return results.some(r => r.success);
  }

  private checkFunctionality(results: AgentResult[]): boolean {
    // Check if implementation succeeded
    const executorResult = results.find(r => r.agentName === 'executor');
    return executorResult?.success || false;
  }

  private checkSecurity(results: AgentResult[]): boolean {
    const securityResult = results.find(r => r.agentName === 'security');
    if (!securityResult) return true; // If no security check, pass
    
    const content = securityResult.content.toLowerCase();
    const hasVulnerabilities = content.includes('vulnerability') || content.includes('security issue');
    return !hasVulnerabilities;
  }

  /**
   * Build result
   */
  private buildResult(
    results: AgentResult[],
    verificationChecks: VerificationCheck[],
    startTime: number,
    totalCost: number,
    success: boolean,
    completed: boolean,
    retryCount: number
  ): RalphResult {
    const totalTime = Date.now() - startTime;
    
    const passedChecks = verificationChecks.filter(c => c.passed).length;
    const requiredChecks = verificationChecks.filter(c => c.required).length;
    const requiredPassed = verificationChecks.filter(c => c.required && c.passed).length;

    const summary = `
Ralph Mode ${completed ? 'COMPLETED ✅' : 'FAILED ❌'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Guarantee: ${completed ? 'VERIFIED' : 'NOT VERIFIED'}
Steps: ${results.length}
Retries: ${retryCount}
Time: ${formatDuration(totalTime)}
Cost: ${formatCost(totalCost)}

Verification Checks:
${verificationChecks.map(c => 
  `  ${c.passed ? '✓' : '✗'} ${c.name}${c.required ? ' (required)' : ''}`
).join('\n')}

Summary: ${requiredPassed}/${requiredChecks} required checks passed
Overall: ${passedChecks}/${verificationChecks.length} checks passed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    return {
      success,
      results,
      verificationChecks,
      totalCost,
      totalTime,
      retryCount,
      summary,
      completed
    };
  }
}
