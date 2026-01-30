/**
 * @file admin.routes.ts
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
 * @file admin.routes.ts
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
import { getAdminRateAlerts, runAdminRateCheck } from '../controllers/rateAlerts.controller';
import { adminAuthMiddleware } from '../middleware/adminAuth';

const router: Router = Router();

// All admin routes require authentication
router.use(adminAuthMiddleware);

// Get all rate alerts (admin)
router.get('/rate-alerts', getAdminRateAlerts);

// Run rate alert check immediately (admin)
router.post('/rate-alerts/run-check', runAdminRateCheck);

export default router;
