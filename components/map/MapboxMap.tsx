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
        style: 'mapbox://styles/mapbox/streets-v12', // Streets style with 3D building support
        center: [selectedCity.coordinates[1], selectedCity.coordinates[0]],
        zoom: 16, // Higher zoom to see buildings in detail
        pitch: 60, // Steeper angle for better 3D building view
        bearing: 0,
        antialias: true,
        dragRotate: true, // Enable rotation by dragging (right-click or Ctrl+drag)
        touchZoomRotate: true, // Enable rotation on touch devices
        touchPitch: true, // Enable pitch adjustment on touch
      });

      // Add navigation controls (zoom, rotate, pitch)
      const nav = new mapboxgl.default.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true,
      });
      map.addControl(nav, 'top-right');

      // Enable 3D buildings and terrain
      map.on('load', () => {
        // Add terrain for elevation
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14,
        });
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

        // Enable 3D building extrusion
        const layers = map.getStyle().layers;
        
        // Find existing building layers and enhance them for 3D
        for (const layer of layers) {
          if (layer.type === 'fill-extrusion' && layer.id.includes('building')) {
            // Enhance existing building layer
            map.setPaintProperty(layer.id, 'fill-extrusion-height', [
              'get',
              'height',
            ]);
            map.setPaintProperty(layer.id, 'fill-extrusion-base', [
              'get',
              'min_height',
            ]);
            map.setPaintProperty(layer.id, 'fill-extrusion-color', [
              'interpolate',
              ['linear'],
              ['get', 'height'],
              0,
              '#aaa',
              50,
              '#888',
              100,
              '#666',
            ]);
            map.setPaintProperty(layer.id, 'fill-extrusion-opacity', 0.7);
          }
        }

        // Add 3D buildings layer if it doesn't exist
        const hasBuildingLayer = layers.some(
          (layer) => layer.type === 'fill-extrusion' && layer.id.includes('building'),
        );
        
        if (!hasBuildingLayer) {
          // Insert 3D buildings layer before labels
          const labelLayer = layers.find(
            (layer) => layer.type === 'symbol' && layer.layout && layer.layout['text-field'],
          );
          
          map.addLayer(
            {
              id: '3d-buildings',
              source: 'composite',
              'source-layer': 'building',
              type: 'fill-extrusion',
              minzoom: 14,
              paint: {
                'fill-extrusion-color': [
                  'interpolate',
                  ['linear'],
                  ['get', 'height'],
                  0,
                  '#aaa',
                  50,
                  '#888',
                  100,
                  '#666',
                ],
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  14,
                  0,
                  15,
                  ['get', 'height'],
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  14,
                  0,
                  15,
                  ['get', 'min_height'],
                ],
                'fill-extrusion-opacity': 0.7,
              },
            },
            labelLayer?.id,
          );
        }
      });

      mapRef.current = map;
    });

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isMounted]);

  // Update map center when city changes
  useEffect(() => {
    if (mapRef.current && selectedCity) {
      mapRef.current.flyTo({
        center: [selectedCity.coordinates[1], selectedCity.coordinates[0]],
        zoom: 16, // Higher zoom for 3D building view
        pitch: 60, // Steeper angle for better 3D view
        bearing: mapRef.current.getBearing(), // Maintain current rotation
        duration: 1500,
      });
    }
  }, [selectedCity]);

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
