/**
 * @file app.ts
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

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateAlertsRoutes from './routes/rateAlerts.routes';
import adminRoutes from './routes/admin.routes';
import { correlationIdMiddleware } from './middleware/correlationId';
import { tenantContextMiddleware } from './middleware/tenantContext';
import { generalRateLimiter } from './middleware/rateLimiter';
import { AppError, sendErrorResponse } from './utils/errors';
import { Logger } from './utils/logger';

export const app: Express = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'"],
      "script-src-attr": ["'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing middleware with limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Correlation ID middleware (must be early in the chain)
app.use(correlationIdMiddleware);

// Tenant context middleware
app.use(tenantContextMiddleware);

// General rate limiting
app.use(generalRateLimiter);

// Health check endpoints
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'rate-alert-service',
    timestamp: new Date().toISOString(),
  });
});

app.get('/ready', async (_req: Request, res: Response) => {
  // TODO: Add readiness checks (database connection, etc.)
  res.json({
    status: 'ready',
    service: 'rate-alert-service',
    timestamp: new Date().toISOString(),
  });
});

// Rate alerts routes
app.use('/rate-alerts', rateAlertsRoutes);

// Admin routes
app.use('/admin', adminRoutes);

// API info endpoint
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    message: 'Rate Alert Service - API endpoints available at /rate-alerts',
    version: '1.0.0',
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Error handler
app.use((err: Error, req: Request, _res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return next(err);
  }

  Logger.error('Unhandled error', req, err);
  next(new AppError('INTERNAL_ERROR', 'An unexpected error occurred', 500));
});

// AppError handler
app.use((err: AppError, req: Request, res: Response, _next: NextFunction) => {
  Logger.error('Application error', req, err);
  sendErrorResponse(res, err);
});
