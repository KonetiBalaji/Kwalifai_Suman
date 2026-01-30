/**
 * @file taskTypes.ts
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

import { TaskType, TaskData } from '../../types/scheduler';

/**
 * Task type definitions and their configurations
 */
export const TASK_CONFIGS: Record<TaskType, {
  description: string;
  defaultInterval?: number; // in milliseconds
  maxRetries: number;
}> = {
  rate_monitoring: {
    description: 'Monitor mortgage rates and check if alerts should trigger',
    defaultInterval: 24 * 60 * 60 * 1000, // 24 hours
    maxRetries: 3,
  },
  follow_up: {
    description: 'Send follow-up reminders to users',
    defaultInterval: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxRetries: 1,
  },
  scheduled_calculation: {
    description: 'Re-run calculations with updated rates',
    defaultInterval: 24 * 60 * 60 * 1000, // 24 hours
    maxRetries: 2,
  },
};

/**
 * Validates task data structure
 */
export function validateTaskData(taskData: TaskData): boolean {
  if (!taskData.taskType || !TASK_CONFIGS[taskData.taskType]) {
    return false;
  }

  if (!taskData.email || typeof taskData.email !== 'string') {
    return false;
  }

  return true;
}
