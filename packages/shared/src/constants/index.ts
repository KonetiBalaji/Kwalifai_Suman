/**
 * @file index.ts
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

// Placeholder constants - will be expanded in next phase
export const DEFAULT_LOAN_TERM = 30;
export const DEFAULT_DOWN_PAYMENT_PERCENT = 20;

export const LOAN_TYPES = {
  THIRTY_YEAR_FIXED: '30-Year Fixed',
  FIFTEEN_YEAR_FIXED: '15-Year Fixed',
  TWENTY_YEAR_FIXED: '20-Year Fixed',
  FIVE_ONE_ARM: '5/1 ARM',
  FHA: 'FHA',
  VA: 'VA',
  USDA: 'USDA',
  JUMBO: 'Jumbo',
} as const;
