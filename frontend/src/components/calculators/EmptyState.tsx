/**
 * @file EmptyState.tsx
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

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  title = 'No results yet',
  description = 'Run a calculation to see your results here.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

