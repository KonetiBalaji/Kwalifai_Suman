/**
 * @file validation.ts
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

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendStandardError } from '../utils/errors';

/**
 * Middleware to validate request body against a Zod schema
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        sendStandardError(
          res,
          'VALIDATION_ERROR',
          'Invalid request body',
          400,
          error.errors
        );
      } else {
        sendStandardError(res, 'VALIDATION_ERROR', 'Validation failed', 400);
      }
    }
  };
};

/**
 * Middleware to validate request query parameters against a Zod schema
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        sendStandardError(
          res,
          'VALIDATION_ERROR',
          'Invalid query parameters',
          400,
          error.errors
        );
      } else {
        sendStandardError(res, 'VALIDATION_ERROR', 'Validation failed', 400);
      }
    }
  };
};

/**
 * Middleware to validate request params against a Zod schema
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        sendStandardError(
          res,
          'VALIDATION_ERROR',
          'Invalid route parameters',
          400,
          error.errors
        );
      } else {
        sendStandardError(res, 'VALIDATION_ERROR', 'Validation failed', 400);
      }
    }
  };
};
