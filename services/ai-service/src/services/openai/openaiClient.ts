/**
 * @file openaiClient.ts
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

import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn('[AI] WARNING: OPENAI_API_KEY not set. AI service will use fallback mode.');
  console.warn('[AI] Tip: Create services/ai-service/.env with OPENAI_API_KEY=sk-...');
} else {
  console.log('[AI] OpenAI API key loaded successfully');
}

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : (null as any); // Will be checked before use

export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
export const OPENAI_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '2000', 10);
export const OPENAI_TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');
