'use client';

import { useMemo } from 'react';
import { ThermometerSun, TrendingUp, Flame, Leaf, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboardStore } from '@/lib/store';
import { generateCityStats } from '@/lib/data';
import { formatTemperature, formatNumber } from '@/lib/utils';

export function StatsCards() {
  const { selectedCity, temperatureUnit } = useDashboardStore();

  const stats = useMemo(() => {
    return generateCityStats(selectedCity);
  }, [selectedCity]);

  const cards = [
    {
      title: 'Urban Temperature',
      value: formatTemperature(stats.avgUrbanTemp, temperatureUnit),
      icon: <ThermometerSun className="h-5 w-5" />,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950',
      description: 'Average urban area',
    },
    {
      title: 'Rural Temperature',
      value: formatTemperature(stats.avgRuralTemp, temperatureUnit),
      icon: <Leaf className="h-5 w-5" />,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
      description: 'Average rural area',
    },
    {
      title: 'Heat Island Effect',
      value: `+${formatTemperature(stats.heatIslandIntensity, temperatureUnit)}`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      description: 'Urban vs. rural difference',
    },
    {
      title: 'Hotspot Zones',
      value: stats.hotspotCount.toString(),
      icon: <Flame className="h-5 w-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
      description: 'High-risk areas identified',
    },
    {
      title: 'Green Coverage',
      value: `${stats.greenCoverage}%`,
      icon: <Leaf className="h-5 w-5" />,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
      description: 'Vegetation & parks',
    },
    {
      title: 'Vulnerable Population',
      value: formatNumber(stats.vulnerablePopulation),
      icon: <Users className="h-5 w-5" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      description: 'At-risk residents',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{card.description}</p>
              </div>
              <div className={`rounded-lg p-2 ${card.bgColor}`}>
                <span className={card.color}>{card.icon}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
