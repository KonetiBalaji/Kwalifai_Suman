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
import {
  calculateMortgagePayment,
  calculateAmortizationSchedule,
} from '../../../lib/calculators/engine';

interface FormState {
  loanAmount: string;
  interestRate: string;
  termYears: string;
}

interface FieldErrors {
  loanAmount?: string;
  interestRate?: string;
  termYears?: string;
}

export default function PaymentCalculatorPage() {
  const [form, setForm] = useState<FormState>({
    loanAmount: '',
    interestRate: '',
    termYears: '30',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalPaid, setTotalPaid] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [balanceData, setBalanceData] = useState<
    { paymentNumber: number; balance: number }[]
  >([]);

  const handleChange = (field: keyof FormState, value: string) => {
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
    } else if (loanAmount < 10000 || loanAmount > 10000000) {
      errors.loanAmount = 'Loan amount should be between 10,000 and 10,000,000';
    }

    const interestRate = Number(form.interestRate);
    if (!form.interestRate.trim()) {
      errors.interestRate = 'Interest rate is required';
    } else if (Number.isNaN(interestRate)) {
      errors.interestRate = 'Enter a valid rate (e.g., 6.25)';
    } else if (interestRate <= 0 || interestRate > 25) {
      errors.interestRate = 'Rate should be between 0 and 25%';
    }

    const termYears = Number(form.termYears);
    if (!form.termYears.trim()) {
      errors.termYears = 'Term is required';
    } else if (Number.isNaN(termYears) || !Number.isInteger(termYears)) {
      errors.termYears = 'Enter a whole number of years';
    } else if (termYears < 5 || termYears > 40) {
      errors.termYears = 'Term should be between 5 and 40 years';
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
      const interestRate = Number(form.interestRate);
      const termYears = Number(form.termYears);

      const payment = calculateMortgagePayment(
        loanAmount,
        interestRate,
        termYears,
      );
      const amortization = calculateAmortizationSchedule(
        loanAmount,
        interestRate,
        termYears,
      );

      setMonthlyPayment(payment);
      setTotalPaid(amortization.summary.totalPaid);
      setTotalInterest(amortization.summary.totalInterest);

      const chartPoints = amortization.schedule.map((entry) => ({
        paymentNumber: entry.paymentNumber,
        balance: entry.balance,
      }));
      setBalanceData(chartPoints);
    } catch (error) {
      console.error('Payment calculation error:', error);
      setErrorMessage('Unable to run the calculation. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const hasResults =
    monthlyPayment !== null && totalPaid !== null && totalInterest !== null;

  return (
    <PageShell>
      <CalculatorPageShell
        title="Payment Calculator"
        subtitle="Estimate your monthly mortgage payment based on loan amount, interest rate, and term."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
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
                    step="0.01"
                    min={0}
                    value={form.interestRate}
                    onChange={(e) => handleChange('interestRate', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="6.25"
                  />
                  {fieldErrors.interestRate && (
                    <p className="text-xs text-red-600">{fieldErrors.interestRate}</p>
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

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Calculating…' : 'Calculate'}
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
                      label: 'Monthly payment',
                      value: monthlyPayment !== null
                        ? `$${monthlyPayment.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}`
                        : '-',
                      helperText: 'Principal & interest only',
                    },
                    {
                      label: 'Total paid over loan',
                      value: totalPaid !== null
                        ? `$${totalPaid.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}`
                        : '-',
                    },
                    {
                      label: 'Total interest paid',
                      value: totalInterest !== null
                        ? `$${totalInterest.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}`
                        : '-',
                    },
                  ]}
                />

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Balance over time
                  </h3>
                  <BalanceOverTimeLine
                    data={balanceData}
                    yAxisLabel="Balance"
                    height={260}
                  />
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    What this means
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    This estimate shows how much of your monthly payment goes toward
                    principal versus interest over time. A lower rate or shorter term
                    usually increases the payment but reduces total interest paid
                    over the life of the loan.
                  </p>
                  <Disclaimer />
                </div>
              </>
            ) : (
              <EmptyState
                title="No payment calculated yet"
                description="Fill in the loan details on the left and select Calculate to see your payment and balance chart."
              />
            )}
          </section>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
