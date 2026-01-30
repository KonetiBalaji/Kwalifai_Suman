/**
 * @file swagger.ts
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

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mortgage Platform API',
      version: '1.0.0',
      description: 'API Gateway for Mortgage Platform - Authentication endpoints',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: process.env.API_GATEWAY_URL || 'http://localhost:3001',
        description: 'API Gateway',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Rate Alerts',
        description: 'Endpoints for managing mortgage rate alerts',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/config/swagger.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           minLength: 8
 *           example: SecurePassword123
 *         phone:
 *           type: string
 *           example: +1234567890
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *     LoginRequest:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         phone:
 *           type: string
 *           example: +1234567890
 *         password:
 *           type: string
 *           example: SecurePassword123
 *     VerifyEmailRequest:
 *       type: object
 *       required:
 *         - email
 *         - code
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         code:
 *           type: string
 *           pattern: '^[0-9]{6}$'
 *           example: "123456"
 *     VerifyPhoneRequest:
 *       type: object
 *       required:
 *         - phone
 *         - code
 *       properties:
 *         phone:
 *           type: string
 *           example: +1234567890
 *         code:
 *           type: string
 *           pattern: '^[0-9]{6}$'
 *           example: "123456"
 *     RefreshRequest:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: "Required for mobile clients. Web clients use cookie."
 *     LogoutRequest:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: "Required for mobile clients. Web clients use cookie."
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Operation successful
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         accessToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refreshToken:
 *           type: string
 *           description: "Only returned for mobile clients (X-Client-Type: mobile header)"
 *           example: hex-token-string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: uuid
 *             email:
 *               type: string
 *               example: user@example.com
 *             firstName:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *     RateAlertRequest:
 *       type: object
 *       required:
 *         - email
 *         - loanType
 *         - targetRate
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         firstName:
 *           type: string
 *           example: Jane
 *         lastName:
 *           type: string
 *           example: Smith
 *         phone:
 *           type: string
 *           example: +1234567890
 *         loanType:
 *           type: string
 *           description: Loan type selected by the user
 *           enum: ['30-Year Fixed', '15-Year Fixed', 'FHA', 'VA', 'ARM', 'Jumbo', 'USDA', '20-Year Fixed']
 *         targetRate:
 *           type: number
 *           format: float
 *           minimum: 0.5
 *           maximum: 20
 *           example: 6.25
 *         loanAmount:
 *           type: number
 *           format: float
 *           example: 450000
 *         propertyAddress:
 *           type: string
 *           example: 123 Main St, Springfield, USA
 *         timeframe:
 *           type: string
 *           description: How long to keep the alert active
 *           enum: ['30 days', '60 days', '90 days', '180 days', '365 days']
 *           example: 90 days
 *     RateAlertResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         alertId:
 *           type: string
 *           example: uuid
 *         message:
 *           type: string
 *           example: Rate alert created successfully! We'll notify you when rates hit your target.
 *         targetRate:
 *           type: number
 *           format: float
 *           example: 6.25
 *         loanType:
 *           type: string
 *           example: 30-Year Fixed
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: Creates a new user account in PENDING state and sends verification codes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests
 */

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     tags: [Authentication]
 *     summary: Verify email address
 *     description: Verify email address with OTP code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailRequest'
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid code or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/auth/verify-phone:
 *   post:
 *     tags: [Authentication]
 *     summary: Verify phone number
 *     description: Verify phone number with OTP code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyPhoneRequest'
 *     responses:
 *       200:
 *         description: Phone verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid code or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     description: Login with email OR phone. Requires both email and phone to be verified.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests
 */

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     description: Refresh access token using refresh token. Implements token rotation.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                   description: "Only returned for mobile clients"
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Logout user
 *     description: Logout and revoke refresh token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutRequest'
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */

/**
 * @swagger
 * /api/v1/rate-alerts:
 *   post:
 *     tags: [Rate Alerts]
 *     summary: Create a new rate alert
 *     description: Create a mortgage rate alert for a given email, loan type, and target rate.
 *     parameters:
 *       - in: header
 *         name: Idempotency-Key
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique key to ensure idempotent alert creation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RateAlertRequest'
 *     responses:
 *       201:
 *         description: Rate alert created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RateAlertResponse'
 *       400:
 *         description: Validation error or limits exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests
 *   get:
 *     tags: [Rate Alerts]
 *     summary: List rate alerts for an email
 *     description: Returns rate alerts for a given email. By default returns only active alerts unless includeAll=true.
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *       - in: query
 *         name: includeAll
 *         required: false
 *         schema:
 *           type: boolean
 *         description: When true, returns all alerts (active, inactive, triggered).
 *     responses:
 *       200:
 *         description: List of rate alerts
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/rate-alerts/{id}:
 *   get:
 *     tags: [Rate Alerts]
 *     summary: Get a specific rate alert
 *     description: Returns a single rate alert by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Rate alert details
 *       404:
 *         description: Alert not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   put:
 *     tags: [Rate Alerts]
 *     summary: Update a rate alert
 *     description: Update target rate, loan type, timeframe, or status for a rate alert.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RateAlertRequest'
 *     responses:
 *       200:
 *         description: Rate alert updated successfully
 *       404:
 *         description: Alert not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     tags: [Rate Alerts]
 *     summary: Deactivate a rate alert
 *     description: Soft deactivates a rate alert by setting status to INACTIVE.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Rate alert deactivated successfully
 *       404:
 *         description: Alert not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'

 */