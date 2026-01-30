/**
 * @file ai.ts
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

import { z } from 'zod';

/**
 * User intent schema - validates intent categories
 */
export const UserIntentSchema = z.enum([
  'rates',
  'calculator',
  'rate_alert',
  'refinance',
  'dti',
  'statement',
  'education',
  'general_mortgage',
  'unknown',
]);

/**
 * Action type schema
 */
export const ActionTypeSchema = z.enum(['create_rate_alert', 'run_calculator', 'save_calculation']);

/**
 * Action taken schema
 */
export const ActionTakenSchema = z.object({
  type: ActionTypeSchema,
  status: z.enum(['success', 'failed']),
  referenceId: z.string().optional(),
  error: z.string().optional(),
});

/**
 * Explainability schema
 */
export const ExplainabilitySchema = z.object({
  assumptions: z.array(z.string()),
  calculations: z.array(z.object({
    name: z.string(),
    value: z.string(),
  })).optional(),
  whyThis: z.array(z.string()).optional(),
  disclaimers: z.array(z.string()),
});

/**
 * AI response schema - validates complete AI responses
 */
export const AiResponseSchema = z.object({
  greeting: z.string().optional(),
  userIntent: UserIntentSchema,
  replyMarkdown: z.string().min(1),
  explainability: ExplainabilitySchema.optional(),
  actionsTaken: z.array(ActionTakenSchema).optional(),
});

/**
 * Chat request schema
 */
export const ChatRequestSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().optional(),
});

/**
 * Chat response schema (extends AI response)
 */
export const ChatResponseSchema = AiResponseSchema.extend({
  sessionId: z.string(),
  correlationId: z.string().optional(),
});
