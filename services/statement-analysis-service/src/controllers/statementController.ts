/**
 * @file statementController.ts
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
import { statementService } from '../services/statementService';
import { createFileStorageProvider } from '../services/fileStorage';

const fileStorage = createFileStorageProvider();
const upload = fileStorage.getMulterMiddleware();

/**
 * Upload statement endpoint
 * POST /statement/upload
 * 
 * Matches legacy: POST /api/upload-statement
 * Field name: mortgageStatement (required)
 */
export const uploadStatement = [
  upload.single('mortgageStatement'),
  async (req: Request, res: Response) => {
    try {
      // Extract tenant info from headers (forwarded by gateway)
      const brokerId = req.headers['x-broker-id'] as string | undefined;
      const loanOfficerId = req.headers['x-loan-officer-id'] as string | undefined;
      const userId = req.headers['x-user-id'] as string | undefined; // Future: from JWT

      // Extract form data (matching legacy field names)
      const result = await statementService.createStatement({
        sessionId: req.body.sessionId || undefined,
        userId: userId || undefined,
        customerName: req.body.customerName || undefined,
        customerEmail: req.body.customerEmail || undefined,
        customerPhone: req.body.customerPhone || undefined,
        brokerId: brokerId || undefined,
        loanOfficerId: loanOfficerId || undefined,
        idempotencyKey: req.headers['idempotency-key'] as string | undefined,
        // Form fields
        currentBalance: req.body.currentBalance,
        currentRate: req.body.currentRate,
        monthlyPayment: req.body.monthlyPayment,
        propertyAddress: req.body.propertyAddress,
        lenderName: req.body.lenderName,
        escrowBalance: req.body.escrowBalance,
        loanNumber: req.body.loanNumber,
        nextPaymentDate: req.body.nextPaymentDate,
        // File (if uploaded)
        file: req.file
          ? {
              filename: req.file.filename,
              originalName: req.file.originalname,
              path: req.file.path,
              size: req.file.size,
              mimetype: req.file.mimetype,
            }
          : undefined,
      });

      res.json(result);
    } catch (error: any) {
      console.error('Upload/Analysis error:', error);
      res.status(500).json({
        error: 'Analysis failed',
        message: error.message || 'Unknown error occurred',
      });
    }
  },
];

/**
 * Get statement by ID
 * GET /statement/:id
 * 
 * Matches legacy: GET /api/statement/:id
 */
export const getStatement = async (req: Request, res: Response) => {
  try {
    const statementId = req.params.id;
    const statement = await statementService.getStatementById(statementId);

    if (!statement) {
      return res.status(404).json({ error: 'Statement not found' });
    }

    res.json(statement);
  } catch (error: any) {
    console.error('Get statement error:', error);
    res.status(500).json({
      error: 'Failed to retrieve statement',
      message: error.message || 'Unknown error occurred',
    });
  }
};
