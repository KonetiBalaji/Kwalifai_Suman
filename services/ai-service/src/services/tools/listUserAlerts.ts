/**
 * @file listUserAlerts.ts
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

const RATE_ALERT_SERVICE_URL = process.env.RATE_ALERT_SERVICE_URL || 'http://localhost:3004';

export interface RateAlert {
  id: string;
  email: string;
  loanType: string;
  targetRate: number;
  status: string;
  createdAt: string;
}

/**
 * Lists user's active rate alerts
 */
export async function listUserAlerts(
  email: string,
  correlationId?: string
): Promise<RateAlert[]> {
  try {
    const response = await axios.get(`${RATE_ALERT_SERVICE_URL}/rate-alerts`, {
      params: {
        email,
        includeAll: 'false', // Only active alerts
      },
      headers: {
        'x-correlation-id': correlationId,
      },
      timeout: 5000,
    });

    if (response.data && response.data.alerts) {
      return response.data.alerts;
    }
  } catch (error) {
    console.warn('Failed to fetch user alerts:', error);
  }

  return [];
}
