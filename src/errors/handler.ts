/**
 * Error Handler
 * Provides centralized error handling and formatting
 */

import { OMCError } from './index.js';

export class ErrorHandler {
  private static formatError(error: OMCError): string {
    let output = `\n❌ ${error.name}: ${error.message}\n`;
    
    if (error.code) {
      output += `   Code: ${error.code}\n`;
    }
    
    if (error.suggestion) {
      output += `   💡 Suggestion: ${error.suggestion}\n`;
    }
    
    if (error.details && Object.keys(error.details).length > 0) {
      output += `   Details: ${JSON.stringify(error.details, null, 2)}\n`;
    }
    
    return output;
  }
  
  static handle(error: unknown): never {
    if (error instanceof OMCError) {
      console.error(this.formatError(error));
    } else if (error instanceof Error) {
      console.error(`\n❌ Error: ${error.message}\n`);
    } else {
      console.error(`\n❌ Unknown error: ${String(error)}\n`);
    }
    
    process.exit(1);
  }
  
  static async wrap<T>(fn: () => Promise<T>, context?: string): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (context) {
        console.error(`Error in ${context}:`);
      }
      throw error;
    }
  }
}
