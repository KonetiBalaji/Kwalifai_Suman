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

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_GATEWAY_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
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
          setError(data.error || data.message || 'Failed to send reset code. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Success - show message and redirect to reset password page
      setSuccess(true);
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
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

        {/* Right Column - Forgot Password Form (First on mobile, right side on desktop) */}
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
                Reset your password
              </h2>
              <p className="text-base text-gray-600">
                Enter your email address and we'll send you a reset code
              </p>
            </div>

            {/* Forgot Password Form Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm py-8 px-6 sm:px-10">
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  If an account exists with this email, a password reset code has been sent. Redirecting...
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {!success && (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`block w-full px-4 py-3 border rounded-lg transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        fieldErrors.email 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>
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
                          Sending...
                        </span>
                      ) : (
                        'Send Reset Code'
                      )}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
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
