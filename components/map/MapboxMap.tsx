'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCw, TrendingUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
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
  const [bearing, setBearing] = useState(0);
  const [pitch, setPitch] = useState(60);
  const isDraggingSlider = useRef(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  // Normalize bearing to 0-360 range (defined early so it's accessible everywhere)
  const normalizeBearing = (b: number): number => {
    let normalized = b % 360;
    if (normalized < 0) normalized += 360;
    return normalized;
  };

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
        style: 'mapbox://styles/mapbox/streets-v12', // Streets style with vector tiles and 3D building support
        center: [selectedCity.coordinates[1], selectedCity.coordinates[0]],
        zoom: 16, // Higher zoom to see buildings in detail
        pitch: 60, // Steeper angle for better 3D building view
        bearing: 0,
        antialias: true,
        dragRotate: true, // Enable rotation by dragging (right-click or Ctrl+drag)
        touchZoomRotate: true, // Enable rotation on touch devices
        touchPitch: true, // Enable pitch adjustment on touch
      });

      // Listen for bearing changes and update state
      map.on('rotate', () => {
        // Don't update if slider is being dragged to prevent feedback loop
        if (isDraggingSlider.current) return;
        
        // Use requestAnimationFrame to debounce rapid updates and prevent glitches
        requestAnimationFrame(() => {
          if (isDraggingSlider.current) return; // Double-check after frame
          
          const currentBearing = map.getBearing();
          const normalized = normalizeBearing(currentBearing);
          setBearing(normalized);
          window.dispatchEvent(
            new CustomEvent('map-bearing-change', { detail: { bearing: normalized } }),
          );
        });
      });

      // Listen for pitch changes and update state
      map.on('pitch', () => {
        const currentPitch = map.getPitch();
        setPitch(currentPitch);
        window.dispatchEvent(
          new CustomEvent('map-pitch-change', { detail: { pitch: currentPitch } }),
        );
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

  // Listen for rotation slider changes from external sources
  useEffect(() => {
    const handleRotate = (e: CustomEvent) => {
      if (mapRef.current && !isDraggingSlider.current) {
        const normalized = normalizeBearing(e.detail.bearing);
        mapRef.current.rotateTo(normalized, { duration: 200 });
      }
    };

    window.addEventListener('rotate-map', handleRotate as EventListener);
    return () => {
      window.removeEventListener('rotate-map', handleRotate as EventListener);
    };
  }, []);

  // Update map center when city changes
  useEffect(() => {
    if (mapRef.current && selectedCity) {
      const currentBearing = mapRef.current.getBearing();
      const normalized = normalizeBearing(currentBearing);
      mapRef.current.flyTo({
        center: [selectedCity.coordinates[1], selectedCity.coordinates[0]],
        zoom: 16, // Higher zoom for 3D building view
        pitch: 60, // Steeper angle for better 3D view
        bearing: normalized, // Maintain current rotation (normalized)
        duration: 1500,
      });
      // Update bearing state after flyTo completes
      setTimeout(() => {
        if (mapRef.current) {
          const newBearing = normalizeBearing(mapRef.current.getBearing());
          setBearing(newBearing);
        }
      }, 1600);
    }
  }, [selectedCity]);

  // Listen for pitch changes from map
  useEffect(() => {
    const handlePitchChange = (e: CustomEvent) => {
      setPitch(e.detail.pitch);
    };

    window.addEventListener('map-pitch-change', handlePitchChange as EventListener);
    return () => {
      window.removeEventListener('map-pitch-change', handlePitchChange as EventListener);
    };
  }, []);

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

  const handleRotationChange = (value: number[]) => {
    const newBearing = normalizeBearing(value[0]);
    // Set dragging flag immediately to prevent map rotate event from interfering
    isDraggingSlider.current = true;
    
    // Update state immediately for responsive slider
    setBearing(newBearing);
    
    if (mapRef.current) {
      // Use rotateTo with immediate update (no animation) during drag for smooth tracking
      // This ensures the map follows the cursor without lag
      mapRef.current.rotateTo(newBearing, { duration: 0 });
    }
  };

  const handleRotationCommit = () => {
    // Reset dragging flag after a small delay to allow map to settle
    // This prevents the map's rotate event from immediately updating the slider
    setTimeout(() => {
      isDraggingSlider.current = false;
      // Sync the final bearing value to ensure accuracy
      if (mapRef.current) {
        const currentBearing = mapRef.current.getBearing();
        const normalized = normalizeBearing(currentBearing);
        // Only update if there's a meaningful difference to avoid unnecessary re-renders
        if (Math.abs(normalized - bearing) > 0.5) {
          setBearing(normalized);
        }
      }
    }, 150);
  };

  const handleTiltChange = (value: number[]) => {
    const newPitch = value[0];
    setPitch(newPitch);
    if (mapRef.current) {
      mapRef.current.setPitch(newPitch, { duration: 200 });
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Tilt Control - Left Side */}
      <div className="absolute left-4 top-1/2 z-[1000] -translate-y-1/2">
        <div className="rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur dark:bg-gray-900/90">
          <div className="flex flex-col items-center gap-3">
            <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400 rotate-90" />
            <div className="h-32 w-6">
              <Slider
                value={[pitch]}
                onValueChange={handleTiltChange}
                min={0}
                max={85}
                step={1}
                orientation="vertical"
                className="h-full"
              />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-alliance">
              {Math.round(pitch)}°
            </span>
          </div>
        </div>
      </div>

      <div ref={mapContainer} className="flex-1 w-full" />

      {/* Rotation Slider */}
      <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center gap-3">
          <RotateCw className="h-4 w-4 text-gray-600 dark:text-gray-400 shrink-0" />
          <div className="flex-1">
            <Slider
              value={[bearing]}
              onValueChange={handleRotationChange}
              onValueCommit={handleRotationCommit}
              min={0}
              max={360}
              step={1}
              className="w-full"
            />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 w-12 text-right font-alliance">
            {Math.round(bearing)}°
          </span>
        </div>
      </div>

      {/* Map Controls Overlay */}
      <div className="absolute bottom-20 left-4 z-[1000] flex flex-col gap-2">
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
