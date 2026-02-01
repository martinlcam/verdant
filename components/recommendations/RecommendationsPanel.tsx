'use client';

import { useMemo } from 'react';
import {
  TreeDeciduous,
  DollarSign,
  Thermometer,
  Building2,
  TreePine,
  Droplets,
  Square,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/lib/store';
import { generateRecommendations } from '@/lib/data';
import { formatCurrency, formatArea } from '@/lib/utils';
import type { GreenInfrastructureRecommendation } from '@/types';

const typeIcons: Record<string, React.ReactNode> = {
  urban_park: <TreeDeciduous className="h-4 w-4" />,
  green_roof: <Building2 className="h-4 w-4" />,
  tree_planting: <TreePine className="h-4 w-4" />,
  cool_pavement: <Square className="h-4 w-4" />,
  bioswale: <Droplets className="h-4 w-4" />,
  permeable_surface: <Square className="h-4 w-4" />,
  water_feature: <Droplets className="h-4 w-4" />,
};

const priorityColors: Record<string, string> = {
  critical:
    'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  high: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',
  medium:
    'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800',
  low: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
};

export function RecommendationsPanel() {
  const { selectedCity, setSelectedRecommendation, selectedRecommendation } = useDashboardStore();

  const recommendations = useMemo(() => {
    return generateRecommendations(selectedCity);
  }, [selectedCity]);

  const totalCost = useMemo(() => {
    return recommendations.reduce((sum, rec) => sum + rec.estimatedCost, 0);
  }, [recommendations]);

  const totalCooling = useMemo(() => {
    return (
      recommendations.reduce((sum, rec) => sum + rec.estimatedCoolingEffect, 0) /
      recommendations.length
    );
  }, [recommendations]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base font-semibold">
          <span className="flex items-center gap-2">
            <TreeDeciduous className="h-4 w-4 text-emerald-500" />
            Green Infrastructure Recommendations
          </span>
          <Badge variant="default" className="text-xs">
            {recommendations.length} projects
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {/* Summary Stats */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs font-medium">Total Investment</span>
            </div>
            <p className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-300">
              {formatCurrency(totalCost)}
            </p>
          </div>
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Thermometer className="h-4 w-4" />
              <span className="text-xs font-medium">Avg. Cooling</span>
            </div>
            <p className="mt-1 text-lg font-bold text-blue-700 dark:text-blue-300">
              -{totalCooling.toFixed(1)}°C
            </p>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="space-y-2 overflow-y-auto max-h-[400px] pr-1">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              isSelected={selectedRecommendation?.id === rec.id}
              onSelect={() => setSelectedRecommendation(rec)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface RecommendationCardProps {
  recommendation: GreenInfrastructureRecommendation;
  isSelected: boolean;
  onSelect: () => void;
}

function RecommendationCard({ recommendation, isSelected, onSelect }: RecommendationCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-lg border p-3 text-left transition-all ${
        isSelected
          ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 dark:bg-emerald-950'
          : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-800'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-lg p-2 ${priorityColors[recommendation.priority]}`}>
          {typeIcons[recommendation.type] || <TreeDeciduous className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium text-gray-900 dark:text-white">
              {recommendation.name}
            </p>
          </div>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2 dark:text-gray-400">
            {recommendation.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Thermometer className="h-3 w-3" />-{recommendation.estimatedCoolingEffect.toFixed(1)}
              °C
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 dark:text-gray-400">
              {formatCurrency(recommendation.estimatedCost)}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 dark:text-gray-400">
              {formatArea(recommendation.area)}
            </span>
          </div>
        </div>
        <Badge
          variant={
            recommendation.priority === 'critical'
              ? 'destructive'
              : recommendation.priority === 'high'
                ? 'warning'
                : 'secondary'
          }
          className="shrink-0 text-xs capitalize"
        >
          {recommendation.priority}
        </Badge>
      </div>
    </button>
  );
}
