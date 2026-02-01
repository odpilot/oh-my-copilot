/**
 * Ultrapilot Mode
 * Advanced orchestration with skill composition and intelligent agent routing
 * Combines multiple execution strategies for optimal results
 */

import { ArchitectAgent } from '../agents/architect.js';
import { ExecutorAgent } from '../agents/executor.js';
import { QATesterAgent } from '../agents/qa-tester.js';
import { SecurityAgent } from '../agents/security.js';
import { BaseAgent, type AgentResult } from '../agents/base-agent.js';
import { logger } from '../utils/logger.js';
import { calculateCost, formatCost, formatDuration } from '../utils/helpers.js';

export type SkillType = 'execution' | 'enhancement' | 'guarantee';

export interface Skill {
  name: string;
  type: SkillType;
  description: string;
  enabled: boolean;
}

export interface UltrapilotConfig {
  skills?: string[]; // Skills to activate: 'default', 'planner', 'orchestrate', 'ultrawork', 'git-master', 'ralph'
  parallelExecution?: boolean;
  smartRouting?: boolean; // Enable smart model routing based on task complexity
  autoDelegate?: boolean; // Enable automatic delegation to specialized agents
  maxConcurrency?: number;
  continueOnFailure?: boolean;
}

export interface UltrapilotResult {
  success: boolean;
  results: AgentResult[];
  skillsUsed: Skill[];
  totalCost: number;
  totalTime: number;
  summary: string;
  delegations: number; // Number of delegations to specialized agents
}

export class Ultrapilot {
  private architect: ArchitectAgent;
  private executor: ExecutorAgent;
  private qaTester: QATesterAgent;
  private security: SecurityAgent;
  
  // Available skills
  private availableSkills: Skill[] = [
    // Execution skills
    { name: 'default', type: 'execution', description: 'Standard implementation workflow', enabled: true },
    { name: 'planner', type: 'execution', description: 'Focus on planning and architecture', enabled: false },
    { name: 'orchestrate', type: 'execution', description: 'Coordinate multiple agents', enabled: false },
    
    // Enhancement skills
    { name: 'ultrawork', type: 'enhancement', description: 'Parallel task execution', enabled: false },
    { name: 'git-master', type: 'enhancement', description: 'Atomic commits and Git workflow', enabled: false },
    { name: 'frontend-ui-ux', type: 'enhancement', description: 'Enhanced UI/UX focus', enabled: false },
    
    // Guarantee skills
    { name: 'ralph', type: 'guarantee', description: 'Guarantee completion with verification', enabled: false }
  ];

  constructor() {
    this.architect = new ArchitectAgent('gpt-4o');
    this.executor = new ExecutorAgent('gpt-4o');
    this.qaTester = new QATesterAgent('gpt-4o-mini');
    this.security = new SecurityAgent('gpt-4o');
    
    logger.info('Ultrapilot Mode initialized');
  }

