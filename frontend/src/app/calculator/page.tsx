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
import PageShell from '../../components/PageShell';
import CalculatorPageShell from '../../components/calculators/CalculatorPageShell';

const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';

interface CalculatorInputs {
  loanAmount: string;
  interestRate: string;
  loanTerm: string;
  downPayment: string;
  propertyTax: string;
  homeInsurance: string;
  hoa: string;
}

interface CalculatorResults {
  monthlyPayment: number;
  principalAndInterest: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalCost: number;
}

export default function CalculatorPage() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    loanAmount: '500000',
    interestRate: '6.5',
    loanTerm: '30',
    downPayment: '100000',
    propertyTax: '6000',
    homeInsurance: '1200',
    hoa: '0',
  });
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_GATEWAY_URL}/api/v1/calculator/mortgage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanAmount: parseFloat(inputs.loanAmount),
          interestRate: parseFloat(inputs.interestRate),
          loanTerm: parseInt(inputs.loanTerm),
          downPayment: parseFloat(inputs.downPayment) || 0,
          propertyTax: parseFloat(inputs.propertyTax) || 0,
          homeInsurance: parseFloat(inputs.homeInsurance) || 0,
          hoa: parseFloat(inputs.hoa) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Calculation failed. Please check your inputs.');
        setLoading(false);
        return;
      }

      setResults(data.results);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <CalculatorPageShell
        title="Mortgage Calculator"
        subtitle="Estimate your monthly mortgage payment and total cost, including taxes, insurance, and HOA."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Form */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Loan details
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="loanAmount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Loan amount ($)
                </label>
                <input
                  id="loanAmount"
                  type="number"
                  required
                  value={inputs.loanAmount}
                  onChange={(e) =>
                    setInputs({ ...inputs, loanAmount: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="interestRate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Interest rate (%)
                </label>
                <input
                  id="interestRate"
                  type="number"
                  step={0.01}
                  required
                  value={inputs.interestRate}
                  onChange={(e) =>
                    setInputs({ ...inputs, interestRate: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="loanTerm"
                  className="block text-sm font-medium text-gray-700"
                >
                  Loan term (years)
                </label>
                <input
                  id="loanTerm"
                  type="number"
                  required
                  value={inputs.loanTerm}
                  onChange={(e) =>
                    setInputs({ ...inputs, loanTerm: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="downPayment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Down payment ($)
                </label>
                <input
                  id="downPayment"
                  type="number"
                  value={inputs.downPayment}
                  onChange={(e) =>
                    setInputs({ ...inputs, downPayment: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="propertyTax"
                  className="block text-sm font-medium text-gray-700"
                >
                  Annual property tax ($)
                </label>
                <input
                  id="propertyTax"
                  type="number"
                  value={inputs.propertyTax}
                  onChange={(e) =>
                    setInputs({ ...inputs, propertyTax: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="homeInsurance"
                  className="block text-sm font-medium text-gray-700"
                >
                  Annual home insurance ($)
                </label>
                <input
                  id="homeInsurance"
                  type="number"
                  value={inputs.homeInsurance}
                  onChange={(e) =>
                    setInputs({ ...inputs, homeInsurance: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="hoa"
                  className="block text-sm font-medium text-gray-700"
                >
                  Monthly HOA fees ($)
                </label>
                <input
                  id="hoa"
                  type="number"
                  value={inputs.hoa}
                  onChange={(e) =>
                    setInputs({ ...inputs, hoa: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Calculating…' : 'Calculate'}
              </button>
            </form>
          </section>

          {/* Results */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Results
            </h2>

            {results ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Monthly payment</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {`$${results.monthlyPayment.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Principal & interest</span>
                    <span className="font-semibold text-gray-900">
                      {`$${results.principalAndInterest.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total monthly payment</span>
                    <span className="font-semibold text-gray-900">
                      {`$${results.totalMonthlyPayment.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total interest</span>
                    <span className="font-semibold text-gray-900">
                      {`$${results.totalInterest.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Total cost</span>
                    <span className="font-semibold text-gray-900">
                      {`$${results.totalCost.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm py-10">
                Enter loan details and click Calculate to see results.
              </div>
            )}
          </section>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
