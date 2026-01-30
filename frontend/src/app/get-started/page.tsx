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
import { UserPlus, Mail, Calculator, CheckCircle2 } from 'lucide-react';
import PageShell from '../../components/PageShell';
import SectionCard from '../../components/SectionCard';

export default function GetStartedPage() {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Account',
      description: 'Sign up with email and phone',
      time: '2 minutes',
      completed: false,
    },
    {
      icon: Mail,
      title: 'Verify Information',
      description: 'Verify email and phone for security',
      time: '3 minutes',
      completed: false,
    },
    {
      icon: Calculator,
      title: 'Start Calculating',
      description: 'Explore calculators and save scenarios',
      time: '1 minute',
      completed: false,
    },
  ];

  return (
    <PageShell
      title="Get Started"
      subtitle="Join homeowners making smarter mortgage decisions."
    >
      <div className="space-y-12">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Getting Started Checklist</h2>
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
              Total: ~6 minutes
            </div>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <span className="text-sm text-gray-500">{step.time}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: step.completed ? '100%' : '0%' }}
                    />
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    {step.completed && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SectionCard title="No Credit Card Required">
            <p className="text-sm text-gray-700">Start using all features immediately after signup.</p>
          </SectionCard>
          <SectionCard title="Free Forever">
            <p className="text-sm text-gray-700">Access all calculators and basic features at no cost.</p>
          </SectionCard>
          <SectionCard title="Secure & Private">
            <p className="text-sm text-gray-700">Your data is encrypted and never shared.</p>
          </SectionCard>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
