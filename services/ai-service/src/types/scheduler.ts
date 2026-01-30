/**
 * @file scheduler.ts
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

export type TaskType = 'rate_monitoring' | 'follow_up' | 'scheduled_calculation';

export interface TaskData {
  taskType: TaskType;
  userId?: string;
  email: string;
  metadata: Record<string, any>;
}

export interface ScheduledTask {
  id: string;
  taskType: TaskType;
  userId?: string;
  email: string;
  scheduledFor: Date;
  metadata: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}
