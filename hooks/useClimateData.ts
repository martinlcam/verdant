'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNASAMonthlyData, fetchNASATemperatureData, formatNASADate } from '@/lib/api/nasa';
import type { City } from '@/types';

/**
 * Hook to fetch daily temperature data from NASA POWER API
 */
export function useNASADailyTemperature(city: City, days: number = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return useQuery({
    queryKey: ['nasa-daily-temp', city.id, days],
    queryFn: async () => {
      const data = await fetchNASATemperatureData(
        city.coordinates[0],
        city.coordinates[1],
        formatNASADate(startDate),
        formatNASADate(endDate),
      );
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
}

/**
 * Hook to fetch monthly temperature averages from NASA POWER API
 */
export function useNASAMonthlyTemperature(city: City, year?: number) {
  const targetYear = year || new Date().getFullYear() - 1; // Use last year for complete data

  return useQuery({
    queryKey: ['nasa-monthly-temp', city.id, targetYear],
    queryFn: async () => {
      const data = await fetchNASAMonthlyData(city.coordinates[0], city.coordinates[1], targetYear);
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });
}

/**
 * Hook to fetch temperature comparison data (urban point vs nearby rural point)
 * Simulates heat island effect by comparing city center to a point 50km away
 */
export function useHeatIslandComparison(city: City) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  // Rural offset (approximately 50km north)
  const ruralLat = city.coordinates[0] + 0.45;
  const ruralLon = city.coordinates[1];

  return useQuery({
    queryKey: ['heat-island-comparison', city.id],
    queryFn: async () => {
      const [urbanData, ruralData] = await Promise.all([
        fetchNASATemperatureData(
          city.coordinates[0],
          city.coordinates[1],
          formatNASADate(startDate),
          formatNASADate(endDate),
        ),
        fetchNASATemperatureData(
          ruralLat,
          ruralLon,
          formatNASADate(startDate),
          formatNASADate(endDate),
        ),
      ]);

      // Calculate averages
      const urbanAvg = urbanData.reduce((sum, d) => sum + d.temperature, 0) / urbanData.length || 0;
      const ruralAvg = ruralData.reduce((sum, d) => sum + d.temperature, 0) / ruralData.length || 0;
      const heatIslandIntensity = urbanAvg - ruralAvg;

      // Create comparison timeline
      const comparison = urbanData.map((urban) => {
        const rural = ruralData.find((r) => r.date === urban.date);
        return {
          date: urban.date,
          urban: urban.temperature,
          rural: rural?.temperature || urban.temperature - 2,
          differential: urban.temperature - (rural?.temperature || urban.temperature - 2),
        };
      });

      return {
        urbanAvg: Math.round(urbanAvg * 10) / 10,
        ruralAvg: Math.round(ruralAvg * 10) / 10,
        heatIslandIntensity: Math.round(heatIslandIntensity * 10) / 10,
        comparison,
      };
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
}

/**
 * Calculate climate statistics from NASA data
 */
export function useClimateStats(city: City) {
  const { data: monthlyData, isLoading: monthlyLoading } = useNASAMonthlyTemperature(city);
  const { data: heatIsland, isLoading: heatIslandLoading } = useHeatIslandComparison(city);

  const isLoading = monthlyLoading || heatIslandLoading;

  const stats = {
    avgUrbanTemp: heatIsland?.urbanAvg || 0,
    avgRuralTemp: heatIsland?.ruralAvg || 0,
    heatIslandIntensity: heatIsland?.heatIslandIntensity || 0,
    maxTemp: monthlyData ? Math.max(...monthlyData.map((m) => m.maxTemp)) : 0,
    minTemp: monthlyData ? Math.min(...monthlyData.map((m) => m.minTemp)) : 0,
    yearlyAvg: monthlyData
      ? Math.round((monthlyData.reduce((sum, m) => sum + m.avgTemp, 0) / monthlyData.length) * 10) /
        10
      : 0,
  };

  return { stats, isLoading };
}
