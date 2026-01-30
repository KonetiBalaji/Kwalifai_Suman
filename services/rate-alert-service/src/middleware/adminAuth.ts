/**
 * @file adminAuth.ts
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
import { AppError } from '../utils/errors';

/**
 * Middleware to authenticate admin requests
 * Checks for X-Admin-Key header matching ADMIN_KEY environment variable
 */
export const adminAuthMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const adminKey = req.headers['x-admin-key'] as string;
  const expectedKey = process.env.ADMIN_KEY;

  if (!expectedKey) {
    throw new AppError('ADMIN_CONFIG_ERROR', 'Admin authentication not configured', 500);
  }

  if (!adminKey || adminKey !== expectedKey) {
    throw new AppError('UNAUTHORIZED', 'Invalid admin key', 401);
  }

  next();
};
