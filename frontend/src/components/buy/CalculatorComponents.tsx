'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

// Toggle Switch Component
export function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
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
export function SliderInput({ 
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
export function CreditScoreSlider({ value, onChange }: { value: string; onChange: (value: string) => void }) {
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
export function Dropdown({ 
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
