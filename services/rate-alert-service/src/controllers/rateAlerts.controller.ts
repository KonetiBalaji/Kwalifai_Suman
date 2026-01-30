/**
 * @file rateAlerts.controller.ts
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

import { Request, Response } from 'express';
import { rateAlertsService } from '../services/rateAlerts.service';
import { rateMonitorService } from '../services/rateMonitor.service';
import { sendErrorResponse, AppError } from '../utils/errors';
import { Logger } from '../utils/logger';

/**
 * Create a new rate alert
 * POST /rate-alerts
 */
export const createRateAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    Logger.info('Creating rate alert', req, req.body);
    
    const result = await rateAlertsService.createRateAlert(req.body, req);
    res.status(201).json(result);
  } catch (error) {
    Logger.error('Error creating rate alert', req, error);
    if (error instanceof AppError) {
      sendErrorResponse(res, error);
    } else {
      sendErrorResponse(res, new AppError('INTERNAL_ERROR', 'Failed to create rate alert', 500));
    }
  }
};

/**
 * Get rate alerts
 * GET /rate-alerts?email=...
 */
export const getRateAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    Logger.info('Getting rate alerts', req, req.query);
    
    const query = req.query as { email: string; includeAll?: string };
    const result = await rateAlertsService.getRateAlerts({
      email: query.email,
      includeAll: query.includeAll === 'true',
    }, req);
    res.status(200).json(result);
  } catch (error) {
    Logger.error('Error getting rate alerts', req, error);
    if (error instanceof AppError) {
      sendErrorResponse(res, error);
    } else {
      sendErrorResponse(res, new AppError('INTERNAL_ERROR', 'Failed to get rate alerts', 500));
    }
  }
};

/**
 * Get a specific rate alert by ID
 * GET /rate-alerts/:id
 */
export const getRateAlertById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    Logger.info(`Getting rate alert ${id}`, req);
    
    const result = await rateAlertsService.getRateAlertById(id, req);
    res.status(200).json(result);
  } catch (error) {
    Logger.error('Error getting rate alert by ID', req, error);
    if (error instanceof AppError) {
      sendErrorResponse(res, error);
    } else {
      sendErrorResponse(res, new AppError('INTERNAL_ERROR', 'Failed to get rate alert', 500));
    }
  }
};

/**
 * Update a rate alert
 * PUT /rate-alerts/:id
 */
export const updateRateAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    Logger.info(`Updating rate alert ${id}`, req, req.body);
    
    const result = await rateAlertsService.updateRateAlert(id, req.body, req);
    res.status(200).json(result);
  } catch (error) {
    Logger.error('Error updating rate alert', req, error);
    if (error instanceof AppError) {
      sendErrorResponse(res, error);
    } else {
      sendErrorResponse(res, new AppError('INTERNAL_ERROR', 'Failed to update rate alert', 500));
    }
  }
};

/**
 * Delete a rate alert
 * DELETE /rate-alerts/:id
 */
export const deleteRateAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    Logger.info(`Deleting rate alert ${id}`, req);
    
    await rateAlertsService.deleteRateAlert(id, req);
    res.status(200).json({
      success: true,
      message: 'Rate alert deactivated successfully',
    });
  } catch (error) {
    Logger.error('Error deleting rate alert', req, error);
    if (error instanceof AppError) {
      sendErrorResponse(res, error);
    } else {
      sendErrorResponse(res, new AppError('INTERNAL_ERROR', 'Failed to delete rate alert', 500));
    }
  }
};

/**
 * Get all rate alerts (admin)
 * GET /admin/rate-alerts
 */
export const getAdminRateAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    Logger.info('Getting admin rate alerts', req, { page, limit });
    
    const result = await rateAlertsService.getAdminRateAlerts(page, limit);
    res.status(200).json(result);
  } catch (error) {
    Logger.error('Error getting admin rate alerts', req, error);
    if (error instanceof AppError) {
      sendErrorResponse(res, error);
    } else {
      sendErrorResponse(res, new AppError('INTERNAL_ERROR', 'Failed to get admin rate alerts', 500));
    }
  }
};

/**
 * Run rate alert check immediately (admin)
 * POST /admin/rate-alerts/run-check
 */
export const runAdminRateCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    Logger.info('Admin requested immediate rate alert check', req);
    const result = await rateMonitorService.runRateCheck(req);

    res.status(200).json({
      success: true,
      message: 'Rate alert check completed',
      ...result,
    });
  } catch (error) {
    Logger.error('Error running admin rate alert check', req, error);
    if (error instanceof AppError) {
      sendErrorResponse(res, error);
    } else {
      sendErrorResponse(res, new AppError('INTERNAL_ERROR', 'Failed to run rate alert check', 500));
    }
  }
};
