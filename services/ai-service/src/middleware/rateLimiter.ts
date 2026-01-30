/**
 * @file rateLimiter.ts
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

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from './auth';

/**
 * Rate limiter for unauthenticated users
 * 20 requests per 15 minutes per IP
 */
export const unauthenticatedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    error: 'Too many requests',
    message: 'Please try again later. Rate limit: 20 requests per 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.ip || 'unknown';
  },
});

/**
 * Rate limiter for authenticated users
 * 50 requests per 15 minutes per user
 */
export const authenticatedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: {
    error: 'Too many requests',
    message: 'Please try again later. Rate limit: 50 requests per 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const authReq = req as AuthenticatedRequest;
    return authReq.userId || authReq.ip || 'unknown';
  },
  skip: (req: Request) => {
    // Skip if user is not authenticated (use unauthenticated limiter instead)
    const authReq = req as AuthenticatedRequest;
    return !authReq.userId;
  },
});

/**
 * Combined rate limiter middleware
 * Applies appropriate limit based on authentication status
 */
export const chatRateLimiter = [unauthenticatedLimiter, authenticatedLimiter];
