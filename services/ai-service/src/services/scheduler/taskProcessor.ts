/**
 * @file taskProcessor.ts
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

import { TaskData, ScheduledTask } from '../../types/scheduler';
import { getRates } from '../tools/getRates';
import { listUserAlerts } from '../tools/listUserAlerts';
import axios from 'axios';

const RATE_ALERT_SERVICE_URL = process.env.RATE_ALERT_SERVICE_URL || 'http://localhost:3004';

/**
 * Processes a scheduled task
 */
export async function processTask(task: ScheduledTask): Promise<void> {
  console.log(`Processing task ${task.id} of type ${task.taskType}`);

  try {
    switch (task.taskType) {
      case 'rate_monitoring':
        await processRateMonitoring(task);
        break;

      case 'follow_up':
        await processFollowUp(task);
        break;

      case 'scheduled_calculation':
        await processScheduledCalculation(task);
        break;

      default:
        console.warn(`Unknown task type: ${task.taskType}`);
    }
  } catch (error: any) {
    console.error(`Task ${task.id} processing failed:`, error);
    throw error;
  }
}

/**
 * Processes rate monitoring task
 * Checks if any rate alerts should trigger
 */
async function processRateMonitoring(task: ScheduledTask): Promise<void> {
  // Get current rates
  const rates = await getRates();

  // Get user's alerts
  const alerts = await listUserAlerts(task.email);

  // Check each alert
  for (const alert of alerts) {
    const currentRate = getRateForLoanType(rates, alert.loanType);
    
    if (currentRate && currentRate <= alert.targetRate) {
      // Rate has dropped to target - trigger notification
      console.log(`Rate alert triggered for ${alert.email}: ${alert.loanType} at ${currentRate}%`);
      
      // Notify rate-alert-service to trigger the alert
      try {
        await axios.post(
          `${RATE_ALERT_SERVICE_URL}/rate-alerts/${alert.id}/trigger`,
          {},
          {
            timeout: 5000,
          }
        );
      } catch (error) {
        console.error(`Failed to trigger alert ${alert.id}:`, error);
      }
    }
  }
}

/**
 * Processes follow-up task
 * Sends reminder to user
 */
async function processFollowUp(task: ScheduledTask): Promise<void> {
  // TODO: Implement follow-up logic
  // This could send an email, push notification, or create a chat message
  console.log(`Follow-up task for ${task.email}:`, task.metadata);
}

/**
 * Processes scheduled calculation task
 * Re-runs calculation with updated rates
 */
async function processScheduledCalculation(task: ScheduledTask): Promise<void> {
  // TODO: Implement scheduled calculation logic
  // Re-run the calculation with current rates
  console.log(`Scheduled calculation for ${task.email}:`, task.metadata);
}

/**
 * Gets the rate for a specific loan type
 */
function getRateForLoanType(rates: any, loanType: string): number | null {
  const lowerType = loanType.toLowerCase();
  
  if (lowerType.includes('30') && lowerType.includes('year')) {
    return rates.thirtyYear;
  }
  if (lowerType.includes('15') && lowerType.includes('year')) {
    return rates.fifteenYear;
  }
  if (lowerType.includes('20') && lowerType.includes('year')) {
    return rates.twentyYear;
  }
  if (lowerType.includes('fha')) {
    return rates.fha;
  }
  if (lowerType.includes('va')) {
    return rates.va;
  }
  if (lowerType.includes('jumbo')) {
    return rates.jumbo;
  }
  if (lowerType.includes('arm')) {
    return rates.fiveYearARM;
  }

  return null;
}
