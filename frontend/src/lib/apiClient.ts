/**
 * @file apiClient.ts
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

// Simple API client wrapper for calling the API Gateway from the frontend

const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';

export interface ApiClientError {
  message: string;
  code?: string;
  details?: unknown;
}

export async function apiClient<TResponse>(
  path: string,
  options: RequestInit & { idempotencyKey?: string } = {},
): Promise<TResponse> {
  const url = `${API_GATEWAY_URL}${path}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Attach Idempotency-Key header if provided
  if (options.idempotencyKey) {
    (headers as Record<string, string>)['idempotency-key'] =
      options.idempotencyKey;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    // Ignore JSON parse errors for non-JSON responses
  }

  if (!response.ok) {
    const error: ApiClientError = {
      message:
        data?.error?.message ||
        data?.message ||
        'Something went wrong. Please try again.',
      code: data?.error?.code,
      details: data?.error?.details ?? data?.details,
    };
    throw error;
  }

  return data as TResponse;
}

