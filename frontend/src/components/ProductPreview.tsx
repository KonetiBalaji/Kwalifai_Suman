/**
 * @file ProductPreview.tsx
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

export default function ProductPreview() {
  const features = [
    {
      title: 'Smart Calculators',
      description: 'Compare multiple loan scenarios in seconds. See payment breakdowns, total interest costs, and how small rate changes can impact you over time.',
    },
    {
      title: 'Side-by-Side Loan Comparison',
      description: 'View up to four loan options at once. See the real differences between 15-year and 30-year terms, fixed and adjustable rates, and different down payment amounts.',
    },
    {
      title: 'Rate Alerts',
      description: 'Set your target rate and get notified when mortgage rates drop. No need to check daily, and no sales calls. You decide when to act.',
    },
    {
      title: 'Statement Analysis',
      description: 'Upload your existing mortgage statement to see if refinancing makes sense. We\'ll show your break-even point, potential savings, and when a refi actually pays off.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
            Everything you need to understand your mortgage options
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our tools show you exactly how different loans compare, what you'll pay over time, and when rates change, so you can avoid surprises and costly mistakes. 
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm card-hover-border cursor-pointer transition-all duration-300 hover:shadow-md">
              <h3 className="text-xl text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
