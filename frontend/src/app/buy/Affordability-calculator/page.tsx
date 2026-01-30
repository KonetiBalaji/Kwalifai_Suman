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

import { useState, useEffect, useMemo } from 'react';
import PageShell from '../../../components/PageShell';
import CalculatorPageShell from '../../../components/calculators/CalculatorPageShell';
import BuyNavigation from '../../../components/buy/BuyNavigation';
import { ToggleSwitch, SliderInput, CreditScoreSlider, Dropdown } from '../../../components/buy/CalculatorComponents';
import { ChevronDown, Calculator, MapPin } from 'lucide-react';

export default function AffordabilityCalculatorPage() {
  // Mortgage Information
  const [firstTimeHomebuyer, setFirstTimeHomebuyer] = useState<boolean>(false);
  const [zipCode, setZipCode] = useState<string>('');
  const [annualIncome, setAnnualIncome] = useState<number>(100000);
  const [availableAssets, setAvailableAssets] = useState<number>(100000);
  const [creditScore, setCreditScore] = useState<string>('good');
  const [loanTerm, setLoanTerm] = useState<string>('30-year-fixed');
  const [propertyUsage, setPropertyUsage] = useState<string>('primary-residence');
  const [propertyType, setPropertyType] = useState<string>('single-family');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  
  // Budget Expenses
  const [monthlyDebtPayment, setMonthlyDebtPayment] = useState<number>(0);
  const [utilities, setUtilities] = useState<number>(0);
  const [miscExpenses, setMiscExpenses] = useState<number>(0);
  const [maintenancePercent, setMaintenancePercent] = useState<number>(0);
  const [homeImprovement, setHomeImprovement] = useState<number>(0);
  
  // UI State
  const [expandedMortgage, setExpandedMortgage] = useState<boolean>(false);
  const [expandedPersonal, setExpandedPersonal] = useState<boolean>(false);

  // Detect user's location and get ZIP code on component mount
  useEffect(() => {
    const detectLocation = async () => {
      if (zipCode) return;
      if (!navigator.geolocation) return;

      setIsDetectingLocation(true);
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000,
          });
        });

        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'Kwalifai-Affordability-Calculator',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const postalCode = data.address?.postcode;
          if (postalCode) {
            const zipMatch = postalCode.match(/\d{5}/);
            if (zipMatch) {
              setZipCode(zipMatch[0]);
            }
          }
        }
      } catch (error) {
        console.log('Location detection failed or denied:', error);
      } finally {
        setIsDetectingLocation(false);
      }
    };

    detectLocation();
  }, []);

  const getInterestRate = () => {
    switch (creditScore) {
      case 'fair': return 6.5;
      case 'good': return 4.75;
      case 'excellent': return 4.25;
      default: return 4.75;
    }
  };

  const getLoanTermYears = () => {
    const match = loanTerm.match(/(\d+)/);
    return match ? parseInt(match[1]) : 30;
  };

  const results = useMemo(() => {
    if (annualIncome <= 0) return null;

    const monthlyIncome = annualIncome / 12;
    const interestRate = getInterestRate();
    const termYears = getLoanTermYears();
    const downPaymentPercent = firstTimeHomebuyer ? 6 : 20;
    const maxHousingPayment = monthlyIncome * 0.28;
    const totalMonthlyDebts = monthlyDebtPayment + utilities + miscExpenses;
    const availableForHousing = maxHousingPayment - totalMonthlyDebts;
    const maxMonthlyPayment = Math.max(0, availableForHousing);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = termYears * 12;

    let maxLoanAmount = 0;
    if (monthlyRate > 0) {
      const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments);
      maxLoanAmount = maxMonthlyPayment * (rateFactor - 1) / (monthlyRate * rateFactor);
    } else {
      maxLoanAmount = maxMonthlyPayment * numberOfPayments;
    }

    const maxHomePrice = maxLoanAmount / (1 - downPaymentPercent / 100);
    const downPayment = maxHomePrice * (downPaymentPercent / 100);
    const closingCosts = maxHomePrice * 0.05;
    const loanAmount = maxHomePrice - downPayment;
    
    let principalAndInterest = 0;
    if (monthlyRate > 0) {
      const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments);
      principalAndInterest = loanAmount * (monthlyRate * rateFactor) / (rateFactor - 1);
    } else {
      principalAndInterest = loanAmount / numberOfPayments;
    }
    
    const annualPropertyTax = maxHomePrice * 0.01;
    const monthlyPropertyTax = annualPropertyTax / 12;
    const annualHomeInsurance = maxHomePrice * 0.0035;
    const monthlyHomeInsurance = annualHomeInsurance / 12;
    const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * 0.005) / 12 : 0;
    const monthlyMortgagePayment = principalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI;
    const monthlyMaintenance = maxHomePrice * (maintenancePercent / 100) / 12;
    const monthlyHomeImprovement = homeImprovement / 12;
    const totalPersonalExpenses = monthlyDebtPayment + utilities + miscExpenses + monthlyMaintenance + monthlyHomeImprovement;
    const totalMonthlyPayment = monthlyMortgagePayment + utilities + miscExpenses;

    return {
      maxHomePrice: Math.round(maxHomePrice),
      monthlyPayment: Math.round(totalMonthlyPayment),
      downPayment: Math.round(downPayment),
      downPaymentPercent,
      closingCosts: Math.round(closingCosts),
      interestRate,
      apr: interestRate + 0.5,
      termYears,
      monthlyMortgagePayment: Math.round(monthlyMortgagePayment),
      principalAndInterest: Math.round(principalAndInterest),
      monthlyPropertyTax: Math.round(monthlyPropertyTax),
      monthlyHomeInsurance: Math.round(monthlyHomeInsurance),
      monthlyPMI: Math.round(monthlyPMI),
      totalPersonalExpenses: Math.round(totalPersonalExpenses),
      monthlyDebtPayment,
      utilities,
      miscExpenses,
      monthlyMaintenance: Math.round(monthlyMaintenance),
      monthlyHomeImprovement: Math.round(monthlyHomeImprovement),
    };
  }, [annualIncome, availableAssets, creditScore, loanTerm, firstTimeHomebuyer, monthlyDebtPayment, utilities, miscExpenses, maintenancePercent, homeImprovement, zipCode]);

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
              <p className="text-sm text-gray-600 mb-2">Mortgage affordability calculator</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How much can I afford to spend on a house?
              </h1>
              <p className="text-base text-gray-700 max-w-3xl">
                Discover your true home-buying budget in minutes. Our affordability calculator factors in taxes, PMI, and live mortgage rates, using your income, assets, and monthly debts, so you know exactly what you can afford. Enter your details to get your max home price.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Mortgage information</h2>
                  
                  <ToggleSwitch
                    checked={firstTimeHomebuyer}
                    onChange={setFirstTimeHomebuyer}
                    label="First time homebuyer?"
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">ZIP code</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {isDetectingLocation ? (
                          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <MapPin className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                        placeholder={isDetectingLocation ? "Detecting location..." : "Enter ZIP code"}
                        className="block w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        disabled={isDetectingLocation}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Based on where you're looking, price can change. Interest rates can vary by state and property taxes can change from county to county.
                    </p>
                  </div>

                  <SliderInput
                    value={annualIncome}
                    onChange={setAnnualIncome}
                    min={0}
                    max={500000}
                    step={1000}
                    label="Annual gross income"
                    description="This is your total income before taxes. If you plan on having a co-borrower, include their income too."
                  />

                  <SliderInput
                    value={availableAssets}
                    onChange={setAvailableAssets}
                    min={0}
                    max={1000000}
                    step={1000}
                    label="Available assets"
                    description="This is what you'll use for your down payment and closing costs. It can include checking accounts, savings accounts, retirement funds, CDs, and brokerage accounts."
                  />

                  <CreditScoreSlider value={creditScore} onChange={setCreditScore} />

                  <Dropdown
                    value={loanTerm}
                    onChange={setLoanTerm}
                    label="Loan term"
                    description="This is how long it will take you to pay off your loan. Some mortgages have 15 or 10 year terms, but 30 is most common."
                    options={[
                      { label: '30-year fixed', value: '30-year-fixed' },
                      { label: '20-year fixed', value: '20-year-fixed' },
                      { label: '15-year fixed', value: '15-year-fixed' },
                      { label: '10/1 adjustable rate', value: '10-1-arm' },
                      { label: '7/1 adjustable rate', value: '7-1-arm' },
                      { label: '5/1 adjustable rate', value: '5-1-arm' },
                    ]}
                  />

                  <Dropdown
                    value={propertyUsage}
                    onChange={setPropertyUsage}
                    label="Property usage"
                    description="Whether you will be using your property to live in, use on the side, or as an investment. Based on what you choose, your loan type and rates can change."
                    options={[
                      { label: 'Primary residence', value: 'primary-residence' },
                      { label: 'Second home', value: 'second-home' },
                      { label: 'Investment', value: 'investment' },
                    ]}
                  />

                  <Dropdown
                    value={propertyType}
                    onChange={setPropertyType}
                    label="Property type"
                    description="Does your property have one unit? Are there 2 to 4 units? Or is it a condo? Based on what type of property you have, your loan type may change."
                    options={[
                      { label: 'Single family', value: 'single-family' },
                      { label: 'Condo', value: 'condo' },
                      { label: '2 units', value: '2-units' },
                      { label: '3 units', value: '3-units' },
                      { label: '4 units', value: '4-units' },
                    ]}
                  />
                </div>

                <div className="space-y-6 pt-6 border-t border-gray-200">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Build your budget</h2>
                    <p className="text-sm text-gray-600">
                      Add in all those other non-mortgage expenses and see what you'll be spending each month.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-base font-medium text-gray-900">Miscellaneous expenses</h3>

                    <SliderInput
                      value={monthlyDebtPayment}
                      onChange={setMonthlyDebtPayment}
                      min={0}
                      max={10000}
                      step={50}
                      label="Monthly minimum debt payment"
                      description="This includes regular payments like credit cards, student loans, and car payments."
                    />

                    <SliderInput
                      value={utilities}
                      onChange={setUtilities}
                      min={0}
                      max={2000}
                      step={25}
                      label="Utilities"
                      description="Natural gas, heating, and electric. If you currently rent, this may be included as part of your monthly rent payments so check your lease."
                    />

                    <SliderInput
                      value={miscExpenses}
                      onChange={setMiscExpenses}
                      min={0}
                      max={5000}
                      step={50}
                      label="Miscellaneous expenses"
                      description="Add up what you might normally spend on expenses like internet, food, groceries, child alimony, and entertainment every month."
                    />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Maintenance</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={maintenancePercent}
                            onChange={(e) => setMaintenancePercent(Math.max(0, Math.min(10, parseFloat(e.target.value) || 0)))}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="text-sm text-gray-600">%</span>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min={0}
                          max={10}
                          step={0.1}
                          value={maintenancePercent}
                          onChange={(e) => setMaintenancePercent(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #1d4ed8 0%, #1d4ed8 ${(maintenancePercent / 10) * 100}%, #e5e7eb ${(maintenancePercent / 10) * 100}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Typically, homeowners set aside between 1-4% of the purchase price of their house for annual maintenance and repairs. The older the house, the higher this percentage should be.
                      </p>
                    </div>

                    <SliderInput
                      value={homeImprovement}
                      onChange={setHomeImprovement}
                      min={0}
                      max={50000}
                      step={100}
                      label="Home improvement"
                      description="If you expect any major home improvements after you buy, put those here. Things like a kitchen or bathroom remodel can start at $10,000."
                    />
                  </div>
                </div>
              </div>

              <div className="lg:sticky lg:top-8 lg:self-start">
                {results ? (
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-8 shadow-xl">
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-2">Estimated maximum home price</p>
                      <div className="flex items-baseline gap-3 mb-3">
                        <p className="text-4xl md:text-5xl font-bold text-gray-900">
                          {formatCurrency(results.maxHomePrice)}
                        </p>
                        <p className="text-lg text-gray-600">
                          {formatCurrency(results.monthlyPayment)}/mo
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Requires a downpayment of {formatCurrency(results.downPayment)} ({results.downPaymentPercent}%) and closing cost of {formatCurrency(results.closingCosts)} on a {results.termYears} year fixed at an estimated rate of {results.interestRate.toFixed(3)}% ({results.apr.toFixed(3)}% APR).
                      </p>
                    </div>

                    <div className="mb-6 flex justify-center">
                      <div className="relative w-48 h-48">
                        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="8"
                            strokeDasharray={`${(results.monthlyMortgagePayment / results.monthlyPayment) * 251.2} 251.2`}
                            strokeLinecap="round"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="8"
                            strokeDasharray={`${((results.monthlyPayment - results.monthlyMortgagePayment) / results.monthlyPayment) * 251.2} 251.2`}
                            strokeDashoffset={`-${(results.monthlyMortgagePayment / results.monthlyPayment) * 251.2}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-xs text-gray-600 mb-1">Total monthly payments</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(results.monthlyPayment)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedMortgage(!expandedMortgage)}
                          className="w-full flex items-center justify-between text-left text-gray-900 hover:bg-gray-50 rounded-lg p-3 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${expandedMortgage ? 'rotate-180' : ''}`} />
                            <span className="text-sm font-medium">Monthly mortgage payments</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{formatCurrency(results.monthlyMortgagePayment)}</span>
                        </button>
                        
                        {expandedMortgage && (
                          <div className="px-3 pb-3 space-y-2 border-t border-gray-200 pt-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                <span className="text-gray-700">Principal & interest</span>
                              </div>
                              <span className="font-medium text-gray-900">{formatCurrency(results.principalAndInterest)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                <span className="text-gray-700">Mortgage insurance</span>
                              </div>
                              <span className="font-medium text-gray-900">{formatCurrency(results.monthlyPMI)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                <span className="text-gray-700">Property taxes</span>
                              </div>
                              <span className="font-medium text-gray-900">{formatCurrency(results.monthlyPropertyTax)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                <span className="text-gray-700">Home insurance</span>
                              </div>
                              <span className="font-medium text-gray-900">{formatCurrency(results.monthlyHomeInsurance)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedPersonal(!expandedPersonal)}
                          className="w-full flex items-center justify-between text-left text-gray-900 hover:bg-gray-50 rounded-lg p-3 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${expandedPersonal ? 'rotate-180' : ''}`} />
                            <span className="text-sm font-medium">Monthly personal expenses</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{formatCurrency(results.totalPersonalExpenses)}</span>
                        </button>
                        
                        {expandedPersonal && (
                          <div className="px-3 pb-3 space-y-2 border-t border-gray-200 pt-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-gray-700">Monthly minimum debt payments</span>
                              </div>
                              <span className="font-medium text-gray-900">{formatCurrency(results.monthlyDebtPayment)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                <span className="text-gray-700">Utilities</span>
                              </div>
                              <span className="font-medium text-gray-900">{formatCurrency(results.utilities)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                <span className="text-gray-700">Miscellaneous expenses</span>
                              </div>
                              <span className="font-medium text-gray-900">{formatCurrency(results.miscExpenses)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                <span className="text-gray-700">Maintenance budget</span>
                              </div>
                              <span className="font-medium text-gray-900">{formatCurrency(results.monthlyMaintenance)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-gray-700">Home improvement</span>
                              </div>
                              <span className="font-medium text-gray-900">{formatCurrency(results.monthlyHomeImprovement)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 space-y-2 leading-relaxed">
                      <p className="font-medium mb-2">For illustration only, estimates are not a guarantee.</p>
                      <p>ZIP code is used to estimate property taxes and insurance.</p>
                      <p>Results may vary based on your situation, lender terms, and current rates.</p>
                      <p>We don't have all your details, so rate, APR, and payment estimates may differ from your actual offer.</p>
                      <p className="font-medium mt-3 mb-1">Assumptions (unless noted):</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>No cash-out at closing</li>
                        <li>Closing costs paid out of pocket</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-8 shadow-xl text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Calculator className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm">
                      Enter your annual income to see how much home you can afford
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}
