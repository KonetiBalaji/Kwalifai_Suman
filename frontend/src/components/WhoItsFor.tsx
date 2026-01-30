/**
 * @file WhoItsFor.tsx
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

export default function WhoItsFor() {
  const forYou = [
    'You\'re shopping for a mortgage and want to compare options without sales pressure',
    'You\'re considering refinancing and want to see if it makes financial sense',
    'You\'re watching mortgage rates and want alerts when they drop',
    'You want clear, side-by-side comparisons of different loan scenarios',
    'You prefer tools that show you the math, not just the marketing',
  ];

  const notForYou = [
    {
      text: 'You need immediate pre-approval or loan origination',
      note: '(we\'re a decision tool, not a lender)',
    },
    {
      text: 'You want personalized advice from a mortgage broker',
      note: '(we provide data, not financial advice)',
    },
    {
      text: 'You\'re looking for the absolute lowest rate guarantee',
      note: '(rates change daily and vary by lender)',
    },
    {
      text: 'You need help with credit repair or debt consolidation',
      note: '(we focus on mortgage comparison and analysis)',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
            Is Kwalifai right for you?
          </h2>
        </div>

        <div className="space-y-12">
          <div>
            <h3 className="text-xl text-gray-900 mb-4">
              This is for you if:
            </h3>
            <ul className="space-y-3">
              {forYou.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">✓</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl text-gray-900 mb-4">
              This might not be for you if:
            </h3>
            <ul className="space-y-3">
              {notForYou.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-400 mr-3 mt-1">×</span>
                  <div>
                    <span className="text-gray-600">{item.text} </span>
                    <span className="text-gray-500 italic">{item.note}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 border-t border-gray-200">
            <p className="text-lg text-gray-700 text-center">
              If you want to understand your mortgage options clearly—without pressure, commissions, or confusion—this is the right place to start.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
