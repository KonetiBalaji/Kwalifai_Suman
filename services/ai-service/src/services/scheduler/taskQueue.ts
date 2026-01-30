/**
 * @file taskQueue.ts
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

import Queue from 'bull';
import { TaskData, ScheduledTask } from '../../types/scheduler';

const REDIS_URL = process.env.REDIS_URL;
const TASK_QUEUE_NAME = process.env.TASK_QUEUE_NAME || 'lowi-tasks';

/**
 * Task queue setup
 * Uses Redis in production, in-memory for development if Redis not available
 */
let taskQueue: Queue.Queue<TaskData> | null = null;

if (REDIS_URL) {
  taskQueue = new Queue<TaskData>(TASK_QUEUE_NAME, REDIS_URL, {
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  });

  taskQueue.on('error', (error) => {
    console.error('Task queue error:', error);
  });

  console.log('[AI] Task queue initialized with Redis');
} else {
  console.warn('[AI] REDIS_URL not set. Task scheduling will use in-memory storage (not persistent).');
}

/**
 * In-memory task storage for development (when Redis not available)
 */
const inMemoryTasks: Map<string, ScheduledTask> = new Map();

/**
 * Adds a task to the queue
 */
export async function addTask(
  taskData: TaskData,
  delay?: number
): Promise<string> {
  if (taskQueue) {
    // Use Bull queue with Redis
    const job = await taskQueue.add(taskData, {
      delay: delay || 0,
    });
    return job.id.toString();
  } else {
    // In-memory fallback
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const scheduledFor = new Date(Date.now() + (delay || 0));
    
    const task: ScheduledTask = {
      id: taskId,
      taskType: taskData.taskType,
      userId: taskData.userId,
      email: taskData.email,
      scheduledFor,
      metadata: taskData.metadata,
      status: 'pending',
      createdAt: new Date(),
    };

    inMemoryTasks.set(taskId, task);
    
    // Schedule processing (simple setTimeout for dev)
    if (delay) {
      setTimeout(() => {
        // Task will be processed by taskProcessor
      }, delay);
    }

    return taskId;
  }
}

/**
 * Gets a task by ID
 */
export async function getTask(taskId: string): Promise<ScheduledTask | null> {
  if (taskQueue) {
    const job = await taskQueue.getJob(taskId);
    if (!job) return null;

    return {
      id: job.id.toString(),
      taskType: job.data.taskType,
      userId: job.data.userId,
      email: job.data.email,
      scheduledFor: new Date(job.timestamp + (job.opts.delay || 0)),
      metadata: job.data.metadata,
      status: job.finishedOn ? 'completed' : job.failedReason ? 'failed' : 'pending',
      createdAt: new Date(job.timestamp),
      completedAt: job.finishedOn ? new Date(job.finishedOn) : undefined,
      error: job.failedReason,
    };
  } else {
    return inMemoryTasks.get(taskId) || null;
  }
}

/**
 * Cancels a task
 */
export async function cancelTask(taskId: string): Promise<boolean> {
  if (taskQueue) {
    const job = await taskQueue.getJob(taskId);
    if (job) {
      await job.remove();
      return true;
    }
    return false;
  } else {
    const task = inMemoryTasks.get(taskId);
    if (task) {
      task.status = 'cancelled';
      return true;
    }
    return false;
  }
}

/**
 * Gets all tasks for a user
 */
export async function getUserTasks(userId?: string, email?: string): Promise<ScheduledTask[]> {
  if (taskQueue) {
    const jobs = await taskQueue.getJobs(['waiting', 'active', 'delayed', 'completed', 'failed']);
    return jobs
      .filter(job => {
        if (userId && job.data.userId === userId) return true;
        if (email && job.data.email === email) return true;
        return false;
      })
      .map(job => ({
        id: job.id.toString(),
        taskType: job.data.taskType,
        userId: job.data.userId,
        email: job.data.email,
        scheduledFor: new Date(job.timestamp + (job.opts.delay || 0)),
        metadata: job.data.metadata,
        status: job.finishedOn ? 'completed' : job.failedReason ? 'failed' : 'pending',
        createdAt: new Date(job.timestamp),
        completedAt: job.finishedOn ? new Date(job.finishedOn) : undefined,
        error: job.failedReason,
      }));
  } else {
    return Array.from(inMemoryTasks.values())
      .filter(task => {
        if (userId && task.userId === userId) return true;
        if (email && task.email === email) return true;
        return false;
      });
  }
}

export { taskQueue };
