/**
 * @file BalanceOverTimeLine.tsx
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
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface BalancePoint {
  paymentNumber: number;
  balance: number;
}

interface BalanceOverTimeLineProps {
  data: BalancePoint[];
  height?: number;
  yAxisLabel?: ReactNode;
}

export default function BalanceOverTimeLine({
  data,
  height = 260,
  yAxisLabel,
}: BalanceOverTimeLineProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 12, right: 16, bottom: 8, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="paymentNumber"
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            tick={{ fontSize: 11, fill: '#6B7280' }}
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
            cursor={{ stroke: '#CBD5F5', strokeWidth: 1 }}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              borderColor: '#E5E7EB',
            }}
            formatter={(value) => [`$${(Number(value) || 0).toLocaleString()}`, 'Balance']}
            labelFormatter={(label) => `Payment #${Number(label) || 0}`}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#2563EB"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

