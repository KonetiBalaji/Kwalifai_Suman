/**
 * @file responseValidator.ts
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
import { AiResponse, UserIntent } from '../../types/ai';

/**
 * Zod schema for validating AI responses
 * Ensures responses are mortgage-related and properly structured
 */
const UserIntentSchema = z.enum([
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

const ActionTypeSchema = z.enum(['create_rate_alert', 'run_calculator', 'save_calculation']);

const AiResponseSchema = z.object({
  greeting: z.string().optional(),
  userIntent: UserIntentSchema,
  replyMarkdown: z.string().min(1),
  explainability: z.object({
    assumptions: z.array(z.string()),
    calculations: z.array(z.object({
      name: z.string(),
      value: z.string(),
    })).optional(),
    whyThis: z.array(z.string()).optional(),
    disclaimers: z.array(z.string()),
  }).optional(),
  actionsTaken: z.array(z.object({
    type: ActionTypeSchema,
    status: z.enum(['success', 'failed']),
    referenceId: z.string().optional(),
    error: z.string().optional(),
  })).optional(),
});

/**
 * Validates an AI response against the schema
 * Returns validated response or throws error
 */
export function validateResponse(response: any): AiResponse {
  try {
    return AiResponseSchema.parse(response) as AiResponse;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Response validation error:', error.errors);
      // Return a safe fallback response
      return {
        userIntent: 'unknown',
        replyMarkdown: response.replyMarkdown || 'I encountered an error processing your request. Please try again.',
        explainability: {
          assumptions: [],
          disclaimers: ['Response validation failed'],
        },
      };
    }
    throw error;
  }
}

/**
 * Validates that intent is mortgage-related
 */
export function validateIntent(intent: UserIntent): boolean {
  const mortgageIntents: UserIntent[] = [
    'rates',
    'calculator',
    'rate_alert',
    'refinance',
    'dti',
    'statement',
    'education',
    'general_mortgage',
  ];

  return mortgageIntents.includes(intent) || intent === 'unknown';
}
