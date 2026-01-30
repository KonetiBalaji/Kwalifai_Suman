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
import {
  calculateRateBuydown,
  calculatePermanentBuydown,
  calculateTemporaryBuydown,
} from '../../../lib/calculators/engine';
import BalanceOverTimeLine from '../../../components/charts/BalanceOverTimeLine';

type BuydownMode = 'permanent' | 'temporary';

interface PermanentFormState {
  loanAmount: string;
  originalRate: string;
  termYears: string;
  points: string;
}

interface TemporaryFormState {
  loanAmount: string;
  originalRate: string;
  termYears: string;
  structure: '3-2-1' | '2-1' | '1-1' | '1-0';
}

interface FieldErrors {
  loanAmount?: string;
  originalRate?: string;
  termYears?: string;
  points?: string;
}

export default function BuydownCalculatorPage() {
  const [mode, setMode] = useState<BuydownMode>('permanent');

  const [permanentForm, setPermanentForm] = useState<PermanentFormState>({
    loanAmount: '',
    originalRate: '',
    termYears: '30',
    points: '1',
  });

  const [temporaryForm, setTemporaryForm] = useState<TemporaryFormState>({
    loanAmount: '',
    originalRate: '',
    termYears: '30',
    structure: '3-2-1',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [permanentResult, setPermanentResult] = useState<
    ReturnType<typeof calculatePermanentBuydown> | null
  >(null);

  const [temporaryResult, setTemporaryResult] = useState<
    ReturnType<typeof calculateTemporaryBuydown> | null
  >(null);

  const handleModeChange = (nextMode: BuydownMode) => {
    setMode(nextMode);
    setErrorMessage(null);
    setFieldErrors({});
  };

  const handlePermanentChange = (
    field: keyof PermanentFormState,
    value: string,
  ) => {
    setPermanentForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setErrorMessage(null);
  };

  const handleTemporaryChange = (
    field: keyof TemporaryFormState,
    value: string,
  ) => {
    setTemporaryForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setErrorMessage(null);
  };

  const validatePermanent = (): boolean => {
    const errors: FieldErrors = {};

    const loanAmount = Number(permanentForm.loanAmount);
    if (!permanentForm.loanAmount.trim()) {
      errors.loanAmount = 'Loan amount is required';
    } else if (Number.isNaN(loanAmount) || loanAmount <= 0) {
      errors.loanAmount = 'Enter a valid loan amount';
    }

    const rate = Number(permanentForm.originalRate);
    if (!permanentForm.originalRate.trim()) {
      errors.originalRate = 'Original rate is required';
    } else if (Number.isNaN(rate) || rate <= 0) {
      errors.originalRate = 'Enter a valid interest rate';
    }

    const term = Number(permanentForm.termYears);
    if (!permanentForm.termYears.trim()) {
      errors.termYears = 'Term is required';
    } else if (Number.isNaN(term) || term < 5 || term > 40) {
      errors.termYears = 'Term should be between 5 and 40 years';
    }

    const points = Number(permanentForm.points);
    if (!permanentForm.points.trim()) {
      errors.points = 'Points are required';
    } else if (Number.isNaN(points) || points < 0 || points > 5) {
      errors.points = 'Points should be between 0 and 5';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateTemporary = (): boolean => {
    const errors: FieldErrors = {};

    const loanAmount = Number(temporaryForm.loanAmount);
    if (!temporaryForm.loanAmount.trim()) {
      errors.loanAmount = 'Loan amount is required';
    } else if (Number.isNaN(loanAmount) || loanAmount <= 0) {
      errors.loanAmount = 'Enter a valid loan amount';
    }

    const rate = Number(temporaryForm.originalRate);
    if (!temporaryForm.originalRate.trim()) {
      errors.originalRate = 'Original rate is required';
    } else if (Number.isNaN(rate) || rate <= 0) {
      errors.originalRate = 'Enter a valid interest rate';
    }

    const term = Number(temporaryForm.termYears);
    if (!temporaryForm.termYears.trim()) {
      errors.termYears = 'Term is required';
    } else if (Number.isNaN(term) || term < 5 || term > 40) {
      errors.termYears = 'Term should be between 5 and 40 years';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'permanent') {
      if (!validatePermanent()) return;
    } else if (!validateTemporary()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === 'permanent') {
        const result = calculateRateBuydown({
          buydownType: 'permanent',
          loanAmount: Number(permanentForm.loanAmount),
          originalRate: Number(permanentForm.originalRate),
          termYears: Number(permanentForm.termYears),
          permanentPoints: Number(permanentForm.points),
        });

        if (result.buydownType === 'permanent') {
          setPermanentResult(result);
          setTemporaryResult(null);
        }
      } else {
        const result = calculateRateBuydown({
          buydownType: 'temporary',
          loanAmount: Number(temporaryForm.loanAmount),
          originalRate: Number(temporaryForm.originalRate),
          termYears: Number(temporaryForm.termYears),
          temporaryBuydownStructure: temporaryForm.structure,
        });

        if (result.buydownType === 'temporary') {
          setTemporaryResult(result);
          setPermanentResult(null);
        }
      }
    } catch (error) {
      console.error('Buydown calculation error:', error);
      setErrorMessage('Unable to calculate buydown. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const hasPermanentResult = !!permanentResult && mode === 'permanent';
  const hasTemporaryResult = !!temporaryResult && mode === 'temporary';

  return (
    <PageShell>
      <CalculatorPageShell
        title="Rate Buydown Calculator"
        subtitle="Compare permanent and temporary rate buydowns to understand upfront cost, payment savings, and break-even timing."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Choose buydown type
              </h2>
              <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleModeChange('permanent')}
                  className={`px-3 py-1.5 rounded-md font-medium ${
                    mode === 'permanent'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Permanent
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('temporary')}
                  className={`px-3 py-1.5 rounded-md font-medium ${
                    mode === 'temporary'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Temporary
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'permanent' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Loan amount
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={permanentForm.loanAmount}
                      onChange={(e) =>
                        handlePermanentChange('loanAmount', e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="400000"
                    />
                    {fieldErrors.loanAmount && (
                      <p className="text-xs text-red-600">
                        {fieldErrors.loanAmount}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Original rate (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        step={0.01}
                        value={permanentForm.originalRate}
                        onChange={(e) =>
                          handlePermanentChange('originalRate', e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="6.5"
                      />
                      {fieldErrors.originalRate && (
                        <p className="text-xs text-red-600">
                          {fieldErrors.originalRate}
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
                        value={permanentForm.termYears}
                        onChange={(e) =>
                          handlePermanentChange('termYears', e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="30"
                      />
                      {fieldErrors.termYears && (
                        <p className="text-xs text-red-600">
                          {fieldErrors.termYears}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Points
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.25}
                      value={permanentForm.points}
                      onChange={(e) =>
                        handlePermanentChange('points', e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="1.0"
                    />
                    {fieldErrors.points && (
                      <p className="text-xs text-red-600">
                        {fieldErrors.points}
                      </p>
                    )}
                    <p className="text-[11px] text-gray-500">
                      Each point typically reduces the rate by about 0.25% and
                      costs 1% of the loan amount.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Loan amount
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={temporaryForm.loanAmount}
                      onChange={(e) =>
                        handleTemporaryChange('loanAmount', e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="400000"
                    />
                    {fieldErrors.loanAmount && (
                      <p className="text-xs text-red-600">
                        {fieldErrors.loanAmount}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Original rate (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        step={0.01}
                        value={temporaryForm.originalRate}
                        onChange={(e) =>
                          handleTemporaryChange('originalRate', e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="6.5"
                      />
                      {fieldErrors.originalRate && (
                        <p className="text-xs text-red-600">
                          {fieldErrors.originalRate}
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
                        value={temporaryForm.termYears}
                        onChange={(e) =>
                          handleTemporaryChange('termYears', e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="30"
                      />
                      {fieldErrors.termYears && (
                        <p className="text-xs text-red-600">
                          {fieldErrors.termYears}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Structure
                    </label>
                    <select
                      value={temporaryForm.structure}
                      onChange={(e) =>
                        handleTemporaryChange(
                          'structure',
                          e.target.value as TemporaryFormState['structure'],
                        )
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="3-2-1">3-2-1 buydown</option>
                      <option value="2-1">2-1 buydown</option>
                      <option value="1-1">1-1 buydown</option>
                      <option value="1-0">1-0 buydown</option>
                    </select>
                    <p className="text-[11px] text-gray-500">
                      Shows how your rate and payment step up each year during the
                      buydown period.
                    </p>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Calculating…' : 'Calculate buydown'}
              </button>
            </form>

            {errorMessage && (
              <div className="mt-4">
                <ErrorState message={errorMessage} />
              </div>
            )}
          </section>

          {/* Results */}
          <section className="space-y-4">
            {hasPermanentResult && permanentResult ? (
              <>
                <ResultSummaryCards
                  items={[
                    {
                      label: 'New rate',
                      value: `${permanentResult.newRate.toFixed(3)}%`,
                      helperText: `From ${permanentResult.originalRate.toFixed(
                        3,
                      )}% with ${permanentResult.points} points.`,
                    },
                    {
                      label: 'Monthly savings',
                      value: `$${permanentResult.monthlySavings.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}`,
                      helperText: 'Difference between original and new payment.',
                    },
                    {
                      label: 'Points cost',
                      value: `$${permanentResult.pointsCost.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}`,
                      helperText: 'Upfront cost to lower your rate.',
                    },
                    {
                      label: 'Break-even time',
                      value: permanentResult.breakEvenTime,
                      helperText: 'How long it takes for savings to cover cost.',
                    },
                  ]}
                />

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    What this means
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    A permanent buydown trades upfront cash for a lower fixed rate.
                    If you expect to keep the loan longer than the break-even
                    period, the total interest savings can outweigh the points you
                    pay today.
                  </p>
                  <Disclaimer />
                </div>
              </>
            ) : null}

            {hasTemporaryResult && temporaryResult ? (
              <>
                <ResultSummaryCards
                  items={[
                    {
                      label: 'Original payment',
                      value: `$${temporaryResult.originalPayment.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}`,
                    },
                    {
                      label: 'Total buydown cost',
                      value: `$${temporaryResult.totalBuydownCost.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}`,
                      helperText: 'Approximate subsidy across buydown years.',
                    },
                    {
                      label: 'Total savings',
                      value: `$${temporaryResult.totalSavings.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}`,
                      helperText: 'Payment reduction during the buydown period.',
                    },
                    {
                      label: 'Buydown period',
                      value: temporaryResult.summary.buydownPeriod,
                      helperText: temporaryResult.summary.paidBy,
                    },
                  ]}
                />

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Year-by-year breakdown
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">
                            Year
                          </th>
                          <th className="px-4 py-2 text-right font-medium text-gray-600">
                            Effective rate
                          </th>
                          <th className="px-4 py-2 text-right font-medium text-gray-600">
                            Monthly payment
                          </th>
                          <th className="px-4 py-2 text-right font-medium text-gray-600">
                            Monthly savings
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {temporaryResult.yearlyBreakdown.map((row) => (
                          <tr key={row.year}>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                              Year {row.year}
                            </td>
                            <td className="px-4 py-2 text-right text-gray-700">
                              {row.effectiveRate.toFixed(3)}%
                            </td>
                            <td className="px-4 py-2 text-right text-gray-900 font-medium">
                              ${row.monthlyPayment.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-4 py-2 text-right text-gray-700">
                              ${row.monthlySavings.toLocaleString(undefined, {
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
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Effective rate over time
                  </h3>
                  <div className="h-64">
                    <BalanceOverTimeLine
                      data={temporaryResult.yearlyBreakdown.map((row) => ({
                        paymentNumber: row.year,
                        balance: row.effectiveRate,
                      }))}
                    />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    What this means
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    A temporary buydown lowers your payment for the first few years,
                    then steps back up to the full rate. It can ease the first years
                    of ownership while you plan for income growth or a potential
                    refinance.
                  </p>
                  <Disclaimer />
                </div>
              </>
            ) : null}

            {!hasPermanentResult && !hasTemporaryResult && (
              <EmptyState
                title="No buydown calculated yet"
                description="Choose permanent or temporary, enter your loan details, and run the calculation to see how a buydown changes your rate and payment."
              />
            )}
          </section>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
