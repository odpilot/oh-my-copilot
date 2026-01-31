/**
 * Logger utility
 * Provides structured logging throughout the application
 */

import fs from 'fs';
import path from 'path';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: Record<string, any>;
  duration?: number;
  taskId?: string;
  agentName?: string;
}

export interface LoggerOptions {
  level?: LogLevel;
  format?: 'text' | 'json';
  output?: 'console' | 'file' | 'both';
  filePath?: string;
  maxFileSize?: number;     // bytes
  maxFiles?: number;
  includeTimestamp?: boolean;
  includeContext?: boolean;
}

export class Logger {
  private level: LogLevel;
  private logFile?: string;
  private options: Required<LoggerOptions>;
  private fileStream?: fs.WriteStream;
  private currentFileSize = 0;

  constructor(level: LogLevel = LogLevel.INFO, logFile?: string) {
    this.level = level;
    this.logFile = logFile;
    this.options = {
      level,
      format: 'text',
      output: logFile ? 'both' : 'console',
      filePath: logFile ?? './logs/omc.log',
      maxFileSize: 10 * 1024 * 1024,  // 10MB
      maxFiles: 5,
      includeTimestamp: true,
      includeContext: true
    };
    
    if (this.options.output !== 'console' && logFile) {
      this.initFileStream();
    }
  }
  
  private initFileStream(): void {
    const dir = path.dirname(this.options.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    this.fileStream = fs.createWriteStream(this.options.filePath, { flags: 'a' });
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }
  
  private formatEntry(entry: LogEntry): string {
    if (this.options.format === 'json') {
      return JSON.stringify(entry);
    }
    
    let output = '';
    
    if (this.options.includeTimestamp) {
      output += `[${entry.timestamp}] `;
    }
    
    output += `[${entry.level}] ${entry.message}`;
    
    if (entry.agentName) {
      output += ` (agent: ${entry.agentName})`;
    }
    
    if (entry.duration !== undefined) {
      output += ` (${entry.duration}ms)`;
    }
    
    if (this.options.includeContext && entry.context) {
      output += `\n  Context: ${JSON.stringify(entry.context)}`;
    }
    
    return output;
  }
  
  private writeEntry(entry: LogEntry): void {
    const formatted = this.formatEntry(entry);
    
    if (this.options.output === 'console' || this.options.output === 'both') {
      const colorFn = this.getColorFn(entry.level);
      console.log(colorFn(formatted));
    }
    
    if (this.options.output === 'file' || this.options.output === 'both') {
      this.writeToFile(formatted + '\n');
    }
  }
  
  private writeToFile(content: string): void {
    if (!this.fileStream) return;
    
    this.fileStream.write(content);
    this.currentFileSize += Buffer.byteLength(content);
    
    if (this.currentFileSize >= this.options.maxFileSize) {
      this.rotateFile();
    }
  }
  
  private rotateFile(): void {
    this.fileStream?.end();
    
    // Rotate files
    for (let i = this.options.maxFiles - 1; i >= 0; i--) {
      const current = i === 0 
        ? this.options.filePath 
        : `${this.options.filePath}.${i}`;
      const next = `${this.options.filePath}.${i + 1}`;
      
      if (fs.existsSync(current)) {
        if (i === this.options.maxFiles - 1) {
          fs.unlinkSync(current);
        } else {
          fs.renameSync(current, next);
        }
      }
    }
    
    this.currentFileSize = 0;
    this.initFileStream();
  }
  
  private getColorFn(level: string): (text: string) => string {
    switch (level) {
      case 'DEBUG':
        return (text) => `\x1b[36m${text}\x1b[0m`; // Cyan
      case 'INFO':
        return (text) => `\x1b[32m${text}\x1b[0m`; // Green
      case 'WARN':
        return (text) => `\x1b[33m${text}\x1b[0m`; // Yellow
      case 'ERROR':
        return (text) => `\x1b[31m${text}\x1b[0m`; // Red
      default:
        return (text) => text;
    }
  }

  private log(level: LogLevel, levelName: string, message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: levelName,
      message,
      context
    };
    
    this.writeEntry(entry);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, 'INFO', message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, 'WARN', message, context);
  }

  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, 'ERROR', message, context);
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }
  
  // Task logging
  taskStart(taskId: string, agentName: string, description: string): void {
    this.info(`Task started: ${description}`, { taskId, agentName });
  }
  
  taskEnd(taskId: string, agentName: string, duration: number, success: boolean): void {
    const level = success ? 'info' : 'error';
    this[level](`Task ${success ? 'completed' : 'failed'}`, {
      taskId,
      agentName,
      duration
    });
  }
  
  setOptions(options: Partial<LoggerOptions>): void {
    this.options = { ...this.options, ...options };
    if (options.level !== undefined) {
      this.level = options.level;
    }
  }
}

// Singleton logger instance
export const logger = new Logger(
  process.env.LOG_LEVEL === 'debug' ? LogLevel.DEBUG :
  process.env.LOG_LEVEL === 'warn' ? LogLevel.WARN :
  process.env.LOG_LEVEL === 'error' ? LogLevel.ERROR :
  LogLevel.INFO,
  process.env.LOG_FILE
);
