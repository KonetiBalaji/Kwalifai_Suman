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
import { compare15vs30Year } from '../../../lib/calculators/engine';

interface FifteenVsThirtyFormState {
  loanAmount: string;
  rate15: string;
  rate30: string;
}

interface FieldErrors {
  loanAmount?: string;
  rate15?: string;
  rate30?: string;
}

export default function FifteenVsThirtyCalculatorPage() {
  const [form, setForm] = useState<FifteenVsThirtyFormState>({
    loanAmount: '',
    rate15: '',
    rate30: '',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<
    ReturnType<typeof compare15vs30Year> | null
  >(null);

  const handleChange = (field: keyof FifteenVsThirtyFormState, value: string) => {
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

    const r15 = Number(form.rate15);
    if (!form.rate15.trim()) {
      errors.rate15 = '15-year rate is required';
    } else if (Number.isNaN(r15) || r15 <= 0) {
      errors.rate15 = 'Enter a valid 15-year rate';
    } else if (r15 > 25) {
      errors.rate15 = 'Rate should not exceed 25%';
    }

    const r30 = Number(form.rate30);
    if (!form.rate30.trim()) {
      errors.rate30 = '30-year rate is required';
    } else if (Number.isNaN(r30) || r30 <= 0) {
      errors.rate30 = 'Enter a valid 30-year rate';
    } else if (r30 > 25) {
      errors.rate30 = 'Rate should not exceed 25%';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const loanAmount = Number(form.loanAmount);
      const rate15 = Number(form.rate15);
      const rate30 = Number(form.rate30);

      const calcResult = compare15vs30Year(loanAmount, rate15, rate30);
      setResult(calcResult);
    } catch (error) {
      console.error('15 vs 30 calculation error:', error);
      setErrorMessage(
        'Unable to compare 15 vs 30 year options. Please check your inputs.',
      );
    } finally {
      setLoading(false);
    }
  };

  const hasResult = !!result;

  return (
    <PageShell>
      <CalculatorPageShell
        title="15-Year vs 30-Year"
        subtitle="Compare monthly payments and total interest between 15-year and 30-year mortgages."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Inputs */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Enter loan details
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
                  placeholder="350000"
                />
                {fieldErrors.loanAmount && (
                  <p className="text-xs text-red-600">{fieldErrors.loanAmount}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    15-year rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    step={0.01}
                    value={form.rate15}
                    onChange={(e) => handleChange('rate15', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="5.75"
                  />
                  {fieldErrors.rate15 && (
                    <p className="text-xs text-red-600">{fieldErrors.rate15}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    30-year rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    step={0.01}
                    value={form.rate30}
                    onChange={(e) => handleChange('rate30', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="6.25"
                  />
                  {fieldErrors.rate30 && (
                    <p className="text-xs text-red-600">{fieldErrors.rate30}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Calculating…' : 'Compare 15 vs 30'}
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
            {hasResult && result ? (
              <>
                <ResultSummaryCards
                  items={[
                    {
                      label: '15-year payment',
                      value: `$${result.fifteenYear.monthlyPayment.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}`,
                      helperText: 'Higher payment, faster payoff.',
                    },
                    {
                      label: '30-year payment',
                      value: `$${result.thirtyYear.monthlyPayment.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}`,
                      helperText: 'Lower payment, longer payoff.',
                    },
                    {
                      label: 'Total interest (15-year)',
                      value: `$${result.fifteenYear.totalInterest.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 0 },
                      )}`,
                    },
                    {
                      label: 'Total interest (30-year)',
                      value: `$${result.thirtyYear.totalInterest.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 0 },
                      )}`,
                    },
                  ]}
                />

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Total interest comparison
                  </h3>
                  <TwoValueCompareBar
                    labelA="15-year total interest"
                    labelB="30-year total interest"
                    valueA={result.fifteenYear.totalInterest}
                    valueB={result.thirtyYear.totalInterest}
                    valueFormatter={(v) =>
                      `$${v.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}`
                    }
                  />
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    What this means
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    A 15-year loan usually comes with a higher monthly payment but
                    dramatically less interest over the life of the loan. A 30-year
                    loan frees up more cash each month but costs more in total
                    interest.
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-gray-700">
                    Use this comparison to decide whether lower monthly cashflow or
                    lower lifetime interest is more important for your situation.
                  </p>
                  <Disclaimer />
                </div>
              </>
            ) : (
              <EmptyState
                title="No comparison yet"
                description="Enter your loan amount and rates for 15-year and 30-year options to compare payments and total interest."
              />
            )}
          </section>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
