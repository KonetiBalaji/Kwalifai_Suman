/**
 * @file audit.ts
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

import { Request } from 'express';

export interface AuditLog {
  action: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  success: boolean;
  error?: string;
}

/**
 * Get client IP address from request
 */
export function getClientIp(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    (req.headers['x-real-ip'] as string) ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

/**
 * Get user agent from request
 */
export function getUserAgent(req: Request): string {
  return req.headers['user-agent'] || 'unknown';
}

/**
 * Log audit event (non-sensitive information only)
 */
export function logAuditEvent(
  action: string,
  req: Request,
  options: {
    userId?: string;
    success: boolean;
    error?: string;
  }
): void {
  const auditLog: AuditLog = {
    action,
    userId: options.userId,
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req),
    timestamp: new Date(),
    success: options.success,
    error: options.error,
  };

  // Log to console (in production, this should go to a logging service)
  console.log('[AUDIT]', JSON.stringify(auditLog));
}
