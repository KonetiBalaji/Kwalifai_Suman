/**
 * @file InfoTimeline.tsx
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
import { LucideIcon } from 'lucide-react';

interface TimelineItem {
  number: number;
  title: string;
  icon: LucideIcon;
  content: ReactNode;
}

interface InfoTimelineProps {
  items: TimelineItem[];
}

export default function InfoTimeline({ items }: InfoTimelineProps) {
  return (
    <div className="relative">
      {/* Desktop: Horizontal layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <div key={index} className="relative">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-bold text-sm">
                  {item.number}
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <item.icon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
              <div className="text-sm text-gray-700">{item.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: Vertical timeline */}
      <div className="md:hidden space-y-6">
        {items.map((item, index) => (
          <div key={index} className="relative pl-8">
            {/* Timeline line */}
            {index < items.length - 1 && (
              <div className="absolute left-3 top-12 bottom-0 w-0.5 bg-gray-200" />
            )}
            {/* Timeline dot */}
            <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold">
              {item.number}
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <item.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              </div>
              <div className="text-sm text-gray-700">{item.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
