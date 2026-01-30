/**
 * @file Disclaimer.tsx
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

interface DisclaimerProps {
  children?: ReactNode;
}

/**
 * Short legal/accuracy note shown under calculators.
 */
export default function Disclaimer({
  children,
}: DisclaimerProps) {
  return (
    <p className="mt-4 text-[11px] sm:text-xs text-gray-500 leading-relaxed">
      {children ??
        'These results are estimates for educational purposes only and do not constitute a credit decision or loan approval.'}
    </p>
  );
}

