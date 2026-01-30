/**
 * @file page.tsx
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
import PageShell from '../../components/PageShell';
import ChatInterface from '../../components/chat/ChatInterface';

export default function LowiAIPage() {
  const [useLegacy, setUseLegacy] = useState(false);

  return (
    <PageShell
      title="LOWI AI"
      subtitle="Your AI Mortgage Specialist Assistant"
    >
      <div className="max-w-4xl mx-auto">
        {/* Toggle for legacy mode */}
        <div className="mb-4 flex justify-end">
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={useLegacy}
              onChange={(e) => setUseLegacy(e.target.checked)}
              className="rounded"
            />
            <span>Use Legacy Endpoint (Fallback)</span>
          </label>
        </div>

        {/* Chat Interface */}
        <div className="h-[800px]">
          <ChatInterface useLegacy={useLegacy} />
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">What can LOWI help you with?</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Current mortgage rates for all loan types</li>
            <li>Mortgage payment calculations</li>
            <li>Rate alerts - get notified when rates drop</li>
            <li>Refinance analysis and break-even calculations</li>
            <li>Debt-to-Income (DTI) qualification checks</li>
            <li>Multiple loan scenario comparisons</li>
            <li>Statement analysis and refinance opportunities</li>
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
