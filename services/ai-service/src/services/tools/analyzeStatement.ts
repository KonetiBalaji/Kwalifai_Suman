/**
 * @file analyzeStatement.ts
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
import { AnalyzeStatementParams } from '../../types/tools';

const STATEMENT_ANALYSIS_SERVICE_URL = process.env.STATEMENT_ANALYSIS_SERVICE_URL || 'http://localhost:3005';
const LEGACY_SERVER_URL = process.env.LEGACY_SERVER_URL || 'http://localhost:3000';

export interface AnalyzeStatementResult {
  success: boolean;
  analysis?: any;
  statementId?: string;
  error?: string;
}

/**
 * Analyzes a mortgage statement
 * Can work with statement ID or manual entry
 */
export async function analyzeStatement(
  params: AnalyzeStatementParams,
  correlationId?: string
): Promise<AnalyzeStatementResult> {
  try {
    // If statementId is provided, fetch analysis
    if (params.statementId) {
      const response = await axios.get(
        `${STATEMENT_ANALYSIS_SERVICE_URL}/statement/${params.statementId}`,
        {
          headers: {
            'x-correlation-id': correlationId,
          },
          timeout: 10000,
        }
      );

      if (response.data && response.data.analysis) {
        return {
          success: true,
          analysis: response.data.analysis,
          statementId: params.statementId,
        };
      }
    }

    // Manual entry - use legacy endpoint for now
    if (params.currentBalance || params.currentRate || params.monthlyPayment) {
      const response = await axios.post(
        `${LEGACY_SERVER_URL}/api/upload-statement`,
        {
          currentBalance: params.currentBalance,
          currentRate: params.currentRate,
          monthlyPayment: params.monthlyPayment,
        },
        {
          headers: {
            'x-correlation-id': correlationId,
          },
          timeout: 10000,
        }
      );

      if (response.data && response.data.analysis) {
        return {
          success: true,
          analysis: response.data.analysis,
          statementId: response.data.statementId,
        };
      }
    }

    return {
      success: false,
      error: 'Either statementId or manual entry data required',
    };
  } catch (error: any) {
    console.error('Failed to analyze statement:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to analyze statement',
    };
  }
}
