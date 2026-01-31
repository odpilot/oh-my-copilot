/**
 * HTTP MCP Tool
 */

import { logger } from '../../utils/logger.js';

export const httpTool = {
  name: 'http',

  async get(url: string, headers?: Record<string, string>): Promise<any> {
    try {
      logger.info(`HTTP GET: ${url}`);
      const response = await fetch(url, { headers });
      const data = await response.json();
      return data;
    } catch (error) {
      logger.error(`HTTP GET failed: ${error}`);
      throw error;
    }
  },

  async post(url: string, body: any, headers?: Record<string, string>): Promise<any> {
    try {
      logger.info(`HTTP POST: ${url}`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      logger.error(`HTTP POST failed: ${error}`);
      throw error;
    }
  },

  async put(url: string, body: any, headers?: Record<string, string>): Promise<any> {
    try {
      logger.info(`HTTP PUT: ${url}`);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      logger.error(`HTTP PUT failed: ${error}`);
      throw error;
    }
  },

  async delete(url: string, headers?: Record<string, string>): Promise<any> {
    try {
      logger.info(`HTTP DELETE: ${url}`);
      const response = await fetch(url, { method: 'DELETE', headers });
      const data = await response.json();
      return data;
    } catch (error) {
      logger.error(`HTTP DELETE failed: ${error}`);
      throw error;
    }
  }
};
