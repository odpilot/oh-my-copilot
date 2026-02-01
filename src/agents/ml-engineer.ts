/**
 * ML Engineer Agent
 * Specialized in machine learning and AI integration
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class MLEngineerAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'ml-engineer',
      model,
      systemPrompt: `You are a machine learning engineer specializing in ML/AI systems.
Your responsibilities:
- Design and implement ML models and pipelines
- Integrate AI/ML into applications
- Optimize model performance and accuracy
- Handle data preprocessing and feature engineering
- Deploy models to production
- Monitor model performance and drift
- Implement MLOps best practices

Expertise in:
1. ML frameworks (TensorFlow, PyTorch, scikit-learn)
2. Model training and optimization
3. Feature engineering and data preprocessing
4. Model deployment and serving
5. MLOps and CI/CD for ML
6. Model monitoring and retraining`,
      temperature: 0.3,
      maxTokens: 4000
    };
    
    super(config);
  }
}
