/**
 * @file page.tsx
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

'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

// API Gateway URL - should be set via NEXT_PUBLIC_API_GATEWAY_URL env var
const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface PasswordValidation {
  length: boolean;
  valid: boolean;
  show: boolean;
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  // Step management
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+1',
    password: '',
    confirmPassword: '',
  });

  const [phoneDigits, setPhoneDigits] = useState('');

  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    length: false,
    valid: false,
    show: false,
  });

  const [confirmPasswordMatch, setConfirmPasswordMatch] = useState<{
    matches: boolean;
    show: boolean;
  }>({
    matches: false,
    show: false,
  });

  // Password validation logic
  useEffect(() => {
    if (formData.password.length > 0) {
      const lengthValid = formData.password.length >= 8 && formData.password.length <= 12;
      const hasUpper = /[A-Z]/.test(formData.password);
      const hasLower = /[a-z]/.test(formData.password);
      const hasNumber = /[0-9]/.test(formData.password);
      
      setPasswordValidation({
        length: lengthValid,
        valid: lengthValid && hasUpper && hasLower && hasNumber,
        show: true,
      });
    } else {
      setPasswordValidation({ length: false, valid: false, show: false });
    }
  }, [formData.password]);

  // Hide password validation when all requirements met
  useEffect(() => {
    if (passwordValidation.valid) {
      const timer = setTimeout(() => {
        setPasswordValidation(prev => ({ ...prev, show: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [passwordValidation.valid]);

  // Confirm password match validation
  useEffect(() => {
    if (formData.confirmPassword.length > 0) {
      setConfirmPasswordMatch({
        matches: formData.password === formData.confirmPassword && formData.password.length > 0,
        show: true,
      });
    } else {
      setConfirmPasswordMatch({ matches: false, show: false });
    }
  }, [formData.confirmPassword, formData.password]);

  // Hide confirm password indicator when matches
  useEffect(() => {
    if (confirmPasswordMatch.matches) {
      const timer = setTimeout(() => {
        setConfirmPasswordMatch(prev => ({ ...prev, show: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [confirmPasswordMatch.matches]);

  // Check if email is valid to show Next button
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  // Check if phone is valid (10 digits)
  const isPhoneValid = phoneDigits.length === 10;

  const handleEmailNext = async () => {
    if (!isEmailValid || !formData.firstName || !formData.lastName) {
      setError('Please fill in first name, last name, and valid email');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Pre-register user to generate OTP (creates user in PENDING state)
      const response = await fetch(`${API_GATEWAY_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: 'TempPass123!', // Temporary, will be updated on final submit
          phone: phoneDigits.length === 10 ? `+1${phoneDigits}` : '+1',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If user already exists, we can still proceed to verification
        if (data.message && data.message.includes('verification code')) {
          setShowEmailOTP(true);
          setError(null);
          setLoading(false);
          return;
        }
        setError(data.error || data.message || 'Failed to send OTP');
        setLoading(false);
        return;
      }

      setShowEmailOTP(true);
      setError(null);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (emailOTP.length !== 6) {
      setFieldErrors({ emailOTP: 'Please enter a 6-digit code' });
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await fetch(`${API_GATEWAY_URL}/api/v1/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: emailOTP,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || 'Email verification failed');
        setFieldErrors({ emailOTP: data.error || data.message || 'Invalid code' });
        setLoading(false);
        return;
      }

      setEmailVerified(true);
      setShowEmailOTP(false);
      setEmailOTP('');
      setError(null);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneValidate = async () => {
    if (!isPhoneValid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Update registration with phone number to generate OTP
      // If user was already pre-registered during email step, this will update the phone
      const response = await fetch(`${API_GATEWAY_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: 'TempPass123!', // Temporary
          phone: `+1${phoneDigits}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If user already exists, we can still proceed to verification
        if (data.message && data.message.includes('verification code')) {
          setShowPhoneOTP(true);
          setError(null);
          setLoading(false);
          return;
        }
        setError(data.error || data.message || 'Failed to send OTP');
        setLoading(false);
        return;
      }

      setShowPhoneOTP(true);
      setError(null);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (phoneOTP.length !== 6) {
      setFieldErrors({ phoneOTP: 'Please enter a 6-digit code' });
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await fetch(`${API_GATEWAY_URL}/api/v1/auth/verify-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
                        body: JSON.stringify({
                          phone: `+1${phoneDigits}`,
                          code: phoneOTP,
                        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || 'Phone verification failed');
        setFieldErrors({ phoneOTP: data.error || data.message || 'Invalid code' });
        setLoading(false);
        return;
      }

      setPhoneVerified(true);
      setShowPhoneOTP(false);
      setPhoneOTP('');
      setError(null);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!formData.firstName.trim()) {
      setFieldErrors({ firstName: 'First name is required' });
      return;
    }

    if (!formData.lastName.trim()) {
      setFieldErrors({ lastName: 'Last name is required' });
      return;
    }

    if (!emailVerified) {
      setError('Please verify your email address');
      return;
    }

    if (!phoneVerified) {
      setError('Please verify your phone number');
      return;
    }

    if (!passwordValidation.valid) {
      setError('Password does not meet requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Update password for the pre-registered user
      // In production, you might need an endpoint to update password after verification
      // For now, we'll complete registration with the final password
      const response = await fetch(`${API_GATEWAY_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          phone: phoneDigits.length === 10 ? `+1${phoneDigits}` : formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If user already exists and verified, redirect to login
        if (data.message && (data.message.includes('already verified') || data.message.includes('already exists'))) {
          window.location.href = '/login?verified=true';
          return;
        }
        
        if (data.details && Array.isArray(data.details)) {
          const errors: Record<string, string> = {};
          data.details.forEach((detail: { path: string; message: string }) => {
            const field = detail.path.replace(/\[|\]/g, '').split('.').pop() || '';
            errors[field] = detail.message;
          });
          setFieldErrors(errors);
          setError(data.error || 'Validation failed');
        } else {
          setError(data.error || data.message || 'Registration failed. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Registration successful - redirect to login
      window.location.href = '/login?verified=true';
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update formData.phone for API calls (formatted version)
  useEffect(() => {
    if (phoneDigits.length === 10) {
      setFormData((prev) => ({ ...prev, phone: `+1${phoneDigits}` }));
    }
  }, [phoneDigits]);

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Column - Brand & Message */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center">
          <div className="ml-32 max-w-md">
            <h1 className="text-4xl text-gray-900 mb-4">
              Kwalifai
            </h1>
            <p className="text-2xl text-gray-900 leading-relaxed">
              Make mortgage decisions with clarity and confidence.
            </p>
          </div>
        </div>

        {/* Right Column - Registration Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-0 min-h-screen lg:min-h-0">
          <div className="w-full max-w-lg mx-auto">
            {/* Mobile: Show brand message */}
            <div className="md:hidden mb-8 text-center">
              <h1 className="text-3xl text-gray-900 mb-4">
                Kwalifai
              </h1>
              <h2 className="text-xl text-gray-900 mb-3 leading-tight">
                Make mortgage decisions with clarity and confidence.
              </h2>
            </div>

            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl text-gray-900 mb-2">
                Create your account
              </h2>
            </div>

            {/* Registration Form Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg py-8 px-6 sm:px-10">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 text-red-700 rounded-xl text-sm font-medium shadow-sm">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleRegister}>
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                      }
                      placeholder="John"
                      className={`block w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        fieldErrors.firstName 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {fieldErrors.firstName && (
                      <p className="mt-2 text-sm text-red-600">{fieldErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                      }
                      placeholder="Doe"
                      className={`block w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        fieldErrors.lastName 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-2 text-sm text-red-600">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email Field with Verification */}
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                    Email Address
                    {emailVerified && (
                      <span className="ml-2 text-green-600 text-xs font-medium">✓ Verified</span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                      disabled={emailVerified}
                      className={`flex-1 px-4 py-3 border-2 rounded-xl transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        fieldErrors.email 
                          ? 'border-red-300 focus:ring-red-500' 
                          : emailVerified
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {!emailVerified && isEmailValid && !showEmailOTP && (
                      <button
                        type="button"
                        onClick={handleEmailNext}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-md hover:shadow-lg whitespace-nowrap"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          'Verify'
                        )}
                      </button>
                    )}
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>
                  )}

                  {/* Email OTP Verification */}
                  {showEmailOTP && !emailVerified && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
                      <form onSubmit={handleEmailVerify} className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-800">
                          Enter verification code sent to <span className="text-blue-700">{formData.email}</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={emailOTP}
                            onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-xl tracking-[0.5em] font-semibold bg-white"
                            autoFocus
                          />
                          {emailOTP.length === 6 && (
                            <button
                              type="submit"
                              disabled={loading}
                              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                            >
                              {loading ? (
                                <span className="flex items-center gap-2">
                                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Verifying...
                                </span>
                              ) : (
                                'Submit'
                              )}
                            </button>
                          )}
                        </div>
                        {fieldErrors.emailOTP && (
                          <p className="text-sm text-red-600 font-medium">{fieldErrors.emailOTP}</p>
                        )}
                      </form>
                    </div>
                  )}
                </div>

                {/* Phone Field with Verification - Only visible after email verification */}
                {emailVerified && (
                  <div>
                    <label htmlFor="phone" className="block text-sm text-gray-700 mb-2">
                      Phone Number
                      {phoneVerified && (
                        <span className="ml-2 text-green-600 text-xs font-medium">✓ Verified</span>
                      )}
                    </label>
                    <div className="flex gap-2 items-start">
                      {/* First Box: Country Code */}
                      <div className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 shadow-sm">
                        <span className="text-gray-700 font-semibold">+1</span>
                      </div>
                      
                      {/* Second Box: 10-digit Phone Number */}
                      <div className="flex-1">
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={phoneDigits}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setPhoneDigits(digits);
                          }}
                          disabled={phoneVerified}
                          placeholder="5551234567"
                          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium ${
                            fieldErrors.phone 
                              ? 'border-red-300 focus:ring-red-500' 
                              : phoneVerified
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          maxLength={10}
                        />
                      </div>
                      
                      {/* Validate Button - Appears when 10 digits entered */}
                      {!phoneVerified && isPhoneValid && !showPhoneOTP && (
                        <button
                          type="button"
                          onClick={handlePhoneValidate}
                          disabled={loading}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold whitespace-nowrap shadow-md hover:shadow-lg"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </span>
                          ) : (
                            'Validate'
                          )}
                        </button>
                      )}
                    </div>
                    {fieldErrors.phone && (
                      <p className="mt-2 text-sm text-red-600">{fieldErrors.phone}</p>
                    )}

                    {/* Phone OTP Verification */}
                    {showPhoneOTP && !phoneVerified && (
                      <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
                        <form onSubmit={handlePhoneVerify} className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-800">
                            Enter verification code sent to <span className="text-blue-700">+1 {phoneDigits.length >= 10 ? `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6, 10)}` : phoneDigits}</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              value={phoneOTP}
                              onChange={(e) => setPhoneOTP(e.target.value.replace(/\D/g, ''))}
                              placeholder="000000"
                              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-xl tracking-[0.5em] font-semibold bg-white"
                              autoFocus
                            />
                            {phoneOTP.length === 6 && (
                              <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                              >
                                {loading ? (
                                  <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                  </span>
                                ) : (
                                  'Submit'
                                )}
                              </button>
                            )}
                          </div>
                          {fieldErrors.phoneOTP && (
                            <p className="text-sm text-red-600 font-medium">{fieldErrors.phoneOTP}</p>
                          )}
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* Password Field with Dynamic Validation - Only visible after phone verification */}
                {phoneVerified && (
                  <>
                    <div>
                      <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, password: e.target.value }))
                          }
                          placeholder="Enter your password"
                          className={`block w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            passwordValidation.show && !passwordValidation.valid
                              ? 'border-red-300 focus:ring-red-500' 
                              : passwordValidation.valid
                              ? 'border-green-400'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        />
                        {passwordValidation.valid && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        )}
                      </div>
                      
                      {/* Password Validation Indicator */}
                      {passwordValidation.show && (
                        <div className={`mt-3 p-4 rounded-xl transition-all duration-300 shadow-sm ${
                          passwordValidation.valid ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                        }`}>
                          <div className="space-y-2 text-sm">
                            <div className={`flex items-center gap-2 font-medium ${formData.password.length >= 8 && formData.password.length <= 12 ? 'text-green-700' : 'text-red-700'}`}>
                              {formData.password.length >= 8 && formData.password.length <= 12 ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <X className="w-4 h-4 text-red-600" />
                              )}
                              <span>8-12 characters</span>
                            </div>
                            <div className={`flex items-center gap-2 font-medium ${/[A-Z]/.test(formData.password) ? 'text-green-700' : 'text-red-700'}`}>
                              {/[A-Z]/.test(formData.password) ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <X className="w-4 h-4 text-red-600" />
                              )}
                              <span>Uppercase letter</span>
                            </div>
                            <div className={`flex items-center gap-2 font-medium ${/[a-z]/.test(formData.password) ? 'text-green-700' : 'text-red-700'}`}>
                              {/[a-z]/.test(formData.password) ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <X className="w-4 h-4 text-red-600" />
                              )}
                              <span>Lowercase letter</span>
                            </div>
                            <div className={`flex items-center gap-2 font-medium ${/[0-9]/.test(formData.password) ? 'text-green-700' : 'text-red-700'}`}>
                              {/[0-9]/.test(formData.password) ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <X className="w-4 h-4 text-red-600" />
                              )}
                              <span>Number</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password Field with Match Indicator */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                          }
                          placeholder="Confirm your password"
                          className={`block w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            confirmPasswordMatch.show && !confirmPasswordMatch.matches
                              ? 'border-red-300 focus:ring-red-500' 
                              : confirmPasswordMatch.matches
                              ? 'border-green-400'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        />
                        {confirmPasswordMatch.matches && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        )}
                      </div>
                      
                      {/* Password Match Indicator */}
                      {confirmPasswordMatch.show && (
                        <div className={`mt-3 p-3 rounded-xl transition-all duration-300 shadow-sm ${
                          confirmPasswordMatch.matches 
                            ? 'bg-green-50 border-2 border-green-200' 
                            : 'bg-red-50 border-2 border-red-200'
                        }`}>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            {confirmPasswordMatch.matches ? (
                              <>
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="text-green-700">Passwords match</span>
                              </>
                            ) : (
                              <>
                                <X className="w-5 h-5 text-red-600" />
                                <span className="text-red-700">Passwords do not match</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button - Only visible when password is valid */}
                    {passwordValidation.valid && (
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading || !emailVerified || !phoneVerified || !passwordValidation.valid}
                          className="w-full flex justify-center items-center py-3 px-6 rounded-full text-base text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          {loading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating account...
                            </span>
                          ) : (
                            'Create Account'
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
