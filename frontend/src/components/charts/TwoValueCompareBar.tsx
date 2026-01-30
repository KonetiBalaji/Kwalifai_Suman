/**
 * @file TwoValueCompareBar.tsx
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

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface TwoValueCompareBarProps {
  /** Label for first value (e.g., 'Before', '15-Year') */
  labelA: string;
  /** Label for second value (e.g., 'After', '30-Year') */
  labelB: string;
  /** Numeric values to compare */
  valueA: number;
  valueB: number;
  height?: number;
  valueFormatter?: (value: number) => string;
}

export default function TwoValueCompareBar({
  labelA,
  labelB,
  valueA,
  valueB,
  height = 220,
  valueFormatter,
}: TwoValueCompareBarProps) {
  const format = valueFormatter ?? ((v: number) => `$${v.toLocaleString()}`);

  const data = [
    { name: labelA, value: valueA },
    { name: labelB, value: valueB },
  ];

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 12, right: 16, bottom: 8, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            tick={{ fontSize: 12, fill: '#4B5563' }}
          />
          <YAxis
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            tickFormatter={(v) => format(v)}
          />
          <Tooltip
            cursor={{ fill: 'rgba(15, 23, 42, 0.03)' }}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              borderColor: '#E5E7EB',
            }}
            formatter={(value: number, _name: string) => [format(value), 'Value']}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#4F46E5" maxBarSize={80} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

