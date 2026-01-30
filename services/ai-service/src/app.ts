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
import { correlationIdMiddleware } from './middleware/correlationId';
import { optionalAuthMiddleware } from './middleware/auth';
import { chatRateLimiter } from './middleware/rateLimiter';
import { auditMiddleware } from './middleware/audit';
import chatRoutes from './routes/chat';
import healthRoutes from './routes/health';

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

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug: Log ALL incoming requests (very early)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[APP] Raw request: ${req.method} ${req.path} | URL: ${req.url} | Original: ${req.originalUrl}`);
  next();
});

// Correlation ID middleware (must be early in the chain)
app.use(correlationIdMiddleware);

// Optional authentication middleware (doesn't fail if no token)
app.use(optionalAuthMiddleware);

// Global rate limiting (apply to all routes)
// Note: chatRateLimiter is an array, so we need to spread it
app.use(...chatRateLimiter);

// Audit logging middleware
app.use(auditMiddleware);

// Health check routes (before API routes)
app.use('/', healthRoutes);

// Debug: Log all incoming requests (before routes)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/chat')) {
    console.log(`[APP] Incoming request: ${req.method} ${req.path} | Original URL: ${req.originalUrl}`);
  }
  next();
});

// API routes
app.use('/chat', chatRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  
  const correlationId = (req as any).correlationId || req.headers['x-correlation-id'];
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
    correlationId,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});
