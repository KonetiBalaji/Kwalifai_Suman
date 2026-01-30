/**
 * @file index.ts
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

import dotenv from 'dotenv';
import { app } from './app';
import { rateMonitorService } from './services/rateMonitor.service';

dotenv.config();

const PORT = parseInt(process.env.RATE_ALERT_SERVICE_PORT || '3004', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[RATE-ALERT] Rate Alert Service running on port ${PORT}`);

  // Start background rate monitor (runs every hour by default)
  const intervalMs = process.env.RATE_ALERT_MONITOR_INTERVAL_MS
    ? parseInt(process.env.RATE_ALERT_MONITOR_INTERVAL_MS, 10)
    : 60 * 60 * 1000;

  rateMonitorService.start(intervalMs);
});
