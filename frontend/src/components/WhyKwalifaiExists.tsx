/**
 * @file WhyKwalifaiExists.tsx
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

export default function WhyKwalifaiExists() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
            Why we built this
          </h2>
        </div>
        
        <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
          <p>
            Buying a home or refinancing is one of the biggest and most stressful financial decisions you'll make. Yet most mortgage tools are designed to sell you something, not help you understand your options.
          </p>
          <p>
            We built Kwalifai because you deserve transparency. You should know exactly how much you'll pay, when rates change, and whether refinancing makes sense, without someone trying to close a deal.
          </p>
          <p>
            Kwalifai is built by people who've been frustrated by confusing calculators, sales calls, and vague answers. We're not a lender. We don't take commissions. We don't run credit checks. We just give you the information you need to make a decision you can feel confident about.
          </p>
        </div>
      </div>
    </section>
  );
}
