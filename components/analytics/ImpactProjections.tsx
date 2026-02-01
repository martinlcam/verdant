'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown } from 'lucide-react';
import { useDashboardStore } from '@/lib/store';
import { generateRecommendations } from '@/lib/data';

export function ImpactProjections() {
  const { selectedCity } = useDashboardStore();

  const data = useMemo(() => {
    const recommendations = generateRecommendations(selectedCity);
    
    // Aggregate by type
    const byType = recommendations.reduce((acc, rec) => {
      const type = rec.type.replace('_', ' ');
      if (!acc[type]) {
        acc[type] = { cooling: 0, count: 0 };
      }
      acc[type].cooling += rec.estimatedCoolingEffect;
      acc[type].count += 1;
      return acc;
    }, {} as Record<string, { cooling: number; count: number }>);

    return Object.entries(byType)
      .map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        cooling: Math.round(data.cooling * 10) / 10,
        count: data.count,
      }))
      .sort((a, b) => b.cooling - a.cooling)
      .slice(0, 6);
  }, [selectedCity]);

  const colors = ['#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <TrendingDown className="h-4 w-4 text-emerald-500" />
          Projected Temperature Reduction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `-${value}°C`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10 }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value) => [`-${value}°C`, 'Cooling Effect']}
              />
              <Bar dataKey="cooling" radius={[0, 4, 4, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          Estimated cooling effect by infrastructure type
        </p>
      </CardContent>
    </Card>
  );
}
