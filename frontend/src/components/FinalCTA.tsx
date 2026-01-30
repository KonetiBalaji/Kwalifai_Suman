/**
 * @file FinalCTA.tsx
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

import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
          Ready to see your options clearly?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Stop second-guessing your mortgage decision. Get side-by-side comparisons, rate alerts, and clear calculations, all in one place, with no sales pressure.
        </p>
        
        <div className="mb-6">
          <p className="text-base text-gray-700">
            You don't need to decide today. Just see the numbers.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg hover:bg-blue-700 transition-all duration-300 inline-block mb-3"
          >
            Get Started Free
          </Link>
          <p className="text-sm text-gray-500">
            No credit check required. No spam. No commitment.
          </p>
        </div>
      </div>
    </section>
  );
}
