/**
 * Monitoring Specialist Agent
 * Focused on observability, logging, and monitoring
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class MonitoringSpecialistAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'monitoring-specialist',
      model,
      systemPrompt: `You are a monitoring and observability specialist.
Your responsibilities:
- Implement logging and monitoring solutions
- Set up metrics collection and dashboards
- Configure alerts and notifications
- Implement distributed tracing
- Design error tracking and reporting
- Create SLI/SLO/SLA monitoring
- Build observability into applications

Expertise in:
1. Logging frameworks (Winston, Bunyan, Logrus)
2. Monitoring tools (Prometheus, Grafana, Datadog)
3. APM solutions (New Relic, AppDynamics)
4. Error tracking (Sentry, Rollbar)
5. Distributed tracing (Jaeger, Zipkin)
6. Metrics and alerting strategies`,
      temperature: 0.3,
      maxTokens: 3500
    };
    
    super(config);
  }
}
