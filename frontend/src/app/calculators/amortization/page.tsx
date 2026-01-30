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
import BalanceOverTimeLine from '../../../components/charts/BalanceOverTimeLine';
import PrincipalInterestStacked from '../../../components/charts/PrincipalInterestStacked';
import { calculateAmortizationSchedule } from '../../../lib/calculators/engine';
import type { AmortizationResult } from '../../../lib/calculators/engine/types';

interface AmortizationFormState {
  loanAmount: string;
  rate: string;
  termYears: string;
  extraPayment: string;
}

interface FieldErrors {
  loanAmount?: string;
  rate?: string;
  termYears?: string;
  extraPayment?: string;
}

export default function AmortizationCalculatorPage() {
  const [form, setForm] = useState<AmortizationFormState>({
    loanAmount: '',
    rate: '',
    termYears: '30',
    extraPayment: '',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<AmortizationResult | null>(null);

  const handleChange = (field: keyof AmortizationFormState, value: string) => {
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

    const rate = Number(form.rate);
    if (!form.rate.trim()) {
      errors.rate = 'Rate is required';
    } else if (Number.isNaN(rate) || rate < 0) {
      errors.rate = 'Enter a valid interest rate';
    } else if (rate > 25) {
      errors.rate = 'Rate should not exceed 25%';
    }

    const term = Number(form.termYears);
    if (!form.termYears.trim()) {
      errors.termYears = 'Term is required';
    } else if (Number.isNaN(term) || term < 5 || term > 40) {
      errors.termYears = 'Term should be between 5 and 40 years';
    }

    if (form.extraPayment.trim()) {
      const extra = Number(form.extraPayment);
      if (Number.isNaN(extra) || extra < 0) {
        errors.extraPayment = 'Extra payment must be zero or positive';
      }
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
      const loanAmount = Number(form.loanAmount);
      const rate = Number(form.rate);
      const termYears = Number(form.termYears);
      const extraPayment = form.extraPayment.trim()
        ? Number(form.extraPayment)
        : 0;

      const resultValue = calculateAmortizationSchedule(
        loanAmount,
        rate,
        termYears,
        extraPayment,
      );

      setResult(resultValue);
    } catch (error) {
      console.error('Amortization calculation error:', error);
      setErrorMessage(
        'Unable to generate the amortization schedule. Please check your inputs.',
      );
    } finally {
      setLoading(false);
    }
  };

  const hasResult = !!result;
  const firstRows = result ? result.schedule.slice(0, 12) : [];

  const timeSavedMonths =
    result && result.originalTermMonths && result.actualTermMonths
      ? result.originalTermMonths - result.actualTermMonths
      : 0;

  return (
    <PageShell>
      <CalculatorPageShell
        title="Amortization Calculator"
        subtitle="See how each payment splits between principal and interest, and how extra payments can shorten your loan."
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
                    Interest rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    step={0.01}
                    value={form.rate}
                    onChange={(e) => handleChange('rate', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="6.25"
                  />
                  {fieldErrors.rate && (
                    <p className="text-xs text-red-600">{fieldErrors.rate}</p>
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
                    value={form.termYears}
                    onChange={(e) => handleChange('termYears', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="30"
                  />
                  {fieldErrors.termYears && (
                    <p className="text-xs text-red-600">{fieldErrors.termYears}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Extra payment (optional)
                </label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={form.extraPayment}
                  onChange={(e) => handleChange('extraPayment', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="200"
                />
                {fieldErrors.extraPayment && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.extraPayment}
                  </p>
                )}
                <p className="text-[11px] text-gray-500">
                  Applied each month in addition to the regular payment.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Calculating…' : 'Generate schedule'}
              </button>
            </form>

            {errorMessage && (
              <div className="mt-4">
                <ErrorState message={errorMessage} />
              </div>
            )}
          </section>

          {/* Results & charts */}
          <section className="space-y-4">
            {hasResult && result ? (
              <>
                <ResultSummaryCards
                  items={[
                    {
                      label: 'Total interest',
                      value: `$${result.summary.totalInterest.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}`,
                      helperText: 'Across the full life of the loan.',
                    },
                    {
                      label: 'Total paid',
                      value: `$${result.summary.totalPaid.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}`,
                      helperText: 'Principal plus interest.',
                    },
                    {
                      label: 'Months to payoff',
                      value: `${result.actualTermMonths} months`,
                      helperText:
                        timeSavedMonths > 0
                          ? `${timeSavedMonths} months faster than original term.`
                          : 'Same as original term.',
                    },
                  ]}
                />

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Balance over time
                  </h3>
                  <div className="h-64">
                    <BalanceOverTimeLine
                      data={result.schedule.map((row) => ({
                        paymentNumber: row.paymentNumber,
                        balance: row.balance,
                      }))}
                    />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Principal vs interest (first year)
                  </h3>
                  <div className="h-64">
                    <PrincipalInterestStacked
                      data={firstRows.map((row) => ({
                        paymentNumber: row.paymentNumber,
                        principal: row.principal,
                        interest: row.interest,
                      }))}
                    />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">
                      First 12 payments
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">
                            #
                          </th>
                          <th className="px-4 py-2 text-right font-medium text-gray-600">
                            Principal
                          </th>
                          <th className="px-4 py-2 text-right font-medium text-gray-600">
                            Interest
                          </th>
                          <th className="px-4 py-2 text-right font-medium text-gray-600">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {firstRows.map((row) => (
                          <tr key={row.paymentNumber}>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                              {row.paymentNumber}
                            </td>
                            <td className="px-4 py-2 text-right text-gray-700">
                              ${row.principal.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-4 py-2 text-right text-gray-700">
                              ${row.interest.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-4 py-2 text-right text-gray-900 font-medium">
                              ${row.balance.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    What this means
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Early payments are mostly interest, but over time more of each
                    payment goes toward principal and your balance drops faster.
                    Adding a consistent extra payment can reduce total interest and
                    shave months or even years off your loan term.
                  </p>
                  <Disclaimer />
                </div>
              </>
            ) : (
              <EmptyState
                title="No schedule generated yet"
                description="Enter your loan details and optional extra payment, then generate the schedule to see how your mortgage pays down over time."
              />
            )}
          </section>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
