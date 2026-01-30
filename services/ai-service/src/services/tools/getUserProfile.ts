/**
 * @file getUserProfile.ts
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
import { User } from '../../types/ai';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';

/**
 * Fetches user profile from auth-service
 */
export async function getUserProfile(
  userId: string,
  authToken: string,
  correlationId?: string
): Promise<User | null> {
  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'x-correlation-id': correlationId,
      },
      timeout: 5000,
    });

    if (response.data && response.data.user) {
      return {
        id: response.data.user.id || userId,
        email: response.data.user.email,
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
      };
    }
  } catch (error) {
    console.warn('Failed to fetch user profile:', error);
  }

  return null;
}
