/**
 * @file saveCalculation.ts
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
import { SaveCalculationParams } from '../../types/tools';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';
const LEGACY_SERVER_URL = process.env.LEGACY_SERVER_URL || 'http://localhost:3000';

export interface SaveCalculationResult {
  success: boolean;
  calculationId?: string;
  message?: string;
  error?: string;
}

/**
 * Saves a calculation to the user's profile
 */
export async function saveCalculation(
  params: SaveCalculationParams,
  authToken?: string,
  correlationId?: string
): Promise<SaveCalculationResult> {
  if (!authToken) {
    return {
      success: false,
      error: 'User must be authenticated to save calculations',
    };
  }

  try {
    // Try auth-service first (if it has a save-calculation endpoint)
    try {
      const response = await axios.post(
        `${AUTH_SERVICE_URL}/auth/save-calculation`,
        {
          calculation: {
            type: params.calculationType,
            data: params.calculationData,
            title: params.title,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'x-correlation-id': correlationId,
          },
          timeout: 10000,
        }
      );

      if (response.data && response.data.success) {
        return {
          success: true,
          calculationId: response.data.calculationId || Date.now().toString(),
          message: response.data.message || 'Calculation saved successfully',
        };
      }
    } catch (error) {
      // Fallback to legacy endpoint
      console.warn('Auth service save-calculation failed, trying legacy:', error);
    }

    // Fallback to legacy endpoint
    const response = await axios.post(
      `${LEGACY_SERVER_URL}/api/user/save-calculation`,
      {
        calculation: {
          type: params.calculationType,
          data: params.calculationData,
          title: params.title,
        },
      },
      {
        headers: {
          'x-user-session': authToken, // Legacy uses session ID
          'x-correlation-id': correlationId,
        },
        timeout: 10000,
      }
    );

    if (response.data && response.data.success) {
      return {
        success: true,
        calculationId: Date.now().toString(),
        message: 'Calculation saved successfully',
      };
    }
  } catch (error: any) {
    console.error('Failed to save calculation:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to save calculation',
    };
  }

  return {
    success: false,
    error: 'Unknown error saving calculation',
  };
}
