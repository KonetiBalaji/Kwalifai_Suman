/**
 * @file ErrorState.tsx
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

interface ErrorStateProps {
  message?: string;
  details?: ReactNode;
  action?: ReactNode;
}

export default function ErrorState({
  message = 'Something went wrong while running this calculation.',
  details,
  action,
}: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-2 w-2 rounded-full bg-red-500" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-800">{message}</p>
          {details && (
            <div className="mt-1 text-xs sm:text-sm text-red-700">{details}</div>
          )}
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
}

