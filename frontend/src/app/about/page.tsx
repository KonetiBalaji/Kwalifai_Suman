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
import { Target, Briefcase, Heart, Calculator, Shield, Bell } from 'lucide-react';
import PageShell from '../../components/PageShell';
import SectionCard from '../../components/SectionCard';

export default function AboutPage() {
  return (
    <PageShell
      title="About Us"
      subtitle="Empowering homeowners with transparent, accurate mortgage tools."
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SectionCard icon={Target} title="Our Mission">
            <ul className="space-y-2 text-sm">
              <li>Make mortgage calculations accessible</li>
              <li>Provide accurate, reliable tools</li>
              <li>Help homeowners make informed decisions</li>
            </ul>
          </SectionCard>

          <SectionCard icon={Briefcase} title="What We Do">
            <ul className="space-y-2 text-sm">
              <li>Develop comprehensive calculation tools</li>
              <li>Provide rate alerts and market insights</li>
              <li>Offer educational resources</li>
            </ul>
          </SectionCard>

          <SectionCard icon={Heart} title="Our Values">
            <ul className="space-y-2 text-sm">
              <li>Transparency in all processes</li>
              <li>Security and privacy for user data</li>
              <li>Accuracy in every calculation</li>
            </ul>
          </SectionCard>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">10+</div>
              <div className="text-sm text-gray-600">Calculators</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">Rate</div>
              <div className="text-sm text-gray-600">Alerts</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">Secure</div>
              <div className="text-sm text-gray-600">Accounts</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
