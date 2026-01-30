/**
 * @file auth.test.ts
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

import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
} from '../auth';

describe('Auth Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'TestPassword123',
        phone: '+1234567890',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate registration without optional fields', () => {
      const validData = {
        email: 'test@example.com',
        password: 'TestPassword123',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'TestPassword123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('password');
      }
    });

    it('should reject password without uppercase', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'testpassword123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject password without lowercase', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'TESTPASSWORD123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject password without number', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'TestPassword',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid phone format', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'TestPassword123',
        phone: '123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept valid phone format', () => {
      const validData = {
        email: 'test@example.com',
        password: 'TestPassword123',
        phone: '+1234567890',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('verifyEmailSchema', () => {
    it('should validate correct email verification data', () => {
      const validData = {
        email: 'test@example.com',
        code: '123456',
      };

      const result = verifyEmailSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        code: '123456',
      };

      const result = verifyEmailSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject code that is not 6 digits', () => {
      const invalidData = {
        email: 'test@example.com',
        code: '12345',
      };

      const result = verifyEmailSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject code with non-numeric characters', () => {
      const invalidData = {
        email: 'test@example.com',
        code: '12345a',
      };

      const result = verifyEmailSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('verifyPhoneSchema', () => {
    it('should validate correct phone verification data', () => {
      const validData = {
        phone: '+1234567890',
        code: '123456',
      };

      const result = verifyPhoneSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid phone format', () => {
      const invalidData = {
        phone: '123',
        code: '123456',
      };

      const result = verifyPhoneSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject code that is not 6 digits', () => {
      const invalidData = {
        phone: '+1234567890',
        code: '12345',
      };

      const result = verifyPhoneSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
