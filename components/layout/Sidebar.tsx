'use client';

import {
  BarChart3,
  Box,
  Layers,
  Leaf,
  Map,
  Radio,
  Settings,
  ThermometerSun,
  TreeDeciduous,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDashboardStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { LayerType } from '@/types';

const layers: {
  id: LayerType;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}[] = [
  {
    id: 'heat',
    name: 'Heat Map',
    icon: <ThermometerSun className="h-4 w-4" />,
    color: 'text-red-500',
    description:
      'Toggles the display of temperature zones on the map. Shows heat hotspots with color-coded polygons (red for extreme, orange for high, yellow for moderate).',
  },
  {
    id: 'vegetation',
    name: 'Vegetation',
    icon: <Leaf className="h-4 w-4" />,
    color: 'text-green-500',
    description:
      'Toggles the display of green spaces, parks, and vegetation areas on the map. This layer helps visualize where natural cooling occurs.',
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    icon: <Layers className="h-4 w-4" />,
    color: 'text-blue-500',
    description:
      'Toggles the display of buildings, roads, and urban infrastructure on the map. This layer helps identify areas with dense development that may contribute to heat islands.',
  },
  {
    id: 'recommendations',
    name: 'Recommendations',
    icon: <TreeDeciduous className="h-4 w-4" />,
    color: 'text-emerald-500',
    description:
      'Toggles the display of suggested green infrastructure project locations on the map. Click markers to see project details.',
  },
  {
    id: 'sensors',
    name: 'Sensors',
    icon: <Radio className="h-4 w-4" />,
    color: 'text-purple-500',
    description:
      'Toggles the display of temperature and environmental monitoring sensor locations on the map.',
  },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, activeLayers, toggleLayer, enable3D, setEnable3D } =
    useDashboardStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden cursor-default"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-950 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800 lg:hidden">
          <span className="font-semibold">Layers & Controls</span>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Map Layers Section */}
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <Map className="h-4 w-4" />
              Map Layers
            </h3>
            <TooltipProvider delayDuration={200}>
              <div className="space-y-2">
                {layers.map((layer) => (
                  <Tooltip key={layer.id}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => toggleLayer(layer.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors font-alliance',
                          activeLayers.includes(layer.id)
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
                        )}
                      >
                        <span className={cn(layer.color)}>{layer.icon}</span>
                        <span>{layer.name}</span>
                        <div
                          className={cn(
                            'ml-auto h-2 w-2 rounded-full',
                            activeLayers.includes(layer.id)
                              ? 'bg-emerald-500'
                              : 'bg-gray-300 dark:bg-gray-600',
                          )}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="max-w-xs p-4 text-sm !bg-gray-900 !border-gray-800 !text-gray-100 shadow-xl backdrop-blur-sm font-alliance"
                    >
                      <div className="space-y-2">
                        <h4 className="font-semibold mb-1.5 text-gray-50">{layer.name}</h4>
                        <p className="text-xs text-gray-300 leading-relaxed">{layer.description}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {/* 3D Visualization Section */}
          <div className="mb-6 border-t border-gray-200 pt-6 dark:border-gray-800">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <Box className="h-4 w-4" />
              3D Visualization
            </h3>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setEnable3D(!enable3D)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors font-alliance',
                      enable3D
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
                    )}
                  >
                    <span className="text-purple-500">
                      <Box className="h-4 w-4" />
                    </span>
                    <span>3D Map View</span>
                    <div
                      className={cn(
                        'ml-auto h-2 w-2 rounded-full',
                        enable3D ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600',
                      )}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="max-w-xs p-4 text-sm !bg-gray-900 !border-gray-800 !text-gray-100 shadow-xl backdrop-blur-sm font-alliance"
                >
                  <div className="space-y-2">
                    <h4 className="font-semibold mb-1.5 text-gray-50">3D Visualization</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Toggle 3D map view powered by Mapbox. Provides enhanced terrain visualization
                      and building heights for better spatial understanding.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Heat Legend */}
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <ThermometerSun className="h-4 w-4" />
              Temperature Legend
            </h3>
            <div className="space-y-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-6 rounded bg-gradient-to-r from-green-500 to-yellow-400" />
                <span className="text-gray-600 dark:text-gray-400">Cool (20-25°C)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-6 rounded bg-gradient-to-r from-yellow-400 to-orange-500" />
                <span className="text-gray-600 dark:text-gray-400">Moderate (25-30°C)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-6 rounded bg-gradient-to-r from-orange-500 to-red-600" />
                <span className="text-gray-600 dark:text-gray-400">High (30-35°C)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-6 rounded bg-gradient-to-r from-red-600 to-red-900" />
                <span className="text-gray-600 dark:text-gray-400">Extreme (&gt;35°C)</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <BarChart3 className="h-4 w-4" />
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950">
                <p className="text-xs text-red-600 dark:text-red-400">Hotspots</p>
                <p className="text-lg font-bold text-red-700 dark:text-red-300">12</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950">
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Green Cover</p>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">23%</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-3 dark:bg-orange-950">
                <p className="text-xs text-orange-600 dark:text-orange-400">UHI Effect</p>
                <p className="text-lg font-bold text-orange-700 dark:text-orange-300">+4.2°C</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
                <p className="text-xs text-blue-600 dark:text-blue-400">Sensors</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">48</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="max-w-xs p-3 text-sm !bg-gray-900 !border-gray-800 !text-gray-100 shadow-xl backdrop-blur-sm font-alliance"
              >
                <p className="text-xs text-gray-300">Coming soon with light mode and dev log</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>
    </>
  );
}
