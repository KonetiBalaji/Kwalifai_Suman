/**
 * @file rateData.service.ts
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

/**
 * Service responsible for providing current market rates.
 * For now this returns mock data per loan type.
 */

export type LoanType =
  | '30-Year Fixed'
  | '15-Year Fixed'
  | 'FHA'
  | 'VA'
  | 'ARM'
  | 'Jumbo'
  | 'USDA'
  | '20-Year Fixed';

export interface RateData {
  loanType: LoanType;
  currentRate: number;
}

/**
 * Mock rate table for different loan types.
 * In a real implementation, this would call an external rate provider.
 */
const MOCK_RATES: Record<LoanType, number> = {
  '30-Year Fixed': 6.25,
  '15-Year Fixed': 5.75,
  FHA: 6.0,
  VA: 5.9,
  ARM: 6.1,
  Jumbo: 6.5,
  USDA: 6.05,
  '20-Year Fixed': 6.15,
};

export class RateDataService {
  /**
   * Get current rates for all supported loan types.
   */
  async getCurrentRates(): Promise<RateData[]> {
    // Simulate async operation (e.g., HTTP request)
    return Object.entries(MOCK_RATES).map(([loanType, currentRate]) => ({
      loanType: loanType as LoanType,
      currentRate,
    }));
  }
}

export const rateDataService = new RateDataService();

