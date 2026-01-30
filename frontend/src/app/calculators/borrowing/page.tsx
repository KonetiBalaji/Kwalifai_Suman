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
import PaymentComparisonBar from '../../../components/charts/PaymentComparisonBar';
import { calculateBorrowingCapacity } from '../../../lib/calculators/engine';

interface BorrowingFormState {
  grossMonthlyIncome: string;
  monthlyDebtPayment: string;
  interestRate: string;
  termInYears: string;
  downPaymentPercent: string;
}

interface FieldErrors {
  grossMonthlyIncome?: string;
  monthlyDebtPayment?: string;
  interestRate?: string;
  termInYears?: string;
  downPaymentPercent?: string;
}

export default function BorrowingCalculatorPage() {
  const [form, setForm] = useState<BorrowingFormState>({
    grossMonthlyIncome: '',
    monthlyDebtPayment: '',
    interestRate: '',
    termInYears: '30',
    downPaymentPercent: '20',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<
    ReturnType<typeof calculateBorrowingCapacity> | null
  >(null);

  const handleChange = (field: keyof BorrowingFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setErrorMessage(null);
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    const income = Number(form.grossMonthlyIncome);
    if (!form.grossMonthlyIncome.trim()) {
      errors.grossMonthlyIncome = 'Gross monthly income is required';
    } else if (Number.isNaN(income) || income <= 0) {
      errors.grossMonthlyIncome = 'Enter a valid income amount';
    }

    if (form.monthlyDebtPayment.trim()) {
      const debts = Number(form.monthlyDebtPayment);
      if (Number.isNaN(debts) || debts < 0) {
        errors.monthlyDebtPayment = 'Monthly debts must be zero or positive';
      }
    }

    const rate = Number(form.interestRate);
    if (!form.interestRate.trim()) {
      errors.interestRate = 'Interest rate is required';
    } else if (Number.isNaN(rate) || rate <= 0) {
      errors.interestRate = 'Enter a valid interest rate';
    } else if (rate > 25) {
      errors.interestRate = 'Rate should not exceed 25%';
    }

    const term = Number(form.termInYears);
    if (!form.termInYears.trim()) {
      errors.termInYears = 'Term is required';
    } else if (Number.isNaN(term) || term < 5 || term > 40) {
      errors.termInYears = 'Term should be between 5 and 40 years';
    }

    const dp = Number(form.downPaymentPercent);
    if (!form.downPaymentPercent.trim()) {
      errors.downPaymentPercent = 'Down payment percent is required';
    } else if (Number.isNaN(dp) || dp < 0 || dp >= 100) {
      errors.downPaymentPercent =
        'Down payment percent must be between 0 and 99';
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
      const calcResult = calculateBorrowingCapacity({
        grossMonthlyIncome: Number(form.grossMonthlyIncome),
        monthlyDebtPayment: form.monthlyDebtPayment.trim()
          ? Number(form.monthlyDebtPayment)
          : 0,
        interestRate: Number(form.interestRate),
        termInYears: Number(form.termInYears),
        downPaymentPercent: Number(form.downPaymentPercent),
      });

      setResult(calcResult);
    } catch (error) {
      console.error('Borrowing capacity calculation error:', error);
      setErrorMessage(
        'Unable to calculate borrowing capacity. Please check your inputs.',
      );
    } finally {
      setLoading(false);
    }
  };

  const hasResult = !!result;

  return (
    <PageShell>
      <CalculatorPageShell
        title="Borrowing Power Calculator"
        subtitle="Estimate how much home you can afford with conservative and more aggressive payment assumptions."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Inputs */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Enter income and loan assumptions
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Gross monthly income
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.grossMonthlyIncome}
                  onChange={(e) =>
                    handleChange('grossMonthlyIncome', e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="9000"
                />
                {fieldErrors.grossMonthlyIncome && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.grossMonthlyIncome}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Monthly debt payments
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.monthlyDebtPayment}
                  onChange={(e) =>
                    handleChange('monthlyDebtPayment', e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="1500"
                />
                {fieldErrors.monthlyDebtPayment && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.monthlyDebtPayment}
                  </p>
                )}
                <p className="text-[11px] text-gray-500">
                  Includes auto, credit cards, student loans, etc.
                </p>
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
                    value={form.interestRate}
                    onChange={(e) =>
                      handleChange('interestRate', e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="6.25"
                  />
                  {fieldErrors.interestRate && (
                    <p className="text-xs text-red-600">
                      {fieldErrors.interestRate}
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
                    onChange={(e) =>
                      handleChange('termInYears', e.target.value)
                    }
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

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Down payment (% of home price)
                </label>
                <input
                  type="number"
                  min={0}
                  max={99}
                  step={1}
                  value={form.downPaymentPercent}
                  onChange={(e) =>
                    handleChange('downPaymentPercent', e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="20"
                />
                {fieldErrors.downPaymentPercent && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.downPaymentPercent}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Calculating…' : 'Calculate borrowing power'}
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
                      label: 'Conservative max home price',
                      value: `$${result.conservative.maxHomePrice.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 0 },
                      )}`,
                      helperText: 'Based on ~28% front-end ratio.',
                    },
                    {
                      label: 'Aggressive max home price',
                      value: `$${result.aggressive.maxHomePrice.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 0 },
                      )}`,
                      helperText: 'Based on ~31% front-end ratio.',
                    },
                    {
                      label: 'Conservative payment',
                      value: `$${result.conservative.maxPayment.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}`,
                    },
                    {
                      label: 'Aggressive payment',
                      value: `$${result.aggressive.maxPayment.toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}`,
                    },
                  ]}
                />

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Max home price comparison
                  </h3>
                  <PaymentComparisonBar
                    data={[
                      {
                        name: 'Conservative',
                        payment: result.conservative.maxHomePrice,
                      },
                      {
                        name: 'Aggressive',
                        payment: result.aggressive.maxHomePrice,
                      },
                    ]}
                    yAxisLabel="Home price"
                  />
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    What this means
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    The conservative estimate keeps your housing costs closer to
                    traditional guidelines, leaving more room in your monthly budget.
                    The aggressive estimate stretches your payment higher, which may
                    be reasonable if your income or cash reserves are strong, but
                    leaves less cushion for surprises.
                  </p>
                  <Disclaimer />
                </div>
              </>
            ) : (
              <EmptyState
                title="No borrowing estimate yet"
                description="Enter your income, debts, and loan assumptions to see how much you might be able to borrow under different comfort levels."
              />
            )}
          </section>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
