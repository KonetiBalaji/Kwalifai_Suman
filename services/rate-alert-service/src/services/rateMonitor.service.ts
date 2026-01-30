/**
 * @file rateMonitor.service.ts
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

import { prisma, RateAlertStatus } from '@mortgage-platform/db';
import { rateDataService } from './rateData.service';
import { notificationProvider } from './notify';
import { Logger } from '../utils/logger';
import type { Request } from 'express';

/**
 * Service responsible for periodically checking rate alerts against current rates.
 */
export class RateMonitorService {
  private intervalHandle: NodeJS.Timeout | null = null;

  /**
   * Start the background rate monitor.
   * @param intervalMs Interval in milliseconds (default: 1 hour)
   */
  start(intervalMs: number = 60 * 60 * 1000): void {
    if (this.intervalHandle) {
      return;
    }

    Logger.info(`Starting rate monitor with interval ${intervalMs}ms`);
    this.intervalHandle = setInterval(() => {
      // Background job has no request context
      this.runRateCheck().catch((error) => {
        Logger.error('Rate monitor background job failed', undefined, error);
      });
    }, intervalMs);
  }

  /**
   * Execute a single rate check cycle.
   * Can be called from background job or admin endpoint.
   */
  async runRateCheck(req?: Request): Promise<{
    checked: number;
    triggered: number;
  }> {
    Logger.info('Running rate alert check', req);

    const now = new Date();
    const currentRates = await rateDataService.getCurrentRates();

    // Map loanType -> currentRate for quick lookup
    const rateMap = new Map<string, number>(
      currentRates.map((r) => [r.loanType, r.currentRate]),
    );

    // Fetch all ACTIVE alerts
    const activeAlerts = await prisma.rateAlert.findMany({
      where: {
        status: RateAlertStatus.ACTIVE,
      },
    });

    let triggeredCount = 0;

    for (const alert of activeAlerts) {
      const currentRate = rateMap.get(alert.loanType);

      // If we don't have a rate for this loan type, skip
      if (typeof currentRate !== 'number') {
        continue;
      }

      // Safeguard: do not trigger same alert twice
      // Only trigger when status is ACTIVE
      if (currentRate <= alert.targetRate) {
        triggeredCount += 1;

        const message = `Rate alert triggered for ${alert.loanType}: current rate ${currentRate.toFixed(
          2,
        )}% is at or below target ${alert.targetRate.toFixed(2)}%.`;

        await prisma.$transaction([
          prisma.rateAlert.update({
            where: { id: alert.id },
            data: {
              status: RateAlertStatus.TRIGGERED,
              triggeredAt: now,
              notificationsSent: alert.notificationsSent + 1,
              lastChecked: now,
            },
          }),
          prisma.rateAlertNotification.create({
            data: {
              rateAlertId: alert.id,
              currentRate,
              message,
            },
          }),
        ]);

        Logger.info('Triggered rate alert', req, {
          alertId: alert.id,
          loanType: alert.loanType,
          targetRate: alert.targetRate,
          currentRate,
        });

        // Send email notification (do not fail the job if email sending fails)
        try {
          await notificationProvider.sendRateAlertTriggered({
            email: alert.email,
            loanType: alert.loanType,
            currentRate,
            targetRate: alert.targetRate,
            alertId: alert.id,
          });
        } catch (error) {
          Logger.error('Failed to send rate alert email notification', req, error);
        }
      } else {
        // No trigger, but update lastChecked
        await prisma.rateAlert.update({
          where: { id: alert.id },
          data: {
            lastChecked: now,
          },
        });
      }
    }

    Logger.info('Rate alert check completed', req, {
      checked: activeAlerts.length,
      triggered: triggeredCount,
    });

    return {
      checked: activeAlerts.length,
      triggered: triggeredCount,
    };
  }
}

export const rateMonitorService = new RateMonitorService();

