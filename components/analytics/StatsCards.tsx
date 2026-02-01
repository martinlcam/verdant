'use client';

import { Flame, Leaf, Loader2, ThermometerSun, TrendingUp, Users } from 'lucide-react';
import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useHeatIslandComparison } from '@/hooks/useClimateData';
import { generateCityStats, generateRecommendations } from '@/lib/data';
import { useDashboardStore } from '@/lib/store';
import { formatNumber, formatTemperature, formatTemperatureDifference } from '@/lib/utils';

export function StatsCards() {
  const { selectedCity, implementedRecommendations } = useDashboardStore();
  const { data: heatIslandData, isLoading } = useHeatIslandComparison(selectedCity);

  // Get stable recommendations (memoized by city)
  const allRecommendations = useMemo(() => {
    return generateRecommendations(selectedCity);
  }, [selectedCity]);

  // Get only implemented recommendations
  const implementedRecs = useMemo(() => {
    return allRecommendations.filter((rec) => implementedRecommendations.includes(rec.id));
  }, [allRecommendations, implementedRecommendations]);

  // Use NASA data for temperature stats, fallback to generated data for others
  // Stats now account for implemented recommendations
  const mockStats = useMemo(() => {
    return generateCityStats(selectedCity, implementedRecs);
  }, [selectedCity, implementedRecs]);

  const stats = {
    avgUrbanTemp: heatIslandData?.urbanAvg ?? mockStats.avgUrbanTemp,
    avgRuralTemp: heatIslandData?.ruralAvg ?? mockStats.avgRuralTemp,
    heatIslandIntensity: heatIslandData?.heatIslandIntensity ?? mockStats.heatIslandIntensity,
    hotspotCount: mockStats.hotspotCount,
    greenCoverage: mockStats.greenCoverage,
    vulnerablePopulation: mockStats.vulnerablePopulation,
  };

  const cards = [
    {
      title: 'Urban Temperature',
      value: isLoading ? null : formatTemperature(stats.avgUrbanTemp),
      icon: <ThermometerSun className="h-5 w-5" />,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950',
      description: '30-day avg (NASA)',
      isLoading,
      tooltip: {
        source: 'NASA POWER API (T2M parameter - temperature at 2 meters)',
        location: 'City center coordinates',
        calculation: '30-day average of daily temperature readings',
      },
    },
    {
      title: 'Rural Temperature',
      value: isLoading ? null : formatTemperature(stats.avgRuralTemp),
      icon: <Leaf className="h-5 w-5" />,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
      description: '30-day avg (NASA)',
      isLoading,
      tooltip: {
        source: 'NASA POWER API (T2M parameter)',
        location: 'Point approximately 50km north of city center',
        calculation: '30-day average of daily temperature readings',
      },
    },
    {
      title: 'Heat Island Effect',
      value: isLoading
        ? null
        : `${stats.heatIslandIntensity >= 0 ? '+' : ''}${formatTemperatureDifference(stats.heatIslandIntensity)}`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      description: 'Urban vs. rural diff',
      isLoading,
      tooltip: {
        calculation: 'Urban Temperature - Rural Temperature',
        explanation:
          'Positive values indicate the urban area is warmer than surrounding rural areas, demonstrating the urban heat island effect.',
      },
    },
    {
      title: 'Hotspot Zones',
      value: stats.hotspotCount.toString(),
      icon: <Flame className="h-5 w-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
      description: 'High-risk areas',
      isLoading: false,
      tooltip: {
        source: 'Heat zone analysis based on temperature mapping',
        calculation:
          'Areas identified with severity levels (low, moderate, high, extreme) based on temperature thresholds and vulnerability scores',
        location: 'High-risk areas throughout the city with elevated temperatures',
      },
    },
    {
      title: 'Green Coverage',
      value: `${stats.greenCoverage}%`,
      icon: <Leaf className="h-5 w-5" />,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
      description: 'Vegetation & parks',
      isLoading: false,
      tooltip: {
        source: 'Vegetation and park area analysis',
        calculation:
          'Percentage of city area covered by vegetation, parks, and green infrastructure',
        location: 'City-wide assessment of green spaces and natural areas',
      },
    },
    {
      title: 'Vulnerable Population',
      value: formatNumber(stats.vulnerablePopulation),
      icon: <Users className="h-5 w-5" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      description: 'At-risk residents',
      isLoading: false,
      tooltip: {
        source: 'Population demographics and heat vulnerability assessment',
        calculation:
          'Estimated 8-20% of total city population at higher risk from heat exposure (elderly, children, low-income communities, those with limited access to cooling)',
        location: 'At-risk residents across the city',
      },
    },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {card.isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    ) : (
                      card.value
                    )}
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {card.description}
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`rounded-lg p-2 ${card.bgColor} cursor-help`}>
                      <span className={card.color}>{card.icon}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-xs p-4 text-sm !bg-gray-900 !border-gray-800 !text-gray-100 shadow-xl backdrop-blur-sm"
                  >
                    <div className="space-y-2">
                      <h4 className="font-semibold mb-2 text-gray-50">{card.title}</h4>
                      {card.tooltip.source && (
                        <p className="text-xs text-gray-300 leading-relaxed">
                          <strong className="text-gray-200">Source:</strong> {card.tooltip.source}
                        </p>
                      )}
                      {card.tooltip.location && (
                        <p className="text-xs text-gray-300 leading-relaxed mt-1">
                          <strong className="text-gray-200">Location:</strong>{' '}
                          {card.tooltip.location}
                        </p>
                      )}
                      {card.tooltip.calculation && (
                        <p className="text-xs text-gray-300 leading-relaxed mt-1">
                          <strong className="text-gray-200">Calculation:</strong>{' '}
                          {card.tooltip.calculation}
                        </p>
                      )}
                      {card.tooltip.explanation && (
                        <p className="text-xs text-gray-300 leading-relaxed mt-1">
                          {card.tooltip.explanation}
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}
