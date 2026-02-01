'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { generateHeatMapData, generateHeatZones, generateRecommendations } from '@/lib/data';
import { useDashboardStore } from '@/lib/store';
import { getInfrastructureIcon, getPriorityColor, interpolateColor } from '@/lib/utils';

// Dynamic import for Leaflet components (client-side only)
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
});
const CircleMarker = dynamic(() => import('react-leaflet').then((mod) => mod.CircleMarker), {
  ssr: false,
});
const Polygon = dynamic(() => import('react-leaflet').then((mod) => mod.Polygon), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

export function HeatMap() {
  const { selectedCity, activeLayers, setSelectedHeatZone, setSelectedRecommendation, mapZoom } =
    useDashboardStore();
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    setIsClient(true);
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  // Generate data based on selected city
  const heatData = useMemo(() => {
    return generateHeatMapData(selectedCity, 15);
  }, [selectedCity]);

  const heatZones = useMemo(() => {
    return generateHeatZones(selectedCity);
  }, [selectedCity]);

  const recommendations = useMemo(() => {
    return generateRecommendations(selectedCity);
  }, [selectedCity]);

  const minTemp = useMemo(() => Math.min(...heatData.map((d) => d.temperature)), [heatData]);
  const maxTemp = useMemo(() => Math.max(...heatData.map((d) => d.temperature)), [heatData]);

  if (!isClient || !L) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={selectedCity.coordinates}
        zoom={mapZoom}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Heat Data Points Layer */}
        {activeLayers.includes('heat') &&
          heatData.map((point, index) => (
            <CircleMarker
              key={`heat-${index}`}
              center={[point.lat, point.lng]}
              radius={12}
              pathOptions={{
                fillColor: interpolateColor(point.temperature, minTemp, maxTemp),
                fillOpacity: 0.6,
                color: 'transparent',
                weight: 0,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">Temperature: {point.temperature}°C</p>
                  <p>Surface: {point.surfaceTemperature}°C</p>
                  <p>NDVI: {point.ndvi.toFixed(2)}</p>
                  <p>Land Use: {point.landUse}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* Heat Zones Polygons */}
        {activeLayers.includes('heat') &&
          heatZones.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.coordinates}
              pathOptions={{
                fillColor:
                  zone.severity === 'extreme'
                    ? '#7f1d1d'
                    : zone.severity === 'high'
                      ? '#dc2626'
                      : zone.severity === 'moderate'
                        ? '#f97316'
                        : '#facc15',
                fillOpacity: 0.3,
                color:
                  zone.severity === 'extreme'
                    ? '#7f1d1d'
                    : zone.severity === 'high'
                      ? '#dc2626'
                      : zone.severity === 'moderate'
                        ? '#f97316'
                        : '#facc15',
                weight: 2,
              }}
              eventHandlers={{
                click: () => setSelectedHeatZone(zone),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-base mb-1">{zone.name}</p>
                  <p>
                    Severity: <span className="font-medium capitalize">{zone.severity}</span>
                  </p>
                  <p>Avg Temp: {zone.avgTemperature.toFixed(1)}°C</p>
                  <p>Max Temp: {zone.maxTemperature.toFixed(1)}°C</p>
                  <p>Area: {zone.area.toFixed(2)} km²</p>
                  <p>Vulnerability: {zone.vulnerabilityScore.toFixed(0)}/100</p>
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* Recommendations Layer */}
        {activeLayers.includes('recommendations') &&
          recommendations.map((rec) => (
            <CircleMarker
              key={rec.id}
              center={rec.location}
              radius={8}
              pathOptions={{
                fillColor: getPriorityColor(rec.priority),
                fillOpacity: 0.9,
                color: '#ffffff',
                weight: 2,
              }}
              eventHandlers={{
                click: () => setSelectedRecommendation(rec),
              }}
            >
              <Popup>
                <div className="text-sm min-w-[200px]">
                  <p className="font-semibold text-base mb-1">{rec.name}</p>
                  <p className="mb-2 text-gray-600">{rec.description}</p>
                  <div className="space-y-1">
                    <p>
                      Type:{' '}
                      <span className="font-medium">
                        {getInfrastructureIcon(rec.type)} {rec.type.replace('_', ' ')}
                      </span>
                    </p>
                    <p>
                      Priority: <span className="font-medium capitalize">{rec.priority}</span>
                    </p>
                    <p>
                      Cooling Effect:{' '}
                      <span className="font-medium text-emerald-600">
                        -{rec.estimatedCoolingEffect.toFixed(1)}°C
                      </span>
                    </p>
                    <p>
                      Est. Cost:{' '}
                      <span className="font-medium">
                        ${(rec.estimatedCost / 1000000).toFixed(1)}M
                      </span>
                    </p>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>

      {/* Map Controls Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-2">
        <div className="rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur dark:bg-gray-900/90">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {selectedCity.name}, {selectedCity.province}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Pop: {selectedCity.population.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
