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
import { User, Calculator, BarChart3, CheckCircle2, FileText, Save, Bell } from 'lucide-react';
import PageShell from '../../components/PageShell';
import InfoTimeline from '../../components/InfoTimeline';
import SectionCard from '../../components/SectionCard';

export default function HowItWorksPage() {
  const timelineItems = [
    {
      number: 1,
      title: 'Create Your Account',
      icon: User,
      content: (
        <ul className="space-y-2 text-sm">
          <li>Sign up with email and phone</li>
          <li>Verify your contact information</li>
          <li>Set up in under 2 minutes</li>
        </ul>
      ),
    },
    {
      number: 2,
      title: 'Use Our Calculators',
      icon: Calculator,
      content: (
        <ul className="space-y-2 text-sm">
          <li>Choose from 10+ specialized calculators</li>
          <li>Input loan details and property info</li>
          <li>Get instant, accurate calculations</li>
        </ul>
      ),
    },
    {
      number: 3,
      title: 'Save and Compare',
      icon: BarChart3,
      content: (
        <ul className="space-y-2 text-sm">
          <li>Save multiple scenarios</li>
          <li>Track rate changes with alerts</li>
          <li>Access calculations anywhere</li>
        </ul>
      ),
    },
    {
      number: 4,
      title: 'Make Informed Decisions',
      icon: CheckCircle2,
      content: (
        <ul className="space-y-2 text-sm">
          <li>Review detailed payment schedules</li>
          <li>Understand total costs over time</li>
          <li>Compare loan options side by side</li>
        </ul>
      ),
    },
  ];

  return (
    <PageShell
      title="How It Works"
      subtitle="Get accurate mortgage calculations and insights in minutes, not hours."
    >
      <div className="space-y-12">
        <InfoTimeline items={timelineItems} />

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SectionCard icon={FileText} title="Accurate Breakdowns">
              <ul className="space-y-2 text-sm">
                <li>Principal and interest calculations</li>
                <li>Amortization schedules</li>
                <li>Total cost analysis</li>
              </ul>
            </SectionCard>
            <SectionCard icon={Save} title="Saved Scenarios">
              <ul className="space-y-2 text-sm">
                <li>Store multiple loan scenarios</li>
                <li>Compare options easily</li>
                <li>Access from any device</li>
              </ul>
            </SectionCard>
            <SectionCard icon={Bell} title="Rate Alerts">
              <ul className="space-y-2 text-sm">
                <li>Set custom rate thresholds</li>
                <li>Get notified when rates drop</li>
                <li>Never miss opportunities</li>
              </ul>
            </SectionCard>
          </div>
        </section>

        <div className="pt-8 border-t border-gray-200">
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Account
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
