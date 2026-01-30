/**
 * @file layout.tsx
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

import type { Metadata } from 'next';
import './globals.css';
import LowiFloatingWidget from '../components/lowi/LowiFloatingWidget';

export const metadata: Metadata = {
  title: 'Kwalifai Mortgage Platform',
  description: 'Smart mortgage calculators and rate alerts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <LowiFloatingWidget />
      </body>
    </html>
  );
}
