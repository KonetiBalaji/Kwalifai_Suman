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

import { useState, type FormEvent } from 'react';
import PageShell from '../../../components/PageShell';
import CalculatorPageShell from '../../../components/calculators/CalculatorPageShell';
import ResultSummaryCards from '../../../components/calculators/ResultSummaryCards';
import EmptyState from '../../../components/calculators/EmptyState';
import ErrorState from '../../../components/calculators/ErrorState';
import Disclaimer from '../../../components/calculators/Disclaimer';
import TwoValueCompareBar from '../../../components/charts/TwoValueCompareBar';
import { calculateARMPayment } from '../../../lib/calculators/engine';

interface ARMFormState {
  loanAmount: string;
  initialRate: string;
  termInYears: string;
  maximumInterestRate: string;
  lifetimeRateCap: string;
}

interface FieldErrors {
  loanAmount?: string;
  initialRate?: string;
  termInYears?: string;
  maximumInterestRate?: string;
  lifetimeRateCap?: string;
}

export default function ARMCalculatorPage() {
  const [form, setForm] = useState<ARMFormState>({
    loanAmount: '',
    initialRate: '',
    termInYears: '30',
    maximumInterestRate: '10',
    lifetimeRateCap: '5',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [initialPayment, setInitialPayment] = useState<number | null>(null);
  const [maxPayment, setMaxPayment] = useState<number | null>(null);
  const [initialRate, setInitialRate] = useState<number | null>(null);
  const [maxRate, setMaxRate] = useState<number | null>(null);

  const handleChange = (field: keyof ARMFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setErrorMessage(null);
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    const loanAmount = Number(form.loanAmount);
    if (!form.loanAmount.trim()) {
      errors.loanAmount = 'Loan amount is required';
    } else if (Number.isNaN(loanAmount) || loanAmount <= 0) {
      errors.loanAmount = 'Enter a valid loan amount';
    }

    const initialRate = Number(form.initialRate);
    if (!form.initialRate.trim()) {
      errors.initialRate = 'Initial rate is required';
    } else if (Number.isNaN(initialRate) || initialRate <= 0) {
      errors.initialRate = 'Enter a valid interest rate';
    }

    const term = Number(form.termInYears);
    if (!form.termInYears.trim()) {
      errors.termInYears = 'Term is required';
    } else if (Number.isNaN(term) || term < 5 || term > 40) {
      errors.termInYears = 'Term should be between 5 and 40 years';
    }

    const maxRate = Number(form.maximumInterestRate);
    if (!form.maximumInterestRate.trim()) {
      errors.maximumInterestRate = 'Maximum rate is required';
    } else if (Number.isNaN(maxRate) || maxRate <= 0) {
      errors.maximumInterestRate = 'Enter a valid max rate';
    }

    const cap = Number(form.lifetimeRateCap);
    if (!form.lifetimeRateCap.trim()) {
      errors.lifetimeRateCap = 'Lifetime cap is required';
    } else if (Number.isNaN(cap) || cap < 0) {
      errors.lifetimeRateCap = 'Enter a valid cap amount';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const result = calculateARMPayment({
        loanAmount: Number(form.loanAmount),
        initialRate: Number(form.initialRate),
        termInYears: Number(form.termInYears),
        maximumInterestRate: Number(form.maximumInterestRate),
        lifetimeRateCap: Number(form.lifetimeRateCap),
      });

      setInitialPayment(result.initialPayment);
      setMaxPayment(result.maxPayment);
      setInitialRate(result.initialRate);
      setMaxRate(result.maxRate);
    } catch (error) {
      console.error('ARM calculation error:', error);
      setErrorMessage('Unable to calculate ARM payments. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const hasResults =
    initialPayment !== null &&
    maxPayment !== null &&
    initialRate !== null &&
    maxRate !== null;

  return (
    <PageShell>
      <CalculatorPageShell
        title="ARM Calculator"
        subtitle="Estimate how an adjustable-rate mortgage payment could change between the initial rate and a capped maximum rate."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Inputs */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Enter ARM details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Loan amount
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.loanAmount}
                  onChange={(e) => handleChange('loanAmount', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="400000"
                />
                {fieldErrors.loanAmount && (
                  <p className="text-xs text-red-600">{fieldErrors.loanAmount}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Initial rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    step={0.01}
                    value={form.initialRate}
                    onChange={(e) => handleChange('initialRate', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="5.75"
                  />
                  {fieldErrors.initialRate && (
                    <p className="text-xs text-red-600">
                      {fieldErrors.initialRate}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Term (years)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={40}
                    step={1}
                    value={form.termInYears}
                    onChange={(e) => handleChange('termInYears', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="30"
                  />
                  {fieldErrors.termInYears && (
                    <p className="text-xs text-red-600">
                      {fieldErrors.termInYears}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum interest rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    step={0.01}
                    value={form.maximumInterestRate}
                    onChange={(e) =>
                      handleChange('maximumInterestRate', e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="10.0"
                  />
                  {fieldErrors.maximumInterestRate && (
                    <p className="text-xs text-red-600">
                      {fieldErrors.maximumInterestRate}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Lifetime rate cap (% above start)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.25}
                    value={form.lifetimeRateCap}
                    onChange={(e) =>
                      handleChange('lifetimeRateCap', e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="5.0"
                  />
                  {fieldErrors.lifetimeRateCap && (
                    <p className="text-xs text-red-600">
                      {fieldErrors.lifetimeRateCap}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Calculating…' : 'Calculate ARM payments'}
              </button>
            </form>

            {errorMessage && (
              <div className="mt-4">
                <ErrorState message={errorMessage} />
              </div>
            )}
          </section>

          {/* Results & chart */}
          <section className="space-y-4">
            {hasResults ? (
              <>
                <ResultSummaryCards
                  items={[
                    {
                      label: 'Initial payment',
                      value: initialPayment !== null
                        ? `$${initialPayment.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}`
                        : '-',
                      helperText: `At the starting rate of ${initialRate?.toFixed(
                        3,
                      )}%.`,
                    },
                    {
                      label: 'Max payment (capped)',
                      value: maxPayment !== null
                        ? `$${maxPayment.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}`
                        : '-',
                      helperText: `If the rate rose to about ${maxRate?.toFixed(
                        3,
                      )}%.`,
                    },
                  ]}
                />

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Payment at start vs. capped maximum
                  </h3>
                  <TwoValueCompareBar
                    labelA="Initial payment"
                    labelB="Max capped payment"
                    valueA={initialPayment ?? 0}
                    valueB={maxPayment ?? 0}
                    valueFormatter={(v) =>
                      `$${v.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}`
                    }
                  />
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    What the caps mean
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 mb-2">
                    The maximum interest rate is the highest rate your ARM is
                    allowed to reach under the loan terms. The lifetime cap limits
                    how many percentage points your rate can increase above the
                    initial rate over the life of the loan.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700">
                    This calculator shows the payment at your starting rate and an
                    approximate payment if your rate ever hit that capped maximum.
                    Use the gap between these numbers to understand how much
                    headroom you need in your monthly budget.
                  </p>
                  <Disclaimer />
                </div>
              </>
            ) : (
              <EmptyState
                title="No ARM scenario calculated yet"
                description="Enter your loan amount, starting rate, and caps to see how your payment might change between the initial and worst-case capped rate."
              />
            )}
          </section>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
