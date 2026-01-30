/**
 * @file redaction.ts
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

/**
 * Redacts PII from text before sending to OpenAI
 */
export function redactPII(text: string): string {
  let redacted = text;

  // Redact SSN patterns: XXX-XX-XXXX
  redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED-SSN]');

  // Redact credit card numbers: XXXX-XXXX-XXXX-XXXX or XXXX XXXX XXXX XXXX
  redacted = redacted.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[REDACTED-CARD]');

  // Redact bank account numbers (10-17 digits, context-dependent)
  // Only redact if it appears in context of "account", "routing", "bank"
  const accountContextRegex = /\b(?:account|routing|bank|acct)\s*(?:number|#|num)?\s*:?\s*(\d{10,17})\b/gi;
  redacted = redacted.replace(accountContextRegex, (match, accountNum) => {
    return match.replace(accountNum, '[REDACTED-ACCOUNT]');
  });

  return redacted;
}

/**
 * Redacts PII from an object recursively
 */
export function redactPIIFromObject(obj: any): any {
  if (typeof obj === 'string') {
    return redactPII(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(redactPIIFromObject);
  }

  if (obj && typeof obj === 'object') {
    const redacted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip redaction for fields that are needed for functionality
      if (key === 'message' || key === 'userMessage') {
        redacted[key] = redactPIIFromObject(value);
      } else {
        redacted[key] = redactPIIFromObject(value);
      }
    }
    return redacted;
  }

  return obj;
}
