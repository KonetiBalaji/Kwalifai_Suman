/**
 * @file rateAlerts.routes.ts
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

import { Router } from 'express';
import {
  createRateAlert,
  getRateAlerts,
  getRateAlertById,
  updateRateAlert,
  deleteRateAlert,
} from '../controllers/rateAlerts.controller';
import { createRateAlertLimiter, getRateAlertsLimiter } from '../middleware/rateLimiter';
import { idempotencyMiddleware } from '../middleware/idempotency';
import { validateBody, validateQuery, validateParams } from '../middleware/validation';
import { createRateAlertSchema, updateRateAlertSchema, getRateAlertsQuerySchema } from '../validators/rateAlerts.zod';
import { z } from 'zod';

const router: Router = Router();

// Create rate alert (idempotency middleware applied here)
router.post(
  '/',
  idempotencyMiddleware,
  createRateAlertLimiter,
  validateBody(createRateAlertSchema),
  createRateAlert
);

// Get rate alerts (with query filters)
router.get(
  '/',
  getRateAlertsLimiter,
  validateQuery(getRateAlertsQuerySchema),
  getRateAlerts
);

// Get specific rate alert by ID
router.get(
  '/:id',
  getRateAlertsLimiter,
  validateParams(z.object({ id: z.string().uuid('Invalid rate alert ID') })),
  getRateAlertById
);

// Update rate alert
router.put(
  '/:id',
  createRateAlertLimiter,
  validateParams(z.object({ id: z.string().uuid('Invalid rate alert ID') })),
  validateBody(updateRateAlertSchema),
  updateRateAlert
);

// Delete rate alert
router.delete(
  '/:id',
  createRateAlertLimiter,
  validateParams(z.object({ id: z.string().uuid('Invalid rate alert ID') })),
  deleteRateAlert
);

export default router;
