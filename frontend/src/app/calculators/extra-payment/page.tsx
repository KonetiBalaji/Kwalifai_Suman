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
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PageShell from '../../../components/PageShell';
import CalculatorPageShell from '../../../components/calculators/CalculatorPageShell';
import ResultSummaryCards from '../../../components/calculators/ResultSummaryCards';
import EmptyState from '../../../components/calculators/EmptyState';
import ErrorState from '../../../components/calculators/ErrorState';
import Disclaimer from '../../../components/calculators/Disclaimer';
import {
  calculateAmortizationSchedule,
  calculateExtraPaymentImpact,
} from '../../../lib/calculators/engine';
import type { AmortizationResult } from '../../../lib/calculators/engine/types';

interface ExtraPaymentFormState {
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

interface ComparisonPoint {
  paymentNumber: number;
  withoutExtra: number;
  withExtra: number;
}

export default function ExtraPaymentCalculatorPage() {
  const [form, setForm] = useState<ExtraPaymentFormState>({
    loanAmount: '',
    rate: '',
    termYears: '30',
    extraPayment: '',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [impactResult, setImpactResult] =
    useState<ReturnType<typeof calculateExtraPaymentImpact> | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonPoint[]>([]);

  const handleChange = (field: keyof ExtraPaymentFormState, value: string) => {
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

    const extra = Number(form.extraPayment);
    if (!form.extraPayment.trim()) {
      errors.extraPayment = 'Extra payment is required';
    } else if (Number.isNaN(extra) || extra <= 0) {
      errors.extraPayment = 'Extra payment must be a positive number';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildComparisonData = (
    withoutExtra: AmortizationResult,
    withExtra: AmortizationResult,
  ): ComparisonPoint[] => {
    const scheduleA = withoutExtra.schedule;
    const scheduleB = withExtra.schedule;
    const maxLen = Math.max(scheduleA.length, scheduleB.length);

    const data: ComparisonPoint[] = [];
    for (let i = 0; i < maxLen; i += 1) {
      const a = scheduleA[i] ?? scheduleA[scheduleA.length - 1];
      const b = scheduleB[i] ?? scheduleB[scheduleB.length - 1];
      data.push({
        paymentNumber: i + 1,
        withoutExtra: a ? a.balance : 0,
        withExtra: b ? b.balance : 0,
      });
    }

    return data;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const loanAmount = Number(form.loanAmount);
      const rate = Number(form.rate);
      const termYears = Number(form.termYears);
      const extraPayment = Number(form.extraPayment);

      const impact = calculateExtraPaymentImpact(
        loanAmount,
        rate,
        termYears,
        extraPayment,
      );
      setImpactResult(impact);

      const scheduleWithout = calculateAmortizationSchedule(
        loanAmount,
        rate,
        termYears,
        0,
      );
      const scheduleWith = calculateAmortizationSchedule(
        loanAmount,
        rate,
        termYears,
        extraPayment,
      );

      setComparisonData(buildComparisonData(scheduleWithout, scheduleWith));
    } catch (error) {
      console.error('Extra payment calculation error:', error);
      setErrorMessage(
        'Unable to calculate extra payment impact. Please check your inputs.',
      );
    } finally {
      setLoading(false);
    }
  };

  const hasResult = !!impactResult && comparisonData.length > 0;

  return (
    <PageShell>
      <CalculatorPageShell
        title="Extra Payment Impact"
        subtitle="See how adding a fixed extra amount to each payment can reduce total interest and shorten your loan term."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Inputs */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Enter loan and extra payment
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
                  Extra payment per month
                </label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={form.extraPayment}
                  onChange={(e) =>
                    handleChange('extraPayment', e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="200"
                />
                {fieldErrors.extraPayment && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.extraPayment}
                  </p>
                )}
                <p className="text-[11px] text-gray-500">
                  Added on top of your regular monthly payment.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Calculating…' : 'Calculate impact'}
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
            {hasResult && impactResult ? (
              <>
                <ResultSummaryCards
                  items={[
                    {
                      label: 'Interest saved',
                      value: `$${impactResult.savings.interestSaved.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}`,
                      helperText: 'Compared to making no extra payments.',
                    },
                    {
                      label: 'Time saved',
                      value: impactResult.savings.timeSaved,
                      helperText: 'Earlier payoff vs original schedule.',
                    },
                    {
                      label: 'Payment without extra',
                      value: `$${impactResult.withoutExtraPayment.monthlyPayment.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}`,
                    },
                    {
                      label: 'Payment with extra',
                      value: `$${impactResult.withExtraPayment.monthlyPayment.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}`,
                    },
                  ]}
                />

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Balance over time (with and without extra)
                  </h3>
                  <div className="h-64">
                    <div className="w-full h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={comparisonData}
                          margin={{ top: 12, right: 16, bottom: 8, left: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E5E7EB"
                          />
                          <XAxis
                            dataKey="paymentNumber"
                            tickLine={false}
                            axisLine={{ stroke: '#E5E7EB' }}
                            tick={{ fontSize: 11, fill: '#6B7280' }}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={{ stroke: '#E5E7EB' }}
                            tick={{ fontSize: 11, fill: '#6B7280' }}
                            tickFormatter={(v) => `$${v.toLocaleString()}`}
                          />
                          <Tooltip
                            cursor={{ stroke: '#CBD5F5', strokeWidth: 1 }}
                            contentStyle={{
                              fontSize: 12,
                              borderRadius: 8,
                              borderColor: '#E5E7EB',
                            }}
                            formatter={(value: number, name: string) => [
                              `$${value.toLocaleString()}`,
                              name === 'withoutExtra'
                                ? 'Balance without extra'
                                : 'Balance with extra',
                            ]}
                            labelFormatter={(label: number) =>
                              `Payment #${label}`
                            }
                          />
                          <Line
                            type="monotone"
                            dataKey="withoutExtra"
                            stroke="#2563EB"
                            strokeWidth={2}
                            dot={false}
                            name="withoutExtra"
                          />
                          <Line
                            type="monotone"
                            dataKey="withExtra"
                            stroke="#F97316"
                            strokeWidth={2}
                            dot={false}
                            name="withExtra"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    What this means
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Even a modest extra payment each month can pull your payoff date
                    forward and reduce the total interest paid. The orange line shows
                    how your balance falls faster with extra payments compared to
                    the standard schedule.
                  </p>
                  <Disclaimer />
                </div>
              </>
            ) : (
              <EmptyState
                title="No extra payment scenario yet"
                description="Enter your loan details and a monthly extra payment to see how much interest and time you could save."
              />
            )}
          </section>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
