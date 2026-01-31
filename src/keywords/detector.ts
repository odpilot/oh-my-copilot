/**
 * Keyword Detector
 * Detects execution mode from input text
 */

import { PATTERNS, type KeywordPattern } from './patterns.js';

export type ExecutionMode = 'autopilot' | 'ultrawork' | 'swarm' | 'ecomode' | 'default';

export interface DetectionResult {
  mode: ExecutionMode;
  confidence: number;
  matchedKeywords: string[];
  description?: string;
}

export class KeywordDetector {
  /**
   * Detect execution mode from input text
   */
  detect(input: string): DetectionResult {
    const lowerInput = input.toLowerCase();
    
    for (const pattern of PATTERNS) {
      const matchedKeywords = pattern.keywords.filter(keyword => 
        lowerInput.includes(keyword)
      );
      
      if (matchedKeywords.length > 0) {
        // Calculate confidence based on number of matches and specificity
        const confidence = Math.min(matchedKeywords.length * 0.3 + 0.7, 1.0);
        
        return {
          mode: pattern.mode,
          confidence,
          matchedKeywords,
          description: pattern.description
        };
      }
    }
    
    return {
      mode: 'default',
      confidence: 1.0,
      matchedKeywords: []
    };
  }

  /**
   * Get all available modes
   */
  getAvailableModes(): KeywordPattern[] {
    return [...PATTERNS];
  }

  /**
   * Check if input matches a specific mode
   */
  matchesMode(input: string, mode: ExecutionMode): boolean {
    const result = this.detect(input);
    return result.mode === mode;
  }
}

// Singleton instance
export const keywordDetector = new KeywordDetector();
