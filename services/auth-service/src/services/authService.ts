/**
 * @file authService.ts
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

import { prisma, UserStatus, VerificationType } from '@mortgage-platform/db';
import {
  hashPassword,
  generateOTP,
  hashOTP,
  verifyOTP,
  getOTPExpiry,
  isOTPExpired,
  getMaxAttempts,
  verifyPassword,
} from '../utils/crypto';
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from '../utils/jwt';
import { RegisterInput, VerifyEmailInput, VerifyPhoneInput, LoginInput, ForgotPasswordInput, ResetPasswordInput } from '../validators/auth';
import { sendEmailOTP, sendPhoneOTP } from '../utils/emailService';

/**
 * Register a new user
 * Creates user in PENDING state and generates verification codes
 */
export async function registerUser(input: RegisterInput) {
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: input.email },
        ...(input.phone ? [{ phone: input.phone }] : []),
      ],
    },
    include: {
      verificationCodes: {
        where: {
          usedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
      },
    },
  });

  // If user exists and is PENDING, update password and regenerate OTPs if needed
  if (existingUser && existingUser.status === UserStatus.PENDING) {
    // Hash new password
    const passwordHash = await hashPassword(input.password);

    // Update user data
    const updateData: any = {
      passwordHash,
      ...(input.firstName && { firstName: input.firstName }),
      ...(input.lastName && { lastName: input.lastName }),
      ...(input.phone && { phone: input.phone }),
    };

    await prisma.user.update({
      where: { id: existingUser.id },
      data: updateData,
    });

    // Check if email OTP exists and is still valid
    const hasValidEmailOTP = existingUser.verificationCodes.some(
      (code) => code.type === VerificationType.EMAIL && !isOTPExpired(code.expiresAt)
    );

    // Generate new email OTP if needed
    if (!hasValidEmailOTP) {
      const emailOTP = generateOTP();
      const emailOTPHash = hashOTP(emailOTP);

      await prisma.verificationCode.create({
        data: {
          userId: existingUser.id,
          type: VerificationType.EMAIL,
          codeHash: emailOTPHash,
          expiresAt: getOTPExpiry(),
          attempts: 0,
        },
      });

      // Send email OTP
      await sendEmailOTP(existingUser.email, emailOTP, existingUser.firstName).catch((err) => {
        console.error('Failed to send email OTP:', err);
        // Don't throw - OTP is still stored, user can request resend
      });
    }

    // Check if phone OTP exists and is still valid (only if phone is provided)
    if (input.phone) {
      const hasValidPhoneOTP = existingUser.verificationCodes.some(
        (code) => code.type === VerificationType.PHONE && !isOTPExpired(code.expiresAt)
      );

      // Generate new phone OTP if needed
      if (!hasValidPhoneOTP) {
        const phoneOTP = generateOTP();
        const phoneOTPHash = hashOTP(phoneOTP);

        await prisma.verificationCode.create({
          data: {
            userId: existingUser.id,
            type: VerificationType.PHONE,
            codeHash: phoneOTPHash,
            expiresAt: getOTPExpiry(),
            attempts: 0,
          },
        });

        // Send phone OTP via SMS
        if (input.phone) {
          await sendPhoneOTP(input.phone, phoneOTP).catch((err) => {
            console.error('Failed to send phone OTP:', err);
            // Don't throw - OTP is still stored, user can request resend
          });
        }
      }
    }

    return {
      success: true,
      message: 'If an account exists with this email or phone, a verification code has been sent.',
    };
  }

  // If user exists but is not PENDING, return generic response
  if (existingUser) {
    return {
      success: true,
      message: 'If an account exists with this email or phone, a verification code has been sent.',
    };
  }

  // Hash password
  const passwordHash = await hashPassword(input.password);

  // Create user in PENDING state
  const user = await prisma.user.create({
    data: {
      email: input.email,
      phone: input.phone || null,
      passwordHash,
      firstName: input.firstName || null,
      lastName: input.lastName || null,
      status: UserStatus.PENDING,
      emailVerified: false,
      phoneVerified: false,
    },
  });

  // Generate and store email verification code
  const emailOTP = generateOTP();
  const emailOTPHash = hashOTP(emailOTP);

  await prisma.verificationCode.create({
    data: {
      userId: user.id,
      type: VerificationType.EMAIL,
      codeHash: emailOTPHash,
      expiresAt: getOTPExpiry(),
      attempts: 0,
    },
  });

  // Send email OTP
  await sendEmailOTP(user.email, emailOTP, user.firstName).catch((err) => {
    console.error('Failed to send email OTP:', err);
    // Don't throw - OTP is still stored, user can request resend
  });

  // Generate and store phone verification code if phone provided
  if (input.phone) {
    const phoneOTP = generateOTP();
    const phoneOTPHash = hashOTP(phoneOTP);

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        type: VerificationType.PHONE,
        codeHash: phoneOTPHash,
        expiresAt: getOTPExpiry(),
        attempts: 0,
      },
    });

    // Send phone OTP via SMS
    await sendPhoneOTP(input.phone, phoneOTP).catch((err) => {
      console.error('Failed to send phone OTP:', err);
      // Don't throw - OTP is still stored, user can request resend
    });
  }

  return {
    success: true,
    message: 'Registration successful. Please check your email and phone for verification codes.',
  };
}

