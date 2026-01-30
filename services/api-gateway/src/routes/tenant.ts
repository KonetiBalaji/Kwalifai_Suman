/**
 * @file tenant.ts
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

/**
 * @file tenant.ts
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

import { Router, Request } from 'express';
import type { Router as ExpressRouter } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { forwardTenantHeaders } from '../middleware/tenantResolution';

const router: ExpressRouter = Router();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';
const CALCULATOR_SERVICE_URL = process.env.CALCULATOR_SERVICE_URL || 'http://localhost:3003';

/**
 * Create tenant-aware proxy for auth service
 */
const tenantAuthProxy = createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/b/[^/]+/auth': '/auth', // /api/v1/b/:brokerSlug/auth -> /auth
    '^/api/v1/lo/[^/]+/auth': '/auth', // /api/v1/lo/:loanOfficerSlug/auth -> /auth
  },
  onProxyReq: (proxyReq, req: Request) => {
    // Forward correlation ID
    const correlationId = (req as any).correlationId || req.headers['x-correlation-id'];
    if (correlationId) {
      proxyReq.setHeader('x-correlation-id', correlationId);
    }

    // Forward client type
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
 * Create tenant-aware proxy for calculator service
 */
const tenantCalculatorProxy = createProxyMiddleware({
  target: CALCULATOR_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/b/[^/]+/calculator': '/calculator', // /api/v1/b/:brokerSlug/calculator -> /calculator
    '^/api/v1/lo/[^/]+/calculator': '/calculator', // /api/v1/lo/:loanOfficerSlug/calculator -> /calculator
  },
  onProxyReq: (proxyReq, req: Request) => {
    // Forward correlation ID
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
 * Routes for broker tenant context
 * /api/v1/b/:brokerSlug/*
 */
router.use('/b/:brokerSlug/auth', tenantAuthProxy);
router.use('/b/:brokerSlug/calculator', tenantCalculatorProxy);

/**
 * Routes for loan officer tenant context
 * /api/v1/lo/:loanOfficerSlug/*
 */
router.use('/lo/:loanOfficerSlug/auth', tenantAuthProxy);
router.use('/lo/:loanOfficerSlug/calculator', tenantCalculatorProxy);

export default router;
