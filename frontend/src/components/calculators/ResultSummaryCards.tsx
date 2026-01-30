/**
 * @file ResultSummaryCards.tsx
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

'use client';

import type { ReactNode } from 'react';

interface SummaryItem {
  label: string;
  value: ReactNode;
  helperText?: string;
}

interface ResultSummaryCardsProps {
  items: SummaryItem[];
}

/**
 * Compact summary row for key calculator outputs
 * (e.g., monthly payment, total interest, break-even time).
 */
export default function ResultSummaryCards({ items }: ResultSummaryCardsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section
      aria-label="Result summary"
      className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-3"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {item.label}
            </span>
            <span className="mt-1 text-lg font-semibold text-gray-900">
              {item.value}
            </span>
            {item.helperText && (
              <span className="mt-1 text-[11px] text-gray-500">
                {item.helperText}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

