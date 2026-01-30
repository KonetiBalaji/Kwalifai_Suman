/**
 * @file proxy.ts
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

import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Request } from 'express';
import { forwardTenantHeaders } from './tenantResolution';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';
const CALCULATOR_SERVICE_URL = process.env.CALCULATOR_SERVICE_URL || 'http://localhost:3003';
const RATE_ALERT_SERVICE_URL = process.env.RATE_ALERT_SERVICE_URL || 'http://localhost:3004';
const STATEMENT_ANALYSIS_SERVICE_URL = process.env.STATEMENT_ANALYSIS_SERVICE_URL || 'http://localhost:3005';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:3006';

/**
 * Proxy configuration for auth-service
 */
export const authServiceProxy = createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/auth': '/auth', // Rewrite /api/v1/auth/* to /auth/*
  },
  onProxyReq: (proxyReq, req: Request) => {
    // Forward correlation ID to downstream service
    const correlationId = (req as any).correlationId || req.headers['x-correlation-id'];
    if (correlationId) {
      proxyReq.setHeader('x-correlation-id', correlationId);
    }

    // Forward client type header for mobile clients
    const clientType = req.headers['x-client-type'];
    if (clientType) {
      proxyReq.setHeader('x-client-type', clientType);
    }

    // Forward tenant headers
    const tenantHeaders = forwardTenantHeaders(req);
    Object.entries(tenantHeaders).forEach(([key, value]) => {
      proxyReq.setHeader(key, value);
    });
  },
  onError: (err, _req, res) => {
    console.error('Proxy error:', err);
    if (res && !res.headersSent) {
      res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'The authentication service is currently unavailable. Please try again later.',
      });
    }
  },
  logLevel: 'warn',
} as Options);

/**
 * Proxy configuration for calculator-service
 */
export const calculatorServiceProxy = createProxyMiddleware({
  target: CALCULATOR_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/calculator': '/calculator', // Rewrite /api/v1/calculator/* to /calculator/*
  },
  onProxyReq: (proxyReq, req: Request) => {
    // Forward correlation ID to downstream service
    const correlationId = (req as any).correlationId || req.headers['x-correlation-id'];
    if (correlationId) {
      proxyReq.setHeader('x-correlation-id', correlationId);
    }

    // Forward tenant headers
    const tenantHeaders = forwardTenantHeaders(req);
    Object.entries(tenantHeaders).forEach(([key, value]) => {
      proxyReq.setHeader(key, value);
    });
  },
  onError: (err, _req, res) => {
    console.error('Proxy error:', err);
    if (res && !res.headersSent) {
      res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'The calculator service is currently unavailable. Please try again later.',
      });
    }
  },
  logLevel: 'warn',
} as Options);

/**
 * Proxy configuration for rate-alert-service
 */
export const rateAlertServiceProxy = createProxyMiddleware({
  target: RATE_ALERT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/rate-alerts': '/rate-alerts', // Rewrite /api/v1/rate-alerts/* to /rate-alerts/*
  },
  onProxyReq: (proxyReq, req: Request) => {
    // Forward correlation ID to downstream service
    const correlationId = (req as any).correlationId || req.headers['x-correlation-id'];
    if (correlationId) {
      proxyReq.setHeader('x-correlation-id', correlationId);
    }

    // Forward authorization header
    const authorization = req.headers['authorization'];
    if (authorization) {
      proxyReq.setHeader('authorization', authorization);
    }

    // Forward idempotency key
    const idempotencyKey = req.headers['idempotency-key'];
    if (idempotencyKey) {
      proxyReq.setHeader('idempotency-key', idempotencyKey);
    }

    // Forward tenant headers
    const tenantHeaders = forwardTenantHeaders(req);
    Object.entries(tenantHeaders).forEach(([key, value]) => {
      proxyReq.setHeader(key, value);
    });
  },
  onError: (err, _req, res) => {
    console.error('Proxy error:', err);
    if (res && !res.headersSent) {
      res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'The rate alert service is currently unavailable. Please try again later.',
      });
    }
  },
  logLevel: 'warn',
} as Options);

