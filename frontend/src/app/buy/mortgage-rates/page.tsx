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

import PageShell from '../../../components/PageShell';
import CalculatorPageShell from '../../../components/calculators/CalculatorPageShell';
import BuyNavigation from '../../../components/buy/BuyNavigation';
import MortgageRatesCards from '../../../components/MortgageRatesCards';

export default function MortgageRatesPage() {
  return (
    <PageShell>
      <CalculatorPageShell
        title="Buy a Home"
        subtitle="Explore current mortgage rates and use our calculators to find the right home for you"
      >
        <BuyNavigation />

        <div className="mt-8">
          <div className="w-full max-w-7xl mx-auto">
            <MortgageRatesCards />
          </div>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
