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

import { useState, FormEvent, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [isEmail, setIsEmail] = useState(true);

  useEffect(() => {
    if (searchParams.get('verified') === 'true' || searchParams.get('passwordReset') === 'true') {
      // Show success message briefly
      setTimeout(() => {
        // Clear the query param
        router.replace('/login');
      }, 3000);
    }
  }, [searchParams, router]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.emailOrPhone.trim()) {
      errors.emailOrPhone = isEmail ? 'Email is required' : 'Phone is required';
    } else if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOrPhone)) {
      errors.emailOrPhone = 'Please enter a valid email address';
    } else if (!isEmail && !/^\+?[1-9]\d{1,14}$/.test(formData.emailOrPhone.replace(/\s/g, ''))) {
      errors.emailOrPhone = 'Please enter a valid phone number (e.g., +1234567890)';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const requestBody = isEmail
        ? { email: formData.emailOrPhone, password: formData.password }
        : { phone: formData.emailOrPhone.replace(/\s/g, ''), password: formData.password };

      const response = await fetch(`${API_GATEWAY_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          const errors: Record<string, string> = {};
          data.details.forEach((detail: { path: string; message: string }) => {
            const field = detail.path.replace(/\[|\]/g, '').split('.').pop() || '';
            errors[field] = detail.message;
          });
          setFieldErrors(errors);
          setError(data.error || 'Validation failed');
        } else {
          setError(data.error || data.message || 'Login failed. Please check your credentials.');
        }
        setLoading(false);
        return;
      }

      // Login successful - store access token and redirect
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        // Redirect to intended destination or home
        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setFormData((prev) => ({ ...prev, emailOrPhone: value }));
    // Auto-detect if it's email or phone
    if (value.includes('@')) {
      setIsEmail(true);
    } else if (value.startsWith('+') || /^\d/.test(value)) {
      setIsEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Column - Brand & Message (Facebook-style: brand top-left, one sentence below, vertically centered) */}
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

        {/* Right Column - Login Form (First on mobile, right side on desktop) */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-0 min-h-screen lg:min-h-0">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile: Show brand message below form */}
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
                Welcome back
              </h2>
              <p className="text-base text-gray-600">
                Sign in to continue to your account
              </p>
            </div>

            {/* Login Form Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm py-8 px-6 sm:px-10">
              {searchParams.get('verified') === 'true' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  Account verified successfully! Please sign in.
                </div>
              )}

              {searchParams.get('passwordReset') === 'true' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  Password reset successfully! Please sign in with your new password.
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="emailOrPhone" className="block text-sm text-gray-700 mb-2">
                    {isEmail ? 'Email Address' : 'Phone Number'}
                  </label>
                  <input
                    id="emailOrPhone"
                    type={isEmail ? 'email' : 'tel'}
                    required
                    value={formData.emailOrPhone}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={isEmail ? 'you@example.com' : '+1234567890'}
                    className={`block w-full px-4 py-3 border rounded-lg transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      fieldErrors.emailOrPhone 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {fieldErrors.emailOrPhone && (
                    <p className="mt-2 text-sm text-red-600">{fieldErrors.emailOrPhone}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm text-gray-700">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    placeholder="Enter your password"
                    className={`block w-full px-4 py-3 border rounded-lg transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      fieldErrors.password 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {fieldErrors.password && (
                    <p className="mt-2 text-sm text-red-600">{fieldErrors.password}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-6 rounded-full text-base text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    Create one now
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
