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

import Link from 'next/link';
import { Calculator, Bell, FolderOpen, Shield, Lock, Ban, Brain } from 'lucide-react';
import PageShell from '../../components/PageShell';
import SectionCard from '../../components/SectionCard';

export default function FeaturesPage() {
  return (
    <PageShell
      title="Features"
      subtitle="Everything you need to make smart mortgage decisions with confidence."
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard icon={Calculator} title="Comprehensive Calculators">
            <ul className="space-y-2 text-sm">
              <li>Payment calculator for principal and interest</li>
              <li>Affordability calculator for borrowing capacity</li>
              <li>Refinance calculator to compare loan terms</li>
            </ul>
          </SectionCard>

          <SectionCard icon={Bell} title="Rate Alerts">
            <ul className="space-y-2 text-sm">
              <li>Set custom rate thresholds</li>
              <li>Receive alerts when rates drop</li>
              <li>Never miss an opportunity</li>
            </ul>
          </SectionCard>

          <SectionCard icon={FolderOpen} title="Scenario Management">
            <ul className="space-y-2 text-sm">
              <li>Save multiple loan scenarios</li>
              <li>Organize by property or loan type</li>
              <li>Access from any device</li>
            </ul>
          </SectionCard>

          <SectionCard icon={Shield} title="Security & Privacy">
            <ul className="space-y-2 text-sm">
              <li>Bank-level encryption for all data</li>
              <li>Two-factor authentication</li>
              <li>Information never shared with third parties</li>
            </ul>
          </SectionCard>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust & Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Encrypted Data</div>
                <div className="text-xs text-gray-600">All data secured</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Ban className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">No Data Selling</div>
                <div className="text-xs text-gray-600">We never sell your data</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Mortgage-Only AI</div>
                <div className="text-xs text-gray-600">Focused guardrails</div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start Using Features
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
