/**
 * @file ai.ts
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

export type UserIntent =
  | 'rates'
  | 'calculator'
  | 'rate_alert'
  | 'refinance'
  | 'dti'
  | 'statement'
  | 'education'
  | 'general_mortgage'
  | 'unknown';

export type ActionType = 'create_rate_alert' | 'run_calculator' | 'save_calculation';

export interface AiResponse {
  greeting?: string;
  userIntent: UserIntent;
  replyMarkdown: string;
  explainability?: {
    assumptions: string[];
    calculations?: Array<{ name: string; value: string }>;
    whyThis?: string[];
    disclaimers: string[];
  };
  actionsTaken?: Array<{
    type: ActionType;
    status: 'success' | 'failed';
    referenceId?: string;
    error?: string;
  }>;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse extends AiResponse {
  sessionId: string;
  correlationId?: string;
}
