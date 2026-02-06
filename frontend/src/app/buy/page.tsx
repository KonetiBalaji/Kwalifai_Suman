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
import PageShell from '../../components/PageShell';
import CalculatorPageShell from '../../components/calculators/CalculatorPageShell';
import BuyNavigation from '../../components/buy/BuyNavigation';
import { ChevronDown, Calculator, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  Line,
} from 'recharts';

export default function BuyPage() {
  const router = useRouter();

  // Redirect to affordability calculator as default
  useEffect(() => {
    router.push('/buy/Affordability-calculator');
  }, [router]);

  return (
    <PageShell>
      <CalculatorPageShell
        title="Buy a Home"
        subtitle="Explore current mortgage rates and use our calculators to find the right home for you"
      >
        <BuyNavigation />

        {/* Tab Content */}
        <div className="mt-8">
          <div className="relative min-h-[400px]">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </CalculatorPageShell>
    </PageShell>
  );
}

// Toggle Switch Component
function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

// Slider Input Component
function SliderInput({ 
  value, 
  onChange, 
  min = 0, 
  max = 1000000, 
  step = 1000,
  label,
  description,
  prefix = '$',
  suffix = ''
}: { 
  value: number; 
  onChange: (value: number) => void; 
  min?: number;
  max?: number;
  step?: number;
  label: string;
  description?: string;
  prefix?: string;
  suffix?: string;
}) {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(val);
    if (val) {
      const numValue = parseInt(val);
      if (numValue >= min && numValue <= max) {
        onChange(numValue);
      }
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-sm text-gray-600">{prefix}</span>}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {suffix && <span className="text-sm text-gray-600">{suffix}</span>}
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #1d4ed8 0%, #1d4ed8 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
        />
      </div>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}

// Credit Score Slider Component
function CreditScoreSlider({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const options = [
    { label: 'Fair', value: 'fair', range: '620-699' },
    { label: 'Good', value: 'good', range: '700-720' },
    { label: 'Excellent', value: 'excellent', range: '720+' },
  ];

  const currentIndex = options.findIndex(opt => opt.value === value) || 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Credit score</label>
        <span className="text-sm text-gray-900 font-medium">
          {options.find(opt => opt.value === value)?.label} ({options.find(opt => opt.value === value)?.range})
        </span>
      </div>
      <div className="relative">
        <div className="flex justify-between mb-2">
          {options.map((opt, idx) => (
            <div key={opt.value} className="flex-1">
              <div className={`h-1 ${idx < options.length - 1 ? 'border-r border-gray-300' : ''}`} />
            </div>
          ))}
        </div>
        <div className="relative h-8">
          {options.map((opt, idx) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`absolute top-0 h-8 px-2 text-xs font-medium transition-colors ${
                value === opt.value
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ left: `${(idx / (options.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
            >
              {opt.label}
            </button>
          ))}
          <div className="relative h-2 bg-gray-200 rounded-full mt-6">
            <div
              className="absolute h-2 bg-blue-600 rounded-full transition-all"
              style={{
                width: `${(currentIndex / (options.length - 1)) * 100}%`,
              }}
            />
            <div
              className="absolute w-4 h-4 bg-white border-2 border-blue-600 rounded-full -top-1 transition-all shadow-sm"
              style={{
                left: `${(currentIndex / (options.length - 1)) * 100}%`,
                transform: 'translateX(-50%)',
              }}
            />
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        This affects your interest rate. A higher score means a better chance of a lower rate. If you have a co-borrower, use the lower score of the two.
      </p>
    </div>
  );
}

// Dropdown Component
function Dropdown({ 
  value, 
  onChange, 
  options, 
  label, 
  description 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  options: { label: string; value: string }[]; 
  label: string;
  description?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-3 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between transition-all font-semibold text-gray-900"
        >
          <span>
            {options.find(opt => opt.value === value)?.label || value}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    value === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}

// Affordability Calculator Component
function AffordabilityCalculator() {
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
      // Only detect if ZIP code is empty
      if (zipCode) return;

      // Check if geolocation is available
      if (!navigator.geolocation) {
        return;
      }

      setIsDetectingLocation(true);

      try {
        // Get user's coordinates
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000, // Cache for 5 minutes
          });
        });

        const { latitude, longitude } = position.coords;

        // Use reverse geocoding to get ZIP code
        // Using OpenStreetMap Nominatim API (free, no API key required)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'Kwalifai-Affordability-Calculator', // Required by Nominatim
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const postalCode = data.address?.postcode;
          
          if (postalCode) {
            // Extract just the ZIP code (US format, 5 digits)
            const zipMatch = postalCode.match(/\d{5}/);
            if (zipMatch) {
              setZipCode(zipMatch[0]);
            }
          }
        }
      } catch (error) {
        // Silently fail - user can manually enter ZIP code
        console.log('Location detection failed or denied:', error);
      } finally {
        setIsDetectingLocation(false);
      }
    };

    detectLocation();
  }, []); // Only run once on mount

  // Get interest rate based on credit score
  const getInterestRate = () => {
    switch (creditScore) {
      case 'fair': return 6.5;
      case 'good': return 4.75;
      case 'excellent': return 4.25;
      default: return 4.75;
    }
  };

  // Extract years from loan term
  const getLoanTermYears = () => {
    const match = loanTerm.match(/(\d+)/);
    return match ? parseInt(match[1]) : 30;
  };

  // Calculate affordability
  const results = useMemo(() => {
    if (annualIncome <= 0) {
      return null;
    }

    const monthlyIncome = annualIncome / 12;
    const interestRate = getInterestRate();
    const termYears = getLoanTermYears();
    
    // Calculate down payment percentage (6% default for first-time homebuyer, 20% otherwise)
    const downPaymentPercent = firstTimeHomebuyer ? 6 : 20;
    
    // Standard 28/36 rule: housing should be max 28% of gross income
    const maxHousingPayment = monthlyIncome * 0.28;
    const totalMonthlyDebts = monthlyDebtPayment + utilities + miscExpenses;
    const availableForHousing = maxHousingPayment - totalMonthlyDebts;
    const maxMonthlyPayment = Math.max(0, availableForHousing);

    // Calculate max loan amount from monthly payment
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = termYears * 12;

    let maxLoanAmount = 0;
    if (monthlyRate > 0) {
      const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments);
      maxLoanAmount = maxMonthlyPayment * (rateFactor - 1) / (monthlyRate * rateFactor);
    } else {
      maxLoanAmount = maxMonthlyPayment * numberOfPayments;
    }

    // Calculate max home price including down payment
    const maxHomePrice = maxLoanAmount / (1 - downPaymentPercent / 100);
    
    // Calculate down payment and closing costs
    const downPayment = maxHomePrice * (downPaymentPercent / 100);
    const closingCosts = maxHomePrice * 0.05; // Estimate 5% closing costs
    
    // Calculate monthly mortgage payment (principal + interest)
    const loanAmount = maxHomePrice - downPayment;
    let principalAndInterest = 0;
    if (monthlyRate > 0) {
      const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments);
      principalAndInterest = loanAmount * (monthlyRate * rateFactor) / (rateFactor - 1);
    } else {
      principalAndInterest = loanAmount / numberOfPayments;
    }
    
    // Calculate property taxes (estimate 1% of home price annually, varies by ZIP)
    const annualPropertyTax = maxHomePrice * 0.01;
    const monthlyPropertyTax = annualPropertyTax / 12;
    
    // Calculate home insurance (estimate 0.35% of home price annually)
    const annualHomeInsurance = maxHomePrice * 0.0035;
    const monthlyHomeInsurance = annualHomeInsurance / 12;
    
    // Calculate PMI (only if down payment < 20%)
    const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * 0.005) / 12 : 0;
    
    // Total monthly mortgage payment
    const monthlyMortgagePayment = principalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI;
    
    // Calculate maintenance cost
    const monthlyMaintenance = maxHomePrice * (maintenancePercent / 100) / 12;
    const monthlyHomeImprovement = homeImprovement / 12;
    
    // Total personal expenses (all are monthly values)
    const totalPersonalExpenses = monthlyDebtPayment + utilities + miscExpenses + monthlyMaintenance + monthlyHomeImprovement;
    
    // Total monthly payment (mortgage + personal expenses)
    const totalMonthlyPayment = monthlyMortgagePayment + utilities + miscExpenses;

    return {
      maxHomePrice: Math.round(maxHomePrice),
      monthlyPayment: Math.round(totalMonthlyPayment),
      downPayment: Math.round(downPayment),
      downPaymentPercent,
      closingCosts: Math.round(closingCosts),
      interestRate,
      apr: interestRate + 0.5, // Rough APR estimate
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
  }, [annualIncome, availableAssets, creditScore, loanTerm, firstTimeHomebuyer, monthlyDebtPayment, utilities, miscExpenses, maintenancePercent, homeImprovement]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header Section - Spans both columns */}
      <div className="mb-8">
        <p className="text-sm text-gray-600 mb-2">Mortgage affordability calculator</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          How much can I afford to spend on a house?
        </h1>
        <p className="text-base text-gray-700 max-w-3xl">
          Discover your true home-buying budget in minutes. Our affordability calculator factors in taxes, PMI, and live mortgage rates, using your income, assets, and monthly debts, so you know exactly what you can afford. Enter your details to get your max home price.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12">
        {/* Left Column - Input Section */}
        <div className="space-y-8">
          {/* Mortgage Information Section */}
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

          {/* Build Your Budget Section */}
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

        {/* Right Column - Results Section (Light Theme) */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          {results ? (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-8 shadow-xl">
              {/* Estimated Maximum Home Price */}
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

              {/* Donut Chart */}
              <div className="mb-6 flex justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
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

              {/* Expandable Sections */}
              <div className="space-y-3 mb-6">
                {/* Monthly Mortgage Payments */}
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

                {/* Monthly Personal Expenses */}
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

              {/* Disclaimer */}
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
  );
}

// Mortgage Calculator Component
function MortgageCalculator() {
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
  const [utilitiesExpanded, setUtilitiesExpanded] = useState<boolean>(false);

  // Calculate loan amount
  const loanAmount = parseFloat(homePrice) - parseFloat(downPayment);

  // Calculate monthly payment
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
  // Mortgage payment (PITI + HOA) - does NOT include utilities
  const mortgagePayment = principalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyHOA;
  // Total monthly housing cost (includes utilities)
  const totalMonthlyPayment = mortgagePayment + monthlyUtilities;

  // Update down payment percentage when down payment amount changes
  const handleDownPaymentChange = (value: string) => {
    setDownPayment(value);
    const homePriceNum = parseFloat(homePrice) || 0;
    const downPaymentNum = parseFloat(value) || 0;
    if (homePriceNum > 0) {
      const percent = ((downPaymentNum / homePriceNum) * 100).toFixed(1);
      setDownPaymentPercent(percent);
    }
  };

  // Update down payment amount when percentage changes
  const handleDownPaymentPercentChange = (value: string) => {
    setDownPaymentPercent(value);
    const homePriceNum = parseFloat(homePrice) || 0;
    const percent = parseFloat(value) || 0;
    const downPaymentNum = (homePriceNum * percent) / 100;
    setDownPayment(Math.round(downPaymentNum).toString());
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9F8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
          Estimate your monthly mortgage payments
        </h1>

        {/* Main Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Input Fields in Grid */}
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Home Price */}
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

                {/* Down Payment */}
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
                {/* Length of Loan */}
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

                {/* Interest Rate */}
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

                {/* ZIP Code */}
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

            {/* Right Column - Monthly Payment Display */}
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

        {/* Monthly Payment Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly payment breakdown</h3>

            <div className="space-y-5">
                {/* Principal & Interest */}
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#007C4A' }}></div>
                  <div className="flex-1 flex items-center justify-between">
                    <p className="font-medium text-gray-900">Principal & interest</p>
                    <p className="text-base font-semibold text-gray-900">
                      ${principalAndInterest.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>

                {/* Property Taxes */}
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

                {/* Homeowners Insurance */}
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

                {/* HOA Fees */}
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

                {/* Utilities */}
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
  );
}

// Rent vs Buy Calculator Component
function RentVsBuyCalculator() {
  const [homePrice, setHomePrice] = useState<number>(300000);
  const [downPayment, setDownPayment] = useState<number>(60000);
  const [interestRate, setInterestRate] = useState<number>(7.625);
  const [loanTerm, setLoanTerm] = useState<string>('30-year-fixed');
  const [monthlyRent, setMonthlyRent] = useState<number>(2500);
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  
  // More options
  const [propertyTaxRate, setPropertyTaxRate] = useState<number>(1.35);
  const [monthlyHOAFees, setMonthlyHOAFees] = useState<number>(0);
  const [homeInsuranceRate, setHomeInsuranceRate] = useState<number>(0.46);
  const [maintenanceRate, setMaintenanceRate] = useState<number>(0.5);
  const [renovationRate, setRenovationRate] = useState<number>(0.5);
  const [marginalIncomeTaxRate, setMarginalIncomeTaxRate] = useState<number>(25);
  const [rentersInsuranceRate, setRentersInsuranceRate] = useState<number>(1.32);
  const [rentSecurityDeposit, setRentSecurityDeposit] = useState<number>(1); // in months
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

    // Calculate monthly mortgage payment (P&I)
    let principalAndInterest = 0;
    if (monthlyRate > 0) {
      const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments);
      principalAndInterest = loanAmount * (monthlyRate * rateFactor) / (rateFactor - 1);
    } else {
      principalAndInterest = loanAmount / numberOfPayments;
    }

    // Calculate additional monthly costs for buying
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

    // Calculate total costs over time
    const chartData = [];
    let totalRentCost = monthlyRent * rentSecurityDeposit; // Security deposit upfront
    let totalBuyCost = downPayment + (homePrice * buyingClosingCosts / 100);
    let currentRent = monthlyRent;
    let currentHomeValue = homePrice;
    let remainingLoan = loanAmount;
    let totalBuySavings = 0;

    for (let year = 0; year <= Math.min(yearsToCompare, termYears); year++) {
      if (year > 0) {
        // Rent costs (including renter's insurance)
        const monthlyRentersInsurance = currentRent * (rentersInsuranceRate / 100);
        for (let month = 0; month < 12; month++) {
          totalRentCost += currentRent + monthlyRentersInsurance;
        }
        currentRent *= (1 + rentIncreaseRate / 100);

        // Buy costs
        for (let month = 0; month < 12; month++) {
          const interestPayment = remainingLoan * monthlyRate;
          const principalPayment = principalAndInterest - interestPayment;
          remainingLoan -= principalPayment;
          totalBuyCost += principalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyMaintenance + monthlyRenovation + monthlyHOAFees + monthlyPMI;
        }
        
        // Home appreciation
        currentHomeValue *= (1 + homeAppreciationRate / 100);
        
        // Opportunity cost of down payment (investment return)
        if (year === 1) {
          totalBuySavings = downPayment * (investmentReturnRate / 100);
        } else {
          totalBuySavings *= (1 + investmentReturnRate / 100);
          totalBuySavings += downPayment * (investmentReturnRate / 100);
        }
      }

      // Calculate selling costs if we're at the end
      const sellingCosts = year === Math.min(yearsToCompare, termYears) ? currentHomeValue * (sellingClosingCosts / 100) : 0;
      const netBuyCost = totalBuyCost - (currentHomeValue - homePrice) + sellingCosts + totalBuySavings;
      
      chartData.push({
        year,
        rent: Math.round(totalRentCost),
        buy: Math.round(netBuyCost),
      });
    }

    // Find crossover point
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
    <div className="w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Rent vs Buy Calculator</h1>
        <p className="text-base text-gray-700 max-w-3xl">
          Run the numbers in minutes and see if buying beats renting for your budget and timeline.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12">
        {/* Left Column - Input Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Home Price
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Down Payment
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Mortgage interest rate²
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Comfortable monthly rent³
              </label>
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

        {/* Right Column - Results Section */}
        <div className="space-y-6">
          {/* Results Summary */}
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

              {/* Graph */}
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
                        formatter={(value) => formatCurrency(Number(value) || 0)}
                        labelFormatter={(label) => `Year ${Number(label) || 0}`}
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
  );
}
