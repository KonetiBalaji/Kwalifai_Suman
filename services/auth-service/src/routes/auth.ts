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

import { Router, Request, Response } from 'express';
import type { Router as ExpressRouter } from 'express';
import { validate } from '../middleware/validation';
import {
  registerSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth';
import {
  registerRateLimiter,
  verifyRateLimiter,
  loginRateLimiter,
  forgotPasswordRateLimiter,
  resetPasswordRateLimiter,
} from '../middleware/rateLimiter';
import {
  registerUser,
  verifyEmail,
  verifyPhone,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
} from '../services/authService';
import {
  setRefreshTokenResponse,
  extractRefreshToken,
} from '../middleware/refreshTokenHandler';
import { logAuditEvent, getClientIp, getUserAgent } from '../utils/audit';

const router: ExpressRouter = Router();

/**
 * POST /auth/register
 * Register a new user
 */
router.post(
  '/register',
  registerRateLimiter,
  validate(registerSchema),
  async (req: Request, res: Response) => {
    try {
      const result = await registerUser(req.body);
      return res.status(201).json(result);
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({
        error: 'An error occurred during registration. Please try again later.',
      });
    }
  }
);

/**
 * POST /auth/verify-email
 * Verify email with OTP code
 */
router.post(
  '/verify-email',
  verifyRateLimiter,
  validate(verifyEmailSchema),
  async (req: Request, res: Response) => {
    try {
      const result = await verifyEmail(req.body);
      const statusCode = result.success ? 200 : 400;
      return res.status(statusCode).json(result);
    } catch (error) {
      console.error('Email verification error:', error);
      return res.status(500).json({
        error: 'An error occurred during verification. Please try again later.',
      });
    }
  }
);

/**
 * POST /auth/verify-phone
 * Verify phone with OTP code
 */
router.post(
  '/verify-phone',
  verifyRateLimiter,
  validate(verifyPhoneSchema),
  async (req: Request, res: Response) => {
    try {
      const result = await verifyPhone(req.body);
      const statusCode = result.success ? 200 : 400;
      return res.status(statusCode).json(result);
    } catch (error) {
      console.error('Phone verification error:', error);
      return res.status(500).json({
        error: 'An error occurred during verification. Please try again later.',
      });
    }
  }
);

/**
 * POST /auth/login
 * Login user with email or phone
 */
router.post(
  '/login',
  loginRateLimiter,
  validate(loginSchema),
  async (req: Request, res: Response) => {
    try {
      const ipAddress = getClientIp(req);
      const userAgent = getUserAgent(req);

      const result = await loginUser(req.body, ipAddress, userAgent);

      if (result.success && result.accessToken && result.refreshToken) {
        logAuditEvent('login', req, {
          userId: result.user?.id,
          success: true,
        });

        // Handle refresh token response (cookie for web, JSON for mobile)
        return setRefreshTokenResponse(req, res, result.refreshToken, {
          success: true,
          accessToken: result.accessToken,
          user: result.user,
        });
      } else {
        logAuditEvent('login', req, {
          success: false,
          error: 'Invalid credentials',
        });

        return res.status(401).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      logAuditEvent('login', req, {
        success: false,
        error: 'Internal server error',
      });

      return res.status(500).json({
        error: 'An error occurred during login. Please try again later.',
      });
    }
  }
);

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post(
  '/refresh',
  validate(refreshSchema),
  async (req: Request, res: Response) => {
    try {
      const refreshToken = extractRefreshToken(req);

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required.',
        });
      }

      const ipAddress = getClientIp(req);
      const userAgent = getUserAgent(req);

      const result = await refreshAccessToken(refreshToken, ipAddress, userAgent);

      if (result.success && result.accessToken && result.refreshToken) {
        logAuditEvent('refresh_token', req, {
          success: true,
        });

        // Handle refresh token response (cookie for web, JSON for mobile)
        return setRefreshTokenResponse(req, res, result.refreshToken, {
          success: true,
          accessToken: result.accessToken,
        });
      } else {
        logAuditEvent('refresh_token', req, {
          success: false,
          error: result.message,
        });

        return res.status(401).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      logAuditEvent('refresh_token', req, {
        success: false,
        error: 'Internal server error',
      });

      return res.status(500).json({
        error: 'An error occurred during token refresh. Please try again later.',
      });
    }
  }
);

/**
 * POST /auth/logout
 * Logout user by revoking refresh token
 */
router.post(
  '/logout',
  validate(logoutSchema),
  async (req: Request, res: Response) => {
    try {
      const refreshToken = extractRefreshToken(req);

      if (!refreshToken) {
        // Still return success to prevent enumeration
        return res.status(200).json({
          success: true,
          message: 'Logged out successfully.',
        });
      }

      const result = await logoutUser(refreshToken);

      logAuditEvent('logout', req, {
        success: result.success,
      });

      // Clear refresh token cookie if present
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/auth',
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error('Logout error:', error);
      logAuditEvent('logout', req, {
        success: false,
        error: 'Internal server error',
      });

      return res.status(500).json({
        error: 'An error occurred during logout. Please try again later.',
      });
    }
  }
);

/**
 * POST /auth/forgot-password
 * Request password reset
 */
router.post(
  '/forgot-password',
  forgotPasswordRateLimiter,
  validate(forgotPasswordSchema),
  async (req: Request, res: Response) => {
    try {
      const result = await forgotPassword(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(500).json({
        error: 'An error occurred. Please try again later.',
      });
    }
  }
);

/**
 * POST /auth/reset-password
 * Reset password using reset code
 */
router.post(
  '/reset-password',
  resetPasswordRateLimiter,
  validate(resetPasswordSchema),
  async (req: Request, res: Response) => {
    try {
      const result = await resetPassword(req.body);
      const statusCode = result.success ? 200 : 400;
      return res.status(statusCode).json(result);
    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(500).json({
        error: 'An error occurred. Please try again later.',
      });
    }
  }
);

export default router;
