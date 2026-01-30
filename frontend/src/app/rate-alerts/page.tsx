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

import PageShell from '../../components/PageShell';
import RateAlertForm from '../../components/rate-alerts/RateAlertForm';
import RateAlertsList from '../../components/rate-alerts/RateAlertsList';
import { useState } from 'react';

export default function RateAlertsPage() {
  const [emailForAlerts, setEmailForAlerts] = useState<string>('');

  return (
    <PageShell
      title="Rate Alerts"
      subtitle="Get notified when rates hit your target."
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <RateAlertForm onAlertCreatedEmail={setEmailForAlerts} />
          <RateAlertsList initialEmail={emailForAlerts} />
        </div>
      </div>
    </PageShell>
  );
}
