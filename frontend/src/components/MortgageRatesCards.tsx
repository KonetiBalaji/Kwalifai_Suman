/**
 * @file MortgageRatesCards.tsx
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

import { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { format, subMonths, subYears } from 'date-fns';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler);

type SeriesConfig = {
  id: string;
  label: string;
  col: 1 | 2 | 3;
  color: string;
  visible: boolean;
};

type SeriesState = SeriesConfig & {
  points: { x: Date; y: number }[];
};

const SERIES_CONFIG: SeriesConfig[] = [
  // Col 1 – cool blues / teals
  { id: 'OBMMIC30YF', label: '30-Yr. Conforming', col: 1, color: '#2563eb', visible: false },
  { id: 'OBMMIJUMBO30YF', label: '30-Yr. Jumbo', col: 1, color: '#0891b2', visible: false },
  { id: 'OBMMIFHA30YF', label: '30-Yr. FHA', col: 1, color: '#0d9488', visible: false },
  { id: 'OBMMIVA30YF', label: '30-Yr. VA', col: 1, color: '#10b981', visible: false },
  { id: 'OBMMIUSDA30YF', label: '30-Yr. USDA', col: 1, color: '#22c55e', visible: false },
  { id: 'OBMMIC15YF', label: '15-Yr. Conforming', col: 1, color: '#a855f7', visible: false },
  // Col 2 – greens / limes
  { id: 'OBMMIC30YFLVLE80FGE740', label: 'FICO > 740', col: 2, color: '#15803d', visible: false },
  { id: 'OBMMIC30YFLVLE80FB720A739', label: 'FICO 720 - 739', col: 2, color: '#16a34a', visible: false },
  { id: 'OBMMIC30YFLVLE80FB700A719', label: 'FICO 700 - 719', col: 2, color: '#22c55e', visible: false },
  { id: 'OBMMIC30YFLVLE80FB680A699', label: 'FICO 680 - 699', col: 2, color: '#4ade80', visible: false },
  { id: 'OBMMIC30YFLVLE80FLT680', label: 'FICO < 680', col: 2, color: '#a3e635', visible: false },
  // Col 3 – warm oranges / reds
  { id: 'OBMMIC30YFLVGT80FGE740', label: 'FICO > 740', col: 3, color: '#ea580c', visible: true }, // default on
  { id: 'OBMMIC30YFLVGT80FB720A739', label: 'FICO 720 - 739', col: 3, color: '#f97316', visible: false },
  { id: 'OBMMIC30YFLVGT80FB700A719', label: 'FICO 700 - 719', col: 3, color: '#fb923c', visible: false },
  { id: 'OBMMIC30YFLVGT80FB680A699', label: 'FICO 680 - 699', col: 3, color: '#ef4444', visible: false },
  { id: 'OBMMIC30YFLVGT80FLT680', label: 'FICO < 680', col: 3, color: '#f97373', visible: false },
];

const CORS_PROXY = 'https://corsproxy.io/?';
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';
const API_KEY = process.env.NEXT_PUBLIC_FRED_API_KEY;

const RANGE_PRESETS = [
  { label: '1M', months: 1 },
  { label: '3M', months: 3 },
  { label: '6M', months: 6 },
  { label: '1Y', months: 12 },
  { label: '2Y', months: 24 },
];

export default function MortgageRatesCards() {
  const [series, setSeries] = useState<SeriesState[]>(
    SERIES_CONFIG.map((s) => ({ ...s, points: [] })),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRangeMonths, setActiveRangeMonths] = useState<number | null>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      if (!API_KEY) {
        setError('Mortgage rate data is temporarily unavailable.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const start = subYears(new Date(), 5);
      const startStr = format(start, 'yyyy-MM-dd');

      try {
        const updated = await Promise.all(
          SERIES_CONFIG.map(async (cfg) => {
            const url = `${CORS_PROXY}${encodeURIComponent(
              `${FRED_BASE_URL}?series_id=${cfg.id}&api_key=${API_KEY}&file_type=json&observation_start=${startStr}`,
            )}`;

            const res = await fetch(url);
            if (!res.ok) {
              throw new Error(`Failed to load data for ${cfg.label}`);
            }

            const json = await res.json();
            const observations: { date: string; value: string }[] = json?.observations ?? [];

            const points = observations
              .map((obs) => ({
                x: new Date(obs.date),
                y: Number.parseFloat(obs.value),
              }))
              .filter((pt) => Number.isFinite(pt.y));

            return { ...cfg, points };
          }),
        );

        setSeries(updated);

        const today = new Date();
        setEndDate(today);
        setStartDate(subMonths(today, 1));
        setActiveRangeMonths(1);
      } catch (err) {
        setError('Unable to load live mortgage rate data right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleRangeClick = (months: number) => {
    const today = new Date();
    setEndDate(today);
    setStartDate(subMonths(today, months));
    setActiveRangeMonths(months);
  };

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    const date = value ? new Date(value) : null;
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setActiveRangeMonths(null);
  };

  const handleToggleSeries = (id: string) => {
    setSeries((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
    );
  };

  const chartDatasets = useMemo(
    () =>
      series
        .filter((s) => s.points.length > 0)
        .map((s) => ({
          label: s.label,
          data: s.points,
          borderColor: s.color,
          backgroundColor: s.color,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHitRadius: 10,
          spanGaps: true,
          hidden: !s.visible,
        })),
    [series],
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest' as const,
        axis: 'x' as const,
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          titleColor: '#111827',
          bodyColor: '#111827',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 10,
          displayColors: true,
          callbacks: {
            label: (ctx: any) =>
              `${ctx.dataset.label}: ${Number(ctx.parsed.y).toFixed(3)}%`,
          },
        },
      },
      scales: {
        x: {
          type: 'time' as const,
          time: {
            unit: 'week' as const,
            tooltipFormat: 'MMM d, yyyy',
          },
          grid: { display: false, drawBorder: false },
          ticks: {
            color: '#6b7280',
            font: { size: 11 },
          },
          min: startDate ?? undefined,
          max: endDate ?? undefined,
        },
        y: {
          grid: {
            color: '#f3f4f6',
          },
          ticks: {
            color: '#6b7280',
            font: { size: 11 },
            callback: (val: string | number) => `${Number(val).toFixed(3)}%`,
          },
          border: { display: false },
        },
      },
    }),
    [startDate, endDate],
  );

  const latestPrimarySeries = useMemo(() => {
    const primary = series.find((s) => s.id === 'OBMMIC30YF');
    if (!primary || primary.points.length === 0) return null;
    const lastPoint = primary.points[primary.points.length - 1];
    return {
      label: primary.label,
      rate: lastPoint.y,
      asOf: lastPoint.x,
    };
  }, [series]);

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mortgage rates today</h1>
          <p className="mt-1 text-sm text-gray-600">
            Live national mortgage rate data from the Federal Reserve. Values are pulled
            directly from the FRED API on every visit.
          </p>
        </div>

        {latestPrimarySeries && (
          <div className="rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-900 shadow-sm">
            <div className="flex items-baseline gap-2">
              <span className="font-medium">{latestPrimarySeries.label}</span>
              <span className="text-2xl font-semibold">
                {latestPrimarySeries.rate.toFixed(3)}%
              </span>
            </div>
            <p className="mt-1 text-xs text-sky-800">
              As of {format(latestPrimarySeries.asOf, 'MMM d, yyyy')} (no values are
              hard-coded; all data is fetched from the API).
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-4 flex flex-col gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <div className="flex flex-col gap-1 text-xs text-gray-500">
              <span className="font-medium text-gray-700">Date range</span>
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="date"
                  className="h-7 rounded border border-gray-200 px-2 text-xs text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => handleCustomDateChange('start', e.target.value)}
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  className="h-7 rounded border border-gray-200 px-2 text-xs text-gray-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => handleCustomDateChange('end', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2 rounded-full bg-gray-50 p-1">
              {RANGE_PRESETS.map((preset) => (
                <button
                  key={preset.months}
                  type="button"
                  onClick={() => handleRangeClick(preset.months)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                    activeRangeMonths === preset.months
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <span className="h-4 w-4 rounded-full border border-gray-300 bg-gray-100" />
              Print chart
            </button>
          </div>
        </div>

        <div className="relative h-[360px] w-full">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              Loading live mortgage rate data…
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-center text-sm text-red-600">
              {error}
            </div>
          ) : chartDatasets.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              No data available for the selected range.
            </div>
          ) : (
            <Line data={{ datasets: chartDatasets }} options={chartOptions} />
          )}
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((col) => (
              <div key={col} className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {col === 1 && 'Primary mortgage rates'}
                  {col === 2 && '30-Yr. Conforming · LTV ≤ 80'}
                  {col === 3 && '30-Yr. Conforming · LTV > 80'}
                </h3>
                <div className="space-y-2">
                  {series
                    .filter((s) => s.col === col)
                    .map((s) => (
                      <label
                        key={s.id}
                        className="flex cursor-pointer items-center gap-3 text-sm text-gray-800"
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleSeries(s.id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
                            s.visible
                              ? 'border-sky-600 bg-sky-600'
                              : 'border-gray-300 bg-gray-200'
                          }`}
                        >
                          <span
                            className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform"
                            style={{
                              transform: s.visible ? 'translateX(16px)' : 'translateX(2px)',
                            }}
                          />
                        </button>
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: s.color }}
                          />
                          {s.label}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
