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
import { calculateRefinance } from '../../../lib/calculators/engine';

interface RefinanceFormState {
  currentBalance: string;
  currentRate: string;
  currentPayment: string;
  newRate: string;
  newTermYears: string;
  closingCosts: string;
}

interface FieldErrors {
  currentBalance?: string;
  currentRate?: string;
  currentPayment?: string;
  newRate?: string;
  newTermYears?: string;
  closingCosts?: string;
}

export default function RefinanceCalculatorPage() {
  const [form, setForm] = useState<RefinanceFormState>({
    currentBalance: '',
    currentRate: '',
    currentPayment: '',
    newRate: '',
    newTermYears: '30',
    closingCosts: '0',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<
    ReturnType<typeof calculateRefinance> | null
  >(null);

  const handleChange = (field: keyof RefinanceFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setErrorMessage(null);
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    const balance = Number(form.currentBalance);
    if (!form.currentBalance.trim()) {
      errors.currentBalance = 'Current balance is required';
    } else if (Number.isNaN(balance) || balance <= 0) {
      errors.currentBalance = 'Enter a valid current balance';
    }

    const currentRate = Number(form.currentRate);
    if (!form.currentRate.trim()) {
      errors.currentRate = 'Current rate is required';
    } else if (Number.isNaN(currentRate) || currentRate <= 0) {
      errors.currentRate = 'Enter a valid current rate';
    } else if (currentRate > 25) {
      errors.currentRate = 'Rate should not exceed 25%';
    }

    const currentPayment = Number(form.currentPayment);
    if (!form.currentPayment.trim()) {
      errors.currentPayment = 'Current payment is required';
    } else if (Number.isNaN(currentPayment) || currentPayment <= 0) {
      errors.currentPayment = 'Enter a valid current payment';
    }

    const newRate = Number(form.newRate);
    if (!form.newRate.trim()) {
      errors.newRate = 'New rate is required';
    } else if (Number.isNaN(newRate) || newRate <= 0) {
      errors.newRate = 'Enter a valid new rate';
    } else if (newRate > 25) {
      errors.newRate = 'Rate should not exceed 25%';
    }

    const term = Number(form.newTermYears);
    if (!form.newTermYears.trim()) {
      errors.newTermYears = 'New term is required';
    } else if (Number.isNaN(term) || term < 5 || term > 40) {
      errors.newTermYears = 'Term should be between 5 and 40 years';
    }

    if (form.closingCosts.trim()) {
      const cc = Number(form.closingCosts);
      if (Number.isNaN(cc) || cc < 0) {
        errors.closingCosts = 'Closing costs must be zero or positive';
      }
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
      const calcResult = calculateRefinance({
        currentBalance: Number(form.currentBalance),
        currentRate: Number(form.currentRate),
        currentPayment: Number(form.currentPayment),
        newRate: Number(form.newRate),
        newTermYears: Number(form.newTermYears),
        closingCosts: form.closingCosts.trim()
          ? Number(form.closingCosts)
          : 0,
      });

      setResult(calcResult);
    } catch (error) {
      console.error('Refinance calculation error:', error);
      setErrorMessage(
        'Unable to calculate refinance savings. Please check your inputs.',
      );
    } finally {
      setLoading(false);
    }
  };

  const hasResult = !!result;
  const breakEvenMonths = result?.savings.breakEvenMonths ?? 0;
  const monthlySavings = result?.savings.monthlyPaymentChange ?? 0;

  return (
    <PageShell>
      <CalculatorPageShell
        title="Refinance Calculator"
        subtitle="Compare your current mortgage to a new loan to see potential payment savings and break-even timing."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Inputs */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Enter current and new loan details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Current balance
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.currentBalance}
                  onChange={(e) =>
                    handleChange('currentBalance', e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="350000"
                />
                {fieldErrors.currentBalance && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.currentBalance}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Current rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    step={0.01}
                    value={form.currentRate}
                    onChange={(e) => handleChange('currentRate', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="6.25"
                  />
                  {fieldErrors.currentRate && (
                    <p className="text-xs text-red-600">
                      {fieldErrors.currentRate}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Current payment
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.currentPayment}
                    onChange={(e) =>
                      handleChange('currentPayment', e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="2200"
                  />
                  {fieldErrors.currentPayment && (
                    <p className="text-xs text-red-600">
                      {fieldErrors.currentPayment}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    New rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    step={0.01}
                    value={form.newRate}
                    onChange={(e) => handleChange('newRate', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="5.50"
                  />
                  {fieldErrors.newRate && (
                    <p className="text-xs text-red-600">{fieldErrors.newRate}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    New term (years)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={40}
                    step={1}
                    value={form.newTermYears}
                    onChange={(e) =>
                      handleChange('newTermYears', e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="30"
                  />
                  {fieldErrors.newTermYears && (
                    <p className="text-xs text-red-600">
                      {fieldErrors.newTermYears}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Closing costs (rolled into new loan)
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={form.closingCosts}
                  onChange={(e) =>
                    handleChange('closingCosts', e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="5000"
                />
                {fieldErrors.closingCosts && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.closingCosts}
                  </p>
                )}
                <p className="text-[11px] text-gray-500">
                  Estimated total of lender, title, and other refinance fees.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Calculating…' : 'Calculate refinance'}
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
                <div className="flex items-center justify-between gap-3">
                  <ResultSummaryCards
                    items={[
                      {
                        label: 'New payment',
                        value: `$${result.newLoan.newPayment.toLocaleString(
                          undefined,
                          { maximumFractionDigits: 2 },
                        )}`,
                        helperText: `At ${result.newLoan.newRate.toFixed(
                          3,
                        )}% for ${result.newLoan.termInYears} years.`,
                      },
                      {
                        label: 'Monthly savings',
                        value: `$${Math.abs(monthlySavings).toLocaleString(
                          undefined,
                          { maximumFractionDigits: 2 },
                        )}`,
                        helperText:
                          monthlySavings >= 0
                            ? 'Reduction vs current payment.'
                            : 'Increase vs current payment.',
                      },
                      {
                        label: 'Closing costs',
                        value: `$${result.savings.closingCosts.toLocaleString(
                          undefined,
                          { maximumFractionDigits: 0 },
                        )}`,
                      },
                      {
                        label: 'Break-even',
                        value:
                          breakEvenMonths > 0
                            ? `${breakEvenMonths} months`
                            : 'N/A',
                      },
                    ]}
                  />
                </div>

                {breakEvenMonths > 0 && monthlySavings > 0 && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Break-even in approximately {breakEvenMonths} months
                  </div>
                )}

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Current vs new payment
                  </h3>
                  <TwoValueCompareBar
                    labelA="Current payment"
                    labelB="New payment"
                    valueA={result.currentLoan.currentPayment}
                    valueB={result.newLoan.newPayment}
                    valueFormatter={(v) =>
                      `$${v.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}`
                    }
                  />
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    What this means
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 mb-1">
                    Monthly savings show how much your payment could drop after
                    refinancing. The break-even point estimates how many months of
                    savings it takes to recover the closing costs.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Refinancing can make sense if you plan to stay in the home longer
                    than the break-even period and if the lower payment or rate fits
                    your goals.
                  </p>
                  <Disclaimer />
                </div>
              </>
            ) : (
              <EmptyState
                title="No refinance scenario yet"
                description="Enter your current loan and proposed new loan details to see potential payment changes and break-even timing."
              />
            )}
          </section>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
