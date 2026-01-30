/**
 * @file rateAlerts.zod.ts
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
 * Valid loan types
 */
export const LOAN_TYPES = [
  '30-Year Fixed',
  '15-Year Fixed',
  'FHA',
  'VA',
  'ARM',
  'Jumbo',
  'USDA',
  '20-Year Fixed',
];

/**
 * Valid timeframes
 */
export const TIMEFRAMES = ['30 days', '60 days', '90 days', '180 days', '365 days'];

/**
 * Schema for creating a rate alert
 */
export const createRateAlertSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  loanType: z.enum(['30-Year Fixed', '15-Year Fixed', 'FHA', 'VA', 'ARM', 'Jumbo', 'USDA', '20-Year Fixed'] as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid loan type. Must be one of: 30-Year Fixed, 15-Year Fixed, FHA, VA, ARM, Jumbo, USDA, 20-Year Fixed' }),
  }),
  targetRate: z.number().min(0.5, 'Target rate must be at least 0.5%').max(20, 'Target rate must be less than 20%'),
  loanAmount: z.number().positive('Loan amount must be positive').optional(),
  propertyAddress: z.string().optional(),
  timeframe: z.enum(['30 days', '60 days', '90 days', '180 days', '365 days'] as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid timeframe. Must be one of: 30 days, 60 days, 90 days, 180 days, 365 days' }),
  }).default('90 days'),
  userId: z.string().uuid('Invalid user ID').optional().nullable(),
  brokerId: z.string().optional().nullable(),
  loanOfficerId: z.string().optional().nullable(),
});

/**
 * Schema for updating a rate alert
 */
export const updateRateAlertSchema = z.object({
  targetRate: z.number().min(0.5, 'Target rate must be at least 0.5%').max(20, 'Target rate must be less than 20%').optional(),
  loanType: z.enum(['30-Year Fixed', '15-Year Fixed', 'FHA', 'VA', 'ARM', 'Jumbo', 'USDA', '20-Year Fixed'] as [string, ...string[]]).optional(),
  timeframe: z.enum(['30 days', '60 days', '90 days', '180 days', '365 days'] as [string, ...string[]]).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'TRIGGERED', 'EXPIRED']).optional(),
});

/**
 * Schema for query parameters when getting rate alerts
 */
export const getRateAlertsQuerySchema = z.object({
  email: z.string().email('Invalid email address'),
  includeAll: z.string().optional().transform((val) => val === 'true').default('false'),
});

export type CreateRateAlertInput = z.infer<typeof createRateAlertSchema>;
export type UpdateRateAlertInput = z.infer<typeof updateRateAlertSchema>;
export type GetRateAlertsQuery = z.infer<typeof getRateAlertsQuerySchema>;
