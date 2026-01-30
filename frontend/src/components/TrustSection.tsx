/**
 * @file TrustSection.tsx
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

export default function TrustSection() {
  const trustPoints = [
    {
      title: 'No Credit Checks',
      //description: 'We never pull your credit. Explore loan options and compare scenarios without any impact on your credit score.',
    },
    {
      title: 'No Commissions',
    },
    {
      title: 'No Spam',
    },
    {
      title: 'Your Data, Your Control',
    },
    {
      title: 'Transparent Calculations',
    },
    {
      title: 'Early Stage, Honest Approach',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
            Built for your privacy and peace of mind
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {trustPoints.map((point, index) => (
            <div 
              key={index} 
              className="p-8 bg-white border border-gray-200 rounded-lg text-center transition-all duration-300 hover:border-blue-600 hover:shadow-md"
            >
              <h3 className="text-lg text-gray-900">
                {point.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
