/**
 * @file tools.ts
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

import { CalculatorType } from '../services/tools/runCalculator';

export interface ToolCallResult {
  success: boolean;
  data?: any;
  error?: string;
  assumptions?: string[];
}

export interface GetRatesParams {
  // No parameters needed
}

export interface RunCalculatorParams {
  calculatorType: CalculatorType;
  params: Record<string, any>;
}

export interface CreateRateAlertParams {
  email: string;
  loanType: string;
  targetRate: number;
  loanAmount?: number;
  propertyAddress?: string;
  timeframe?: string;
}

export interface GetUserProfileParams {
  // No parameters needed (uses auth token)
}

export interface ListUserAlertsParams {
  email: string;
}

export interface SaveCalculationParams {
  calculationType: string;
  calculationData: Record<string, any>;
  title?: string;
}

export interface AnalyzeStatementParams {
  statementId?: string;
  // Or manual entry
  currentBalance?: number;
  currentRate?: number;
  monthlyPayment?: number;
}
