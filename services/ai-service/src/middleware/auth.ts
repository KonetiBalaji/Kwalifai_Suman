/**
 * @file auth.ts
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
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { User } from '../types/ai';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';

export interface AuthenticatedRequest extends Request {
  user?: User;
  userId?: string;
  userEmail?: string;
}

/**
 * JWT verification middleware
 * Optional authentication - doesn't fail if no token provided
 */
export async function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided - continue without authentication
    return next();
  }

  const token = authHeader.substring(7);

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; type?: string };

    if (decoded.type !== 'access') {
      return next(); // Not an access token, continue without auth
    }

    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    // Fetch user profile from auth-service (with shorter timeout to avoid hanging)
    try {
      const profileResponse = await axios.get(`${AUTH_SERVICE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-correlation-id': (req as any).correlationId || req.headers['x-correlation-id'],
        },
        timeout: 2000, // Reduced timeout to avoid hanging
      });

      if (profileResponse.data && profileResponse.data.user) {
        req.user = {
          id: profileResponse.data.user.id || decoded.userId,
          email: profileResponse.data.user.email || decoded.email,
          firstName: profileResponse.data.user.firstName,
          lastName: profileResponse.data.user.lastName,
        };
      } else {
        // Fallback to token data
        req.user = {
          id: decoded.userId,
          email: decoded.email,
        };
      }
    } catch (profileError) {
      // If profile fetch fails, use token data
      console.warn('Failed to fetch user profile:', profileError);
      req.user = {
        id: decoded.userId,
        email: decoded.email,
      };
    }

    next();
  } catch (error) {
    // Invalid token - continue without authentication
    console.warn('JWT verification failed:', error);
    next();
  }
}
