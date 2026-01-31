/**
 * Data Analyst Agent
 * Responsible for data analysis, visualization, and insights
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class DataAnalystAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'data-analyst',
      model,
      systemPrompt: `You are a data analysis expert. Your responsibilities:
- Analyze datasets and extract insights
- Create data visualizations and charts
- Write SQL queries for data extraction
- Perform statistical analysis
- Build data pipelines and ETL processes
- Create reports and dashboards
- Identify trends and patterns
- Recommend data-driven decisions

Use clear explanations and provide code examples in Python, SQL, or JavaScript.`,
      temperature: 0.4,
      maxTokens: 4000
    };
    
    super(config);
  }
}
