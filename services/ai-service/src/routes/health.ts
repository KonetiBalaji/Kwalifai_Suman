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
import axios from 'axios';

const router = Router();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';
const CALCULATOR_SERVICE_URL = process.env.CALCULATOR_SERVICE_URL || 'http://localhost:3003';
const RATE_ALERT_SERVICE_URL = process.env.RATE_ALERT_SERVICE_URL || 'http://localhost:3004';

/**
 * GET /health
 * Basic health check
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'ai-service',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /ready
 * Readiness check that verifies downstream services
 */
router.get('/ready', async (_req: Request, res: Response) => {
  const services = {
    aiService: true,
    authService: false,
    calculatorService: false,
    rateAlertService: false,
  };

  // Check auth service
  try {
    await axios.get(`${AUTH_SERVICE_URL}/health`, { timeout: 2000 });
    services.authService = true;
  } catch (error) {
    // Service unavailable
  }

  // Check calculator service
  try {
    await axios.get(`${CALCULATOR_SERVICE_URL}/health`, { timeout: 2000 });
    services.calculatorService = true;
  } catch (error) {
    // Service unavailable
  }

  // Check rate alert service
  try {
    await axios.get(`${RATE_ALERT_SERVICE_URL}/health`, { timeout: 2000 });
    services.rateAlertService = true;
  } catch (error) {
    // Service unavailable
  }

  const isReady = services.aiService; // AI service is ready even if downstream services are down (we have fallbacks)

  if (!isReady) {
    return res.status(503).json({
      status: 'not ready',
      service: 'ai-service',
      services,
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    status: 'ready',
    service: 'ai-service',
    services,
    timestamp: new Date().toISOString(),
  });
});

export default router;
