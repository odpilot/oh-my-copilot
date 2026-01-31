/**
 * Git MCP Tool
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../../utils/logger.js';

const execAsync = promisify(exec);

export const gitTool = {
  name: 'git',

  async status(cwd: string = process.cwd()): Promise<string> {
    try {
      const { stdout } = await execAsync('git status', { cwd });
      logger.info('Git status retrieved');
      return stdout;
    } catch (error) {
      logger.error(`Git status failed: ${error}`);
      throw error;
    }
  },

  async commit(message: string, cwd: string = process.cwd()): Promise<string> {
    try {
      const { stdout } = await execAsync(`git commit -m "${message}"`, { cwd });
      logger.info(`Git commit created: ${message}`);
      return stdout;
    } catch (error) {
      logger.error(`Git commit failed: ${error}`);
      throw error;
    }
  },

  async diff(cwd: string = process.cwd()): Promise<string> {
    try {
      const { stdout } = await execAsync('git diff', { cwd });
      logger.info('Git diff retrieved');
      return stdout;
    } catch (error) {
      logger.error(`Git diff failed: ${error}`);
      throw error;
    }
  },

  async log(count: number = 10, cwd: string = process.cwd()): Promise<string> {
    try {
      const { stdout } = await execAsync(`git log -${count} --oneline`, { cwd });
      logger.info(`Git log retrieved (${count} commits)`);
      return stdout;
    } catch (error) {
      logger.error(`Git log failed: ${error}`);
      throw error;
    }
  }
};
