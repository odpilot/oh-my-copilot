/**
 * Jira Plugin
 * Built-in plugin for Jira integration (stub implementation)
 */

import type { Plugin, PluginContext } from '../plugin-types.js';

export const JiraPlugin: Plugin = {
  name: 'jira',
  version: '1.0.0',
  description: 'Jira integration for Oh My Copilot',
  author: 'Oh My Copilot Team',
  
  tools: [
    {
      name: 'jira.createIssue',
      description: 'Create a Jira issue',
      parameters: {
        project: { type: 'string', required: true },
        summary: { type: 'string', required: true },
        description: { type: 'string', required: false },
        issueType: { type: 'string', default: 'Task' }
      },
      async execute(args, context) {
        context.logger.info(`Creating Jira issue: ${args.summary} in ${args.project}`);
        
        // This is a stub implementation
        return {
          success: true,
          issueKey: `${args.project}-${Math.floor(Math.random() * 1000)}`,
          url: `https://jira.example.com/browse/${args.project}-123`,
          message: `Issue "${args.summary}" created successfully`
        };
      }
    },
    {
      name: 'jira.listIssues',
      description: 'List Jira issues',
      parameters: {
        project: { type: 'string', required: true },
        status: { type: 'string', default: 'To Do' }
      },
      async execute(args, context) {
        context.logger.info(`Listing Jira issues in ${args.project} (status: ${args.status})`);
        
        // This is a stub implementation
        return {
          success: true,
          issues: [
            { key: `${args.project}-1`, summary: 'Example task 1', status: args.status },
            { key: `${args.project}-2`, summary: 'Example task 2', status: args.status }
          ],
          count: 2
        };
      }
    }
  ],

  async onLoad(context) {
    context.logger.info('Jira plugin loaded');
  },

  async onUnload() {
    // Cleanup if needed
  }
};

export default JiraPlugin;
