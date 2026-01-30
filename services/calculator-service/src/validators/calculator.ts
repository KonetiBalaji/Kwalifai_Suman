/**
 * @file calculator.ts
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
 * Mortgage calculator input validation schema
 */
export const mortgageCalculateSchema = z.object({
  loanAmount: z.number().positive('Loan amount must be positive'),
  interestRate: z.number().min(0).max(100, 'Interest rate must be between 0 and 100'),
  loanTerm: z.number().int().min(1).max(50, 'Loan term must be between 1 and 50 years'),
  downPayment: z.number().min(0).optional(),
  propertyTax: z.number().min(0).optional(),
  homeInsurance: z.number().min(0).optional(),
  pmi: z.number().min(0).optional(),
  hoa: z.number().min(0).optional(),
});

/**
 * Affordability calculator input validation schema
 */
export const affordabilityCalculateSchema = z.object({
  monthlyIncome: z.number().positive('Monthly income must be positive'),
  monthlyDebts: z.number().min(0, 'Monthly debts cannot be negative'),
  interestRate: z.number().min(0).max(100, 'Interest rate must be between 0 and 100'),
  loanTerm: z.number().int().min(1).max(50, 'Loan term must be between 1 and 50 years'),
  downPaymentPercent: z.number().min(0).max(100).optional().default(20),
});

/**
 * Save scenario validation schema
 */
export const saveScenarioSchema = z.object({
  type: z.enum(['MORTGAGE', 'REFINANCE', 'AFFORDABILITY', 'AMORTIZATION']),
  name: z.string().min(1).max(100).optional(),
  inputs: z.record(z.any()),
  results: z.record(z.any()),
});

export type MortgageCalculateInput = z.infer<typeof mortgageCalculateSchema>;
export type AffordabilityCalculateInput = z.infer<typeof affordabilityCalculateSchema>;
export type SaveScenarioInput = z.infer<typeof saveScenarioSchema>;
