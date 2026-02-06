/**
 * @file PaymentComparisonBar.tsx
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

import type { ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';

interface PaymentComparisonDatum {
  name: string;
  payment: number;
}

interface PaymentComparisonBarProps {
  data: PaymentComparisonDatum[];
  height?: number;
  yAxisLabel?: ReactNode;
}

export default function PaymentComparisonBar({
  data,
  height = 260,
  yAxisLabel,
}: PaymentComparisonBarProps) {
  if (!data || data.length === 0) return null;

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
            tickFormatter={(v) => `$${v.toLocaleString()}`}
            label={
              yAxisLabel
                ? {
                    value: String(yAxisLabel),
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: 11, fill: '#6B7280' },
                  }
                : undefined
            }
          />
          <Tooltip
            cursor={{ fill: 'rgba(15, 23, 42, 0.03)' }}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              borderColor: '#E5E7EB',
            }}
            formatter={(value) => [`$${(Number(value) || 0).toLocaleString()}`, 'Monthly payment']}
          />
          <Bar
            dataKey="payment"
            radius={[4, 4, 0, 0]}
            fill="#2563EB"
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

