/**
 * @file RateAlertForm.tsx
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

import { FormEvent, useState } from 'react';
import { apiClient, ApiClientError } from '../../lib/apiClient';

interface RateAlertFormProps {
  onAlertCreatedEmail?: (email: string) => void;
}

interface CreateAlertResponse {
  success: boolean;
  alertId: string;
  message: string;
  targetRate: number;
  loanType: string;
  email: string;
}

const LOAN_TYPES = [
  '30-Year Fixed',
  '15-Year Fixed',
  'FHA',
  'VA',
  'ARM',
  'Jumbo',
  'USDA',
  '20-Year Fixed',
] as const;

const TIMEFRAMES = ['30 days', '60 days', '90 days', '180 days', '365 days'] as const;

function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function RateAlertForm({ onAlertCreatedEmail }: RateAlertFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    loanType: '',
    targetRate: '',
    timeframe: '90 days',
    loanAmount: '',
    propertyAddress: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.loanType) {
      errors.loanType = 'Loan type is required';
    }

    if (!formData.targetRate) {
      errors.targetRate = 'Target rate is required';
    } else {
      const rate = Number(formData.targetRate);
      if (Number.isNaN(rate)) {
        errors.targetRate = 'Target rate must be a number';
      } else if (rate < 0.5 || rate > 20) {
        errors.targetRate = 'Target rate must be between 0.5% and 20%';
      }
    }

    if (!TIMEFRAMES.includes(formData.timeframe as (typeof TIMEFRAMES)[number])) {
      errors.timeframe = 'Please select a valid timeframe';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    if (!validate()) {
      return;
    }

    setLoading(true);

    const idempotencyKey = generateIdempotencyKey();

    try {
      const payload: Record<string, unknown> = {
        email: formData.email.trim(),
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        loanType: formData.loanType,
        targetRate: Number(formData.targetRate),
        timeframe: formData.timeframe,
      };

      if (formData.loanAmount) {
        payload.loanAmount = Number(formData.loanAmount);
      }
      if (formData.propertyAddress.trim()) {
        payload.propertyAddress = formData.propertyAddress.trim();
      }

      const response = await apiClient<CreateAlertResponse>('/api/v1/rate-alerts', {
        method: 'POST',
        body: JSON.stringify(payload),
        idempotencyKey,
      });

      setSuccessMessage(response.message || 'Rate alert created successfully.');
      if (onAlertCreatedEmail) {
        onAlertCreatedEmail(response.email);
      }
    } catch (err) {
      const error = err as ApiClientError;
      setErrorMessage(error.message);

      // Map validation details to field errors if present
      if (error.details && Array.isArray(error.details)) {
        const errors: Record<string, string> = {};
        (error.details as Array<{ path?: (string | number)[]; message: string }>).forEach(
          (detail) => {
            const path = (detail.path || []).join('.');
            const field = path.split('.').pop() || '';
            if (field) {
              errors[field] = detail.message;
            }
          },
        );
        setFieldErrors(errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-7">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Create Rate Alert</h2>
      <p className="text-sm text-gray-600 mb-6">
        Tell us your target rate and we&apos;ll let you know when the market hits it.
      </p>

      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="you@example.com"
          />
          {fieldErrors.email && <p className="text-xs text-red-600">{fieldErrors.email}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">First name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Jane"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Last name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Smith"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="+1 555 000 1234"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Loan type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.loanType}
            onChange={(e) => handleChange('loanType', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="">Select loan type</option>
            {LOAN_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {fieldErrors.loanType && (
            <p className="text-xs text-red-600">{fieldErrors.loanType}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Target rate (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.5"
              max="20"
              value={formData.targetRate}
              onChange={(e) => handleChange('targetRate', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="6.25"
            />
            {fieldErrors.targetRate && (
              <p className="text-xs text-red-600">{fieldErrors.targetRate}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Timeframe</label>
            <select
              value={formData.timeframe}
              onChange={(e) => handleChange('timeframe', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {TIMEFRAMES.map((tf) => (
                <option key={tf} value={tf}>
                  {tf}
                </option>
              ))}
            </select>
            {fieldErrors.timeframe && (
              <p className="text-xs text-red-600">{fieldErrors.timeframe}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Loan amount</label>
          <input
            type="number"
            min="0"
            value={formData.loanAmount}
            onChange={(e) => handleChange('loanAmount', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="400000"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Property address</label>
          <textarea
            value={formData.propertyAddress}
            onChange={(e) => handleChange('propertyAddress', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={2}
            placeholder="Street, city, state (optional)"
          />
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center items-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? 'Creating alert...' : 'Create Alert'}
          </button>
          <p className="text-xs text-gray-500 text-center">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </form>
    </div>
  );
}

