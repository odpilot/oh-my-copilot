import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Logger, LogLevel } from '../../src/utils/logger.js';

describe('Logger', () => {
  let logger: Logger;
  let consoleLogSpy: any;
  let consoleErrorSpy: any;
  let consoleWarnSpy: any;
  let consoleDebugSpy: any;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create logger with default level INFO', () => {
      logger = new Logger();
      logger.info('test');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should create logger with custom level', () => {
      logger = new Logger(LogLevel.ERROR);
      logger.info('test');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('log levels', () => {
    beforeEach(() => {
      logger = new Logger(LogLevel.DEBUG);
    });

    it('should log debug messages', () => {
      logger.debug('debug message');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should log info messages', () => {
      logger.info('info message');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should log warning messages', () => {
      logger.warn('warning message');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should log error messages', () => {
      logger.error('error message');
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('log level filtering', () => {
    it('should not log debug when level is INFO', () => {
      logger = new Logger(LogLevel.INFO);
      logger.debug('debug');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should not log info when level is WARN', () => {
      logger = new Logger(LogLevel.WARN);
      logger.info('info');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should not log warn when level is ERROR', () => {
      logger = new Logger(LogLevel.ERROR);
      logger.warn('warn');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should log error when level is ERROR', () => {
      logger = new Logger(LogLevel.ERROR);
      logger.error('error');
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('setLevel', () => {
    it('should change log level dynamically', () => {
      logger = new Logger(LogLevel.ERROR);
      logger.info('info');
      expect(consoleLogSpy).not.toHaveBeenCalled();

      logger.setLevel(LogLevel.INFO);
      logger.info('info');
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('message formatting', () => {
    it('should include timestamp in log message', () => {
      logger = new Logger(LogLevel.INFO);
      logger.info('test message');
      expect(consoleLogSpy).toHaveBeenCalled();
      const loggedMessage = consoleLogSpy.mock.calls[0][0];
      expect(loggedMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should include level in log message', () => {
      logger = new Logger(LogLevel.INFO);
      logger.info('test message');
      const loggedMessage = consoleLogSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('[INFO]');
    });

    it('should include actual message', () => {
      logger = new Logger(LogLevel.INFO);
      logger.info('test message');
      const loggedMessage = consoleLogSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('test message');
    });
  });
});
