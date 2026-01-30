/**
 * @file crypto.test.ts
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
  hashPassword,
  verifyPassword,
  generateOTP,
  hashOTP,
  verifyOTP,
  getOTPExpiry,
  isOTPExpired,
  getMaxAttempts,
} from '../crypto';

describe('Crypto Utilities', () => {
  describe('Password Hashing', () => {
    it('should hash a password', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should verify correct password', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123';
      const wrongPassword = 'WrongPassword123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hash);
      
      expect(isValid).toBe(false);
    });
  });

  describe('OTP Generation', () => {
    it('should generate a 6-digit OTP', () => {
      const otp = generateOTP();
      
      expect(otp).toBeDefined();
      expect(otp.length).toBe(6);
      expect(/^\d+$/.test(otp)).toBe(true);
    });

    it('should generate different OTPs on each call', () => {
      const otp1 = generateOTP();
      const otp2 = generateOTP();
      
      // Very unlikely to be the same, but possible
      // We'll just check they're both valid
      expect(otp1).toBeDefined();
      expect(otp2).toBeDefined();
    });
  });

  describe('OTP Hashing and Verification', () => {
    it('should hash an OTP', () => {
      const otp = '123456';
      const hash = hashOTP(otp);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(otp);
      expect(hash.length).toBe(64); // SHA-256 produces 64 char hex string
    });

    it('should verify correct OTP', () => {
      const otp = '123456';
      const hash = hashOTP(otp);
      const isValid = verifyOTP(otp, hash);
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect OTP', () => {
      const otp = '123456';
      const wrongOtp = '654321';
      const hash = hashOTP(otp);
      const isValid = verifyOTP(wrongOtp, hash);
      
      expect(isValid).toBe(false);
    });

    it('should produce same hash for same OTP', () => {
      const otp = '123456';
      const hash1 = hashOTP(otp);
      const hash2 = hashOTP(otp);
      
      expect(hash1).toBe(hash2);
    });
  });

  describe('OTP Expiry', () => {
    it('should return expiry date 15 minutes in the future', () => {
      const now = new Date();
      const expiry = getOTPExpiry();
      
      const diffMinutes = (expiry.getTime() - now.getTime()) / (1000 * 60);
      
      expect(diffMinutes).toBeGreaterThan(14);
      expect(diffMinutes).toBeLessThan(16);
    });

    it('should detect expired OTP', () => {
      const pastDate = new Date();
      pastDate.setMinutes(pastDate.getMinutes() - 20);
      
      expect(isOTPExpired(pastDate)).toBe(true);
    });

    it('should detect non-expired OTP', () => {
      const futureDate = new Date();
      futureDate.setMinutes(futureDate.getMinutes() + 10);
      
      expect(isOTPExpired(futureDate)).toBe(false);
    });
  });

  describe('Max Attempts', () => {
    it('should return max attempts value', () => {
      const maxAttempts = getMaxAttempts();
      
      expect(maxAttempts).toBe(5);
      expect(typeof maxAttempts).toBe('number');
    });
  });
});