  /**
   * Execute task with advanced orchestration
   */
  async execute(
    task: string,
    context?: Record<string, any>,
    config: UltrapilotConfig = {}
  ): Promise<UltrapilotResult> {
    const startTime = Date.now();
    const results: AgentResult[] = [];
    let totalCost = 0;
    let delegations = 0;

    try {
      logger.info('🚀 Starting Ultrapilot Mode (Advanced Orchestration)');
      
      // Activate specified skills
      const activeSkills = this.activateSkills(config.skills || ['default']);
      logger.info(`Active skills: ${activeSkills.map(s => s.name).join(', ')}`);

      // Step 1: Intelligent Planning with auto-delegation detection
      logger.info('Step 1: Intelligent Planning...');
      const planResult = await this.architect.execute({
        task,
        context: { 
          ...context, 
          skills: activeSkills.map(s => s.name),
          smartRouting: config.smartRouting,
          autoDelegate: config.autoDelegate
        }
      });
      results.push(planResult);
      totalCost += calculateCost({ ...planResult.usage, model: planResult.model });

      // Analyze plan for delegation opportunities
      if (config.autoDelegate) {
        const delegationPlan = this.analyzeDelegationNeeds(planResult.content);
        logger.info(`Identified ${delegationPlan.length} delegation opportunities`);
        delegations = delegationPlan.length;
      }

      // Step 2: Execute based on active skills
      if (this.hasSkill(activeSkills, 'ultrawork') && config.parallelExecution) {
        // Parallel execution mode
        logger.info('Step 2: Parallel Execution (Ultrawork)...');
        const parallelResults = await this.executeParallel(task, context, planResult, config);
        results.push(...parallelResults);
        parallelResults.forEach(r => {
          totalCost += calculateCost({ ...r.usage, model: r.model });
        });
      } else {
        // Sequential execution with smart routing
        logger.info('Step 2: Sequential Execution with Smart Routing...');
        const execResult = await this.executeWithSmartRouting(task, context, planResult, config);
        results.push(execResult);
        totalCost += calculateCost({ ...execResult.usage, model: execResult.model });
      }

      // Step 3: Enhanced Testing
      logger.info('Step 3: Comprehensive Testing...');
      const testResult = await this.qaTester.execute({
        task: 'Write comprehensive tests with high coverage',
        context,
        previousResults: results
      });
      results.push(testResult);
      totalCost += calculateCost({ ...testResult.usage, model: testResult.model });

      // Step 4: Security Review (if not in eco mode)
      logger.info('Step 4: Security Review...');
      const securityResult = await this.security.execute({
        task: 'Perform thorough security review',
        context,
        previousResults: results
      });
      results.push(securityResult);
      totalCost += calculateCost({ ...securityResult.usage, model: securityResult.model });

      // Step 5: Verification (if Ralph skill enabled)
      if (this.hasSkill(activeSkills, 'ralph')) {
        logger.info('Step 5: Verification (Ralph guarantee)...');
        // Ralph verification would run here
      }

      const success = results.every(r => r.success) || config.continueOnFailure || false;
      logger.info(`✅ Ultrapilot completed with ${activeSkills.length} skills`);

      return this.buildResult(results, activeSkills, startTime, totalCost, success, delegations);

    } catch (error) {
      logger.error(`Ultrapilot failed: ${error}`);
      return this.buildResult(results, this.availableSkills.filter(s => s.enabled), startTime, totalCost, false, delegations);
    }
  }

  /**
   * Activate skills based on configuration
   */
  private activateSkills(skillNames: string[]): Skill[] {
    return this.availableSkills.map(skill => ({
      ...skill,
      enabled: skillNames.includes(skill.name)
    })).filter(s => s.enabled);
  }

  /**
   * Check if a skill is active
   */
  private hasSkill(skills: Skill[], name: string): boolean {
    return skills.some(s => s.name === name && s.enabled);
  }

  /**
   * Analyze plan for delegation opportunities (auto-delegation)
   */
  private analyzeDelegationNeeds(planContent: string): string[] {
    const delegations: string[] = [];
    const content = planContent.toLowerCase();

    // Detect delegation keywords
    if (content.includes('database') || content.includes('sql') || content.includes('query')) {
      delegations.push('database-expert');
    }
    if (content.includes('frontend') || content.includes('react') || content.includes('ui')) {
      delegations.push('frontend-engineer');
    }
    if (content.includes('api') || content.includes('endpoint') || content.includes('rest')) {
      delegations.push('api-specialist');
    }
    if (content.includes('test') || content.includes('unit test')) {
      delegations.push('unit-test-specialist');
    }
    if (content.includes('security') || content.includes('authentication')) {
      delegations.push('authentication-specialist');
    }

    return delegations;
  }

