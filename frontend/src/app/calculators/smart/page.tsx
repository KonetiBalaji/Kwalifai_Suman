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
import { calculateMultipleScenarios } from '../../../lib/calculators/engine';

interface SmartFormState {
  homePrice: string;
  downPayment: string;
}

interface ScenarioRow {
  type: string;
  rate: number;
  term: number;
  payment: number;
  totalInterest: number;
  totalPayments: number;
  note?: string;
}

export default function SmartCalculatorPage() {
  const [form, setForm] = useState<SmartFormState>({
    homePrice: '',
    downPayment: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{
    homePrice?: string;
    downPayment?: string;
  }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState<ScenarioRow[]>([]);
  const [minPaymentType, setMinPaymentType] = useState<string | null>(null);
  const [minInterestType, setMinInterestType] = useState<string | null>(null);

  const handleChange = (field: keyof SmartFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setErrorMessage(null);
  };

  const validate = (): boolean => {
    const errors: typeof fieldErrors = {};

    const homePrice = Number(form.homePrice);
    if (!form.homePrice.trim()) {
      errors.homePrice = 'Home price is required';
    } else if (Number.isNaN(homePrice) || homePrice <= 0) {
      errors.homePrice = 'Enter a valid home price';
    } else if (homePrice < 50000 || homePrice > 20000000) {
      errors.homePrice = 'Home price should be between 50,000 and 20,000,000';
    }

    if (form.downPayment.trim()) {
      const dp = Number(form.downPayment);
      if (Number.isNaN(dp) || dp < 0) {
        errors.downPayment = 'Down payment must be zero or positive';
      } else if (!Number.isNaN(homePrice) && dp >= homePrice) {
        errors.downPayment = 'Down payment must be less than home price';
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
      const homePrice = Number(form.homePrice);
      const downPayment = form.downPayment.trim()
        ? Number(form.downPayment)
        : 0;

      const result = calculateMultipleScenarios({
        loanAmount: homePrice,
        downPayment,
      });

      const sortedScenarios = result.scenarios;
      setRows(sortedScenarios);

      if (sortedScenarios.length > 0) {
        const minPaymentScenario = [...sortedScenarios].reduce((a, b) =>
          a.payment <= b.payment ? a : b,
        );
        const minInterestScenario = [...sortedScenarios].reduce((a, b) =>
          a.totalInterest <= b.totalInterest ? a : b,
        );
        setMinPaymentType(minPaymentScenario.type);
        setMinInterestType(minInterestScenario.type);
      } else {
        setMinPaymentType(null);
        setMinInterestType(null);
      }
    } catch (error) {
      console.error('Smart calculator error:', error);
      setErrorMessage('Unable to run the smart comparison. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasResults = rows.length > 0;

  return (
    <PageShell>
      <CalculatorPageShell
        title="Smart Calculator"
        subtitle="Compare multiple loan scenarios side by side to see how rate and term affect your payment and total cost."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Enter basic details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Home price
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.homePrice}
                  onChange={(e) => handleChange('homePrice', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="450000"
                />
                {fieldErrors.homePrice && (
                  <p className="text-xs text-red-600">{fieldErrors.homePrice}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Down payment
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.downPayment}
                  onChange={(e) => handleChange('downPayment', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="90000"
                />
                {fieldErrors.downPayment && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.downPayment}
                  </p>
                )}
                <p className="text-[11px] text-gray-500">
                  Optional. Used to compute the actual loan amount.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Calculating…' : 'Run Smart Comparison'}
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
                      label: 'Lowest monthly payment',
                      value: minPaymentType ?? '-',
                      helperText: 'Scenario with the smallest monthly payment.',
                    },
                    {
                      label: 'Lowest total interest',
                      value: minInterestType ?? '-',
                      helperText:
                        'Scenario that minimizes interest over the full term.',
                    },
                  ]}
                />

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Scenario comparison
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">
                            Scenario
                          </th>
                          <th className="px-4 py-2 text-right font-medium text-gray-600">
                            Rate
                          </th>
                          <th className="px-4 py-2 text-right font-medium text-gray-600">
                            Term
                          </th>
                          <th className="px-4 py-2 text-right font-medium text-gray-600">
                            Monthly payment
                          </th>
                          <th className="px-4 py-2 text-right font-medium text-gray-600">
                            Total interest
                          </th>
                          <th className="px-4 py-2 text-right font-medium text-gray-600">
                            Total payments
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {rows.map((scenario) => (
                          <tr key={scenario.type}>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                              {scenario.type}
                              {scenario.note && (
                                <span className="ml-1 text-[11px] text-gray-500">
                                  ({scenario.note})
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-right text-gray-700">
                              {scenario.rate.toFixed(2)}%
                            </td>
                            <td className="px-4 py-2 text-right text-gray-700">
                              {scenario.term} yrs
                            </td>
                            <td className="px-4 py-2 text-right text-gray-900 font-medium">
                              ${scenario.payment.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-4 py-2 text-right text-gray-700">
                              ${scenario.totalInterest.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-4 py-2 text-right text-gray-700">
                              ${scenario.totalPayments.toLocaleString(undefined, {
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
                    Monthly payment comparison
                  </h3>
                  <PaymentComparisonBar
                    data={rows.map((s) => ({
                      name: s.type,
                      payment: s.payment,
                    }))}
                    yAxisLabel="Monthly payment"
                  />
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    What this means
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    The lowest monthly payment usually comes from longer terms or
                    slightly higher rates, while the lowest total interest is
                    typically a shorter term or lower rate. Use this comparison to
                    decide whether a lower payment or a lower lifetime cost matters
                    more for your situation.
                  </p>
                  <Disclaimer />
                </div>
              </>
            ) : (
              <EmptyState
                title="No scenarios calculated yet"
                description="Enter a home price and optional down payment, then run the smart comparison to see multiple loan options side by side."
              />
            )}
          </section>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
