/**
 * @file calculator.ts
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

import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validation';
import { calculatorRateLimiter } from '../middleware/rateLimiter';
import {
  mortgageCalculateSchema,
  affordabilityCalculateSchema,
  saveScenarioSchema,
} from '../validators/calculator';
import {
  calculateMortgagePayment,
  calculateAffordabilityAmount,
  saveScenario,
  getScenarios,
  getScenarioById,
  deleteScenario,
} from '../services/calculatorService';

const router: ExpressRouter = Router();

// Helper to extract user ID from request (from JWT token in future)
// For now, we'll use a placeholder - in production, extract from JWT
function getUserId(req: Request): string | null {
  // TODO: Extract from JWT token
  // For now, return null for unauthenticated requests
  return (req as any).userId || null;
}

/**
 * POST /calculator/mortgage
 * Calculate mortgage payment
 */
router.post(
  '/mortgage',
  calculatorRateLimiter,
  validate(mortgageCalculateSchema),
  async (req: Request, res: Response) => {
    try {
      const result = await calculateMortgagePayment(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Mortgage calculation error:', error);
      return res.status(500).json({
        error: 'An error occurred during calculation. Please try again later.',
      });
    }
  }
);

/**
 * POST /calculator/affordability
 * Calculate affordability
 */
router.post(
  '/affordability',
  calculatorRateLimiter,
  validate(affordabilityCalculateSchema),
  async (req: Request, res: Response) => {
    try {
      const result = await calculateAffordabilityAmount(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Affordability calculation error:', error);
      return res.status(500).json({
        error: 'An error occurred during calculation. Please try again later.',
      });
    }
  }
);

/**
 * POST /calculator/scenarios
 * Save a calculator scenario
 */
router.post(
  '/scenarios',
  calculatorRateLimiter,
  validate(saveScenarioSchema),
  async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({
          error: 'Authentication required',
        });
      }

      const result = await saveScenario(userId, req.body);
      return res.status(201).json(result);
    } catch (error) {
      console.error('Save scenario error:', error);
      return res.status(500).json({
        error: 'An error occurred while saving the scenario. Please try again later.',
      });
    }
  }
);

/**
 * GET /calculator/scenarios
 * Get user's saved scenarios
 */
router.get(
  '/scenarios',
  calculatorRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({
          error: 'Authentication required',
        });
      }

      const type = req.query.type as string | undefined;
      const result = await getScenarios(userId, type as any);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Get scenarios error:', error);
      return res.status(500).json({
        error: 'An error occurred while fetching scenarios. Please try again later.',
      });
    }
  }
);

/**
 * GET /calculator/scenarios/:id
 * Get scenario by ID
 */
router.get(
  '/scenarios/:id',
  calculatorRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({
          error: 'Authentication required',
        });
      }

      const result = await getScenarioById(userId, req.params.id);
      if (!result.success) {
        return res.status(404).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      console.error('Get scenario error:', error);
      return res.status(500).json({
        error: 'An error occurred while fetching the scenario. Please try again later.',
      });
    }
  }
);

/**
 * DELETE /calculator/scenarios/:id
 * Delete scenario
 */
router.delete(
  '/scenarios/:id',
  calculatorRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({
          error: 'Authentication required',
        });
      }

      const result = await deleteScenario(userId, req.params.id);
      if (!result.success) {
        return res.status(404).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      console.error('Delete scenario error:', error);
      return res.status(500).json({
        error: 'An error occurred while deleting the scenario. Please try again later.',
      });
    }
  }
);

export default router;
