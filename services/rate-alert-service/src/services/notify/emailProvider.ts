/**
 * @file emailProvider.ts
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

import { NotificationProvider } from './notificationProvider';
import { Logger } from '../../utils/logger';

/**
 * Simple email notification provider.
 * Currently uses a console-based implementation and respects EMAIL_PROVIDER_API_KEY.
 */
export class EmailNotificationProvider implements NotificationProvider {
  private readonly apiKey: string | undefined;
  private readonly fromAddress: string;

  constructor() {
    this.apiKey = process.env.EMAIL_PROVIDER_API_KEY;
    this.fromAddress =
      process.env.EMAIL_FROM_ADDRESS || 'no-reply@kwalifai.local';
  }

  async sendRateAlertTriggered(options: {
    email: string;
    loanType: string;
    currentRate: number;
    targetRate: number;
    alertId: string;
  }): Promise<void> {
    const subject = 'Your rate alert was triggered';
    const bodyLines = [
      'Your rate alert just triggered.',
      '',
      `Loan type: ${options.loanType}`,
      `Current rate: ${options.currentRate.toFixed(2)}%`,
      `Target rate: ${options.targetRate.toFixed(2)}%`,
      '',
      'View your alerts: /rate-alerts',
    ];
    const body = bodyLines.join('\n');

    // If no API key is configured, log and skip sending
    if (!this.apiKey) {
      Logger.info('Email notification skipped (no EMAIL_PROVIDER_API_KEY configured)', undefined, {
        to: options.email,
        subject,
        alertId: options.alertId,
      });
      return;
    }

    // Placeholder implementation - in future this would call a real email provider SDK / API
    Logger.info('Sending rate alert email (console provider)', undefined, {
      from: this.fromAddress,
      to: options.email,
      subject,
      body,
      alertId: options.alertId,
    });

    // Here you would integrate with a real email service, e.g.:
    // await emailClient.send({ from: this.fromAddress, to: options.email, subject, body });
  }
}

