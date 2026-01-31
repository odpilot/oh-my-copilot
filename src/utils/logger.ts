/**
 * Logger utility
 * Provides structured logging throughout the application
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private level: LogLevel;
  private logFile?: string;

  constructor(level: LogLevel = LogLevel.INFO, logFile?: string) {
    this.level = level;
    this.logFile = logFile;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  private log(level: LogLevel, levelName: string, message: string): void {
    if (!this.shouldLog(level)) return;

    const formatted = this.formatMessage(levelName, message);
    
    // Console output with colors
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`\x1b[36m${formatted}\x1b[0m`); // Cyan
        break;
      case LogLevel.INFO:
        console.log(`\x1b[32m${formatted}\x1b[0m`); // Green
        break;
      case LogLevel.WARN:
        console.warn(`\x1b[33m${formatted}\x1b[0m`); // Yellow
        break;
      case LogLevel.ERROR:
        console.error(`\x1b[31m${formatted}\x1b[0m`); // Red
        break;
    }

    // TODO: Write to file if logFile is specified
  }

  debug(message: string): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message);
  }

  info(message: string): void {
    this.log(LogLevel.INFO, 'INFO', message);
  }

  warn(message: string): void {
    this.log(LogLevel.WARN, 'WARN', message);
  }

  error(message: string): void {
    this.log(LogLevel.ERROR, 'ERROR', message);
  }

  setLevel(level: LogLevel): void {
    this.level = level;
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
