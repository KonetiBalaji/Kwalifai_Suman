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

// Pure TypeScript implementations of calculator functions, ported from server.js

import type {
  ScenarioInput,
  MultipleScenariosResult,
  DTOIParams,
  DTOIResult,
  RateBuydownParams,
  PermanentBuydownParams,
  PermanentBuydownResult,
  TemporaryBuydownParams,
  TemporaryBuydownResult,
  ARMParams,
  ARMResult,
  AmortizationResult,
  BorrowingCapacityParams,
  BorrowingCapacityResult,
  Compare15vs30Result,
  RefinanceParams,
  RefinanceResult,
  ExtraPaymentImpactResult,
} from './types';

// ===== INTERNAL UTILITIES (mirror server.js behavior) =====

export function calculateMortgagePayment(
  loanAmount: number,
  rate: number,
  termYears: number,
): number {
  const monthlyRate = rate / 100 / 12;
  const numPayments = termYears * 12;
  if (monthlyRate === 0) return loanAmount / numPayments;
  const monthlyPayment =
    (loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  return Math.round(monthlyPayment * 100) / 100;
}

export function getCurrentMortgageRates(): {
  thirtyYear: number;
  fifteenYear: number;
  twentyYear: number;
  fiveYearARM: number;
  fha: number;
  va: number;
  usda: number;
  jumbo: number;
  lastUpdated: string;
} {
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

// ===== MULTI-SCENARIO CALCULATOR =====

export function calculateMultipleScenarios(
  params: ScenarioInput,
): MultipleScenariosResult {
  const { loanAmount, downPayment = 0 } = params;
  const rates = getCurrentMortgageRates();
  const actualLoanAmount = loanAmount - downPayment;

  const scenarios = [
    {
      type: '30-Year Fixed',
      rate: rates.thirtyYear,
      term: 30,
      payment: calculateMortgagePayment(actualLoanAmount, rates.thirtyYear, 30),
      totalInterest:
        calculateMortgagePayment(actualLoanAmount, rates.thirtyYear, 30) *
          360 -
        actualLoanAmount,
      totalPayments:
        calculateMortgagePayment(actualLoanAmount, rates.thirtyYear, 30) *
        360,
    },
    {
      type: '15-Year Fixed',
      rate: rates.fifteenYear,
      term: 15,
      payment: calculateMortgagePayment(actualLoanAmount, rates.fifteenYear, 15),
      totalInterest:
        calculateMortgagePayment(actualLoanAmount, rates.fifteenYear, 15) *
          180 -
        actualLoanAmount,
      totalPayments:
        calculateMortgagePayment(actualLoanAmount, rates.fifteenYear, 15) *
        180,
    },
    {
      type: '20-Year Fixed',
      rate: rates.twentyYear,
      term: 20,
      payment: calculateMortgagePayment(actualLoanAmount, rates.twentyYear, 20),
      totalInterest:
        calculateMortgagePayment(actualLoanAmount, rates.twentyYear, 20) *
          240 -
        actualLoanAmount,
      totalPayments:
        calculateMortgagePayment(actualLoanAmount, rates.twentyYear, 20) *
        240,
    },
    {
      type: '5/1 ARM',
      rate: rates.fiveYearARM,
      term: 30,
      payment: calculateMortgagePayment(
        actualLoanAmount,
        rates.fiveYearARM,
        30,
      ),
      totalInterest:
        calculateMortgagePayment(actualLoanAmount, rates.fiveYearARM, 30) *
          360 -
        actualLoanAmount,
      totalPayments:
        calculateMortgagePayment(actualLoanAmount, rates.fiveYearARM, 30) *
        360,
      note: 'Rate adjusts after 5 years',
    },
  ];

  scenarios.forEach((scenario) => {
    // eslint-disable-next-line no-param-reassign
    scenario.payment = Math.round(scenario.payment * 100) / 100;
    // eslint-disable-next-line no-param-reassign
    scenario.totalInterest =
      Math.round(scenario.totalInterest * 100) / 100;
    // eslint-disable-next-line no-param-reassign
    scenario.totalPayments =
      Math.round(scenario.totalPayments * 100) / 100;
  });

  return {
    loanAmount: actualLoanAmount,
    downPayment,
    homePrice: loanAmount,
    scenarios,
  };
}

// ===== DTOI CALCULATOR =====

export function calculateDTOI(params: DTOIParams): DTOIResult {
  const {
    grossMonthlyIncome,
    monthlyDebtPayments = 0,
    proposedHousingPayment = 0,
    propertyTaxes = 0,
    homeInsurance = 0,
    mortgageInsurance = 0,
    hoaFees = 0,
  } = params;

  const totalHousingCosts =
    proposedHousingPayment +
    propertyTaxes +
    homeInsurance +
    mortgageInsurance +
    hoaFees;
  const frontEndRatio = (totalHousingCosts / grossMonthlyIncome) * 100;
  const totalMonthlyDebts = totalHousingCosts + monthlyDebtPayments;
  const backEndRatio = (totalMonthlyDebts / grossMonthlyIncome) * 100;

  let qualification = 'Excellent';
  let message = 'You meet all conventional loan requirements!';
  let color = '#28a745';

  if (frontEndRatio > 28 || backEndRatio > 36) {
    if (frontEndRatio <= 31 && backEndRatio <= 43) {
      qualification = 'Good - FHA Eligible';
      message = 'You qualify for FHA and most conventional programs';
      color = '#ffc107';
    } else if (backEndRatio <= 50) {
      qualification = 'Marginal';
      message = 'May qualify with strong compensating factors';
      color = '#fd7e14';
    } else {
      qualification = 'Needs Improvement';
      message = 'Consider reducing debt or increasing income';
      color = '#dc3545';
    }
  }

  const maxHousingPayment28 = grossMonthlyIncome * 0.28;
  const maxTotalDebt36 = grossMonthlyIncome * 0.36;
  const maxHousingAfterDebts = Math.max(0, maxTotalDebt36 - monthlyDebtPayments);

  return {
    grossMonthlyIncome,
    totalHousingCosts: Math.round(totalHousingCosts * 100) / 100,
    totalMonthlyDebts: Math.round(totalMonthlyDebts * 100) / 100,
    frontEndRatio: Math.round(frontEndRatio * 100) / 100,
    backEndRatio: Math.round(backEndRatio * 100) / 100,
    qualification,
    message,
    color,
    recommendations: {
      maxHousingPayment28: Math.round(maxHousingPayment28 * 100) / 100,
      maxTotalDebt36: Math.round(maxTotalDebt36 * 100) / 100,
      maxHousingAfterDebts:
        Math.round(maxHousingAfterDebts * 100) / 100,
      remainingAfterDebts:
        Math.round((grossMonthlyIncome - totalMonthlyDebts) * 100) / 100,
    },
    breakdown: {
      housingComponents: {
        mortgagePayment: proposedHousingPayment,
        propertyTaxes,
        homeInsurance,
        mortgageInsurance,
        hoaFees,
      },
      monthlyDebtPayments,
    },
  };
}

// ===== RATE BUYDOWN =====

export function calculateRateBuydown(
  params: RateBuydownParams,
): PermanentBuydownResult | TemporaryBuydownResult {
  const {
    loanAmount,
    originalRate,
    termYears = 30,
    buydownType = 'permanent',
    permanentPoints = 1,
    temporaryBuydownStructure = '3-2-1',
  } = params;

  if (buydownType === 'permanent') {
    return calculatePermanentBuydown({
      loanAmount,
      originalRate,
      termYears,
      points: permanentPoints,
    });
  }

  return calculateTemporaryBuydown({
    loanAmount,
    originalRate,
    termYears,
    structure: temporaryBuydownStructure,
  });
}

export function calculatePermanentBuydown(
  params: PermanentBuydownParams,
): PermanentBuydownResult {
  const { loanAmount, originalRate, termYears, points } = params;

  const rateReduction = points * 0.25;
  const newRate = Math.max(0, originalRate - rateReduction);

  const originalPayment = calculateMortgagePayment(
    loanAmount,
    originalRate,
    termYears,
  );
  const newPayment = calculateMortgagePayment(
    loanAmount,
    newRate,
    termYears,
  );
  const monthlySavings = originalPayment - newPayment;

  const pointsCost = loanAmount * (points / 100);
  const breakEvenMonths =
    monthlySavings > 0 ? Math.ceil(pointsCost / monthlySavings) : 0;
  const breakEvenYears = Math.floor(breakEvenMonths / 12);
  const breakEvenRemainingMonths = breakEvenMonths % 12;

  return {
    buydownType: 'permanent',
    loanAmount,
    originalRate,
    newRate,
    points,
    pointsCost: Math.round(pointsCost * 100) / 100,
    originalPayment: Math.round(originalPayment * 100) / 100,
    newPayment: Math.round(newPayment * 100) / 100,
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    breakEvenMonths,
    breakEvenTime: `${breakEvenYears} years, ${breakEvenRemainingMonths} months`,
  };
}

export function calculateTemporaryBuydown(
  params: TemporaryBuydownParams,
): TemporaryBuydownResult {
  const { loanAmount, originalRate, termYears, structure } = params;

  const structures: Record<
    string,
    Array<{ year: number; reduction: number }>
  > = {
    '3-2-1': [
      { year: 1, reduction: 3 },
      { year: 2, reduction: 2 },
      { year: 3, reduction: 1 },
    ],
    '2-1': [
      { year: 1, reduction: 2 },
      { year: 2, reduction: 1 },
    ],
    '1-1': [
      { year: 1, reduction: 1 },
      { year: 2, reduction: 1 },
    ],
    '1-0': [{ year: 1, reduction: 1 }],
  };

  const buydownSchedule =
    structures[structure] || structures['3-2-1'];
  const originalPayment = calculateMortgagePayment(
    loanAmount,
    originalRate,
    termYears,
  );

  let totalBuydownCost = 0;
  let totalSavings = 0;
  const yearlyBreakdown: TemporaryBuydownResult['yearlyBreakdown'] = [];

  buydownSchedule.forEach(({ year, reduction }) => {
    const buydownRate = Math.max(0, originalRate - reduction);
    const buydownPayment = calculateMortgagePayment(
      loanAmount,
      buydownRate,
      termYears,
    );
    const monthlySavings = originalPayment - buydownPayment;
    const annualSavings = monthlySavings * 12;

    totalBuydownCost += annualSavings;
    totalSavings += annualSavings;

    yearlyBreakdown.push({
      year,
      effectiveRate: buydownRate,
      monthlyPayment: Math.round(buydownPayment * 100) / 100,
      monthlySavings: Math.round(monthlySavings * 100) / 100,
      annualSavings: Math.round(annualSavings * 100) / 100,
      subsidyAmount: Math.round(monthlySavings * 100) / 100,
    });
  });

  return {
    buydownType: 'temporary',
    structure,
    loanAmount,
    originalRate,
    termYears,
    originalPayment: Math.round(originalPayment * 100) / 100,
    totalBuydownCost: Math.round(totalBuydownCost * 100) / 100,
    totalSavings: Math.round(totalSavings * 100) / 100,
    sellerContribution: Math.round(totalBuydownCost * 100) / 100,
    yearlyBreakdown,
    summary: {
      buydownPeriod: `${buydownSchedule.length} year${
        buydownSchedule.length > 1 ? 's' : ''
      }`,
      totalSavedDuringBuydown:
        Math.round(totalSavings * 100) / 100,
      averageMonthlySavings:
        Math.round(
          (totalSavings / (buydownSchedule.length * 12)) * 100,
        ) / 100,
      paidBy: 'Seller, Builder, or Lender',
      escrowAccount: true,
      refundableIfRefinance: true,
    },
  };
}

// ===== ARM, AMORTIZATION, BORROWING =====

export function calculateARMPayment(params: ARMParams): ARMResult {
  const {
    loanAmount,
    initialRate,
    termInYears = 30,
    maximumInterestRate = 12,
    lifetimeRateCap = 5,
  } = params;

  const initialPayment = calculateMortgagePayment(
    loanAmount,
    initialRate,
    termInYears,
  );
  const maxRate = Math.min(maximumInterestRate, initialRate + lifetimeRateCap);
  const maxPayment = calculateMortgagePayment(
    loanAmount,
    maxRate,
    termInYears,
  );

  return {
    initialPayment: Math.round(initialPayment * 100) / 100,
    maxPayment: Math.round(maxPayment * 100) / 100,
    initialRate,
    maxRate,
  };
}

export function calculateAmortizationSchedule(
  loanAmount: number,
  rate: number,
  termYears: number,
  extraPayment: number = 0,
): AmortizationResult {
  const monthlyRate = rate / 100 / 12;
  const numPayments = termYears * 12;
  const basePayment = calculateMortgagePayment(loanAmount, rate, termYears);
  const totalPayment = basePayment + extraPayment;

  let balance = loanAmount;
  let totalInterest = 0;
  let paymentNumber = 0;
  const schedule: AmortizationResult['schedule'] = [];

  while (balance > 0.01 && paymentNumber < numPayments * 2) {
    paymentNumber++;
    const interestPayment = balance * monthlyRate;
    let principalPayment = Math.min(totalPayment - interestPayment, balance);

    if (principalPayment <= 0) principalPayment = balance;

    balance -= principalPayment;
    totalInterest += interestPayment;

    schedule.push({
      paymentNumber,
      payment:
        Math.round((principalPayment + interestPayment) * 100) /
        100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      balance: Math.round(Math.max(0, balance) * 100) / 100,
    });

    if (balance <= 0) break;
  }

  return {
    schedule: schedule.slice(0, 12),
    summary: {
      totalPayments: paymentNumber,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPaid: Math.round((loanAmount + totalInterest) * 100) / 100,
      monthlySavings: extraPayment,
      timeSaved: Math.max(0, numPayments - paymentNumber),
    },
  };
}

export function calculateBorrowingCapacity(
  params: BorrowingCapacityParams,
): BorrowingCapacityResult {
  const {
    grossMonthlyIncome,
    monthlyDebtPayment = 0,
    interestRate,
    termInYears = 30,
    downPaymentPercent = 20,
  } = params;

  const conservativePayment = Math.max(
    0,
    grossMonthlyIncome * 0.28 - monthlyDebtPayment,
  );
  const aggressivePayment = Math.max(
    0,
    grossMonthlyIncome * 0.31 - monthlyDebtPayment,
  );

  const monthlyRate = interestRate / 100 / 12;
  const numPayments = termInYears * 12;

  let factor: number = numPayments;
  if (monthlyRate > 0) {
    factor =
      (Math.pow(1 + monthlyRate, numPayments) - 1) /
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
  }

  const conservativeLoan = Math.max(0, conservativePayment * factor);
  const aggressiveLoan = Math.max(0, aggressivePayment * factor);

  const conservativeHomePrice =
    conservativeLoan / (1 - downPaymentPercent / 100);
  const aggressiveHomePrice =
    aggressiveLoan / (1 - downPaymentPercent / 100);

  return {
    conservative: {
      maxPayment: Math.round(conservativePayment * 100) / 100,
      maxLoanAmount: Math.round(conservativeLoan * 100) / 100,
      maxHomePrice: Math.round(conservativeHomePrice * 100) / 100,
      downPayment:
        Math.round(
          (conservativeHomePrice * downPaymentPercent) / 100 * 100,
        ) / 100,
    },
    aggressive: {
      maxPayment: Math.round(aggressivePayment * 100) / 100,
      maxLoanAmount: Math.round(aggressiveLoan * 100) / 100,
      maxHomePrice: Math.round(aggressiveHomePrice * 100) / 100,
      downPayment:
        Math.round(
          (aggressiveHomePrice * downPaymentPercent) / 100 * 100,
        ) / 100,
    },
    monthlyIncome: grossMonthlyIncome,
    monthlyDebts: monthlyDebtPayment,
  };
}

// ===== 15 vs 30, REFINANCE, EXTRA PAYMENT =====

export function compare15vs30Year(
  loanAmount: number,
  rate15: number,
  rate30: number,
): Compare15vs30Result {
  const payment15 = calculateMortgagePayment(loanAmount, rate15, 15);
  const totalInterest15 = payment15 * 180 - loanAmount;
  const totalPayments15 = payment15 * 180;

  const payment30 = calculateMortgagePayment(loanAmount, rate30, 30);
  const totalInterest30 = payment30 * 360 - loanAmount;
  const totalPayments30 = payment30 * 360;

  return {
    fifteenYear: {
      monthlyPayment: Math.round(payment15 * 100) / 100,
      totalPayments: Math.round(totalPayments15 * 100) / 100,
      totalInterest: Math.round(totalInterest15 * 100) / 100,
      interestRate: rate15,
    },
    thirtyYear: {
      monthlyPayment: Math.round(payment30 * 100) / 100,
      totalPayments: Math.round(totalPayments30 * 100) / 100,
      totalInterest: Math.round(totalInterest30 * 100) / 100,
      interestRate: rate30,
    },
    savings: {
      monthlyDifference:
        Math.round((payment15 - payment30) * 100) / 100,
      totalInterestSavings:
        Math.round((totalInterest30 - totalInterest15) * 100) /
        100,
      timeSavings: '15 years',
    },
  };
}

export function calculateRefinance(
  params: RefinanceParams,
): RefinanceResult {
  const {
    currentBalance,
    currentRate,
    currentPayment,
    newRate,
    newTermYears = 30,
    closingCosts = 0,
  } = params;

  const newLoanAmount = currentBalance + closingCosts;
  const newPayment = calculateMortgagePayment(
    newLoanAmount,
    newRate,
    newTermYears,
  );
  const monthlySavings = currentPayment - newPayment;

  let breakEvenMonths = 0;
  if (monthlySavings > 0 && closingCosts > 0) {
    breakEvenMonths = Math.ceil(closingCosts / monthlySavings);
  }

  return {
    currentLoan: {
      remainingBalance: currentBalance,
      currentPayment,
      currentRate,
    },
    newLoan: {
      newBalance: newLoanAmount,
      newPayment: Math.round(newPayment * 100) / 100,
      newRate,
      termInYears: newTermYears,
    },
    savings: {
      monthlyPaymentChange:
        Math.round(monthlySavings * 100) / 100,
      closingCosts,
      breakEvenMonths,
    },
  };
}

export function calculateExtraPaymentImpact(
  loanAmount: number,
  rate: number,
  termYears: number,
  extraPayment: number,
): ExtraPaymentImpactResult {
  const withoutExtra = calculateAmortizationSchedule(
    loanAmount,
    rate,
    termYears,
    0,
  );
  const withExtra = calculateAmortizationSchedule(
    loanAmount,
    rate,
    termYears,
    extraPayment,
  );

  const interestSaved =
    withoutExtra.summary.totalInterest - withExtra.summary.totalInterest;
  const timeSaved =
    withoutExtra.summary.totalPayments - withExtra.summary.totalPayments;

  const yearsSaved = Math.floor(timeSaved / 12);
  const monthsSaved = timeSaved % 12;

  return {
    withoutExtraPayment: {
      monthlyPayment: calculateMortgagePayment(
        loanAmount,
        rate,
        termYears,
      ),
      totalInterest: withoutExtra.summary.totalInterest,
      totalPayments: withoutExtra.summary.totalPayments,
    },
    withExtraPayment: {
      monthlyPayment:
        calculateMortgagePayment(loanAmount, rate, termYears) +
        extraPayment,
      totalInterest: withExtra.summary.totalInterest,
      totalPayments: withExtra.summary.totalPayments,
    },
    savings: {
      interestSaved: Math.round(interestSaved * 100) / 100,
      timeSaved: `${yearsSaved} years, ${monthsSaved} months`,
      timeSavedMonths: timeSaved,
    },
  };
}

