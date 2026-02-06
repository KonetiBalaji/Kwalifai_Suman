/**
 * @file PrincipalInterestStacked.tsx
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
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface PrincipalInterestPoint {
  paymentNumber: number;
  principal: number;
  interest: number;
}

interface PrincipalInterestStackedProps {
  data: PrincipalInterestPoint[];
  height?: number;
}

export default function PrincipalInterestStacked({
  data,
  height = 260,
}: PrincipalInterestStackedProps) {
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
          />
          <Tooltip
            cursor={{ fill: 'rgba(15, 23, 42, 0.03)' }}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              borderColor: '#E5E7EB',
            }}
            formatter={(value, name) => [
              `$${(Number(value) || 0).toLocaleString()}`,
              name === 'principal' ? 'Principal' : 'Interest',
            ]}
            labelFormatter={(label) => `Payment #${Number(label) || 0}`}
          />
          <Legend
            verticalAlign="top"
            height={24}
            wrapperStyle={{ fontSize: 11 }}
          />
          <Bar
            dataKey="principal"
            stackId="pi"
            fill="#22C55E"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="interest"
            stackId="pi"
            fill="#F97316"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

