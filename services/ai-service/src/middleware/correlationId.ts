/**
 * @file correlationId.ts
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
import { v4 as uuidv4 } from 'uuid';

export interface CorrelationRequest extends Request {
  correlationId?: string;
}

/**
 * Middleware to handle correlation IDs for distributed tracing
 * Forwards existing correlation ID or generates a new one
 */
export function correlationIdMiddleware(
  req: CorrelationRequest,
  res: Response,
  next: NextFunction
): void {
  // Use existing correlation ID from header or generate new one
  const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
  
  // Attach to request object
  req.correlationId = correlationId;
  
  // Add to response headers
  res.setHeader('x-correlation-id', correlationId);
  
  next();
}
