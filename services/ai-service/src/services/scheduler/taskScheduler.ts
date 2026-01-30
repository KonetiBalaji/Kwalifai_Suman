/**
 * @file taskScheduler.ts
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

import { TaskData, TaskType } from '../../types/scheduler';
import { addTask, taskQueue } from './taskQueue';
import { processTask } from './taskProcessor';
import { TASK_CONFIGS } from './taskTypes';

/**
 * Schedules a task based on AI decision or user request
 */
export async function scheduleTask(
  taskData: TaskData,
  delayMs?: number
): Promise<string> {
  const taskId = await addTask(taskData, delayMs);
  console.log(`Scheduled task ${taskId} of type ${taskData.taskType}`);
  return taskId;
}

/**
 * Schedules a recurring task (e.g., daily rate monitoring)
 */
export async function scheduleRecurringTask(
  taskData: TaskData,
  intervalMs: number
): Promise<string> {
  // Schedule the first occurrence
  const taskId = await scheduleTask(taskData, 0);

  // Set up recurring schedule (in production, use Bull's repeat option)
  if (taskQueue) {
    // Bull queue handles recurring tasks
    await taskQueue.add(taskData, {
      repeat: {
        every: intervalMs,
      },
    });
  } else {
    // In-memory: schedule next occurrence after processing
    // This is handled in the processor
  }

  return taskId;
}

/**
 * Schedules rate monitoring for a user
 * Called when AI creates a rate alert
 */
export async function scheduleRateMonitoring(
  email: string,
  userId?: string,
  alertId?: string
): Promise<string> {
  const interval = TASK_CONFIGS.rate_monitoring.defaultInterval || 24 * 60 * 60 * 1000;
  
  return scheduleRecurringTask(
    {
      taskType: 'rate_monitoring',
      email,
      userId,
      metadata: {
        alertId,
      },
    },
    interval
  );
}

/**
 * Schedules a follow-up reminder
 */
export async function scheduleFollowUp(
  email: string,
  userId: string,
  message: string,
  delayMs: number = 7 * 24 * 60 * 60 * 1000 // 7 days default
): Promise<string> {
  return scheduleTask(
    {
      taskType: 'follow_up',
      email,
      userId,
      metadata: {
        message,
      },
    },
    delayMs
  );
}

/**
 * Initializes task processing
 * Sets up Bull queue processor if Redis is available
 */
export function initializeTaskProcessor(): void {
  if (taskQueue) {
    // Process tasks from Bull queue
    taskQueue.process(async (job) => {
      const task: any = {
        id: job.id.toString(),
        taskType: job.data.taskType,
        userId: job.data.userId,
        email: job.data.email,
        scheduledFor: new Date(job.timestamp + (job.opts.delay || 0)),
        metadata: job.data.metadata,
        status: 'processing',
        createdAt: new Date(job.timestamp),
      };

      await processTask(task);
    });

    console.log('[AI] Task processor initialized with Bull queue');
  } else {
    console.warn('[AI] Task processor not initialized (Redis not available). Tasks will be stored in memory only.');
  }
}
