/**
 * @file refreshTokenHandler.ts
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

import { Request, Response } from 'express';

/**
 * Helper function to set refresh token response
 * Web: Set as httpOnly secure cookie
 * Mobile: Return in JSON response
 */
export function setRefreshTokenResponse(
  req: Request,
  res: Response,
  refreshToken: string,
  responseBody: any
): Response {
  const isMobile = req.headers['x-client-type'] === 'mobile';

  if (isMobile) {
    // Mobile: Return in JSON
    return res.json({
      ...responseBody,
      refreshToken,
    });
  } else {
    // Web: Set as httpOnly secure cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/auth',
    });

    // Remove refreshToken from JSON response for web clients
    const { refreshToken: _, ...bodyWithoutToken } = responseBody;
    return res.json(bodyWithoutToken);
  }
}

/**
 * Extract refresh token from request
 * Checks cookie first (web), then body (mobile)
 */
export function extractRefreshToken(req: Request): string | null {
  // Check cookie first (web clients)
  const cookieToken = req.cookies?.refreshToken;
  if (cookieToken) {
    return cookieToken;
  }

  // Check body (mobile clients)
  const bodyToken = req.body?.refreshToken;
  if (bodyToken) {
    return bodyToken;
  }

  return null;
}
