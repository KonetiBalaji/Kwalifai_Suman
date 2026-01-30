/**
 * @file tenantContext.ts
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

import { Request, Response, NextFunction } from 'express';

// Extend Request type to include tenant property
declare global {
  namespace Express {
    interface Request {
      tenant?: {
        brokerId: string | null;
        loanOfficerId: string | null;
        brokerSlug?: string;
        loanOfficerSlug?: string;
      };
    }
  }
}

/**
 * Middleware to extract tenant context from headers
 * Expects headers: x-broker-id, x-loan-officer-id, x-broker-slug, x-loan-officer-slug
 */
export const tenantContextMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const brokerId = req.headers['x-broker-id'] as string | undefined;
  const loanOfficerId = req.headers['x-loan-officer-id'] as string | undefined;
  const brokerSlug = req.headers['x-broker-slug'] as string | undefined;
  const loanOfficerSlug = req.headers['x-loan-officer-slug'] as string | undefined;

  req.tenant = {
    brokerId: brokerId || null,
    loanOfficerId: loanOfficerId || null,
    brokerSlug,
    loanOfficerSlug,
  };

  next();
};
