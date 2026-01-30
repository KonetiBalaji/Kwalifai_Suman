/**
 * @file Callout.tsx
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

interface CalloutProps {
  icon?: LucideIcon;
  children: ReactNode;
  variant?: 'info' | 'warning' | 'success';
}

export default function Callout({ icon: Icon, children, variant = 'info' }: CalloutProps) {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    success: 'bg-green-50 border-green-200 text-green-900',
  };

  const iconColors = {
    info: 'text-blue-600',
    warning: 'text-amber-600',
    success: 'text-green-600',
  };

  return (
    <div className={`border rounded-lg p-4 ${variants[variant]}`}>
      <div className="flex items-start gap-3">
        {Icon && <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColors[variant]}`} />}
        <div className="text-sm font-medium">{children}</div>
      </div>
    </div>
  );
}
