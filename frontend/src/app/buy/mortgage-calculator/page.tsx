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

import { useState } from 'react';
import PageShell from '../../../components/PageShell';
import CalculatorPageShell from '../../../components/calculators/CalculatorPageShell';
import BuyNavigation from '../../../components/buy/BuyNavigation';
import { Dropdown } from '../../../components/buy/CalculatorComponents';

export default function MortgageCalculatorPage() {
  const [homePrice, setHomePrice] = useState<string>('300000');
  const [downPayment, setDownPayment] = useState<string>('60000');
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>('20');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [interestRate, setInterestRate] = useState<string>('6.500');
  const [zipCode, setZipCode] = useState<string>('76209');
  const [propertyTax, setPropertyTax] = useState<string>('0');
  const [homeInsurance, setHomeInsurance] = useState<string>('0');
  const [hoaFees, setHoaFees] = useState<string>('0');
  const [utilities, setUtilities] = useState<string>('0');

  const loanAmount = parseFloat(homePrice) - parseFloat(downPayment);

  const calculatePayment = () => {
    if (loanAmount <= 0 || parseFloat(interestRate) <= 0 || parseFloat(loanTerm) <= 0) {
      return 0;
    }
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numPayments = parseFloat(loanTerm) * 12;
    if (monthlyRate === 0) return loanAmount / numPayments;
    const principalAndInterest =
      (loanAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    return Math.round(principalAndInterest * 100) / 100;
  };

  const principalAndInterest = calculatePayment();
  const monthlyPropertyTax = parseFloat(propertyTax);
  const monthlyHomeInsurance = parseFloat(homeInsurance);
  const monthlyHOA = parseFloat(hoaFees);
  const monthlyUtilities = parseFloat(utilities);
  const mortgagePayment = principalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyHOA;
  const totalMonthlyPayment = mortgagePayment + monthlyUtilities;

  const handleDownPaymentChange = (value: string) => {
    setDownPayment(value);
    const homePriceNum = parseFloat(homePrice) || 0;
    const downPaymentNum = parseFloat(value) || 0;
    if (homePriceNum > 0) {
      const percent = ((downPaymentNum / homePriceNum) * 100).toFixed(1);
      setDownPaymentPercent(percent);
    }
  };

  return (
    <PageShell>
      <CalculatorPageShell
        title="Buy a Home"
        subtitle="Explore current mortgage rates and use our calculators to find the right home for you"
      >
        <BuyNavigation />

        <div className="mt-8">
          <div className="min-h-screen" style={{ backgroundColor: '#F8F9F8' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                Estimate your monthly mortgage payments
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Home price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">$</span>
                        <input
                          type="text"
                          value={homePrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setHomePrice(val);
                            const homePriceNum = parseFloat(val) || 0;
                            const downPaymentNum = parseFloat(downPayment) || 0;
                            if (homePriceNum > 0) {
                              const percent = ((downPaymentNum / homePriceNum) * 100).toFixed(1);
                              setDownPaymentPercent(percent);
                            }
                          }}
                          className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Down payment</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">$</span>
                        <input
                          type="text"
                          value={downPayment.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            handleDownPaymentChange(val);
                          }}
                          className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Length of loan</label>
                      <Dropdown
                        value={loanTerm}
                        onChange={setLoanTerm}
                        options={[
                          { label: '15 years', value: '15' },
                          { label: '20 years', value: '20' },
                          { label: '25 years', value: '25' },
                          { label: '30 years', value: '30' },
                        ]}
                        label=""
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interest rate</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={interestRate}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '');
                            setInterestRate(val);
                          }}
                          className="w-full px-3 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-900"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP code</label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                          setZipCode(val);
                        }}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center lg:items-start lg:pl-8">
                  <p className="text-base text-gray-600 mb-1">Total monthly housing cost</p>
                  <p className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
                    ${totalMonthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo
                  </p>
                  <p className="text-sm text-gray-500">
                    Mortgage payment (PITI + HOA): <span className="font-semibold text-gray-700">${mortgagePayment.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo</span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly payment breakdown</h3>

                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#007C4A' }}></div>
                    <div className="flex-1 flex items-center justify-between">
                      <p className="font-medium text-gray-900">Principal & interest</p>
                      <p className="text-base font-semibold text-gray-900">
                        ${principalAndInterest.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#7B42F6' }}></div>
                    <div className="flex-1 flex items-center justify-between">
                      <p className="font-medium text-gray-900">Property taxes</p>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                        <input
                          type="text"
                          value={propertyTax.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setPropertyTax(val);
                          }}
                          className="w-24 pl-6 pr-2 py-1.5 border border-gray-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#9A77F2' }}></div>
                    <div className="flex-1 flex items-center justify-between">
                      <p className="font-medium text-gray-900">Homeowners insurance</p>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                        <input
                          type="text"
                          value={homeInsurance.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setHomeInsurance(val);
                          }}
                          className="w-24 pl-6 pr-2 py-1.5 border border-gray-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#FBC02D' }}></div>
                    <div className="flex-1 flex items-center justify-between">
                      <p className="font-medium text-gray-900">HOA fees</p>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                        <input
                          type="text"
                          value={hoaFees.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setHoaFees(val);
                          }}
                          className="w-24 pl-6 pr-2 py-1.5 border border-gray-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#E57373' }}></div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Utilities</p>
                        <p className="text-xs text-gray-500 mt-0.5">Not included in mortgage payment</p>
                      </div>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                        <input
                          type="text"
                          value={utilities.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setUtilities(val);
                          }}
                          className="w-24 pl-6 pr-2 py-1.5 border border-gray-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
