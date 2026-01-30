/**
 * @file analysisEngine.ts
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
 * Statement input data (from form or future OCR extraction)
 */
export interface StatementInputData {
  currentBalance?: string | number;
  currentRate?: string | number;
  monthlyPayment?: string | number;
  propertyAddress?: string;
  lenderName?: string;
  escrowBalance?: string | number;
  loanNumber?: string;
  nextPaymentDate?: string;
}

/**
 * Analysis result matching legacy format exactly
 */
export interface StatementAnalysisResult {
  currentLoanBalance: number;
  currentInterestRate: number;
  currentMonthlyPayment: number;
  remainingTermMonths: number;
  propertyAddress: string;
  lenderName: string;
  loanNumber: string;
  nextPaymentDate: string;
  escrowBalance: number;
  marketComparison: {
    currentMarketRate: number;
    potentialNewPayment: number;
    potentialMonthlySavings: number;
  };
  recommendations: {
    refinanceOpportunity: boolean;
    potentialSavings: number;
    recommendedAction: string;
  };
}

/**
 * Analysis Engine V1
 * 
 * Re-implements legacy analyzeMortgageStatement logic exactly.
 * This is a versioned engine to allow future V2 (OCR), V3 (AI) without breaking changes.
 */
export class AnalysisEngineV1 {
  /**
   * Get current market rates (hardcoded, matching legacy)
   * Future: Can be fetched from rate service
   */
  private getCurrentMortgageRates() {
    return {
      thirtyYear: 6.44,
      fifteenYear: 5.89,
      twentyYear: 6.15,
      fiveYearARM: 6.99,
      fha: 6.25,
      va: 6.15,
      usda: 6.35,
      jumbo: 6.85,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Calculate mortgage payment (matching legacy formula)
   */
  private calculateMortgagePayment(loanAmount: number, rate: number, termYears: number): number {
    const monthlyRate = rate / 100 / 12;
    const numPayments = termYears * 12;
    if (monthlyRate === 0) return loanAmount / numPayments;
    const monthlyPayment =
      loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    return Math.round(monthlyPayment * 100) / 100;
  }

  /**
   * Analyze statement - EXACT legacy implementation
   * 
   * Preserves all defaults, calculations, and response structure.
   */
  analyze(statementData: StatementInputData): StatementAnalysisResult {
    // Parse with legacy defaults
    const currentBalance = parseFloat(String(statementData.currentBalance || 350000));
    const currentRate = parseFloat(String(statementData.currentRate || 7.25));
    const monthlyPayment = parseFloat(String(statementData.monthlyPayment || 2400));
    const propertyAddress = statementData.propertyAddress || 'Property address not provided';
    const lenderName = statementData.lenderName || 'Current lender not specified';

    // Get market rate (legacy hardcoded)
    const currentMarketRate = this.getCurrentMortgageRates().thirtyYear;
    
    // Calculate potential new payment (30-year fixed)
    const potentialNewPayment = this.calculateMortgagePayment(currentBalance, currentMarketRate, 30);
    const potentialSavings = Math.max(0, monthlyPayment - potentialNewPayment);

    // Calculate remaining term (legacy formula)
    const remainingTermMonths = Math.ceil(currentBalance / (monthlyPayment * 0.7));

    // Build response matching legacy structure exactly
    return {
      currentLoanBalance: currentBalance,
      currentInterestRate: currentRate,
      currentMonthlyPayment: monthlyPayment,
      remainingTermMonths,
      propertyAddress,
      lenderName,
      loanNumber: statementData.loanNumber || 'Not specified',
      nextPaymentDate: statementData.nextPaymentDate || 'Not specified',
      escrowBalance: parseFloat(String(statementData.escrowBalance || 2500)),
      marketComparison: {
        currentMarketRate,
        potentialNewPayment: Math.round(potentialNewPayment),
        potentialMonthlySavings: Math.round(potentialSavings),
      },
      recommendations: {
        refinanceOpportunity: currentRate > currentMarketRate + 0.5,
        potentialSavings: Math.round(potentialSavings),
        recommendedAction:
          potentialSavings > 100
            ? 'Strong refinancing opportunity - contact a specialist!'
            : 'Monitor rates - minimal savings at current market rates',
      },
    };
  }
}

/**
 * Factory function to get analysis engine by version
 */
export function getAnalysisEngine(version: 'V1' = 'V1') {
  switch (version) {
    case 'V1':
      return new AnalysisEngineV1();
    // Future: case 'V2_OCR': return new AnalysisEngineV2OCR();
    // Future: case 'V3_AI': return new AnalysisEngineV3AI();
    default:
      throw new Error(`Unsupported analysis version: ${version}`);
  }
}
