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
import { calculateDTOI } from '../../../lib/calculators/engine';

interface DTOIFormState {
  grossMonthlyIncome: string;
  monthlyDebtPayments: string;
  proposedHousingPayment: string;
  propertyTaxes: string;
  homeInsurance: string;
  mortgageInsurance: string;
  hoaFees: string;
}

interface FieldErrors {
  grossMonthlyIncome?: string;
  monthlyDebtPayments?: string;
  proposedHousingPayment?: string;
}

export default function DTOICalculatorPage() {
  const [form, setForm] = useState<DTOIFormState>({
    grossMonthlyIncome: '',
    monthlyDebtPayments: '',
    proposedHousingPayment: '',
    propertyTaxes: '',
    homeInsurance: '',
    mortgageInsurance: '',
    hoaFees: '',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [frontEndRatio, setFrontEndRatio] = useState<number | null>(null);
  const [backEndRatio, setBackEndRatio] = useState<number | null>(null);
  const [qualification, setQualification] = useState<string | null>(null);
  const [qualificationMessage, setQualificationMessage] = useState<string | null>(null);
  const [maxHousingPayment28, setMaxHousingPayment28] = useState<number | null>(null);
  const [maxTotalDebt36, setMaxTotalDebt36] = useState<number | null>(null);

  const handleChange = (field: keyof DTOIFormState, value: string) => {
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

    if (form.monthlyDebtPayments.trim()) {
      const debts = Number(form.monthlyDebtPayments);
      if (Number.isNaN(debts) || debts < 0) {
        errors.monthlyDebtPayments = 'Monthly debts must be zero or positive';
      }
    }

    const housing = Number(form.proposedHousingPayment);
    if (!form.proposedHousingPayment.trim()) {
      errors.proposedHousingPayment = 'Proposed housing payment is required';
    } else if (Number.isNaN(housing) || housing <= 0) {
      errors.proposedHousingPayment = 'Enter a valid housing payment';
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
      const result = calculateDTOI({
        grossMonthlyIncome: Number(form.grossMonthlyIncome),
        monthlyDebtPayments: form.monthlyDebtPayments.trim()
          ? Number(form.monthlyDebtPayments)
          : 0,
        proposedHousingPayment: Number(form.proposedHousingPayment),
        propertyTaxes: form.propertyTaxes.trim() ? Number(form.propertyTaxes) : 0,
        homeInsurance: form.homeInsurance.trim() ? Number(form.homeInsurance) : 0,
        mortgageInsurance: form.mortgageInsurance.trim()
          ? Number(form.mortgageInsurance)
          : 0,
        hoaFees: form.hoaFees.trim() ? Number(form.hoaFees) : 0,
      });

      setFrontEndRatio(result.frontEndRatio);
      setBackEndRatio(result.backEndRatio);
      setQualification(result.qualification);
      setQualificationMessage(result.message);
      setMaxHousingPayment28(result.recommendations.maxHousingPayment28);
      setMaxTotalDebt36(result.recommendations.maxTotalDebt36);
    } catch (error) {
      console.error('DTOI calculation error:', error);
      setErrorMessage('Unable to run the DTOI calculation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasResults =
    frontEndRatio !== null &&
    backEndRatio !== null &&
    maxHousingPayment28 !== null &&
    maxTotalDebt36 !== null &&
    qualification !== null;

  return (
    <PageShell>
      <CalculatorPageShell
        title="DTOI Calculator"
        subtitle="Check your front-end and back-end debt-to-income ratios to see how they compare to common lending guidelines."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Enter income and debts
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
                  onChange={(e) => handleChange('grossMonthlyIncome', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="8000"
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
                  value={form.monthlyDebtPayments}
                  onChange={(e) => handleChange('monthlyDebtPayments', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="1500"
                />
                {fieldErrors.monthlyDebtPayments && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.monthlyDebtPayments}
                  </p>
                )}
                <p className="text-[11px] text-gray-500">
                  Includes auto loans, credit cards, student loans, etc.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Proposed housing payment
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.proposedHousingPayment}
                  onChange={(e) =>
                    handleChange('proposedHousingPayment', e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="2200"
                />
                {fieldErrors.proposedHousingPayment && (
                  <p className="text-xs text-red-600">
                    {fieldErrors.proposedHousingPayment}
                  </p>
                )}
                <p className="text-[11px] text-gray-500">
                  Principal & interest plus taxes, insurance, and HOA if known.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Property taxes (monthly)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.propertyTaxes}
                    onChange={(e) => handleChange('propertyTaxes', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="300"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Home insurance (monthly)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.homeInsurance}
                    onChange={(e) => handleChange('homeInsurance', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Mortgage insurance (monthly)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.mortgageInsurance}
                    onChange={(e) =>
                      handleChange('mortgageInsurance', e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    HOA fees (monthly)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.hoaFees}
                    onChange={(e) => handleChange('hoaFees', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Calculating…' : 'Calculate DTOI'}
              </button>
            </form>

            {errorMessage && (
              <div className="mt-4">
                <ErrorState message={errorMessage} />
              </div>
            )}
          </section>

          {/* Results & visualization */}
          <section className="space-y-4">
            {hasResults ? (
              <>
                <ResultSummaryCards
                  items={[
                    {
                      label: 'Front-end ratio',
                      value: `${frontEndRatio?.toFixed(1)}%`,
                      helperText: 'Housing costs ÷ income (target ≤ 28%).',
                    },
                    {
                      label: 'Back-end ratio',
                      value: `${backEndRatio?.toFixed(1)}%`,
                      helperText: 'All debts ÷ income (target ≤ 36%).',
                    },
                    {
                      label: 'Max housing (28%)',
                      value: maxHousingPayment28 !== null
                        ? `$${maxHousingPayment28.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}`
                        : '-',
                    },
                    {
                      label: 'Max total debt (36%)',
                      value: maxTotalDebt36 !== null
                        ? `$${maxTotalDebt36.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}`
                        : '-',
                    },
                  ]}
                />

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Ratio vs guideline
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {frontEndRatio !== null && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          Front-end (target ≤ 28%)
                        </p>
                        <TwoValueCompareBar
                          labelA="Your ratio"
                          labelB="Guideline"
                          valueA={frontEndRatio}
                          valueB={28}
                          height={200}
                          valueFormatter={(v) => `${v.toFixed(1)}%`}
                        />
                      </div>
                    )}
                    {backEndRatio !== null && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          Back-end (target ≤ 36%)
                        </p>
                        <TwoValueCompareBar
                          labelA="Your ratio"
                          labelB="Guideline"
                          valueA={backEndRatio}
                          valueB={36}
                          height={200}
                          valueFormatter={(v) => `${v.toFixed(1)}%`}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Qualification
                  </h3>
                  <p className="text-sm font-medium text-gray-900">
                    {qualification}
                  </p>
                  {qualificationMessage && (
                    <p className="mt-1 text-xs sm:text-sm text-gray-700">
                      {qualificationMessage}
                    </p>
                  )}
                  <Disclaimer />
                </div>
              </>
            ) : (
              <EmptyState
                title="No DTOI calculated yet"
                description="Enter your income and debts, then run the calculation to see your debt-to-income ratios and how they compare to common guidelines."
              />
            )}
          </section>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