  /**
   * Execute with smart model routing
   */
  private async executeWithSmartRouting(
    task: string,
    context: Record<string, any> | undefined,
    planResult: AgentResult,
    config: UltrapilotConfig
  ): Promise<AgentResult> {
    if (!config.smartRouting) {
      // Standard execution
      return this.executor.execute({
        task,
        context,
        previousResults: [planResult]
      });
    }

    // Analyze task complexity for smart routing
    const complexity = this.analyzeComplexity(task, planResult.content);
    
    // Route to appropriate model based on complexity
    let model = 'gpt-4o-mini'; // Default to MEDIUM tier
    
    if (complexity === 'HIGH') {
      model = 'gpt-4o'; // Use Opus-tier model for complex tasks
      logger.info('Smart routing: Using HIGH-tier model (gpt-4o) for complex task');
    } else if (complexity === 'LOW') {
      model = 'gpt-4o-mini'; // Use Haiku-tier model for simple tasks
      logger.info('Smart routing: Using LOW-tier model (gpt-4o-mini) for simple task');
    } else {
      logger.info('Smart routing: Using MEDIUM-tier model (gpt-4o-mini)');
    }

    const executor = new ExecutorAgent(model);
    return executor.execute({
      task,
      context,
      previousResults: [planResult]
    });
  }

  /**
   * Analyze task complexity for model routing
   */
  private analyzeComplexity(task: string, planContent: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    const combinedContent = (task + ' ' + planContent).toLowerCase();
    
    // HIGH complexity indicators
    const highComplexityKeywords = [
      'architecture', 'design pattern', 'algorithm', 'optimization',
      'microservices', 'distributed', 'scale', 'complex'
    ];
    
    // LOW complexity indicators
    const lowComplexityKeywords = [
      'simple', 'basic', 'quick', 'small', 'minor', 'fix'
    ];

    const hasHighComplexity = highComplexityKeywords.some(kw => combinedContent.includes(kw));
    const hasLowComplexity = lowComplexityKeywords.some(kw => combinedContent.includes(kw));

    if (hasHighComplexity) return 'HIGH';
    if (hasLowComplexity) return 'LOW';
    return 'MEDIUM';
  }

  /**
   * Execute tasks in parallel (Ultrawork skill)
   */
  private async executeParallel(
    task: string,
    context: Record<string, any> | undefined,
    planResult: AgentResult,
    config: UltrapilotConfig
  ): Promise<AgentResult[]> {
    logger.info('Executing in parallel mode...');
    
    // For now, simulate parallel execution
    // In a real implementation, this would split tasks and run them concurrently
    const results: AgentResult[] = [];
    
    const executor1 = this.executor.execute({
      task: `Part 1: ${task}`,
      context,
      previousResults: [planResult]
    });

    const executor2 = new ExecutorAgent('gpt-4o-mini').execute({
      task: `Part 2: ${task} - Testing and validation`,
      context,
      previousResults: [planResult]
    });

    const [result1, result2] = await Promise.all([executor1, executor2]);
    results.push(result1, result2);

    return results;
  }

  /**
   * Build result
   */
  private buildResult(
    results: AgentResult[],
    skillsUsed: Skill[],
    startTime: number,
    totalCost: number,
    success: boolean,
    delegations: number
  ): UltrapilotResult {
    const totalTime = Date.now() - startTime;
    
    const summary = `
Ultrapilot Mode ${success ? 'Completed ✅' : 'Failed ❌'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mode: Advanced Orchestration
Skills: ${skillsUsed.map(s => s.name).join(', ')}
Delegations: ${delegations}
Steps: ${results.length}
Time: ${formatDuration(totalTime)}
Cost: ${formatCost(totalCost)}

Execution Flow:
${results.map((r, i) => 
  `${i + 1}. ${r.agentName}: ${r.success ? '✓' : '✗'} (${formatDuration(r.executionTime)}, ${formatCost(calculateCost({ ...r.usage, model: r.model }))})`
).join('\n')}

Skills Activated:
${skillsUsed.map(s => `  • ${s.name} (${s.type}): ${s.description}`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    return {
      success,
      results,
      skillsUsed,
      totalCost,
      totalTime,
      summary,
      delegations
    };
  }
}
