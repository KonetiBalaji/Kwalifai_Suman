/**
 * @file auth.ts
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

import { z } from 'zod';

/**
 * Email validation regex
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation regex (supports international format)
 */
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

/**
 * Password requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Register request validation schema
 */
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .refine((val) => emailRegex.test(val), 'Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (val) => passwordRegex.test(val),
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || phoneRegex.test(val),
      'Phone number must be in international format (e.g., +1234567890)'
    ),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

/**
 * Verify email request validation schema
 */
export const verifyEmailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  code: z
    .string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only digits'),
});

/**
 * Verify phone request validation schema
 */
export const verifyPhoneSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone is required')
    .refine(
      (val) => phoneRegex.test(val),
      'Phone number must be in international format (e.g., +1234567890)'
    ),
  code: z
    .string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only digits'),
});

/**
 * Login request validation schema
 * Accepts email OR phone
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  phone: z
    .string()
    .refine(
      (val) => phoneRegex.test(val),
      'Phone number must be in international format (e.g., +1234567890)'
    )
    .optional(),
  password: z.string().min(1, 'Password is required'),
}).refine(
  (data) => data.email || data.phone,
  {
    message: 'Either email or phone is required',
    path: ['email'],
  }
);

/**
 * Refresh token request validation schema
 */
export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').optional(),
});

/**
 * Logout request validation schema
 */
export const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').optional(),
});

/**
 * Forgot password request validation schema
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
});

/**
 * Reset password request validation schema
 */
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  code: z
    .string()
    .length(6, 'Reset code must be 6 digits')
    .regex(/^\d+$/, 'Reset code must contain only digits'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (val) => passwordRegex.test(val),
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type VerifyPhoneInput = z.infer<typeof verifyPhoneSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;