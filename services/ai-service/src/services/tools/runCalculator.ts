/**
 * @file runCalculator.ts
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

import axios from 'axios';

const CALCULATOR_SERVICE_URL = process.env.CALCULATOR_SERVICE_URL || 'http://localhost:3003';
const LEGACY_SERVER_URL = process.env.LEGACY_SERVER_URL || 'http://localhost:3000';

export type CalculatorType =
  | 'payment'
  | 'scenarios'
  | 'dtoi'
  | 'buydown'
  | 'arm'
  | 'amortization'
  | 'borrowing-capacity'
  | '15vs30'
  | 'refinance'
  | 'extra-payment';

export interface CalculatorParams {
  calculatorType: CalculatorType;
  params: any;
}

export interface CalculatorResult {
  success: boolean;
  data?: any;
  error?: string;
  assumptions?: string[];
}

/**
 * Runs a mortgage calculator
 */
export async function runCalculator(
  calculatorType: CalculatorType,
  params: any,
  correlationId?: string
): Promise<CalculatorResult> {
  const assumptions: string[] = [];

  try {
    let endpoint = '';
    let requestBody = params;

    // Map calculator types to endpoints
    switch (calculatorType) {
      case 'payment':
        endpoint = '/calculator/mortgage';
        assumptions.push(`Using interest rate: ${params.interestRate || 'market rate'}%`);
        assumptions.push(`Loan term: ${params.termYears || 30} years`);
        break;

      case 'scenarios':
        endpoint = '/api/calculate-scenarios';
        assumptions.push('Comparing multiple loan scenarios with current market rates');
        assumptions.push(`Home price: $${params.loanAmount || 'not specified'}`);
        assumptions.push(`Down payment: $${params.downPayment || 0}`);
        break;

      case 'dtoi':
        endpoint = '/api/calculate-dtoi';
        assumptions.push('Using standard DTI ratios: 28/36 for conventional loans');
        assumptions.push(`Monthly income: $${params.grossMonthlyIncome || 'not specified'}`);
        break;

      case 'buydown':
        endpoint = '/api/calculate-buydown';
        assumptions.push(`Buydown type: ${params.buydownType || 'permanent'}`);
        break;

      case 'arm':
        endpoint = '/api/calculate-arm';
        assumptions.push('ARM calculations show initial and maximum payment scenarios');
        break;

      case 'amortization':
        endpoint = '/api/calculate-amortization';
        assumptions.push(`Extra payment: $${params.extraPayment || 0} per month`);
        break;

      case 'borrowing-capacity':
        endpoint = '/api/calculate-borrowing-capacity';
        assumptions.push('Based on 28% front-end ratio and 36% back-end ratio');
        break;

      case '15vs30':
        endpoint = '/api/compare-15vs30';
        assumptions.push('Comparing 15-year vs 30-year fixed rate mortgages');
        break;

      case 'refinance':
        endpoint = '/api/calculate-refinance';
        assumptions.push('Refinance analysis includes break-even calculation');
        break;

      case 'extra-payment':
        endpoint = '/api/calculate-extra-payment';
        assumptions.push(`Extra payment: $${params.extraPayment || 0} per month`);
        break;

      default:
        return {
          success: false,
          error: `Unknown calculator type: ${calculatorType}`,
        };
    }

    // Try calculator service first (for payment calculator)
    if (calculatorType === 'payment') {
      try {
        const response = await axios.post(
          `${CALCULATOR_SERVICE_URL}${endpoint}`,
          requestBody,
          {
            headers: {
              'x-correlation-id': correlationId,
            },
            timeout: 10000,
          }
        );

        if (response.data) {
          return {
            success: true,
            data: response.data,
            assumptions,
          };
        }
      } catch (error) {
        console.warn('Calculator service failed, trying legacy:', error);
      }
    }

    // Fallback to legacy server endpoints
    const response = await axios.post(`${LEGACY_SERVER_URL}${endpoint}`, requestBody, {
      headers: {
        'x-correlation-id': correlationId,
      },
      timeout: 10000,
    });

    if (response.data) {
      return {
        success: true,
        data: response.data,
        assumptions,
      };
    }
  } catch (error: any) {
    console.error('Calculator error:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Calculation failed',
      assumptions,
    };
  }

  return {
    success: false,
    error: 'Unknown error during calculation',
    assumptions,
  };
}
