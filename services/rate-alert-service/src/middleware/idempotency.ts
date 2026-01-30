/**
 * @file idempotency.ts
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

// In-memory store for idempotency keys (in production, use Redis or database)
const idempotencyStore = new Map<string, { response: unknown; timestamp: number }>();

const IDEMPOTENCY_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Middleware to handle idempotency for POST/PUT/PATCH requests
 * Expects 'Idempotency-Key' header
 */
export const idempotencyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Only apply to mutating methods
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
    return next();
  }

  const idempotencyKey = req.headers['idempotency-key'] as string;

  if (!idempotencyKey) {
    return next();
  }

  // Check if we've seen this key before
  const cached = idempotencyStore.get(idempotencyKey);

  if (cached) {
    // Check if cached response is still valid (within TTL)
    const age = Date.now() - cached.timestamp;
    if (age < IDEMPOTENCY_TTL) {
      // Return cached response
      res.status(200).json(cached.response);
      return;
    } else {
      // Remove expired entry
      idempotencyStore.delete(idempotencyKey);
    }
  }

  // Store original json method
  const originalJson = res.json.bind(res);

  // Override json to cache the response
  res.json = function (body: unknown): Response {
    idempotencyStore.set(idempotencyKey, {
      response: body,
      timestamp: Date.now(),
    });

    // Clean up old entries periodically (simple cleanup)
    if (idempotencyStore.size > 1000) {
      const now = Date.now();
      for (const [key, value] of idempotencyStore.entries()) {
        if (now - value.timestamp > IDEMPOTENCY_TTL) {
          idempotencyStore.delete(key);
        }
      }
    }

    return originalJson(body);
  };

  next();
};