/**
 * Verify email with OTP code
 */
export async function verifyEmail(input: VerifyEmailInput) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: {
      verificationCodes: {
        where: {
          type: VerificationType.EMAIL,
          usedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });

  // Return generic response to prevent user enumeration
  if (!user) {
    return {
      success: false,
      message: 'Invalid verification code or code has expired.',
    };
  }

  // Check if email is already verified
  if (user.emailVerified) {
    return {
      success: true,
      message: 'Email is already verified.',
    };
  }

  // Check if user has any verification codes
  if (user.verificationCodes.length === 0) {
    return {
      success: false,
      message: 'Invalid verification code or code has expired.',
    };
  }

  const verificationCode = user.verificationCodes[0];

  // Check if code is expired
  if (isOTPExpired(verificationCode.expiresAt)) {
    return {
      success: false,
      message: 'Invalid verification code or code has expired.',
    };
  }

  // Check attempt limit
  if (verificationCode.attempts >= getMaxAttempts()) {
    return {
      success: false,
      message: 'Too many verification attempts. Please request a new code.',
    };
  }

  // Verify OTP
  const isValid = verifyOTP(input.code, verificationCode.codeHash);

  if (!isValid) {
    // Increment attempts
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { attempts: verificationCode.attempts + 1 },
    });

    return {
      success: false,
      message: 'Invalid verification code or code has expired.',
    };
  }

  // Mark code as used and verify email
  await prisma.$transaction([
    prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        // If both email and phone are verified, activate user
        ...(user.phoneVerified
          ? { status: UserStatus.ACTIVE }
          : {}),
      },
    }),
  ]);

  return {
    success: true,
    message: 'Email verified successfully.',
  };
}

/**
 * Verify phone with OTP code
 */
export async function verifyPhone(input: VerifyPhoneInput) {
  // Find user by phone
  const user = await prisma.user.findUnique({
    where: { phone: input.phone },
    include: {
      verificationCodes: {
        where: {
          type: VerificationType.PHONE,
          usedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });

  // Return generic response to prevent user enumeration
  if (!user) {
    return {
      success: false,
      message: 'Invalid verification code or code has expired.',
    };
  }

  // Check if phone is already verified
  if (user.phoneVerified) {
    return {
      success: true,
      message: 'Phone is already verified.',
    };
  }

  // Check if user has any verification codes
  if (user.verificationCodes.length === 0) {
    return {
      success: false,
      message: 'Invalid verification code or code has expired.',
    };
  }

  const verificationCode = user.verificationCodes[0];

  // Check if code is expired
  if (isOTPExpired(verificationCode.expiresAt)) {
    return {
      success: false,
      message: 'Invalid verification code or code has expired.',
    };
  }

  // Check attempt limit
  if (verificationCode.attempts >= getMaxAttempts()) {
    return {
      success: false,
      message: 'Too many verification attempts. Please request a new code.',
    };
  }

  // Verify OTP
  const isValid = verifyOTP(input.code, verificationCode.codeHash);

  if (!isValid) {
    // Increment attempts
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { attempts: verificationCode.attempts + 1 },
    });

    return {
      success: false,
      message: 'Invalid verification code or code has expired.',
    };
  }

  // Mark code as used and verify phone
  await prisma.$transaction([
    prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        phoneVerified: true,
        // If both email and phone are verified, activate user
        ...(user.emailVerified
          ? { status: UserStatus.ACTIVE }
          : {}),
      },
    }),
  ]);

  return {
    success: true,
    message: 'Phone verified successfully.',
  };
}

/**
 * Login user with email or phone
 * Only allows login if both email and phone are verified
 */
export async function loginUser(input: LoginInput, ipAddress?: string, userAgent?: string) {
  // Find user by email or phone
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        ...(input.email ? [{ email: input.email }] : []),
        ...(input.phone ? [{ phone: input.phone }] : []),
      ],
    },
  });

  // Return generic response to prevent user enumeration
  if (!user) {
    return {
      success: false,
      message: 'Invalid credentials.',
    };
  }

  // Check if both email and phone are verified
  if (!user.emailVerified || !user.phoneVerified) {
    return {
      success: false,
      message: 'Invalid credentials.',
    };
  }

  // Check if user is active
  if (user.status !== UserStatus.ACTIVE) {
    return {
      success: false,
      message: 'Invalid credentials.',
    };
  }

  // Verify password
  const isPasswordValid = await verifyPassword(input.password, user.passwordHash);

  if (!isPasswordValid) {
    return {
      success: false,
      message: 'Invalid credentials.',
    };
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
  });

  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);
  const refreshTokenExpiry = getRefreshTokenExpiry();

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: refreshTokenExpiry,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
    },
  });

  return {
    success: true,
    accessToken,
    refreshToken, // Will be handled by middleware based on client type
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };
}

/**
 * Refresh access token using refresh token
 * Implements token rotation
 */
