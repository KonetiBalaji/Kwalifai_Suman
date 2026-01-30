/**
 * @file RateAlertsList.tsx
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

import { FormEvent, useEffect, useState } from 'react';
import { apiClient, ApiClientError } from '../../lib/apiClient';

interface RateAlertsListProps {
  initialEmail?: string;
}

interface AlertRow {
  id: string;
  email: string;
  loanType: string;
  targetRate: number;
  status: string;
  createdAt: string;
}

interface GetAlertsResponse {
  alerts: AlertRow[];
  total: number;
}

export default function RateAlertsList({ initialEmail }: RateAlertsListProps) {
  const [email, setEmail] = useState(initialEmail || '');
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  useEffect(() => {
    if (initialEmail && !email) {
      setEmail(initialEmail);
    }
  }, [initialEmail, email]);

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setErrorMessage('Please enter an email address to view alerts.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const loadAlerts = async () => {
    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const data = await apiClient<GetAlertsResponse>(
        `/api/v1/rate-alerts?email=${encodeURIComponent(email.trim())}`,
        { method: 'GET' },
      );

      const sorted = [...data.alerts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setAlerts(sorted);

      if (sorted.length === 0) {
        setInfoMessage('No alerts found for this email yet.');
      }
    } catch (err) {
      const error = err as ApiClientError;
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await loadAlerts();
  };

  const handleDeactivate = async (id: string) => {
    setDeactivatingId(id);
    setErrorMessage(null);

    try {
      await apiClient(`/api/v1/rate-alerts/${id}`, {
        method: 'DELETE',
      });

      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id ? { ...alert, status: 'INACTIVE' } : alert,
        ),
      );
    } catch (err) {
      const error = err as ApiClientError;
      setErrorMessage(error.message);
    } finally {
      setDeactivatingId(null);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-7">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Your Alerts</h2>
      <p className="text-sm text-gray-600 mb-4">
        Check which alerts you&apos;ve set up for a specific email.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <label className="sr-only">Email to view alerts</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage(null);
              setInfoMessage(null);
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Email to view alerts"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center items-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          {loading ? 'Loading...' : 'Load Alerts'}
        </button>
      </form>

      {errorMessage && (
        <div className="mb-3 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </div>
      )}

      {infoMessage && alerts.length === 0 && (
        <div className="mb-3 rounded-md bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
          {infoMessage}
        </div>
      )}

      {alerts.length > 0 && (
        <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
          <div className="hidden md:grid grid-cols-5 gap-4 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
            <div>Loan type</div>
            <div>Target rate</div>
            <div>Status</div>
            <div>Created</div>
            <div className="text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-200">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="px-4 py-3 text-sm flex flex-col md:grid md:grid-cols-5 md:items-center gap-2"
              >
                <div className="font-medium text-gray-900">{alert.loanType}</div>
                <div className="text-gray-800">
                  {alert.targetRate.toFixed(2)}
                  <span className="text-xs text-gray-500 ml-1">%</span>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      alert.status === 'ACTIVE'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : alert.status === 'TRIGGERED'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
                <div className="text-gray-700">
                  {new Date(alert.createdAt).toLocaleDateString()}
                </div>
                <div className="flex md:justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeactivate(alert.id)}
                    disabled={deactivatingId === alert.id || alert.status === 'INACTIVE'}
                    className="inline-flex justify-center items-center rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {alert.status === 'INACTIVE'
                      ? 'Inactive'
                      : deactivatingId === alert.id
                      ? 'Deactivating...'
                      : 'Deactivate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && !errorMessage && !infoMessage && (
        <p className="mt-2 text-xs text-gray-500">
          Enter your email and select &quot;Load Alerts&quot; to see any existing alerts.
        </p>
      )}
    </div>
  );
}

