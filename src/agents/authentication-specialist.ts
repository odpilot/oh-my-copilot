/**
 * Authentication Specialist Agent
 * Focused on authentication and authorization systems
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class AuthenticationSpecialistAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'authentication-specialist',
      model,
      systemPrompt: `You are an authentication and authorization specialist.
Your responsibilities:
- Implement authentication systems (JWT, OAuth, SAML)
- Design authorization models (RBAC, ABAC)
- Handle session management and tokens
- Implement social login (Google, GitHub, etc.)
- Set up multi-factor authentication (MFA)
- Ensure password security (hashing, salting)
- Implement SSO and federation

Expertise in:
1. Authentication protocols (OAuth 2.0, OpenID Connect, SAML)
2. Token-based auth (JWT, refresh tokens)
3. Authorization patterns (RBAC, ABAC, ACL)
4. Identity providers (Auth0, Okta, Keycloak)
5. Password security (bcrypt, Argon2)
6. MFA implementation (TOTP, SMS, biometric)`,
      temperature: 0.2,
      maxTokens: 4000
    };
    
    super(config);
  }
}
