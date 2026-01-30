/**
 * @file createRateAlert.ts
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
import { v4 as uuidv4 } from 'uuid';

const RATE_ALERT_SERVICE_URL = process.env.RATE_ALERT_SERVICE_URL || 'http://localhost:3004';

export interface CreateRateAlertParams {
  email: string;
  loanType: string;
  targetRate: number;
  loanAmount?: number;
  propertyAddress?: string;
  timeframe?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface CreateRateAlertResult {
  success: boolean;
  alertId?: string;
  message?: string;
  error?: string;
}

/**
 * Creates a rate alert for the user
 */
export async function createRateAlert(
  params: CreateRateAlertParams,
  correlationId?: string
): Promise<CreateRateAlertResult> {
  try {
    // Generate idempotency key
    const idempotencyKey = uuidv4();

    const response = await axios.post(
      `${RATE_ALERT_SERVICE_URL}/rate-alerts`,
      {
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        phone: params.phone,
        loanType: params.loanType,
        targetRate: params.targetRate,
        loanAmount: params.loanAmount,
        propertyAddress: params.propertyAddress,
        timeframe: params.timeframe || '90 days',
      },
      {
        headers: {
          'Idempotency-Key': idempotencyKey,
          'x-correlation-id': correlationId,
        },
        timeout: 10000,
      }
    );

    if (response.data && response.data.alertId) {
      return {
        success: true,
        alertId: response.data.alertId,
        message: response.data.message || 'Rate alert created successfully',
      };
    }
  } catch (error: any) {
    console.error('Failed to create rate alert:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create rate alert',
    };
  }

  return {
    success: false,
    error: 'Unknown error creating rate alert',
  };
}
