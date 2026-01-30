/**
 * @file auditLogger.ts
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

import { AiResponse } from '../../types/ai';

export interface AuditLogEntry {
  timestamp: string;
  userId?: string;
  sessionId: string;
  correlationId?: string;
  userMessage: string;
  aiResponse: AiResponse;
  toolCalls?: Array<{
    toolName: string;
    success: boolean;
    error?: string;
  }>;
  processingTimeMs: number;
  openaiModel?: string;
}

/**
 * Logs AI interactions for audit and compliance
 * In production, this should write to a database or logging service
 */
export function logAuditEntry(entry: AuditLogEntry): void {
  const logMessage = {
    type: 'AI_AUDIT',
    ...entry,
  };

  // In production, send to logging service (e.g., CloudWatch, Datadog, etc.)
  console.log(JSON.stringify(logMessage));

  // TODO: In production, also write to database or logging service
  // await auditLogRepository.create(entry);
}

/**
 * Logs tool execution for audit
 */
export function logToolExecution(
  toolName: string,
  success: boolean,
  userId?: string,
  error?: string
): void {
  const logMessage = {
    type: 'TOOL_EXECUTION',
    timestamp: new Date().toISOString(),
    toolName,
    success,
    userId,
    error,
  };

  console.log(JSON.stringify(logMessage));
}
