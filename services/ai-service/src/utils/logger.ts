/**
 * @file logger.ts
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
import { AuthenticatedRequest } from '../middleware/auth';
import { AiResponse } from '../types/ai';
import { redactPII } from '../middleware/redaction';

export interface AuditLog {
  timestamp: string;
  correlationId?: string;
  userId?: string;
  userEmail?: string;
  userMessage: string;
  userMessageRedacted: string;
  aiResponseIntent: string;
  toolsCalled?: string[];
  actionsTaken?: Array<{
    type: string;
    status: string;
    referenceId?: string;
  }>;
  ipAddress?: string;
  userAgent?: string;
  responseTime?: number;
  error?: string;
}

/**
 * Logs AI interaction for audit trail
 */
export function logAiInteraction(
  req: Request,
  userMessage: string,
  aiResponse: AiResponse,
  toolsCalled: string[] = [],
  responseTime?: number,
  error?: string
): void {
  const authReq = req as AuthenticatedRequest;
  const correlationId = (req as any).correlationId || req.headers['x-correlation-id'];

  const logEntry: AuditLog = {
    timestamp: new Date().toISOString(),
    correlationId: correlationId as string | undefined,
    userId: authReq.userId,
    userEmail: authReq.userEmail,
    userMessage: userMessage,
    userMessageRedacted: redactPII(userMessage),
    aiResponseIntent: aiResponse.userIntent,
    toolsCalled,
    actionsTaken: aiResponse.actionsTaken,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    responseTime,
    error,
  };

  // Log to console (in production, send to logging service or database)
  console.log('[AI_AUDIT]', JSON.stringify(logEntry, null, 2));
}
