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

import { FormEvent, useState, ChangeEvent } from 'react';
import PageShell from '../../components/PageShell';

const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';

interface StatementFormData {
  currentBalance: string;
  currentRate: string;
  monthlyPayment: string;
  propertyAddress: string;
  lenderName: string;
  escrowBalance: string;
  loanNumber: string;
  nextPaymentDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface StatementAnalysis {
  currentLoanBalance: number;
  currentInterestRate: number;
  currentMonthlyPayment: number;
  remainingTermMonths: number;
  propertyAddress: string;
  lenderName: string;
  loanNumber: string;
  nextPaymentDate: string;
  escrowBalance: number;
  marketComparison: {
    currentMarketRate: number;
    potentialNewPayment: number;
    potentialMonthlySavings: number;
  };
  recommendations: {
    refinanceOpportunity: boolean;
    potentialSavings: number;
    recommendedAction: string;
  };
}

interface UploadResponse {
  success: boolean;
  statementId: string;
  message: string;
  analysis: StatementAnalysis;
  file: {
    filename: string;
    originalName: string;
    size: number;
  } | null;
}

export default function StatementAnalysisPage() {
  const [formData, setFormData] = useState<StatementFormData>({
    currentBalance: '',
    currentRate: '',
    monthlyPayment: '',
    propertyAddress: '',
    lenderName: '',
    escrowBalance: '',
    loanNumber: '',
    nextPaymentDate: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<StatementAnalysis | null>(null);
  const [statementId, setStatementId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof StatementFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setError(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF, JPEG, JPG, and PNG files are allowed');
        return;
      }
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    // At least file or some form data should be provided
    if (!selectedFile && !formData.currentBalance && !formData.currentRate && !formData.monthlyPayment) {
      errors.general = 'Please upload a statement file or enter at least current balance, rate, and monthly payment';
    }

    // Validate numeric fields if provided
    if (formData.currentBalance && isNaN(Number(formData.currentBalance))) {
      errors.currentBalance = 'Current balance must be a number';
    }
    if (formData.currentRate && (isNaN(Number(formData.currentRate)) || Number(formData.currentRate) < 0 || Number(formData.currentRate) > 20)) {
      errors.currentRate = 'Current rate must be a number between 0 and 20';
    }
    if (formData.monthlyPayment && isNaN(Number(formData.monthlyPayment))) {
      errors.monthlyPayment = 'Monthly payment must be a number';
    }
    if (formData.escrowBalance && isNaN(Number(formData.escrowBalance))) {
      errors.escrowBalance = 'Escrow balance must be a number';
    }

    // Validate email if provided
    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      errors.customerEmail = 'Please enter a valid email address';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setAnalysis(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append('mortgageStatement', selectedFile);
      }

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch(`${API_GATEWAY_URL}/api/upload-statement`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data: UploadResponse = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to analyze statement. Please try again.');
        setLoading(false);
        return;
      }

      setAnalysis(data.analysis);
      setStatementId(data.statementId);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      currentBalance: '',
      currentRate: '',
      monthlyPayment: '',
      propertyAddress: '',
      lenderName: '',
      escrowBalance: '',
      loanNumber: '',
      nextPaymentDate: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
    });
    setSelectedFile(null);
    setError(null);
    setAnalysis(null);
    setStatementId(null);
    setFieldErrors({});
    // Reset file input
    const fileInput = document.getElementById('mortgageStatement') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <PageShell
      title="Statement Analysis"
      subtitle="Upload your mortgage statement or enter details manually to analyze refinancing opportunities and potential savings."
    >
      <div className="max-w-4xl mx-auto">
        {!analysis ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            {/* File Upload Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Upload Mortgage Statement (Optional)
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Supported formats: PDF, JPEG, JPG, PNG (Max 10MB)
              </p>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="mortgageStatement"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG or JPEG (MAX. 10MB)</p>
                  </div>
                  <input
                    id="mortgageStatement"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {selectedFile && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Selected:</span> {selectedFile.name} (
                    {(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}
            </div>

            {/* Form Fields Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Statement Details (Enter manually if no file uploaded)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Current Balance <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.currentBalance}
                    onChange={(e) => handleInputChange('currentBalance', e.target.value)}
                    className={`w-full rounded-md border ${
                      fieldErrors.currentBalance ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    placeholder="350000"
                  />
                  {fieldErrors.currentBalance && (
                    <p className="text-xs text-red-600">{fieldErrors.currentBalance}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Current Rate (%) <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.01"
                    value={formData.currentRate}
                    onChange={(e) => handleInputChange('currentRate', e.target.value)}
                    className={`w-full rounded-md border ${
                      fieldErrors.currentRate ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    placeholder="7.25"
                  />
                  {fieldErrors.currentRate && (
                    <p className="text-xs text-red-600">{fieldErrors.currentRate}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Monthly Payment <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthlyPayment}
                    onChange={(e) => handleInputChange('monthlyPayment', e.target.value)}
                    className={`w-full rounded-md border ${
                      fieldErrors.monthlyPayment ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    placeholder="2400"
                  />
                  {fieldErrors.monthlyPayment && (
                    <p className="text-xs text-red-600">{fieldErrors.monthlyPayment}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Escrow Balance <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.escrowBalance}
                    onChange={(e) => handleInputChange('escrowBalance', e.target.value)}
                    className={`w-full rounded-md border ${
                      fieldErrors.escrowBalance ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    placeholder="2500"
                  />
                  {fieldErrors.escrowBalance && (
                    <p className="text-xs text-red-600">{fieldErrors.escrowBalance}</p>
                  )}
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Property Address <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.propertyAddress}
                    onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="123 Main St, City, State"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Lender Name <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lenderName}
                    onChange={(e) => handleInputChange('lenderName', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Current Lender"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Loan Number <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.loanNumber}
                    onChange={(e) => handleInputChange('loanNumber', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Loan #"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Next Payment Date <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nextPaymentDate}
                    onChange={(e) => handleInputChange('nextPaymentDate', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="MM/DD/YYYY"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information (Optional) */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    className={`w-full rounded-md border ${
                      fieldErrors.customerEmail ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    placeholder="john@example.com"
                  />
                  {fieldErrors.customerEmail && (
                    <p className="text-xs text-red-600">{fieldErrors.customerEmail}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {(error || fieldErrors.general) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error || fieldErrors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex justify-center items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Analyzing...' : 'Analyze Statement'}
              </button>
            </div>
          </form>
        ) : (
          /* Results Display */
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium">
                ✓ Statement analyzed successfully!
              </p>
            </div>

            {/* Analysis Results */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>

              {/* Current Loan Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Loan Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Current Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${analysis.currentLoanBalance.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Current Interest Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analysis.currentInterestRate.toFixed(2)}%
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Monthly Payment</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${analysis.currentMonthlyPayment.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Remaining Term</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analysis.remainingTermMonths} months
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Property:</span> {analysis.propertyAddress}
                  </p>
                  <p>
                    <span className="font-medium">Lender:</span> {analysis.lenderName}
                  </p>
                  <p>
                    <span className="font-medium">Loan Number:</span> {analysis.loanNumber}
                  </p>
                  <p>
                    <span className="font-medium">Next Payment:</span> {analysis.nextPaymentDate}
                  </p>
                  <p>
                    <span className="font-medium">Escrow Balance:</span> $
                    {analysis.escrowBalance.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Market Comparison */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-600">Current Market Rate</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {analysis.marketComparison.currentMarketRate.toFixed(2)}%
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-600">Potential New Payment</p>
                    <p className="text-2xl font-bold text-green-900">
                      ${analysis.marketComparison.potentialNewPayment.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-600">Potential Monthly Savings</p>
                    <p className="text-2xl font-bold text-purple-900">
                      ${analysis.marketComparison.potentialMonthlySavings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div
                  className={`p-4 rounded-lg border ${
                    analysis.recommendations.refinanceOpportunity
                      ? 'bg-green-50 border-green-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {analysis.recommendations.refinanceOpportunity ? (
                        <svg
                          className="h-6 w-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-6 w-6 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          analysis.recommendations.refinanceOpportunity
                            ? 'text-green-800'
                            : 'text-yellow-800'
                        }`}
                      >
                        {analysis.recommendations.recommendedAction}
                      </p>
                      {analysis.recommendations.potentialSavings > 0 && (
                        <p
                          className={`mt-1 text-sm ${
                            analysis.recommendations.refinanceOpportunity
                              ? 'text-green-700'
                              : 'text-yellow-700'
                          }`}
                        >
                          Potential savings: ${analysis.recommendations.potentialSavings.toLocaleString()}
                          /month
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6 flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 inline-flex justify-center items-center rounded-md bg-gray-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Analyze Another Statement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
