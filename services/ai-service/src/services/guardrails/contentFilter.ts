/**
 * @file contentFilter.ts
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
 * Filters out non-mortgage content from responses
 * Additional safety layer to ensure responses stay on topic
 */
export function filterContent(content: string): string {
  // List of non-mortgage topics to filter
  const nonMortgagePatterns = [
    /stock market/gi,
    /cryptocurrency/gi,
    /bitcoin/gi,
    /ethereum/gi,
    /trading/gi,
    /investment advice/gi,
  ];

  let filtered = content;

  // Check if content contains non-mortgage topics
  for (const pattern of nonMortgagePatterns) {
    if (pattern.test(filtered)) {
      // Replace with mortgage-focused redirect
      filtered = filtered.replace(
        pattern,
        'mortgage-related topic'
      );
    }
  }

  return filtered;
}

/**
 * Checks if content is mortgage-related
 */
export function isMortgageRelated(content: string): boolean {
  const mortgageKeywords = [
    'mortgage', 'loan', 'rate', 'refinance', 'home', 'house', 'property',
    'payment', 'interest', 'lender', 'borrow', 'down payment', 'equity',
    'amortization', 'dti', 'debt to income', 'qualify', 'preapproval',
    'closing', 'escrow', 'piti', 'principal', 'fha', 'va', 'conventional',
    'jumbo', 'arm', 'fixed', 'buydown', 'points', 'statement', 'alert',
    'calculator', 'scenario', 'borrowing capacity', 'extra payment',
  ];

  const lowerContent = content.toLowerCase();
  return mortgageKeywords.some(keyword => lowerContent.includes(keyword));
}
