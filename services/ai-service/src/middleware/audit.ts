/**
 * @file audit.ts
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

import { Request, Response, NextFunction } from 'express';
import { CorrelationRequest } from './correlationId';
import { AuthenticatedRequest } from './auth';

/**
 * Audit logging middleware
 * Logs all requests for compliance and debugging
 */
export function auditMiddleware(
  req: CorrelationRequest & AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();
  const correlationId = req.correlationId || 'unknown';
  const userId = req.userId || 'anonymous';
  const method = req.method;
  const path = req.path;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  // Log request
  console.log(`[AUDIT] ${method} ${path} | User: ${userId} | CorrelationId: ${correlationId} | IP: ${ip}`);

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    console.log(
      `[AUDIT] ${method} ${path} | Status: ${statusCode} | Duration: ${duration}ms | User: ${userId} | CorrelationId: ${correlationId}`
    );
  });

  next();
}
