/**
 * @file CalculatorPageShell.tsx
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

interface CalculatorPageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Lightweight shell for calculator pages that keeps content
 * aligned to a consistent max width and vertical rhythm.
 * Use this *inside* the main PageShell or page-level layout.
 */
export default function CalculatorPageShell({
  title,
  subtitle,
  children,
}: CalculatorPageShellProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="space-y-2 mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
            {subtitle}
          </p>
        )}
      </header>

      <div className="space-y-6">{children}</div>
    </section>
  );
}

