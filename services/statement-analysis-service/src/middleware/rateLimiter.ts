/**
 * @file rateLimiter.ts
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

import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for statement upload endpoint
 * Prevents abuse of file upload functionality
 */
export const statementUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 uploads per window
  message: 'Too many statement uploads. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
