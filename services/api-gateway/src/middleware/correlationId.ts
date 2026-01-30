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

/**
 * Correlation ID header name
 */
export const CORRELATION_ID_HEADER = 'x-correlation-id';

/**
 * Middleware to add correlation ID to requests
 * Generates a new UUID if not present in request headers
 */
export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const correlationId = req.headers[CORRELATION_ID_HEADER] as string || uuidv4();
  
  // Add to request for downstream services
  req.headers[CORRELATION_ID_HEADER] = correlationId;
  
  // Add to response headers
  res.setHeader(CORRELATION_ID_HEADER, correlationId);
  
  // Add to request object for easy access
  (req as any).correlationId = correlationId;
  
  next();
}
