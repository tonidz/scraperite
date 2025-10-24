type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log errors and warnings
    if (!this.isDevelopment && (level === 'debug' || level === 'info')) {
      return false;
    }
    return true;
  }

  private sendToMonitoring(level: LogLevel, message: string, context?: LogContext) {
    // In production, send errors to a monitoring service
    // This is where you'd integrate with Sentry, LogRocket, etc.
    if (!this.isDevelopment && level === 'error') {
      // Example: Sentry.captureException(new Error(message), { extra: context });
    }
  }

  info(message: string, context?: LogContext) {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
    this.sendToMonitoring('warn', message, context);
  }

  error(message: string, error?: unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };

    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, errorContext));
    }
    this.sendToMonitoring('error', message, errorContext);
  }

  debug(message: string, context?: LogContext) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

// Export a singleton instance
export const logger = new Logger();
