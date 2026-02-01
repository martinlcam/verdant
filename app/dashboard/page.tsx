'use client';

import { BarChart3, Map as MapIcon, TreeDeciduous } from 'lucide-react';
import dynamic from 'next/dynamic';
import { HeatZoneList } from '@/components/analytics/HeatZoneList';
import { ImpactProjections } from '@/components/analytics/ImpactProjections';
import { StatsCards } from '@/components/analytics/StatsCards';
import { TemperatureChart } from '@/components/analytics/TemperatureChart';
import { TimeSlider } from '@/components/controls/TimeSlider';
import { ExportPanel } from '@/components/export/ExportPanel';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { RecommendationsPanel } from '@/components/recommendations/RecommendationsPanel';
import { useDashboardStore } from '@/lib/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dynamic import for HeatMap (uses Leaflet which requires client-side rendering)
const HeatMap = dynamic(() => import('@/components/map/HeatMap').then((mod) => mod.HeatMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto" />
        <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  ),
});

// Dynamic import for MapboxMap (3D visualization)
const MapboxMap = dynamic(() => import('@/components/map/MapboxMap').then((mod) => mod.MapboxMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto" />
        <p className="text-gray-600 dark:text-gray-400">Loading 3D map...</p>
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  const { enable3D } = useDashboardStore();

  return (
    <DashboardShell>
      <div className="flex h-full flex-col overflow-hidden">
        {/* Mobile Tabs */}
        <div className="lg:hidden">
          <Tabs defaultValue="map" className="h-full flex flex-col">
            <div className="border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-800 dark:bg-gray-950">
              <TabsList className="w-full">
                <TabsTrigger value="map" className="flex-1 gap-2">
                  <MapIcon className="h-4 w-4" />
                  Map
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex-1 gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="actions" className="flex-1 gap-2">
                  <TreeDeciduous className="h-4 w-4" />
                  Actions
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="map"
              className="flex-1 m-0 data-[state=active]:flex data-[state=active]:flex-col"
            >
              <div className="flex-1">
                {enable3D ? <MapboxMap /> : <HeatMap />}
              </div>
              <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                <TimeSlider />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="flex-1 overflow-auto p-4 space-y-4 m-0">
              <StatsCards />
              <TemperatureChart />
              <HeatZoneList />
              <ImpactProjections />
            </TabsContent>

            <TabsContent value="actions" className="flex-1 overflow-auto p-4 space-y-4 m-0">
              <RecommendationsPanel />
              <ExportPanel />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:flex-1 lg:overflow-hidden">
          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Stats Row */}
            <div className="shrink-0 border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
              <StatsCards />
            </div>

            {/* Map and Charts Row */}
            <div className="flex flex-1 overflow-hidden">
              {/* Map Section */}
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1">
                  {enable3D ? <MapboxMap /> : <HeatMap />}
                </div>
                <div className="shrink-0 border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                  <TimeSlider />
                </div>
              </div>

              {/* Right Panel - Charts & Analytics */}
              <div className="w-[400px] shrink-0 overflow-y-auto border-l border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="space-y-4">
                  <TemperatureChart />
                  <HeatZoneList />
                  <ImpactProjections />
                  <ExportPanel />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Panel */}
          <div className="w-[350px] shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <RecommendationsPanel />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
