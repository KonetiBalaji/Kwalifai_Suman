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

export interface MortgageInputs {
  loanAmount: number;
  interestRate: number; // Annual percentage rate
  loanTerm: number; // Years
  downPayment?: number;
  propertyTax?: number; // Annual
  homeInsurance?: number; // Annual
  pmi?: number; // Annual PMI if down payment < 20%
  hoa?: number; // Monthly HOA fees
}

export interface MortgageResults {
  monthlyPayment: number;
  principalAndInterest: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  amortizationSchedule?: AmortizationEntry[];
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

/**
 * Calculate monthly mortgage payment
 */
export function calculateMortgage(inputs: MortgageInputs): MortgageResults {
  const {
    loanAmount,
    interestRate,
    loanTerm,
    downPayment = 0,
    propertyTax = 0,
    homeInsurance = 0,
    pmi = 0,
    hoa = 0,
  } = inputs;

  const principal = loanAmount - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  // Calculate principal and interest using standard mortgage formula
  // M = P * [r(1+r)^n] / [(1+r)^n - 1]
  let principalAndInterest = 0;
  if (monthlyRate > 0) {
    const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments);
    principalAndInterest = principal * (monthlyRate * rateFactor) / (rateFactor - 1);
  } else {
    principalAndInterest = principal / numberOfPayments;
  }

  // Calculate monthly property tax and insurance
  const monthlyPropertyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;
  const monthlyPMI = (pmi > 0 && downPayment < loanAmount * 0.2) ? pmi / 12 : 0;

  // Total monthly payment
  const monthlyPayment = principalAndInterest + monthlyPropertyTax + monthlyInsurance + monthlyPMI + hoa;
  const totalMonthlyPayment = monthlyPayment;

  // Calculate total interest over life of loan
  const totalPaid = principalAndInterest * numberOfPayments;
  const totalInterest = totalPaid - principal;
  const totalCost = totalPaid + (monthlyPropertyTax * numberOfPayments) + 
                    (monthlyInsurance * numberOfPayments) + 
                    (monthlyPMI * numberOfPayments) + 
                    (hoa * numberOfPayments) + downPayment;

  // Generate amortization schedule (first 12 months)
  const amortizationSchedule: AmortizationEntry[] = [];
  let remainingBalance = principal;

  for (let month = 1; month <= Math.min(12, numberOfPayments); month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = principalAndInterest - interestPayment;
    remainingBalance -= principalPayment;

    amortizationSchedule.push({
      month,
      payment: principalAndInterest,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, remainingBalance),
    });
  }

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    principalAndInterest: Math.round(principalAndInterest * 100) / 100,
    totalMonthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    amortizationSchedule,
  };
}

/**
 * Calculate affordability (max loan amount based on income)
 */
export function calculateAffordability(
  monthlyIncome: number,
  monthlyDebts: number,
  interestRate: number,
  loanTerm: number,
  downPaymentPercent: number = 20
): {
  maxMonthlyPayment: number;
  maxLoanAmount: number;
  maxHomePrice: number;
} {
  // Standard 28/36 rule: housing should be max 28% of gross income
  const maxHousingPayment = monthlyIncome * 0.28;
  const availableForHousing = maxHousingPayment - monthlyDebts;
  const maxMonthlyPayment = Math.max(0, availableForHousing);

  // Calculate max loan amount from monthly payment
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  let maxLoanAmount = 0;
  if (monthlyRate > 0) {
    const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments);
    maxLoanAmount = maxMonthlyPayment * (rateFactor - 1) / (monthlyRate * rateFactor);
  } else {
    maxLoanAmount = maxMonthlyPayment * numberOfPayments;
  }

  // Calculate max home price including down payment
  const maxHomePrice = maxLoanAmount / (1 - downPaymentPercent / 100);

  return {
    maxMonthlyPayment: Math.round(maxMonthlyPayment * 100) / 100,
    maxLoanAmount: Math.round(maxLoanAmount * 100) / 100,
    maxHomePrice: Math.round(maxHomePrice * 100) / 100,
  };
}
