/**
 * @file index.ts (notification services)
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

import { EmailNotificationProvider } from './emailProvider';
import type { NotificationProvider } from './notificationProvider';

// Default notification provider for the service
export const notificationProvider: NotificationProvider =
  new EmailNotificationProvider();

