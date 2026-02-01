'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  generateHeatZones,
  generateInfrastructurePoints,
  generateRecommendations,
  generateSensorLocations,
  generateVegetationAreas,
} from '@/lib/data';
import { useDashboardStore } from '@/lib/store';
import { getInfrastructureIcon, getPriorityColor } from '@/lib/utils';

// Mapbox access token
const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  'pk.eyJ1Ijoiam9ob3N0dWRpbyIsImEiOiJjbWw0M3BlenEwc3dvM2hvZTNiNnN6dG51In0.7ybGdnWnhAK3_t3Lps_hXw';

export function MapboxMap() {
  const {
    selectedCity,
    activeLayers,
    setSelectedHeatZone,
    setSelectedRecommendation,
    mapZoom,
  } = useDashboardStore();
  const [isMounted, setIsMounted] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapContainer.current || mapRef.current) return;

    // Dynamically import mapbox-gl only on client side
    import('mapbox-gl').then((mapboxgl) => {
      if (!mapContainer.current || mapRef.current) return;

      mapboxgl.default.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [selectedCity.coordinates[1], selectedCity.coordinates[0]],
        zoom: mapZoom,
        pitch: 45, // 3D tilt
        bearing: 0,
        antialias: true,
      });

      // Add terrain
      map.on('load', () => {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14,
        });
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      });

      mapRef.current = map;

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    });
  }, [isMounted, selectedCity, mapZoom]);

  // Update map center when city changes
  useEffect(() => {
    if (mapRef.current && selectedCity) {
      mapRef.current.flyTo({
        center: [selectedCity.coordinates[1], selectedCity.coordinates[0]],
        zoom: mapZoom,
        duration: 1000,
      });
    }
  }, [selectedCity, mapZoom]);

  if (!isMounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading 3D map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />

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
