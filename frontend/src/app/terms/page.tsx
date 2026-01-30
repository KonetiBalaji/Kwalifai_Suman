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
import { Info } from 'lucide-react';
import PageShell from '../../components/PageShell';
import FAQAccordion from '../../components/FAQAccordion';
import Callout from '../../components/Callout';

export default function TermsPage() {
  const faqItems = [
    {
      question: 'Acceptable Use',
      answer: (
        <ul className="space-y-2 text-sm">
          <li>• Use our services only for lawful purposes</li>
          <li>• Do not attempt to access accounts that are not yours</li>
          <li>• Do not use automated systems to abuse our services</li>
          <li>• Respect intellectual property rights</li>
        </ul>
      ),
    },
    {
      question: 'Service Disclaimers',
      answer: (
        <ul className="space-y-2 text-sm">
          <li>• Calculations are provided for informational purposes only</li>
          <li>• Results are estimates and may not reflect actual loan terms</li>
          <li>• We are not a lender or financial advisor</li>
          <li>• Always consult with qualified professionals for financial decisions</li>
        </ul>
      ),
    },
    {
      question: 'Limitation of Liability',
      answer: (
        <ul className="space-y-2 text-sm">
          <li>• We are not liable for decisions made based on our calculations</li>
          <li>• We do not guarantee accuracy of rate information or market data</li>
          <li>• Our liability is limited to the maximum extent permitted by law</li>
          <li>• We are not responsible for third-party services or content</li>
        </ul>
      ),
    },
    {
      question: 'Changes to Terms',
      answer: (
        <ul className="space-y-2 text-sm">
          <li>• We may update these terms from time to time</li>
          <li>• Continued use of our services constitutes acceptance of changes</li>
          <li>• We will notify users of significant changes via email</li>
          <li>• Review these terms periodically for updates</li>
        </ul>
      ),
    },
  ];

  return (
    <PageShell
      title="Terms of Service"
      subtitle="Please read these terms carefully before using our mortgage calculation services."
    >
      <div className="space-y-8">
        <Callout icon={Info} variant="warning">
          Calculations are informational estimates.
        </Callout>

        <FAQAccordion items={faqItems} />

        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Last updated: January 2026. For questions about these terms, please{' '}
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
