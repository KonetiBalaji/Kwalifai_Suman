/**
 * @file SectionCard.tsx
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

interface SectionCardProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function SectionCard({ icon: Icon, title, children, className = '' }: SectionCardProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {(Icon || title) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
          )}
          {title && <h3 className="text-xl font-semibold text-gray-900">{title}</h3>}
        </div>
      )}
      <div className="text-gray-700">{children}</div>
    </div>
  );
}
