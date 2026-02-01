'use client';

import { useMemo } from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/lib/store';
import { generateHeatZones } from '@/lib/data';
import { formatTemperature } from '@/lib/utils';

export function HeatZoneList() {
  const { selectedCity, temperatureUnit, setSelectedHeatZone } = useDashboardStore();

  const zones = useMemo(() => {
    return generateHeatZones(selectedCity).slice(0, 5);
  }, [selectedCity]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Flame className="h-4 w-4 text-red-500" />
          Top Heat Zones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {zones.map((zone, index) => (
            <button
              key={zone.id}
              onClick={() => setSelectedHeatZone(zone)}
              className="flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600 dark:bg-red-900 dark:text-red-400">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-gray-900 dark:text-white">
                  {zone.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {zone.area.toFixed(2)} km² · Vulnerability: {zone.vulnerabilityScore.toFixed(0)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600 dark:text-red-400">
                  {formatTemperature(zone.avgTemperature, temperatureUnit)}
                </p>
                <Badge
                  variant={zone.severity as 'extreme' | 'high' | 'moderate' | 'low'}
                  className="text-xs"
                >
                  {zone.severity}
                </Badge>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
