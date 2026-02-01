'use client';

import {
  Building2,
  Droplets,
  Ruler,
  Square,
  Thermometer,
  TreeDeciduous,
  TreePine,
} from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { generateRecommendations } from '@/lib/data';
import { useDashboardStore } from '@/lib/store';
import { formatArea, formatTemperatureDifference } from '@/lib/utils';
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
  const {
    selectedCity,
    selectedDate,
    setSelectedRecommendation,
    selectedRecommendation,
    implementedRecommendations,
    toggleImplementedRecommendation,
  } = useDashboardStore();

  const recommendations = useMemo(() => {
    return generateRecommendations(selectedCity, selectedDate);
  }, [selectedCity, selectedDate]);

  const totalCooling = useMemo(() => {
    return (
      recommendations.reduce((sum, rec) => sum + rec.estimatedCoolingEffect, 0) /
      recommendations.length
    );
  }, [recommendations]);

  const totalArea = useMemo(() => {
    return recommendations.reduce((sum, rec) => sum + rec.area, 0);
  }, [recommendations]);

  const criticalCount = useMemo(() => {
    return recommendations.filter((r) => r.priority === 'critical' || r.priority === 'high').length;
  }, [recommendations]);

  return (
    <Card className="h-full flex flex-col font-alliance mr-0 border-r-0 rounded-r-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base font-semibold font-alliance">
          <span className="flex items-center gap-2">
            <TreeDeciduous className="h-4 w-4 text-emerald-500" />
            Green Infrastructure
          </span>
          <Badge variant="default" className="text-xs font-alliance">
            {recommendations.length} sites
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden min-h-0 font-alliance">
        {/* Summary Stats */}
        <div className="mb-4 grid grid-cols-3 gap-2 shrink-0">
          <div className="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-950">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Thermometer className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium">Avg Cooling</span>
            </div>
            <p className="mt-0.5 text-base font-bold text-blue-700 dark:text-blue-300">
              {formatTemperatureDifference(-totalCooling)}
            </p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-2.5 dark:bg-emerald-950">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Ruler className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium">Total Area</span>
            </div>
            <p className="mt-0.5 text-sm font-bold text-emerald-700 dark:text-emerald-300">
              {formatArea(totalArea)}
            </p>
          </div>
          <div className="rounded-lg bg-red-50 p-2.5 dark:bg-red-950">
            <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
              <TreeDeciduous className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium">Urgent Priority</span>
            </div>
            <p className="mt-0.5 text-sm font-bold text-red-700 dark:text-red-300">
              {criticalCount} sites
            </p>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="flex-1 space-y-2 overflow-y-auto pr-1 min-h-0">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              isSelected={selectedRecommendation?.id === rec.id}
              onSelect={() => {
                // Toggle selection: if already selected, deselect; otherwise select
                if (selectedRecommendation?.id === rec.id) {
                  setSelectedRecommendation(null);
                } else {
                  setSelectedRecommendation(rec);
                }
              }}
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
  const { implementedRecommendations, toggleImplementedRecommendation } = useDashboardStore();
  const isImplemented = implementedRecommendations.includes(recommendation.id);

  const handleClick = (e: React.MouseEvent) => {
    // Click the entire card to toggle implementation
    e.preventDefault();
    e.stopPropagation();
    toggleImplementedRecommendation(recommendation.id);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            className={`w-full rounded-lg border p-3 text-left transition-all font-alliance cursor-pointer ${
              isImplemented
                ? 'border-emerald-600 bg-emerald-100 ring-2 ring-emerald-500 dark:bg-emerald-900 dark:border-emerald-500'
                : isSelected
                  ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 dark:bg-emerald-950'
                  : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`rounded-lg p-2 ${priorityColors[recommendation.priority]}`}>
                <span className="text-current">
                  {typeIcons[recommendation.type] || <TreeDeciduous className="h-4 w-4" />}
                </span>
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
                    <Thermometer className="h-3 w-3" />
                    {formatTemperatureDifference(-recommendation.estimatedCoolingEffect)}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatArea(recommendation.area)}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 dark:text-gray-400 capitalize">
                    {recommendation.type.replace('_', ' ')}
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
        </TooltipTrigger>
        <TooltipContent
          side="left"
          className="max-w-sm p-4 text-sm !bg-gray-900 !border-gray-800 !text-gray-100 shadow-xl backdrop-blur-sm font-alliance"
        >
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2 text-gray-50 text-base">{recommendation.name}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">{recommendation.description}</p>
            </div>
            <div className="border-t border-gray-700 pt-2 space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <Thermometer className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-gray-300">
                  <strong className="text-gray-200">Cooling Effect:</strong>{' '}
                  {formatTemperatureDifference(-recommendation.estimatedCoolingEffect)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Ruler className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-300">
                  <strong className="text-gray-200">Area:</strong> {formatArea(recommendation.area)}
                </span>
              </div>
              <div className="text-xs">
                <span className="text-gray-300">
                  <strong className="text-gray-200">Type:</strong>{' '}
                  <span className="capitalize">{recommendation.type.replace('_', ' ')}</span>
                </span>
              </div>
              <div className="text-xs">
                <span className="text-gray-300">
                  <strong className="text-gray-200">Priority:</strong>{' '}
                  <span className="capitalize">{recommendation.priority}</span>
                </span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
