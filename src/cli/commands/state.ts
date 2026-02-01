/**
 * State Command
 * View and manage session state and wisdom
 */

import chalk from 'chalk';
import { stateManager } from '../../utils/state-manager.js';
import { ui } from '../ui.js';
import { formatCost, formatDuration } from '../../utils/helpers.js';

export async function stateCommand(action: string, options: any) {
  switch (action) {
    case 'sessions':
      await listSessions(options);
      break;
    
    case 'wisdom':
      await showWisdom(options);
      break;
    
    case 'stats':
      await showStats(options);
      break;
    
    case 'clean':
      await cleanState(options);
      break;
    
    default:
      ui.error(`Unknown action: ${action}`);
      console.log(chalk.gray('\nAvailable actions:'));
      console.log(chalk.gray('  sessions - List recent sessions'));
      console.log(chalk.gray('  wisdom   - Show captured wisdom/learnings'));
      console.log(chalk.gray('  stats    - Show agent statistics'));
      console.log(chalk.gray('  clean    - Clean old session data'));
      process.exit(1);
  }
}

/**
 * List recent sessions
 */
async function listSessions(options: any) {
  ui.header('Recent Sessions');
  
  const sessions = stateManager.getAllSessions();
  const limit = options.limit || 10;
  const recentSessions = sessions.slice(0, limit);
  
  if (recentSessions.length === 0) {
    console.log(chalk.gray('No sessions found'));
    return;
  }
  
  const headers = ['ID', 'Mode', 'Status', 'Agents', 'Cost', 'Time'];
  const rows = recentSessions.map(session => [
    session.id.substring(0, 20) + '...',
    chalk.cyan(session.mode),
    session.status === 'completed' ? chalk.green('✓') : 
    session.status === 'failed' ? chalk.red('✗') : 
    chalk.yellow('○'),
    session.agentsUsed.length.toString(),
    formatCost(session.totalCost),
    session.endTime ? formatDuration(session.endTime - session.startTime) : 'Running'
  ]);
  
  ui.table(headers, rows);
  
  console.log(chalk.gray(`\nShowing ${recentSessions.length} of ${sessions.length} sessions`));
  console.log(chalk.gray(`Use --limit to show more`));
}

/**
 * Show captured wisdom
 */
async function showWisdom(options: any) {
  ui.header('Captured Wisdom');
  
  const globalState = stateManager.loadGlobalState();
  const wisdom = globalState.wisdomEntries;
  
  if (wisdom.length === 0) {
    console.log(chalk.gray('No wisdom captured yet'));
    return;
  }
  
  // Filter by category if provided
  let filteredWisdom = wisdom;
  if (options.category) {
    filteredWisdom = wisdom.filter(w => w.category === options.category);
  }
  
  // Filter by tags if provided
  if (options.tags) {
    const tags = options.tags.split(',');
    filteredWisdom = wisdom.filter(w => 
      w.tags.some(tag => tags.includes(tag))
    );
  }
  
  const limit = options.limit || 10;
  const recentWisdom = filteredWisdom.slice(-limit).reverse();
  
  for (const entry of recentWisdom) {
    const categoryColor = 
      entry.category === 'success' ? chalk.green :
      entry.category === 'failure' ? chalk.red :
      entry.category === 'optimization' ? chalk.blue :
      chalk.yellow;
    
    const date = new Date(entry.timestamp).toLocaleString();
    
    console.log();
    console.log(categoryColor(`[${entry.category.toUpperCase()}]`) + chalk.gray(` ${date}`));
    console.log(chalk.bold(entry.learning));
    
    if (entry.context) {
      console.log(chalk.gray(`Context: ${entry.context}`));
    }
    
    if (entry.tags.length > 0) {
      console.log(chalk.gray(`Tags: ${entry.tags.join(', ')}`));
    }
    
    if (entry.relatedAgents.length > 0) {
      console.log(chalk.gray(`Agents: ${entry.relatedAgents.join(', ')}`));
    }
  }
  
  console.log();
  console.log(chalk.gray(`\nShowing ${recentWisdom.length} of ${filteredWisdom.length} wisdom entries`));
  console.log(chalk.gray(`Categories: success, failure, optimization, insight`));
  console.log(chalk.gray(`Use --category or --tags to filter`));
}

/**
 * Show agent statistics
 */
async function showStats(options: any) {
  ui.header('Agent Statistics');
  
  const stats = stateManager.getAgentStats();
  const entries = Object.entries(stats);
  
  if (entries.length === 0) {
    console.log(chalk.gray('No agent statistics available yet'));
    return;
  }
  
  // Sort by usage
  entries.sort((a, b) => b[1].uses - a[1].uses);
  
  const headers = ['Agent', 'Uses', 'Success Rate', 'Avg Cost'];
  const rows = entries.map(([name, stat]) => [
    chalk.cyan(name),
    stat.uses.toString(),
    `${(stat.successRate * 100).toFixed(1)}%`,
    formatCost(stat.averageCost)
  ]);
  
  ui.table(headers, rows);
  
  // Summary
  const totalUses = entries.reduce((sum, [, stat]) => sum + stat.uses, 0);
  const avgSuccessRate = entries.reduce((sum, [, stat]) => sum + stat.successRate, 0) / entries.length;
  const totalCost = entries.reduce((sum, [, stat]) => sum + (stat.uses * stat.averageCost), 0);
  
  console.log();
  console.log(chalk.bold('Summary:'));
  console.log(`  Total uses: ${totalUses}`);
  console.log(`  Average success rate: ${(avgSuccessRate * 100).toFixed(1)}%`);
  console.log(`  Total cost: ${formatCost(totalCost)}`);
  
  // Most used agent
  const [mostUsedAgent, mostUsedStat] = entries[0];
  console.log();
  console.log(chalk.green(`Most used agent: ${mostUsedAgent} (${mostUsedStat.uses} uses)`));
  
  // Best performing agent
  const bestAgent = entries.reduce((best, current) => 
    current[1].successRate > best[1].successRate ? current : best
  );
  console.log(chalk.green(`Best success rate: ${bestAgent[0]} (${(bestAgent[1].successRate * 100).toFixed(1)}%)`));
}

/**
 * Clean old state data
 */
async function cleanState(options: any) {
  ui.header('Clean State Data');
  
  const days = options.days || 30;
  
  console.log(chalk.yellow(`⚠️  This will delete sessions older than ${days} days`));
  console.log(chalk.gray('Note: Wisdom and agent statistics will not be affected\n'));
  
  // In a real implementation, we'd ask for confirmation
  // For now, just run the cleanup
  stateManager.cleanOldSessions(days);
  
  ui.success(`Cleaned sessions older than ${days} days`);
}