export async function refreshAccessToken(
  refreshToken: string,
  ipAddress?: string,
  userAgent?: string
) {
  // Find all active refresh tokens and verify the provided one
  const activeTokens = await prisma.refreshToken.findMany({
    where: {
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Find the matching token by verifying the hash
  let storedToken = null;
  for (const token of activeTokens) {
    if (verifyRefreshToken(refreshToken, token.tokenHash)) {
      storedToken = token;
      break;
    }
  }

  if (!storedToken) {
    return {
      success: false,
      message: 'Invalid or expired refresh token.',
    };
  }

  // Check if user is still active
  if (storedToken.user.status !== UserStatus.ACTIVE) {
    return {
      success: false,
      message: 'Invalid or expired refresh token.',
    };
  }

  // Revoke old refresh token (token rotation)
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  });

  // Generate new tokens
  const newAccessToken = generateAccessToken({
    userId: storedToken.user.id,
    email: storedToken.user.email,
  });

  const newRefreshToken = generateRefreshToken();
  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);
  const newRefreshTokenExpiry = getRefreshTokenExpiry();

  // Store new refresh token
  await prisma.refreshToken.create({
    data: {
      userId: storedToken.user.id,
      tokenHash: newRefreshTokenHash,
      expiresAt: newRefreshTokenExpiry,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
    },
  });

  return {
    success: true,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken, // Will be handled by middleware based on client type
  };
}

/**
 * Logout user by revoking refresh token
 */
export async function logoutUser(refreshToken: string) {
  // Find all active refresh tokens and verify the provided one
  const activeTokens = await prisma.refreshToken.findMany({
    where: {
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Find the matching token by verifying the hash
  let storedToken = null;
  for (const token of activeTokens) {
    if (verifyRefreshToken(refreshToken, token.tokenHash)) {
      storedToken = token;
      break;
    }
  }

  if (storedToken) {
    // Revoke refresh token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });
  }

  // Always return success (prevents enumeration)
  return {
    success: true,
    message: 'Logged out successfully.',
  };
}

/**
 * Request password reset
 * Generates and stores password reset code
 */
export async function forgotPassword(input: ForgotPasswordInput) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: {
      verificationCodes: {
        where: {
          type: VerificationType.PASSWORD_RESET,
          usedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });

  // Return generic success response to prevent user enumeration
  // Always return success even if user doesn't exist
  if (!user) {
    return {
      success: true,
      message: 'If an account exists with this email, a password reset code has been sent.',
    };
  }

  // Check if there's an active reset code
  if (user.verificationCodes.length > 0) {
    const activeCode = user.verificationCodes[0];
    if (!isOTPExpired(activeCode.expiresAt)) {
      // Code still valid, don't send another
      return {
        success: true,
        message: 'If an account exists with this email, a password reset code has been sent.',
      };
    }
  }

  // Generate password reset code
  const resetCode = generateOTP();
  const codeHash = hashOTP(resetCode);
  const expiresAt = getOTPExpiry();

  // Store reset code
  await prisma.verificationCode.create({
    data: {
      userId: user.id,
      type: VerificationType.PASSWORD_RESET,
      codeHash,
      expiresAt,
    },
  });

  // Send password reset email
  await sendEmailOTP(user.email, resetCode, user.firstName).catch((err) => {
    console.error('Failed to send password reset email:', err);
    // Don't throw - code is still stored
  });

  return {
    success: true,
    message: 'If an account exists with this email, a password reset code has been sent.',
  };
}

/**
 * Reset password using reset code
 */
export async function resetPassword(input: ResetPasswordInput) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: {
      verificationCodes: {
        where: {
          type: VerificationType.PASSWORD_RESET,
          usedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });

  // Return generic response to prevent user enumeration
  if (!user) {
    return {
      success: false,
      message: 'Invalid reset code or code has expired.',
    };
  }

  // Check if user has any reset codes
  if (user.verificationCodes.length === 0) {
    return {
      success: false,
      message: 'Invalid reset code or code has expired.',
    };
  }

  const resetCode = user.verificationCodes[0];

  // Check if code is expired
  if (isOTPExpired(resetCode.expiresAt)) {
    return {
      success: false,
      message: 'Invalid reset code or code has expired.',
    };
  }

  // Check attempt limit
  if (resetCode.attempts >= getMaxAttempts()) {
    return {
      success: false,
      message: 'Too many reset attempts. Please request a new code.',
    };
  }

  // Verify reset code
  const isValid = verifyOTP(input.code, resetCode.codeHash);

  if (!isValid) {
    // Increment attempts
    await prisma.verificationCode.update({
      where: { id: resetCode.id },
      data: { attempts: resetCode.attempts + 1 },
    });

    return {
      success: false,
      message: 'Invalid reset code or code has expired.',
    };
  }

  // Hash new password
  const passwordHash = await hashPassword(input.password);

  // Update password and mark code as used
  await prisma.$transaction([
    prisma.verificationCode.update({
      where: { id: resetCode.id },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),
  ]);

  return {
    success: true,
    message: 'Password reset successfully.',
  };
}
