/**
 * @file toolDefinitions.ts
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

import { OpenAI } from 'openai';

/**
 * OpenAI function/tool definitions for mortgage actions
 * These are the ONLY tools the AI can call - all mortgage-related
 */
export const mortgageTools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getRates',
      description: 'Get current mortgage rates for all loan types (30-year, 15-year, FHA, VA, etc.)',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'runCalculator',
      description: 'Run a mortgage calculator. Supports: payment, scenarios, dtoi, buydown, arm, amortization, borrowing-capacity, 15vs30, refinance, extra-payment',
      parameters: {
        type: 'object',
        properties: {
          calculatorType: {
            type: 'string',
            enum: [
              'payment',
              'scenarios',
              'dtoi',
              'buydown',
              'arm',
              'amortization',
              'borrowing-capacity',
              '15vs30',
              'refinance',
              'extra-payment',
            ],
            description: 'Type of calculator to run',
          },
          params: {
            type: 'object',
            description: 'Calculator-specific parameters',
            properties: {
              // Payment calculator
              loanAmount: { type: 'number', description: 'Loan amount in dollars' },
              interestRate: { type: 'number', description: 'Interest rate as percentage (e.g., 6.44)' },
              termYears: { type: 'number', description: 'Loan term in years' },
              
              // Scenarios calculator
              downPayment: { type: 'number', description: 'Down payment amount' },
              
              // DTOI calculator
              grossMonthlyIncome: { type: 'number', description: 'Gross monthly income' },
              monthlyDebtPayments: { type: 'number', description: 'Monthly debt payments' },
              proposedHousingPayment: { type: 'number', description: 'Proposed housing payment' },
              propertyTaxes: { type: 'number', description: 'Property taxes per month' },
              homeInsurance: { type: 'number', description: 'Home insurance per month' },
              mortgageInsurance: { type: 'number', description: 'Mortgage insurance per month' },
              hoaFees: { type: 'number', description: 'HOA fees per month' },
              
              // Refinance calculator
              currentBalance: { type: 'number', description: 'Current loan balance' },
              currentRate: { type: 'number', description: 'Current interest rate' },
              currentPayment: { type: 'number', description: 'Current monthly payment' },
              newRate: { type: 'number', description: 'New interest rate' },
              newTermYears: { type: 'number', description: 'New loan term in years' },
              closingCosts: { type: 'number', description: 'Closing costs' },
              
              // Extra payment calculator
              extraPayment: { type: 'number', description: 'Extra payment amount per month' },
              
              // 15vs30 calculator
              rate15: { type: 'number', description: '15-year rate' },
              rate30: { type: 'number', description: '30-year rate' },
            },
          },
        },
        required: ['calculatorType', 'params'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'createRateAlert',
      description: 'Create a rate alert on behalf of the user. Notifies them when rates drop to their target.',
      parameters: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'User email address',
          },
          loanType: {
            type: 'string',
            description: 'Loan type (e.g., "30-Year Fixed", "15-Year Fixed", "FHA", "VA")',
          },
          targetRate: {
            type: 'number',
            description: 'Target interest rate (e.g., 6.0 means notify when rate drops to 6.0% or below)',
          },
          loanAmount: {
            type: 'number',
            description: 'Loan amount (optional)',
          },
          propertyAddress: {
            type: 'string',
            description: 'Property address (optional)',
          },
          timeframe: {
            type: 'string',
            description: 'Timeframe for alert (default: "90 days")',
          },
        },
        required: ['email', 'loanType', 'targetRate'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getUserProfile',
      description: 'Get the authenticated user profile (name, email, saved calculations, alerts). Only works if user is logged in.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'listUserAlerts',
      description: 'List the user\'s active rate alerts. Requires user email.',
      parameters: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'User email address',
          },
        },
        required: ['email'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'saveCalculation',
      description: 'Save a calculation result to the user\'s profile for later reference.',
      parameters: {
        type: 'object',
        properties: {
          calculationType: {
            type: 'string',
            description: 'Type of calculation (e.g., "payment", "scenarios", "refinance")',
          },
          calculationData: {
            type: 'object',
            description: 'The calculation result data to save',
          },
          title: {
            type: 'string',
            description: 'Optional title for the saved calculation',
          },
        },
        required: ['calculationType', 'calculationData'],
      },
    },
  },
];
