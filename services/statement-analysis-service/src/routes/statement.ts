/**
 * @file statement.ts
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
import { uploadStatement, getStatement } from '../controllers/statementController';
import { statementUploadLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /statement/upload
 * Upload and analyze mortgage statement
 * 
 * Internal path (gateway rewrites /api/upload-statement -> /statement/upload)
 */
router.post('/upload', statementUploadLimiter, uploadStatement);

/**
 * GET /statement/:id
 * Get statement analysis by ID
 * 
 * Internal path (gateway rewrites /api/statement/:id -> /statement/:id)
 */
router.get('/:id', getStatement);

export default router;
