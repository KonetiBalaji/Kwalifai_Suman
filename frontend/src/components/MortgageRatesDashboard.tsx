/**
 * @file MortgageRatesDashboard.tsx
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

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Calendar, Printer, Linkedin, Facebook, Twitter, Mail } from 'lucide-react';
import { format, subMonths, subYears } from 'date-fns';

// Use Next.js API route to proxy FRED API requests (avoids CORS issues)
const FRED_PROXY_URL = '/api/fred';

// FRED Series IDs for different mortgage types (all live from FRED API)
const FRED_SERIES_IDS: Record<string, string | null> = {
  '30-Yr. Conforming': 'MORTGAGE30US',
  '30-Yr. Jumbo': 'OBMMIJUMBO30YF', // Optimal Blue Jumbo Index
  '30-Yr. FHA': 'OBMMIFHA30YF', // Optimal Blue FHA Index
  '30-Yr. VA': 'OBMMIVA30YF', // Optimal Blue VA Index
  '15-Yr. Conforming': 'MORTGAGE15US',
  '30-Yr. USDA': null, // Not available in FRED API
};

interface RateDataPoint {
  date: string;
  [key: string]: string | number;
}

interface FilterState {
  primaryRates: {
    '30-Yr. Conforming': boolean;
    '30-Yr. Jumbo': boolean;
    '30-Yr. FHA': boolean;
    '30-Yr. VA': boolean;
    '30-Yr. USDA': boolean;
    '15-Yr. Conforming': boolean;
  };
  ltv80: {
    'FICO > 740': boolean;
    'FICO 720 - 739': boolean;
    'FICO 700 - 719': boolean;
    'FICO 680 - 699': boolean;
    'FICO < 680': boolean;
  };
  ltv80Plus: {
    'FICO > 740': boolean;
    'FICO 720 - 739': boolean;
    'FICO 700 - 719': boolean;
    'FICO 680 - 699': boolean;
    'FICO < 680': boolean;
  };
}

export default function MortgageRatesDashboard() {
  const [timePeriod, setTimePeriod] = useState<'1M' | '3M' | '6M' | '1Y' | '2Y'>('1M');
  const now = new Date();
  const [startDate, setStartDate] = useState<Date>(subMonths(now, 1));
  const [endDate, setEndDate] = useState<Date>(now);
  const [chartData, setChartData] = useState<RateDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    primaryRates: {
      '30-Yr. Conforming': true, // Enable by default to show graph
      '30-Yr. Jumbo': false,
      '30-Yr. FHA': false,
      '30-Yr. VA': false,
      '30-Yr. USDA': false,
      '15-Yr. Conforming': false,
    },
    ltv80: {
      'FICO > 740': false,
      'FICO 720 - 739': false,
      'FICO 700 - 719': false,
      'FICO 680 - 699': false,
      'FICO < 680': false,
    },
    ltv80Plus: {
      'FICO > 740': false,
      'FICO 720 - 739': false,
      'FICO 700 - 719': false,
      'FICO 680 - 699': false,
      'FICO < 680': false,
    },
  });

  // Update dates when time period changes
  useEffect(() => {
    const now = new Date();
    switch (timePeriod) {
      case '1M':
        setStartDate(subMonths(now, 1));
        break;
      case '3M':
        setStartDate(subMonths(now, 3));
        break;
      case '6M':
        setStartDate(subMonths(now, 6));
        break;
      case '1Y':
        setStartDate(subYears(now, 1));
        break;
      case '2Y':
        setStartDate(subYears(now, 2));
        break;
    }
    setEndDate(now);
  }, [timePeriod]);

  // Get all active filter labels (only include filters that have data)
  const getActiveFilters = (): string[] => {
    const active: string[] = [];

    // Primary rates (these have data from FRED)
    Object.entries(filters.primaryRates).forEach(([key, isActive]) => {
      if (isActive) active.push(key);
    });

    return active.length > 0 ? active : ['30-Yr. Conforming'];
  };

  // Fetch data from FRED API
  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get all unique series IDs that are active in filters
        const activeSeries = new Set<string>();
        Object.entries(filters.primaryRates).forEach(([key, isActive]) => {
          if (isActive && FRED_SERIES_IDS[key]) {
            const seriesId = FRED_SERIES_IDS[key];
            if (seriesId) {
              activeSeries.add(seriesId);
            }
          }
        });

        // If no primary rates are active, fetch default 30-year rate
        if (activeSeries.size === 0) {
          activeSeries.add('MORTGAGE30US');
        }

        const startDateStr = format(startDate, 'yyyy-MM-dd');
        const endDateStr = format(endDate, 'yyyy-MM-dd');

        console.log('Fetching series:', Array.from(activeSeries));
        console.log('Date range:', startDateStr, 'to', endDateStr);

        // Fetch all required series from FRED API via proxy (avoids CORS issues)
        const fetchPromises = Array.from(activeSeries).map(seriesId =>
          fetch(
            `${FRED_PROXY_URL}?series_id=${seriesId}&observation_start=${startDateStr}&observation_end=${endDateStr}`
          ).then(async (response) => {
            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Failed to fetch ${seriesId}:`, response.status, errorText);
              return { seriesId, observations: [], error: `HTTP ${response.status}` };
            }
            const data = await response.json();
            console.log(`Successfully fetched ${seriesId}:`, data.observations?.length || 0, 'observations');
            return { seriesId, observations: data.observations || [] };
          }).catch((error) => {
            console.error(`Error fetching ${seriesId}:`, error);
            return { seriesId, observations: [], error: error.message };
          })
        );

        const results = await Promise.all(fetchPromises);

        // Create a map: seriesId -> date -> rate value
        const seriesDataMap = new Map<string, Map<string, number>>();
        const allDates = new Set<string>();

        results.forEach(({ seriesId, observations }) => {
          const dateMap = new Map<string, number>();
          observations.forEach((obs: any) => {
            // FRED API returns "." for missing values, skip those
            if (obs.value && obs.value !== '.' && obs.value !== '' && obs.value !== null) {
              const value = parseFloat(obs.value);
              if (!isNaN(value) && value > 0) {
                dateMap.set(obs.date, value);
                allDates.add(obs.date);
              }
            }
          });
          if (dateMap.size > 0) {
            seriesDataMap.set(seriesId, dateMap);
            console.log(`Processed ${seriesId}: ${dateMap.size} data points`);
          } else {
            console.warn(`No valid data points for ${seriesId}`);
          }
        });

        if (seriesDataMap.size === 0) {
          throw new Error('No data received from FRED API. Please check your API key and date range.');
        }

        // Transform data for chart
        const sortedDates = Array.from(allDates).sort();
        const transformedData: RateDataPoint[] = [];

        sortedDates.forEach((dateStr) => {
          // Format date for display
          const formattedDate = format(new Date(dateStr + 'T00:00:00'), 'MMM d, yyyy');
          const dataPoint: RateDataPoint = {
            date: formattedDate,
          };

          // Add primary rates from FRED (only if data exists)
          Object.entries(filters.primaryRates).forEach(([key, isActive]) => {
            if (isActive) {
              const seriesId = FRED_SERIES_IDS[key];
              if (seriesId) {
                const dateMap = seriesDataMap.get(seriesId);
                const rate = dateMap?.get(dateStr);
                if (rate !== undefined && rate > 0) {
                  dataPoint[key] = rate;
                }
              }
            }
          });

          // If no filters active, use default
          const hasAnyActive = Object.values(filters.primaryRates).some(v => v);
          if (!hasAnyActive) {
            const defaultRate = seriesDataMap.get('MORTGAGE30US')?.get(dateStr);
            if (defaultRate !== undefined && defaultRate > 0) {
              dataPoint['30-Yr. Conforming'] = defaultRate;
            }
          }

          // Only add data point if it has at least one rate value
          const hasRateData = Object.keys(dataPoint).some(key => 
            key !== 'date' && 
            typeof dataPoint[key] === 'number' && 
            dataPoint[key] > 0
          );

          if (hasRateData) {
            transformedData.push(dataPoint);
          }
        });

        console.log('Transformed data points:', transformedData.length);
        if (transformedData.length > 0) {
          console.log('Sample data point:', transformedData[0]);
          console.log('All data points:', transformedData);
        }

        if (transformedData.length === 0) {
          throw new Error('No data available after transformation. Please check your filters or try a different date range.');
        }

        setChartData(transformedData);
      } catch (error: any) {
        console.error('Error fetching mortgage rates:', error);
        setError(error.message || 'Failed to fetch mortgage rates. Please try again later.');
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [startDate, endDate, filters]);

  const toggleFilter = (category: keyof FilterState, key: string) => {
    setFilters((prev) => {
      const current = prev[category] as Record<string, boolean>;
      return {
        ...prev,
        [category]: {
          ...current,
          [key]: !current[key],
        },
      };
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = 'Check out current mortgage rates on Kwalifai';
    
    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
      case 'print':
        window.print();
        break;
    }
  };

  // Get active filters for rendering lines
  const activeFilters = getActiveFilters();
  const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  return (
    <div className="w-full">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Date Range */}
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <input
            type="date"
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <span className="text-gray-600">-</span>
          <input
            type="date"
            value={format(endDate, 'yyyy-MM-dd')}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Time Period Filters */}
        <div className="flex items-center gap-2">
          {(['1M', '3M', '6M', '1Y', '2Y'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timePeriod === period
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-blue-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Share Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleShare('print')}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Print"
          >
            <Printer className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Share on Facebook"
          >
            <Facebook className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Share on Twitter"
          >
            <Twitter className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleShare('email')}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Share via Email"
          >
            <Mail className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Mortgage Rates</h3>
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="h-96 flex flex-col items-center justify-center bg-red-50 rounded-lg border border-red-200">
            <p className="text-lg font-medium text-red-900 mb-2">Error</p>
            <p className="text-sm text-red-600 text-center max-w-md">{error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-lg font-medium text-gray-900 mb-2">No data available</p>
            <p className="text-sm text-gray-600 text-center max-w-md">
              Please check your filters or try a different date range. Make sure at least one primary mortgage rate is selected.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => `${value.toFixed(2)}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value) => [`${(Number(value) || 0).toFixed(3)}%`, 'Rate']}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              {/* Render lines for all active filters that have data */}
              {activeFilters.map((filterKey, index) => {
                const color = colors[index % colors.length];
                // Check if this filter has data in chartData
                const hasData = chartData.some(point => {
                  const value = point[filterKey];
                  return value !== undefined && typeof value === 'number' && value > 0;
                });
                
                if (!hasData) {
                  console.warn(`No data found for filter: ${filterKey}`);
                  return null;
                }
                
                return (
                  <Line
                    key={filterKey}
                    type="monotone"
                    dataKey={filterKey}
                    stroke={color}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: color }}
                    activeDot={{ r: 5, fill: color }}
                    name={filterKey}
                    connectNulls={false}
                  />
                );
              }).filter(Boolean)}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Primary Mortgage Rates */}
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            PRIMARY MORTGAGE RATES
          </h4>
          <div className="space-y-2">
            {Object.keys(filters.primaryRates).map((key) => (
              <label
                key={key}
                className="flex items-center justify-between cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
              >
                <span className="text-sm text-gray-700">{key}</span>
                <button
                  type="button"
                  onClick={() => toggleFilter('primaryRates', key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    filters.primaryRates[key as keyof typeof filters.primaryRates]
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      filters.primaryRates[key as keyof typeof filters.primaryRates]
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </div>

        {/* 30-YR. CONFORMING - LTV <= 80 */}
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            30-YR. CONFORMING - LTV &lt;= 80
          </h4>
          <div className="space-y-2">
            {Object.keys(filters.ltv80).map((key) => (
              <label
                key={key}
                className="flex items-center justify-between cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
              >
                <span className="text-sm text-gray-700">{key}</span>
                <button
                  type="button"
                  onClick={() => toggleFilter('ltv80', key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    filters.ltv80[key as keyof typeof filters.ltv80]
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      filters.ltv80[key as keyof typeof filters.ltv80]
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </div>

        {/* 30-YR. CONFORMING - LTV > 80 */}
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            30-YR. CONFORMING - LTV &gt; 80
          </h4>
          <div className="space-y-2">
            {Object.keys(filters.ltv80Plus).map((key) => (
              <label
                key={key}
                className="flex items-center justify-between cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
              >
                <span className="text-sm text-gray-700">{key}</span>
                <button
                  type="button"
                  onClick={() => toggleFilter('ltv80Plus', key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    filters.ltv80Plus[key as keyof typeof filters.ltv80Plus]
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      filters.ltv80Plus[key as keyof typeof filters.ltv80Plus]
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
