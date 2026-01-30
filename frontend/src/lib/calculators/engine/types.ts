/**
 * @file types.ts
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

// Shared types for calculator engine functions

export interface MortgagePaymentParams {
  loanAmount: number;
  rate: number;
  termYears: number;
}

export interface ScenarioInput {
  loanAmount: number;
  downPayment?: number;
}

export interface ScenarioResult {
  type: string;
  rate: number;
  term: number;
  payment: number;
  totalInterest: number;
  totalPayments: number;
  note?: string;
}

export interface MultipleScenariosResult {
  loanAmount: number;
  downPayment: number;
  homePrice: number;
  scenarios: ScenarioResult[];
}

export interface DTOIParams {
  grossMonthlyIncome: number;
  monthlyDebtPayments?: number;
  proposedHousingPayment?: number;
  propertyTaxes?: number;
  homeInsurance?: number;
  mortgageInsurance?: number;
  hoaFees?: number;
}

export interface DTOIResult {
  grossMonthlyIncome: number;
  totalHousingCosts: number;
  totalMonthlyDebts: number;
  frontEndRatio: number;
  backEndRatio: number;
  qualification: string;
  message: string;
  color: string;
  recommendations: {
    maxHousingPayment28: number;
    maxTotalDebt36: number;
    maxHousingAfterDebts: number;
    remainingAfterDebts: number;
  };
  breakdown: {
    housingComponents: {
      mortgagePayment: number;
      propertyTaxes: number;
      homeInsurance: number;
      mortgageInsurance: number;
      hoaFees: number;
    };
    monthlyDebtPayments: number;
  };
}

export interface RateBuydownParams {
  loanAmount: number;
  originalRate: number;
  termYears?: number;
  buydownType?: 'permanent' | 'temporary';
  permanentPoints?: number;
  temporaryBuydownStructure?: '3-2-1' | '2-1' | '1-1' | '1-0' | string;
}

export interface PermanentBuydownParams {
  loanAmount: number;
  originalRate: number;
  termYears: number;
  points: number;
}

export interface PermanentBuydownResult {
  buydownType: 'permanent';
  loanAmount: number;
  originalRate: number;
  newRate: number;
  points: number;
  pointsCost: number;
  originalPayment: number;
  newPayment: number;
  monthlySavings: number;
  breakEvenMonths: number;
  breakEvenTime: string;
}

export interface TemporaryBuydownParams {
  loanAmount: number;
  originalRate: number;
  termYears: number;
  structure: string;
}

export interface TemporaryBuydownYear {
  year: number;
  effectiveRate: number;
  monthlyPayment: number;
  monthlySavings: number;
  annualSavings: number;
  subsidyAmount: number;
}

export interface TemporaryBuydownResult {
  buydownType: 'temporary';
  structure: string;
  loanAmount: number;
  originalRate: number;
  termYears: number;
  originalPayment: number;
  totalBuydownCost: number;
  totalSavings: number;
  sellerContribution: number;
  yearlyBreakdown: TemporaryBuydownYear[];
  summary: {
    buydownPeriod: string;
    totalSavedDuringBuydown: number;
    averageMonthlySavings: number;
    paidBy: string;
    escrowAccount: boolean;
    refundableIfRefinance: boolean;
  };
}

export interface ARMParams {
  loanAmount: number;
  initialRate: number;
  termInYears?: number;
  maximumInterestRate?: number;
  lifetimeRateCap?: number;
}

export interface ARMResult {
  initialPayment: number;
  maxPayment: number;
  initialRate: number;
  maxRate: number;
}

export interface AmortizationEntry {
  paymentNumber: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface AmortizationResult {
  schedule: AmortizationEntry[];
  summary: {
    totalPayments: number;
    totalInterest: number;
    totalPaid: number;
    monthlySavings: number;
    timeSaved: number;
  };
}

export interface BorrowingCapacityParams {
  grossMonthlyIncome: number;
  monthlyDebtPayment?: number;
  interestRate: number;
  termInYears?: number;
  downPaymentPercent?: number;
}

export interface BorrowingCapacityResult {
  conservative: {
    maxPayment: number;
    maxLoanAmount: number;
    maxHomePrice: number;
    downPayment: number;
  };
  aggressive: {
    maxPayment: number;
    maxLoanAmount: number;
    maxHomePrice: number;
    downPayment: number;
  };
  monthlyIncome: number;
  monthlyDebts: number;
}

export interface Compare15vs30Result {
  fifteenYear: {
    monthlyPayment: number;
    totalPayments: number;
    totalInterest: number;
    interestRate: number;
  };
  thirtyYear: {
    monthlyPayment: number;
    totalPayments: number;
    totalInterest: number;
    interestRate: number;
  };
  savings: {
    monthlyDifference: number;
    totalInterestSavings: number;
    timeSavings: string;
  };
}

export interface RefinanceParams {
  currentBalance: number;
  currentRate: number;
  currentPayment: number;
  newRate: number;
  newTermYears?: number;
  closingCosts?: number;
}

export interface RefinanceResult {
  currentLoan: {
    remainingBalance: number;
    currentPayment: number;
    currentRate: number;
  };
  newLoan: {
    newBalance: number;
    newPayment: number;
    newRate: number;
    termInYears: number;
  };
  savings: {
    monthlyPaymentChange: number;
    closingCosts: number;
    breakEvenMonths: number;
  };
}

export interface ExtraPaymentImpactResult {
  withoutExtraPayment: {
    monthlyPayment: number;
    totalInterest: number;
    totalPayments: number;
  };
  withExtraPayment: {
    monthlyPayment: number;
    totalInterest: number;
    totalPayments: number;
  };
  savings: {
    interestSaved: number;
    timeSaved: string;
    timeSavedMonths: number;
  };
}

