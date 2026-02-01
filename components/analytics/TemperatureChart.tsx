'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStore } from '@/lib/store';
import { generateTemperatureHistory } from '@/lib/data';

export function TemperatureChart() {
  const { selectedCity, temperatureUnit } = useDashboardStore();

  const data = useMemo(() => {
    const history = generateTemperatureHistory(selectedCity, 12);
    return history.map((record) => ({
      ...record,
      urban: temperatureUnit === 'F' ? (record.urban * 9) / 5 + 32 : record.urban,
      rural: temperatureUnit === 'F' ? (record.rural * 9) / 5 + 32 : record.rural,
      differential: temperatureUnit === 'F' 
        ? (record.differential * 9) / 5 
        : record.differential,
    }));
  }, [selectedCity, temperatureUnit]);

  const formatMonth = (dateStr: string) => {
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Temperature Trends (12 Months)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="urbanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ruralGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatMonth}
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}°${temperatureUnit}`,
                  name === 'urban' ? 'Urban' : name === 'rural' ? 'Rural' : 'Difference',
                ]}
                labelFormatter={(label) => formatMonth(label as string)}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => (
                  <span className="text-xs capitalize">{value}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="urban"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#urbanGradient)"
                name="urban"
              />
              <Area
                type="monotone"
                dataKey="rural"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#ruralGradient)"
                name="rural"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
