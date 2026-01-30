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
import { Shield } from 'lucide-react';
import PageShell from '../../components/PageShell';
import FAQAccordion from '../../components/FAQAccordion';
import Callout from '../../components/Callout';

export default function PrivacyPage() {
  const faqItems = [
    {
      question: 'Information We Collect',
      answer: (
        <ul className="space-y-2 text-sm">
          <li>• Account information: email address, phone number, and name</li>
          <li>• Usage data: calculator inputs and saved scenarios</li>
          <li>• Technical data: IP address, browser type, and device information</li>
        </ul>
      ),
    },
    {
      question: 'How We Use Your Information',
      answer: (
        <ul className="space-y-2 text-sm">
          <li>• Provide and improve our mortgage calculation services</li>
          <li>• Send rate alerts and important account notifications</li>
          <li>• Ensure security and prevent fraud</li>
          <li>• Comply with legal obligations</li>
        </ul>
      ),
    },
    {
      question: 'Data Retention',
      answer: (
        <ul className="space-y-2 text-sm">
          <li>• We retain your account data while your account is active</li>
          <li>• Saved calculations are stored until you delete them</li>
          <li>• You can request account deletion at any time</li>
        </ul>
      ),
    },
    {
      question: 'Data Sharing',
      answer: (
        <ul className="space-y-2 text-sm">
          <li>• We do not sell your personal information to third parties</li>
          <li>• We may share data with service providers who assist in operations</li>
          <li>• We may disclose information if required by law</li>
        </ul>
      ),
    },
    {
      question: 'Security',
      answer: (
        <ul className="space-y-2 text-sm">
          <li>• We use industry-standard encryption to protect your data</li>
          <li>• All data transmission is secured with SSL/TLS</li>
          <li>• Access to your account requires authentication</li>
        </ul>
      ),
    },
  ];

  return (
    <PageShell
      title="Privacy Policy"
      subtitle="Your privacy is important to us. This policy explains how we collect, use, and protect your information."
    >
      <div className="space-y-8">
        <Callout icon={Shield} variant="info">
          We don't sell your data.
        </Callout>

        <FAQAccordion items={faqItems} />

        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Last updated: January 2026. For questions about this policy, please{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </PageShell>
  );
}
