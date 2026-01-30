/**
 * @file Hero.tsx
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

export default function Hero() {
  return (
    <section className="bg-white min-h-[85vh] flex flex-col">
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-[#86E0CB] to-blue-600 bg-clip-text text-transparent">
              Stop guessing which mortgage is right for you
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed px-4 sm:px-0">
              Compare loan options side-by-side, track rate changes, and get clear answers, without sales pressure. No credit checks. No spam. No commissions. Just the data you need to decide confidently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
              <Link
                href="/register"
                className="bg-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-blue-700 transition-all duration-300 text-center"
              >
                Get Started Free
              </Link>
              <Link
                href="#how-it-works"
                className="bg-white text-blue-600 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 text-center"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
