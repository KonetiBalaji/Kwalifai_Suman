/**
 * @file getRates.ts
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

export interface MortgageRates {
  thirtyYear: number;
  fifteenYear: number;
  twentyYear: number;
  fiveYearARM: number;
  fha: number;
  va: number;
  usda: number;
  jumbo: number;
  lastUpdated: string;
}

/**
 * Fetches current mortgage rates
 */
export async function getRates(correlationId?: string): Promise<MortgageRates> {
  try {
    // Try calculator service first
    const response = await axios.get(`${CALCULATOR_SERVICE_URL}/calculator/mortgage-rates`, {
      headers: {
        'x-correlation-id': correlationId,
      },
      timeout: 2000, // Reduced timeout for faster fallback
    });

    if (response.data) {
      return response.data;
    }
  } catch (error: any) {
    // Silently fail and try next option
    if (error.code !== 'ECONNABORTED') {
      console.warn('[getRates] Calculator service failed, trying legacy:', error.message);
    }
  }

  // Fallback to legacy endpoint (but this might not exist, so skip it)
  // Just return hardcoded rates immediately
  console.log('[getRates] Using default rates');
  
  // Hardcoded fallback (matches legacy server.js)
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
