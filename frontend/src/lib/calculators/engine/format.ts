/**
 * @file format.ts
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

// Formatting helpers for calculator outputs

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatCurrency(value: number, currency: string = 'USD'): string {
  if (!Number.isFinite(value)) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '-';
  return `${round2(value)}%`;
}

