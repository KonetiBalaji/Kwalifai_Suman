/**
 * @file intentClassifier.ts
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
 * Pre-classifies user intent to catch non-mortgage queries early
 * This is a fast, lightweight check before sending to OpenAI
 */
export function classifyIntent(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Mortgage-related keywords
  const mortgageKeywords = [
    'mortgage', 'loan', 'rate', 'refinance', 'home', 'house', 'property',
    'payment', 'interest', 'lender', 'borrow', 'down payment', 'equity',
    'amortization', 'dti', 'debt to income', 'qualify', 'preapproval',
    'closing', 'escrow', 'piti', 'principal', 'fha', 'va', 'conventional',
    'jumbo', 'arm', 'fixed', 'buydown', 'points', 'statement', 'alert',
    'calculator', 'scenario', 'borrowing capacity', 'extra payment',
  ];

  // Non-mortgage keywords (strong indicators)
  const nonMortgageKeywords = [
    'stock', 'crypto', 'bitcoin', 'ethereum', 'investment', 'trading',
    'weather', 'sports', 'movie', 'recipe', 'cooking', 'travel', 'vacation',
    'health', 'medical', 'doctor', 'insurance', 'car insurance', 'life insurance',
    'credit card', 'banking', 'savings account', 'checking account',
  ];

  // Check for non-mortgage keywords first
  for (const keyword of nonMortgageKeywords) {
    if (lowerMessage.includes(keyword)) {
      // But allow if it's in mortgage context (e.g., "mortgage insurance")
      if (!lowerMessage.includes('mortgage') && !lowerMessage.includes('home')) {
        return 'non_mortgage';
      }
    }
  }

  // Check for mortgage keywords
  for (const keyword of mortgageKeywords) {
    if (lowerMessage.includes(keyword)) {
      return 'mortgage';
    }
  }

  // Ambiguous - let OpenAI decide
  return 'unknown';
}