/**
 * Proxy configuration for statement-analysis-service
 * 
 * Legacy endpoints preserved:
 * - POST /api/upload-statement -> POST /statement/upload
 * - GET /api/statement/:id -> GET /statement/:id
 */
export const statementAnalysisServiceProxy = createProxyMiddleware({
  target: STATEMENT_ANALYSIS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/upload-statement': '/statement/upload', // POST /api/upload-statement -> /statement/upload
    '^/api/statement': '/statement', // GET /api/statement/:id -> /statement/:id
  },
  onProxyReq: (proxyReq, req: Request) => {
    // Forward correlation ID to downstream service
    const correlationId = (req as any).correlationId || req.headers['x-correlation-id'];
    if (correlationId) {
      proxyReq.setHeader('x-correlation-id', correlationId);
    }

    // Forward authorization header (for future user auth)
    const authorization = req.headers['authorization'];
    if (authorization) {
      proxyReq.setHeader('authorization', authorization);
    }

    // Forward idempotency key
    const idempotencyKey = req.headers['idempotency-key'];
    if (idempotencyKey) {
      proxyReq.setHeader('idempotency-key', idempotencyKey);
    }

    // Forward tenant headers
    const tenantHeaders = forwardTenantHeaders(req);
    Object.entries(tenantHeaders).forEach(([key, value]) => {
      proxyReq.setHeader(key, value);
    });
  },
  onError: (err, _req, res) => {
    console.error('Proxy error:', err);
    if (res && !res.headersSent) {
      res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'The statement analysis service is currently unavailable. Please try again later.',
      });
    }
  },
  logLevel: 'warn',
} as Options);

/**
 * Proxy configuration for ai-service
 */
export const aiServiceProxy = createProxyMiddleware({
  target: AI_SERVICE_URL,
  changeOrigin: true,
  timeout: 60000, // 60 second timeout
  buffer: false, // Don't buffer - stream directly
  pathRewrite: {
    '^/api/v1/ai/chat': '/chat', // Rewrite /api/v1/ai/chat to /chat
    '^/api/v1/ai': '', // Rewrite other /api/v1/ai/* to /*
  },
  onProxyReq: (proxyReq, req: Request) => {
    const targetPath = req.path.replace('/api/v1/ai/chat', '/chat').replace('/api/v1/ai', '');
    console.log(`[GATEWAY] Proxying ${req.method} ${req.path} to ${AI_SERVICE_URL}${targetPath}`);
    
    // Forward correlation ID to downstream service
    const correlationId = (req as any).correlationId || req.headers['x-correlation-id'];
    if (correlationId) {
      proxyReq.setHeader('x-correlation-id', correlationId);
    }

    // Forward authorization header
    const authorization = req.headers['authorization'];
    if (authorization) {
      proxyReq.setHeader('authorization', authorization);
    }

    // Forward client type header for mobile clients
    const clientType = req.headers['x-client-type'];
    if (clientType) {
      proxyReq.setHeader('x-client-type', clientType);
    }

    // Forward tenant headers
    const tenantHeaders = forwardTenantHeaders(req);
    Object.entries(tenantHeaders).forEach(([key, value]) => {
      if (value) {
        proxyReq.setHeader(key, value);
      }
    });

    // CRITICAL FIX: If body was parsed by express.json(), manually write it to proxy
    // express.json() consumes the request stream, so proxy has no body to forward
    if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') && req.body) {
      const bodyData = JSON.stringify(req.body);
      const contentLength = Buffer.byteLength(bodyData);
      
      // Set headers
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', contentLength.toString());
      
      // Write the body data
      proxyReq.write(bodyData);
      console.log(`[GATEWAY] Written body to proxy (${contentLength} bytes):`, bodyData);
    }
  },
  onProxyRes: (proxyRes, req: Request) => {
    console.log(`[GATEWAY] Received response from AI service: ${proxyRes.statusCode} for ${req.path}`);
  },
  onError: (err, req, res) => {
    console.error(`[GATEWAY] Proxy error for ${req?.path}:`, err);
    if (res && !res.headersSent) {
      res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'The AI service is currently unavailable. Please try again later.',
      });
    }
  },
  logLevel: 'warn',
} as Options);
