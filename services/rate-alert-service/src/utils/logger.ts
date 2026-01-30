/**
 * @file logger.ts
 * @author Balaji Koneti
 * @linkedin https://www.linkedin.com/in/balaji-koneti/
 * @github https://github.com/KonetiBalaji/kwalifai
 *
 * Copyright (C) 2026 Balaji Koneti
 * All Rights Reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized copying, modification, distribution, or use is prohibited.
 */

import { Request } from 'express';

// Extend Request type to include correlationId
declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

export class Logger {
  private static getCorrelationId(req?: Request): string {
    return req?.correlationId || 'no-correlation-id';
  }

  static info(message: string, req?: Request, data?: unknown): void {
    const correlationId = this.getCorrelationId(req);
    const logData = data ? ` ${JSON.stringify(data)}` : '';
    console.log(`[INFO] [${correlationId}] ${message}${logData}`);
  }

  static error(message: string, req?: Request, error?: Error | unknown): void {
    const correlationId = this.getCorrelationId(req);
    const errorData = error instanceof Error ? ` ${error.message} ${error.stack}` : error ? ` ${JSON.stringify(error)}` : '';
    console.error(`[ERROR] [${correlationId}] ${message}${errorData}`);
  }

  static warn(message: string, req?: Request, data?: unknown): void {
    const correlationId = this.getCorrelationId(req);
    const logData = data ? ` ${JSON.stringify(data)}` : '';
    console.warn(`[WARN] [${correlationId}] ${message}${logData}`);
  }

  static debug(message: string, req?: Request, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      const correlationId = this.getCorrelationId(req);
      const logData = data ? ` ${JSON.stringify(data)}` : '';
      console.debug(`[DEBUG] [${correlationId}] ${message}${logData}`);
    }
  }
}
