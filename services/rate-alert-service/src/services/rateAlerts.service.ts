/**
 * @file rateAlerts.service.ts
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
import { CreateRateAlertInput, UpdateRateAlertInput, GetRateAlertsQuery } from '../validators/rateAlerts.zod';
import { Request } from 'express';
import { AppError } from '../utils/errors';

/**
 * Rate alerts service - business logic implementation
 */
export class RateAlertsService {
  /**
   * Create a new rate alert
   */
  async createRateAlert(input: CreateRateAlertInput, req: Request): Promise<{
    success: boolean;
    alertId: string;
    message: string;
    targetRate: number;
    loanType: string;
    email: string;
  }> {
    // Check idempotency key
    const idempotencyKey = req.headers['idempotency-key'] as string;
    if (!idempotencyKey) {
      throw new AppError('IDEMPOTENCY_KEY_REQUIRED', 'Idempotency-Key header is required', 400);
    }

    // Check if alert with same idempotency key exists
    // Note: Prisma client will need to be regenerated after migration
    const existingAlert = await prisma.rateAlert.findFirst({
      where: { 
        idempotencyKey: idempotencyKey || undefined,
      } as any,
    });

    if (existingAlert) {
      return {
        success: true,
        alertId: existingAlert.id,
        message: 'Rate alert already exists',
        targetRate: existingAlert.targetRate,
        loanType: existingAlert.loanType,
        email: existingAlert.email,
      };
    }

    // Get tenant context from headers if not in body
    const brokerId = input.brokerId ?? req.tenant?.brokerId ?? null;
    const loanOfficerId = input.loanOfficerId ?? req.tenant?.loanOfficerId ?? null;

    // Spam control: Check max active alerts per email
    const activeAlertsCount = await prisma.rateAlert.count({
      where: {
        email: input.email,
        status: RateAlertStatus.ACTIVE,
      },
    });

    if (activeAlertsCount >= 5) {
      throw new AppError(
        'MAX_ACTIVE_ALERTS_EXCEEDED',
        'You have reached the maximum of 5 active rate alerts. Please deactivate an existing alert first.',
        400
      );
    }

    // Spam control: Check max alerts created per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const alertsToday = await prisma.rateAlert.count({
      where: {
        email: input.email,
        createdAt: {
          gte: today,
        },
      },
    });

    if (alertsToday >= 10) {
      throw new AppError(
        'MAX_DAILY_ALERTS_EXCEEDED',
        'You have reached the maximum of 10 rate alerts per day. Please try again tomorrow.',
        400
      );
    }

    // Create rate alert
    // Note: Prisma client will need to be regenerated after migration to include idempotencyKey
    const rateAlert = await prisma.rateAlert.create({
      data: {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        loanType: input.loanType,
        targetRate: input.targetRate,
        loanAmount: input.loanAmount,
        propertyAddress: input.propertyAddress,
        timeframe: input.timeframe || '90 days',
        status: RateAlertStatus.ACTIVE,
        notificationsSent: 0,
        lastChecked: new Date(),
        idempotencyKey: idempotencyKey,
        userId: input.userId,
        brokerId,
        loanOfficerId,
      } as any,
    });

    // Create lead record
    try {
      // Check if Lead model exists in Prisma client
      if ('lead' in prisma && typeof (prisma as any).lead?.create === 'function') {
        await (prisma as any).lead.create({
          data: {
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.phone,
            propertyAddress: input.propertyAddress,
            loanAmount: input.loanAmount,
            loanType: input.loanType,
            targetRate: input.targetRate,
            leadSource: 'rate-alert',
            leadScore: 85,
            status: 'new',
            alertId: rateAlert.id,
          },
        });
      }
    } catch (error) {
      // If leads table doesn't exist, log but don't fail
      console.error('Failed to create lead record:', error);
    }

    return {
      success: true,
      alertId: rateAlert.id,
      message: 'Rate alert created successfully! We\'ll notify you when rates hit your target.',
      targetRate: rateAlert.targetRate,
      loanType: rateAlert.loanType,
      email: rateAlert.email,
    };
  }

  /**
   * Get rate alerts for a user
   */
  async getRateAlerts(query: GetRateAlertsQuery, _req: Request): Promise<{
    alerts: Array<{
      id: string;
      email: string;
      loanType: string;
      targetRate: number;
      status: string;
      createdAt: Date;
    }>;
    total: number;
  }> {
    const where: {
      email: string;
      status?: RateAlertStatus;
    } = {
      email: query.email,
    };

    // Default to active only unless includeAll is true
    if (!query.includeAll) {
      where.status = RateAlertStatus.ACTIVE;
    }

    const alerts = await prisma.rateAlert.findMany({
      where,
      select: {
        id: true,
        email: true,
        loanType: true,
        targetRate: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      alerts,
      total: alerts.length,
    };
  }

  /**
   * Get a specific rate alert by ID
   */
  async getRateAlertById(id: string, _req: Request): Promise<unknown> {
    const alert = await prisma.rateAlert.findUnique({
      where: { id },
      include: {
        notifications: {
          orderBy: {
            sentAt: 'desc',
          },
          take: 10, // Last 10 notifications
        },
      },
    });

    if (!alert) {
      throw new AppError('ALERT_NOT_FOUND', 'Rate alert not found', 404);
    }

    return alert;
  }

  /**
   * Update a rate alert
   */
  async updateRateAlert(id: string, input: UpdateRateAlertInput, _req: Request): Promise<unknown> {
    // Check if alert exists
    const existingAlert = await prisma.rateAlert.findUnique({
      where: { id },
    });

    if (!existingAlert) {
      throw new AppError('ALERT_NOT_FOUND', 'Rate alert not found', 404);
    }

    // Build update data
    const updateData: {
      targetRate?: number;
      loanType?: string;
      timeframe?: string;
      status?: RateAlertStatus;
    } = {};

    if (input.targetRate !== undefined) {
      updateData.targetRate = input.targetRate;
    }
    if (input.loanType !== undefined) {
      updateData.loanType = input.loanType;
    }
    if (input.timeframe !== undefined) {
      updateData.timeframe = input.timeframe;
    }
    if (input.status !== undefined) {
      updateData.status = input.status as RateAlertStatus;
    }

    const updatedAlert = await prisma.rateAlert.update({
      where: { id },
      data: updateData,
      include: {
        notifications: {
          orderBy: {
            sentAt: 'desc',
          },
          take: 10,
        },
      },
    });

    return updatedAlert;
  }

  /**
   * Delete/deactivate a rate alert
   */
  async deleteRateAlert(id: string, _req: Request): Promise<void> {
    const existingAlert = await prisma.rateAlert.findUnique({
      where: { id },
    });

    if (!existingAlert) {
      throw new AppError('ALERT_NOT_FOUND', 'Rate alert not found', 404);
    }

    // Soft delete: set status to INACTIVE
    await prisma.rateAlert.update({
      where: { id },
      data: {
        status: RateAlertStatus.INACTIVE,
      },
    });
  }

  /**
   * Get all rate alerts (admin)
   */
  async getAdminRateAlerts(page: number = 1, limit: number = 50): Promise<{
    alerts: unknown[];
    total: number;
    active: number;
    triggered: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const [alerts, total, active, triggered] = await Promise.all([
      prisma.rateAlert.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          notifications: {
            orderBy: {
              sentAt: 'desc',
            },
            take: 5,
          },
        },
      }),
      prisma.rateAlert.count(),
      prisma.rateAlert.count({
        where: { status: RateAlertStatus.ACTIVE },
      }),
      prisma.rateAlert.count({
        where: { status: RateAlertStatus.TRIGGERED },
      }),
    ]);

    return {
      alerts,
      total,
      active,
      triggered,
      page,
      limit,
    };
  }
}

export const rateAlertsService = new RateAlertsService();
