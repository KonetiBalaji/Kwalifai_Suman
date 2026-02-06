/**
 * @file PageShell.tsx
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

import { ReactNode } from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageShellProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  children?: ReactNode;
}

export default function PageShell({ title, subtitle, ctaLabel, ctaHref, children }: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {(title || subtitle || ctaLabel) && (
            <div className="mb-12 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                {title && <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>}
                {subtitle && <p className="text-lg text-gray-600 max-w-2xl">{subtitle}</p>}
              </div>
              {ctaLabel && ctaHref && (
                <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          )}
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
