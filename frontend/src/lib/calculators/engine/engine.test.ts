/**
 * @file engine.test.ts
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

import {
  calculateMortgagePayment,
  calculateDTOI,
  calculateRefinance,
} from './index';

describe('calculator engine', () => {
  describe('calculateMortgagePayment', () => {
    it('matches known 30-year mortgage payment example', () => {
      // Example: $300,000 at 6% for 30 years
      const payment = calculateMortgagePayment(300000, 6, 30);
      // Expected ≈ 1798.65 based on standard formula
      expect(payment).toBeCloseTo(1798.65, 2);
    });
  });

  describe('calculateDTOI', () => {
    it('classifies Excellent when within conventional thresholds', () => {
      const result = calculateDTOI({
        grossMonthlyIncome: 10000,
        monthlyDebtPayments: 500,
        proposedHousingPayment: 2000,
      });

      // frontEnd = 20%, backEnd = 25% -> Excellent
      expect(result.qualification).toBe('Excellent');
    });

    it('classifies Good - FHA Eligible when within FHA thresholds', () => {
      const result = calculateDTOI({
        grossMonthlyIncome: 6000,
        monthlyDebtPayments: 1500,
        proposedHousingPayment: 1800, // frontEnd = 30%
      });

      // frontEnd = 30% (>28, <=31), backEnd = 55% -> but only backEnd <= 50 passes FHA
      // Adjust values to keep backEnd <= 43
      const adjusted = calculateDTOI({
        grossMonthlyIncome: 6000,
        monthlyDebtPayments: 600,
        proposedHousingPayment: 1800, // frontEnd = 30%, backEnd = 40%
      });

      expect(adjusted.qualification).toBe('Good - FHA Eligible');
    });

    it('classifies Needs Improvement when ratios are too high', () => {
      const result = calculateDTOI({
        grossMonthlyIncome: 4000,
        monthlyDebtPayments: 2000,
        proposedHousingPayment: 1800, // very high ratios
      });

      expect(result.qualification).toBe('Needs Improvement');
    });
  });

  describe('calculateRefinance', () => {
    it('computes break-even months correctly from closing costs and savings', () => {
      const currentBalance = 200000;
      const currentRate = 6.5;
      const currentPayment = calculateMortgagePayment(
        currentBalance,
        currentRate,
        30,
      );

      const newRate = 5.5;
      const closingCosts = 3000;

      const result = calculateRefinance({
        currentBalance,
        currentRate,
        currentPayment,
        newRate,
        newTermYears: 30,
        closingCosts,
      });

      const monthlySavings =
        result.currentLoan.currentPayment - result.newLoan.newPayment;

      if (monthlySavings > 0) {
        const expectedBreakEven = Math.ceil(
          closingCosts / monthlySavings,
        );
        expect(result.savings.breakEvenMonths).toBe(expectedBreakEven);
      } else {
        expect(result.savings.breakEvenMonths).toBe(0);
      }
    });
  });
});

