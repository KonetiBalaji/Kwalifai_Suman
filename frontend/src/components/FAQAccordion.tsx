/**
 * @file FAQAccordion.tsx
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

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggle(index)}
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            aria-expanded={openIndex === index}
          >
            <span className="font-semibold text-gray-900">{item.question}</span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openIndex === index ? 'transform rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === index && (
            <div className="px-6 pb-4 text-gray-700">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}
