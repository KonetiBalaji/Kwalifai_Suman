/**
 * @file notificationProvider.ts
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

/**
 * Interface for notification providers.
 * Allows plugging in different email/SMS vendors without changing business logic.
 */
export interface NotificationProvider {
  sendRateAlertTriggered(options: {
    email: string;
    loanType: string;
    currentRate: number;
    targetRate: number;
    alertId: string;
  }): Promise<void>;
}

