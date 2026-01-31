/**
 * Shell MCP Tool
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../../utils/logger.js';

const execAsync = promisify(exec);

export const shellTool = {
  name: 'shell',

  async execute(command: string, cwd: string = process.cwd()): Promise<{ stdout: string; stderr: string }> {
    try {
      logger.info(`Executing shell command: ${command}`);
      const result = await execAsync(command, { cwd });
      return result;
    } catch (error: any) {
      logger.error(`Shell command failed: ${error.message}`);
      throw error;
    }
  },

  async which(program: string): Promise<string | null> {
    try {
      const { stdout } = await execAsync(`which ${program}`);
      return stdout.trim();
    } catch (error) {
      return null;
    }
  }
};
