/**
 * @file health.ts
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
import axios, { AxiosError } from 'axios';

const router: Router = Router();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';
const CALCULATOR_SERVICE_URL = process.env.CALCULATOR_SERVICE_URL || 'http://localhost:3003';

/**
 * GET /health
 * Basic health check endpoint
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /ready
 * Readiness check - verifies downstream services are available
 */
router.get('/ready', async (_req: Request, res: Response) => {
  const services = {
    apiGateway: true,
    authService: false,
    calculatorService: false,
  };

  // Check auth-service health
  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/health`, {
      timeout: 2000,
    });
    services.authService = response.status === 200;
  } catch (error: unknown) {
    services.authService = false;
    if (error instanceof AxiosError) {
      console.error('Auth service health check failed:', error.message);
    }
  }

  // Check calculator-service health
  try {
    const response = await axios.get(`${CALCULATOR_SERVICE_URL}/health`, {
      timeout: 2000,
    });
    services.calculatorService = response.status === 200;
  } catch (error: unknown) {
    services.calculatorService = false;
    if (error instanceof AxiosError) {
      console.error('Calculator service health check failed:', error.message);
    }
  }

  const isReady = Object.values(services).every((status) => status === true);

  res.status(isReady ? 200 : 503).json({
    status: isReady ? 'ready' : 'not ready',
    service: 'api-gateway',
    services,
    timestamp: new Date().toISOString(),
  });
});

export default router;
