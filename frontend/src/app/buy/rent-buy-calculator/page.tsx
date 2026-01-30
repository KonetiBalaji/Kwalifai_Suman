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

import { useState, useMemo } from 'react';
import PageShell from '../../../components/PageShell';
import CalculatorPageShell from '../../../components/calculators/CalculatorPageShell';
import BuyNavigation from '../../../components/buy/BuyNavigation';
import { Dropdown } from '../../../components/buy/CalculatorComponents';
import { ChevronDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';

export default function RentBuyCalculatorPage() {
  const [homePrice, setHomePrice] = useState<number>(300000);
  const [downPayment, setDownPayment] = useState<number>(60000);
  const [interestRate, setInterestRate] = useState<number>(7.625);
  const [loanTerm, setLoanTerm] = useState<string>('30-year-fixed');
  const [monthlyRent, setMonthlyRent] = useState<number>(2500);
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  
  const [propertyTaxRate, setPropertyTaxRate] = useState<number>(1.35);
  const [monthlyHOAFees, setMonthlyHOAFees] = useState<number>(0);
  const [homeInsuranceRate, setHomeInsuranceRate] = useState<number>(0.46);
  const [maintenanceRate, setMaintenanceRate] = useState<number>(0.5);
  const [renovationRate, setRenovationRate] = useState<number>(0.5);
  const [marginalIncomeTaxRate, setMarginalIncomeTaxRate] = useState<number>(25);
  const [rentersInsuranceRate, setRentersInsuranceRate] = useState<number>(1.32);
  const [rentSecurityDeposit, setRentSecurityDeposit] = useState<number>(1);
  const [buyingClosingCosts, setBuyingClosingCosts] = useState<number>(4);
  const [sellingClosingCosts, setSellingClosingCosts] = useState<number>(6);
  const [homeAppreciationRate, setHomeAppreciationRate] = useState<number>(3.0);
  const [rentIncreaseRate, setRentIncreaseRate] = useState<number>(2.0);
  const [generalInflationRate, setGeneralInflationRate] = useState<number>(2.0);
  const [investmentReturnRate, setInvestmentReturnRate] = useState<number>(4.0);
  const [taxFilingStatus, setTaxFilingStatus] = useState<string>('individual');
  const [capitalGainsTaxRate, setCapitalGainsTaxRate] = useState<number>(0);
  const [yearsToCompare, setYearsToCompare] = useState<number>(30);

  const getLoanTermYears = () => {
    const match = loanTerm.match(/(\d+)/);
    return match ? parseInt(match[1]) : 30;
  };

  const results = useMemo(() => {
    const termYears = getLoanTermYears();
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = termYears * 12;

    let principalAndInterest = 0;
    if (monthlyRate > 0) {
      const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments);
      principalAndInterest = loanAmount * (monthlyRate * rateFactor) / (rateFactor - 1);
    } else {
      principalAndInterest = loanAmount / numberOfPayments;
    }

    const annualPropertyTax = homePrice * (propertyTaxRate / 100);
    const monthlyPropertyTax = annualPropertyTax / 12;
    const annualHomeInsurance = homePrice * (homeInsuranceRate / 100);
    const monthlyHomeInsurance = annualHomeInsurance / 12;
    const annualMaintenance = homePrice * (maintenanceRate / 100);
    const monthlyMaintenance = annualMaintenance / 12;
    const annualRenovation = homePrice * (renovationRate / 100);
    const monthlyRenovation = annualRenovation / 12;
    const monthlyPMI = downPayment < homePrice * 0.2 ? (loanAmount * 0.005) / 12 : 0;

    const monthlyBuyCost = principalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyMaintenance + monthlyRenovation + monthlyHOAFees + monthlyPMI;

    const chartData = [];
    let totalRentCost = monthlyRent * rentSecurityDeposit;
    let totalBuyCost = downPayment + (homePrice * buyingClosingCosts / 100);
    let currentRent = monthlyRent;
    let currentHomeValue = homePrice;
    let remainingLoan = loanAmount;
    let totalBuySavings = 0;

    for (let year = 0; year <= Math.min(yearsToCompare, termYears); year++) {
      if (year > 0) {
        const monthlyRentersInsurance = currentRent * (rentersInsuranceRate / 100);
        for (let month = 0; month < 12; month++) {
          totalRentCost += currentRent + monthlyRentersInsurance;
        }
        currentRent *= (1 + rentIncreaseRate / 100);

        for (let month = 0; month < 12; month++) {
          const interestPayment = remainingLoan * monthlyRate;
          const principalPayment = principalAndInterest - interestPayment;
          remainingLoan -= principalPayment;
          totalBuyCost += principalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyMaintenance + monthlyRenovation + monthlyHOAFees + monthlyPMI;
        }
        
        currentHomeValue *= (1 + homeAppreciationRate / 100);
        
        if (year === 1) {
          totalBuySavings = downPayment * (investmentReturnRate / 100);
        } else {
          totalBuySavings *= (1 + investmentReturnRate / 100);
          totalBuySavings += downPayment * (investmentReturnRate / 100);
        }
      }

      const sellingCosts = year === Math.min(yearsToCompare, termYears) ? currentHomeValue * (sellingClosingCosts / 100) : 0;
      const netBuyCost = totalBuyCost - (currentHomeValue - homePrice) + sellingCosts + totalBuySavings;
      
      chartData.push({
        year,
        rent: Math.round(totalRentCost),
        buy: Math.round(netBuyCost),
      });
    }

    let crossoverYear = null;
    for (let i = 1; i < chartData.length; i++) {
      if (chartData[i].buy < chartData[i].rent) {
        crossoverYear = i;
        break;
      }
    }

    const finalRentCost = chartData[chartData.length - 1]?.rent || 0;
    const finalBuyCost = chartData[chartData.length - 1]?.buy || 0;
    const savings = finalRentCost - finalBuyCost;
    const isBuyingCheaper = savings > 0;

    return {
      monthlyBuyCost: Math.round(monthlyBuyCost),
      monthlyRent: Math.round(monthlyRent),
      chartData,
      crossoverYear,
      savings: Math.round(Math.abs(savings)),
      isBuyingCheaper,
      yearsToBreakEven: crossoverYear || null,
    };
  }, [homePrice, downPayment, interestRate, loanTerm, monthlyRent, propertyTaxRate, monthlyHOAFees, homeInsuranceRate, maintenanceRate, renovationRate, rentIncreaseRate, rentersInsuranceRate, homeAppreciationRate, investmentReturnRate, buyingClosingCosts, sellingClosingCosts, rentSecurityDeposit, yearsToCompare]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PageShell>
      <CalculatorPageShell
        title="Buy a Home"
        subtitle="Explore current mortgage rates and use our calculators to find the right home for you"
      >
        <BuyNavigation />

        <div className="mt-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Rent vs Buy Calculator</h1>
              <p className="text-base text-gray-700 max-w-3xl">
                Run the numbers in minutes and see if buying beats renting for your budget and timeline.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Home Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                      <input
                        type="text"
                        value={homePrice.toLocaleString()}
                        onChange={(e) => {
                          const val = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                          setHomePrice(val);
                        }}
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="300,000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Down Payment</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                      <input
                        type="text"
                        value={downPayment.toLocaleString()}
                        onChange={(e) => {
                          const val = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                          setDownPayment(Math.min(val, homePrice));
                        }}
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="60,000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Mortgage interest rate²</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={interestRate}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                          setInterestRate(Math.max(0, Math.min(30, val)));
                        }}
                        className="w-full px-4 pr-8 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="7.625"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Loan term</label>
                    <Dropdown
                      value={loanTerm}
                      onChange={setLoanTerm}
                      options={[
                        { label: '30-year fixed', value: '30-year-fixed' },
                        { label: '20-year fixed', value: '20-year-fixed' },
                        { label: '15-year fixed', value: '15-year-fixed' },
                      ]}
                      label=""
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Comfortable monthly rent³</label>
                    <input
                      type="text"
                      value={monthlyRent.toLocaleString()}
                      onChange={(e) => {
                        const val = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                        setMonthlyRent(val);
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="$2,500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors"
                  >
                    <span>More Options</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showMoreOptions ? 'rotate-180' : ''}`} />
                  </button>

                  {showMoreOptions && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Property tax rate</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={propertyTaxRate}
                            onChange={(e) => setPropertyTaxRate(parseFloat(e.target.value) || 0)}
                            step="0.01"
                            className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Monthly HOA Fees³</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                          <input
                            type="number"
                            value={monthlyHOAFees}
                            onChange={(e) => setMonthlyHOAFees(parseFloat(e.target.value) || 0)}
                            step="1"
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Homeowner's insurance³</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={homeInsuranceRate}
                            onChange={(e) => setHomeInsuranceRate(parseFloat(e.target.value) || 0)}
                            step="0.01"
                            className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Home repairs</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={maintenanceRate}
                            onChange={(e) => setMaintenanceRate(parseFloat(e.target.value) || 0)}
                            step="0.01"
                            className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Renovation</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={renovationRate}
                            onChange={(e) => setRenovationRate(parseFloat(e.target.value) || 0)}
                            step="0.01"
                            className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Marginal income tax rate</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={marginalIncomeTaxRate}
                            onChange={(e) => setMarginalIncomeTaxRate(parseFloat(e.target.value) || 0)}
                            step="0.1"
                            className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Renter's insurance³</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={rentersInsuranceRate}
                            onChange={(e) => setRentersInsuranceRate(parseFloat(e.target.value) || 0)}
                            step="0.01"
                            className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Rent security deposit</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={rentSecurityDeposit}
                            onChange={(e) => setRentSecurityDeposit(parseFloat(e.target.value) || 0)}
                            step="0.5"
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600 whitespace-nowrap">month</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Buying closing cost</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={buyingClosingCosts}
                            onChange={(e) => setBuyingClosingCosts(parseFloat(e.target.value) || 0)}
                            step="0.1"
                            className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Selling closing cost</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={sellingClosingCosts}
                            onChange={(e) => setSellingClosingCosts(parseFloat(e.target.value) || 0)}
                            step="0.1"
                            className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Home value appreciation</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={homeAppreciationRate}
                            onChange={(e) => setHomeAppreciationRate(parseFloat(e.target.value) || 0)}
                            step="0.1"
                            className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Rent value appreciation³</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={rentIncreaseRate}
                            onChange={(e) => setRentIncreaseRate(parseFloat(e.target.value) || 0)}
                            step="0.1"
                            className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">General inflation³</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={generalInflationRate}
                            onChange={(e) => setGeneralInflationRate(parseFloat(e.target.value) || 0)}
                            step="0.1"
                            className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Annual return on cash (after cash)</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={investmentReturnRate}
                            onChange={(e) => setInvestmentReturnRate(parseFloat(e.target.value) || 0)}
                            step="0.1"
                            className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Tax filing status</label>
                        <Dropdown
                          value={taxFilingStatus}
                          onChange={setTaxFilingStatus}
                          options={[
                            { label: 'Individual', value: 'individual' },
                            { label: 'Married Filing Jointly', value: 'married-joint' },
                            { label: 'Married Filing Separately', value: 'married-separate' },
                            { label: 'Head of Household', value: 'head-of-household' },
                          ]}
                          label=""
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Capital gains tax rate</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={capitalGainsTaxRate}
                            onChange={(e) => setCapitalGainsTaxRate(parseFloat(e.target.value) || 0)}
                            step="0.1"
                            className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-300"
                  >
                    Calculate
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {results && (
                  <>
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <p className="text-lg font-semibold text-gray-900 mb-4">
                        {results.isBuyingCheaper ? (
                          <>
                            <span className="text-gray-900">Buying is cheaper than renting</span>, you will save {formatCurrency(results.savings)} in {results.yearsToBreakEven || yearsToCompare} years¹
                          </>
                        ) : (
                          <>
                            <span className="text-gray-900">Renting is cheaper than buying</span>, you will save {formatCurrency(results.savings)} in {yearsToCompare} years¹
                          </>
                        )}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Monthly cost¹</p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Rent:</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(results.monthlyRent)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Buy:</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(results.monthlyBuyCost)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Total cost</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={results.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                              dataKey="year"
                              tickLine={false}
                              axisLine={{ stroke: '#E5E7EB' }}
                              tick={{ fontSize: 11, fill: '#6B7280' }}
                              label={{ value: 'Years', position: 'insideBottom', offset: -5, style: { fontSize: 11, fill: '#6B7280' } }}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={{ stroke: '#E5E7EB' }}
                              tick={{ fontSize: 11, fill: '#6B7280' }}
                              tickFormatter={(v) => {
                                if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
                                if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
                                return `$${v}`;
                              }}
                              label={{ value: 'Total cost', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6B7280' } }}
                            />
                            <Tooltip
                              cursor={{ stroke: '#CBD5F5', strokeWidth: 1 }}
                              contentStyle={{
                                fontSize: 12,
                                borderRadius: 8,
                                borderColor: '#E5E7EB',
                              }}
                              formatter={(value: number) => formatCurrency(value)}
                              labelFormatter={(label: number) => `Year ${label}`}
                            />
                            <Legend
                              wrapperStyle={{ paddingTop: '10px' }}
                              iconType="line"
                            />
                            {results.crossoverYear && (
                              <ReferenceLine
                                x={results.crossoverYear}
                                stroke="#9CA3AF"
                                strokeDasharray="3 3"
                                label={{ value: `Year ${results.crossoverYear}`, position: 'top', style: { fontSize: 11, fill: '#6B7280' } }}
                              />
                            )}
                            <Line
                              type="monotone"
                              dataKey="buy"
                              stroke="#10B981"
                              strokeWidth={2}
                              dot={false}
                              name="Buy"
                            />
                            <Line
                              type="monotone"
                              dataKey="rent"
                              stroke="#EF4444"
                              strokeWidth={2}
                              dot={false}
                              name="Rent"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
