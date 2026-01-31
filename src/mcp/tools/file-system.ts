/**
 * File System MCP Tool
 */

import { readFile, writeFile, readdir } from 'fs/promises';
import { logger } from '../../utils/logger.js';

export const fileSystemTool = {
  name: 'filesystem',
  
  async readFile(path: string): Promise<string> {
    try {
      const content = await readFile(path, 'utf-8');
      logger.info(`Read file: ${path}`);
      return content;
    } catch (error) {
      logger.error(`Failed to read file ${path}: ${error}`);
      throw error;
    }
  },

  async writeFile(path: string, content: string): Promise<void> {
    try {
      await writeFile(path, content, 'utf-8');
      logger.info(`Wrote file: ${path}`);
    } catch (error) {
      logger.error(`Failed to write file ${path}: ${error}`);
      throw error;
    }
  },

  async listDirectory(path: string): Promise<string[]> {
    try {
      const entries = await readdir(path);
      logger.info(`Listed directory: ${path}`);
      return entries;
    } catch (error) {
      logger.error(`Failed to list directory ${path}: ${error}`);
      throw error;
    }
  }
};
