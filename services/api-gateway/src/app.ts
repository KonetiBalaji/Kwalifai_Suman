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

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { correlationIdMiddleware } from './middleware/correlationId';
import { tenantResolutionMiddleware } from './middleware/tenantResolution';
import { globalRateLimiter } from './middleware/rateLimiter';
import { authServiceProxy, calculatorServiceProxy, rateAlertServiceProxy, statementAnalysisServiceProxy, aiServiceProxy } from './middleware/proxy';
import { swaggerSpec } from './config/swagger';
import healthRoutes from './routes/health';
import tenantRoutes from './routes/tenant';

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

// Correlation ID middleware (must be early in the chain)
app.use(correlationIdMiddleware);

// Tenant resolution middleware (extracts slugs from URL)
app.use(tenantResolutionMiddleware);

// Global rate limiting
app.use(globalRateLimiter);

// Health check routes (before API routes)
app.use('/', healthRoutes);

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Mortgage Platform API Documentation',
}));

// API routes
// Tenant-aware routes (must come before non-tenant routes)
app.use('/api/v1', tenantRoutes);

// Standard API routes (non-tenant)
// Auth service proxy
app.use('/api/v1/auth', authServiceProxy);

// Calculator service proxy
app.use('/api/v1/calculator', calculatorServiceProxy);

// Rate alert service proxy
app.use('/api/v1/rate-alerts', rateAlertServiceProxy);

// Statement analysis service proxy (legacy endpoints preserved)
app.post('/api/upload-statement', statementAnalysisServiceProxy);
app.get('/api/statement/:id', statementAnalysisServiceProxy);

// AI service proxy (must be after body parsing middleware)
app.use('/api/v1/ai', aiServiceProxy);

// API info endpoint
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'Mortgage Platform API Gateway',
    version: '1.0.0',
    endpoints: {
      docs: '/api/docs',
      health: '/health',
      ready: '/ready',
      auth: '/api/v1/auth',
      calculator: '/api/v1/calculator',
      rateAlerts: '/api/v1/rate-alerts',
      uploadStatement: '/api/upload-statement',
      getStatement: '/api/statement/:id',
      aiChat: '/api/v1/ai/chat',
    },
  });
});
