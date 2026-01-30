/**
 * @file tenantResolution.ts
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

/**
 * Tenant information attached to request
 */
export interface TenantInfo {
  brokerId: string | null;
  loanOfficerId: string | null;
  brokerSlug?: string;
  loanOfficerSlug?: string;
}

/**
 * Extend Express Request to include tenant info
 */
declare global {
  namespace Express {
    interface Request {
      tenant?: TenantInfo;
    }
  }
}

/**
 * Middleware to resolve tenant from URL slugs
 * Extracts brokerSlug or loanOfficerSlug and attaches tenant info to request
 * 
 * For now, sets IDs to null - will be resolved via tenant-service later
 */
export function tenantResolutionMiddleware(req: Request, _res: Response, next: NextFunction): void {
  // Extract broker slug from /b/:brokerSlug/*
  const brokerMatch = req.path.match(/^\/b\/([^\/]+)/);
  if (brokerMatch) {
    const brokerSlug = brokerMatch[1];
    req.tenant = {
      brokerId: null, // TODO: Resolve via tenant-service
      loanOfficerId: null,
      brokerSlug,
    };
    return next();
  }

  // Extract loan officer slug from /lo/:loanOfficerSlug/*
  const loanOfficerMatch = req.path.match(/^\/lo\/([^\/]+)/);
  if (loanOfficerMatch) {
    const loanOfficerSlug = loanOfficerMatch[1];
    req.tenant = {
      brokerId: null, // TODO: Resolve via tenant-service
      loanOfficerId: null, // TODO: Resolve via tenant-service
      loanOfficerSlug,
    };
    return next();
  }

  // No tenant in path - continue without tenant info
  next();
}

/**
 * Helper to forward tenant headers to downstream services
 */
export function forwardTenantHeaders(req: Request): Record<string, string> {
  const headers: Record<string, string> = {};
  
  if (req.tenant) {
    if (req.tenant.brokerId) {
      headers['x-broker-id'] = req.tenant.brokerId;
    }
    if (req.tenant.loanOfficerId) {
      headers['x-loan-officer-id'] = req.tenant.loanOfficerId;
    }
    if (req.tenant.brokerSlug) {
      headers['x-broker-slug'] = req.tenant.brokerSlug;
    }
    if (req.tenant.loanOfficerSlug) {
      headers['x-loan-officer-slug'] = req.tenant.loanOfficerSlug;
    }
  }
  
  return headers;
}
