/**
 * State Management
 * Handles session state persistence and wisdom capture
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { logger } from '../utils/logger.js';

export interface SessionState {
  id: string;
  mode: string;
  startTime: number;
  endTime?: number;
  status: 'active' | 'completed' | 'failed';
  totalCost: number;
  agentsUsed: string[];
  tasks: Array<{
    title: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    agentName?: string;
    cost?: number;
  }>;
  metadata?: Record<string, any>;
}

export interface WisdomEntry {
  id: string;
  timestamp: number;
  category: 'success' | 'failure' | 'optimization' | 'insight';
  context: string;
  learning: string;
  tags: string[];
  relatedAgents: string[];
}

export interface GlobalState {
  totalExecutions: number;
  totalCost: number;
  wisdomEntries: WisdomEntry[];
  agentStats: Record<string, {
    uses: number;
    successRate: number;
    averageCost: number;
  }>;
  preferences?: Record<string, any>;
}

export class StateManager {
  private projectStateDir: string;
  private globalStateDir: string;
  private notepadDir: string;

  constructor(projectPath: string = process.cwd()) {
    // Local project state
    this.projectStateDir = path.join(projectPath, '.omc', 'state');
    this.notepadDir = path.join(projectPath, '.omc', 'notepads');
    
    // Global state
    this.globalStateDir = path.join(os.homedir(), '.omc', 'state');
    
    // Ensure directories exist
    this.ensureDirectories();
  }

  /**
   * Ensure all state directories exist
   */
  private ensureDirectories(): void {
    [this.projectStateDir, this.globalStateDir, this.notepadDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Save session state
   */
  saveSessionState(state: SessionState): void {
    try {
      const filePath = path.join(this.projectStateDir, `${state.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf-8');
      logger.info(`Session state saved: ${state.id}`);
    } catch (error) {
      logger.error(`Failed to save session state: ${error}`);
    }
  }

  /**
   * Load session state
   */
  loadSessionState(sessionId: string): SessionState | null {
    try {
      const filePath = path.join(this.projectStateDir, `${sessionId}.json`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      logger.error(`Failed to load session state: ${error}`);
    }
    return null;
  }

  /**
   * Get all sessions
   */
  getAllSessions(): SessionState[] {
    try {
      const files = fs.readdirSync(this.projectStateDir);
      const sessions: SessionState[] = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.projectStateDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          sessions.push(JSON.parse(content));
        }
      }
      
      return sessions.sort((a, b) => b.startTime - a.startTime);
    } catch (error) {
      logger.error(`Failed to get sessions: ${error}`);
      return [];
    }
  }

  /**
   * Save global state
   */
  saveGlobalState(state: GlobalState): void {
    try {
      const filePath = path.join(this.globalStateDir, 'global.json');
      fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf-8');
    } catch (error) {
      logger.error(`Failed to save global state: ${error}`);
    }
  }

  /**
   * Load global state
   */
  loadGlobalState(): GlobalState {
    try {
      const filePath = path.join(this.globalStateDir, 'global.json');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      logger.error(`Failed to load global state: ${error}`);
    }
    
    // Return default state
    return {
      totalExecutions: 0,
      totalCost: 0,
      wisdomEntries: [],
      agentStats: {},
      preferences: {}
    };
  }

  /**
   * Capture wisdom/learning
   */
  captureWisdom(entry: Omit<WisdomEntry, 'id' | 'timestamp'>): void {
    try {
      const wisdom: WisdomEntry = {
        ...entry,
        id: `wisdom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now()
      };

      // Update global state
      const globalState = this.loadGlobalState();
      globalState.wisdomEntries.push(wisdom);
      
      // Keep only last 100 wisdom entries
      if (globalState.wisdomEntries.length > 100) {
        globalState.wisdomEntries = globalState.wisdomEntries.slice(-100);
      }
      
      this.saveGlobalState(globalState);
      
      logger.info(`Wisdom captured: ${wisdom.learning.substring(0, 50)}...`);
    } catch (error) {
      logger.error(`Failed to capture wisdom: ${error}`);
    }
  }

  /**
   * Save notepad for a plan
   */
  saveNotepad(planName: string, content: string): void {
    try {
      const planDir = path.join(this.notepadDir, planName);
      if (!fs.existsSync(planDir)) {
        fs.mkdirSync(planDir, { recursive: true });
      }
      
      const filePath = path.join(planDir, 'notes.md');
      const timestamp = new Date().toISOString();
      const entry = `\n\n## ${timestamp}\n\n${content}\n`;
      
      fs.appendFileSync(filePath, entry, 'utf-8');
      logger.info(`Notepad updated for plan: ${planName}`);
    } catch (error) {
      logger.error(`Failed to save notepad: ${error}`);
    }
  }

  /**
   * Load notepad for a plan
   */
  loadNotepad(planName: string): string {
    try {
      const filePath = path.join(this.notepadDir, planName, 'notes.md');
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8');
      }
    } catch (error) {
      logger.error(`Failed to load notepad: ${error}`);
    }
    return '';
  }

  /**
   * Update agent statistics
   */
  updateAgentStats(agentName: string, success: boolean, cost: number): void {
    try {
      const globalState = this.loadGlobalState();
      
      if (!globalState.agentStats[agentName]) {
        globalState.agentStats[agentName] = {
          uses: 0,
          successRate: 0,
          averageCost: 0
        };
      }
      
      const stats = globalState.agentStats[agentName];
      stats.uses += 1;
      
      // Update success rate
      const prevSuccesses = stats.successRate * (stats.uses - 1);
      stats.successRate = (prevSuccesses + (success ? 1 : 0)) / stats.uses;
      
      // Update average cost
      const prevTotalCost = stats.averageCost * (stats.uses - 1);
      stats.averageCost = (prevTotalCost + cost) / stats.uses;
      
      this.saveGlobalState(globalState);
    } catch (error) {
      logger.error(`Failed to update agent stats: ${error}`);
    }
  }

  /**
   * Get wisdom by category
   */
  getWisdomByCategory(category: string): WisdomEntry[] {
    const globalState = this.loadGlobalState();
    return globalState.wisdomEntries.filter(w => w.category === category);
  }

  /**
   * Get wisdom by tags
   */
  getWisdomByTags(tags: string[]): WisdomEntry[] {
    const globalState = this.loadGlobalState();
    return globalState.wisdomEntries.filter(w => 
      w.tags.some(tag => tags.includes(tag))
    );
  }

  /**
   * Get agent statistics
   */
  getAgentStats(agentName?: string): Record<string, any> {
    const globalState = this.loadGlobalState();
    
    if (agentName) {
      return globalState.agentStats[agentName] || null;
    }
    
    return globalState.agentStats;
  }

  /**
   * Clean old sessions (older than 30 days)
   */
  cleanOldSessions(daysToKeep: number = 30): void {
    try {
      const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
      const files = fs.readdirSync(this.projectStateDir);
      
      let deletedCount = 0;
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.projectStateDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const session: SessionState = JSON.parse(content);
          
          if (session.startTime < cutoffTime) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        }
      }
      
      if (deletedCount > 0) {
        logger.info(`Cleaned ${deletedCount} old sessions`);
      }
    } catch (error) {
      logger.error(`Failed to clean old sessions: ${error}`);
    }
  }
}

// Export singleton instance
export const stateManager = new StateManager();
