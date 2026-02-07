'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import { RotateCw, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { generateHeatZones, generateRecommendations } from '@/lib/data';
import { useDashboardStore } from '@/lib/store';
import { getPriorityColor } from '@/lib/utils';

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoiam9ob3N0dWRpbyIsImEiOiJjbWw0M3BlenEwc3dvM2hvZTNiNnN6dG51In0.7ybGdnWnhAK3_t3Lps_hXw';

export function MapboxMap() {
  const {
    selectedCity,
    selectedDate,
    activeLayers,
    setSelectedHeatZone,
    setSelectedRecommendation,
    mapCenter,
    mapZoom,
  } = useDashboardStore();

  const [isMounted, setIsMounted] = useState(false);
  const [bearing, setBearing] = useState(0);
  const [pitch, setPitch] = useState(60);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const isDraggingSlider = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsMounted(true);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isMounted || !mapContainer.current || map.current) return;

    // Dynamically import mapbox-gl to avoid SSR issues
    import('mapbox-gl').then((mapboxgl) => {
      mapboxgl.default.accessToken = MAPBOX_TOKEN;

      map.current = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [selectedCity.coordinates[1], selectedCity.coordinates[0]],
        zoom: 16.5, // Higher zoom to ensure buildings are visible
        pitch: 60,
        bearing: 0,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

      // Wait for map to load, then add 3D buildings
      map.current.once('load', () => {
        if (!map.current) return;

        // Add 3D building extrusion layer
        // Try to add buildings using the composite source
        try {
          // Check if composite source exists
          const compositeSource = map.current.getSource('composite');
          if (compositeSource) {
            // Add 3D building layer
            if (!map.current.getLayer('3d-buildings')) {
              map.current.addLayer({
                id: '3d-buildings',
                source: 'composite',
                'source-layer': 'building',
                filter: ['==', ['get', 'extrude'], 'true'],
                type: 'fill-extrusion',
                minzoom: 14,
                paint: {
                  'fill-extrusion-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'height'],
                    0,
                    '#2a2a2a',
                    50,
                    '#3a3a3a',
                    100,
                    '#4a4a4a',
                    200,
                    '#5a5a5a',
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
                  'fill-extrusion-base': ['case', ['has', 'min_height'], ['get', 'min_height'], 0],
                  'fill-extrusion-opacity': 0.9,
                },
              });
            }
          }
        } catch (error) {
          console.warn('Could not add 3D buildings:', error);
          // Try alternative approach - check if buildings exist in style layers
          const styleLayers = map.current.getStyle().layers || [];
          const buildingLayers = styleLayers.filter(
            (layer: any) => layer.type === 'fill-extrusion' && layer['source-layer'] === 'building',
          );
          if (buildingLayers.length > 0) {
            // Enable existing building layers
            buildingLayers.forEach((layer: any) => {
              try {
                map.current.setPaintProperty(layer.id, 'fill-extrusion-opacity', 0.9);
              } catch {
                // Layer might not support this property
              }
            });
          }
        }
      });

      // Listen for rotation and pitch changes
      const handleRotate = () => {
        if (!isDraggingSlider.current && map.current) {
          const newBearing = map.current.getBearing();
          setBearing(newBearing < 0 ? newBearing + 360 : newBearing);
        }
      };

      const handlePitch = () => {
        if (!isDraggingSlider.current && map.current) {
          setPitch(map.current.getPitch());
        }
      };

      map.current.on('rotate', handleRotate);
      map.current.on('pitch', handlePitch);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isMounted, selectedCity]);

  // Update map when mapCenter or mapZoom changes
  useEffect(() => {
    if (!map.current) return;
    map.current.flyTo({
      center: [mapCenter[1], mapCenter[0]],
      zoom: mapZoom,
      duration: 1000,
    });
  }, [mapCenter, mapZoom]);

  const heatZones = useMemo(() => {
    return generateHeatZones(selectedCity, selectedDate);
  }, [selectedCity, selectedDate]);

  const recommendations = useMemo(() => {
    return generateRecommendations(selectedCity, selectedDate);
  }, [selectedCity, selectedDate]);

  // Create GeoJSON for all heat zones
  const heatZonesGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: heatZones.map((zone) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [zone.coordinates.map((coord) => [coord[1], coord[0]])],
        },
        properties: {
          id: zone.id,
          name: zone.name,
          severity: zone.severity,
          avgTemperature: zone.avgTemperature,
          maxTemperature: zone.maxTemperature,
        },
      })),
    };
  }, [heatZones]);

  // Add heat zones layer
  useEffect(() => {
    if (!map.current || !activeLayers.includes('heat')) return;

    const sourceId = 'heat-zones';
    const fillLayerId = 'heat-zones-fill';
    const outlineLayerId = 'heat-zones-outline';

    // Remove existing layers and source if they exist
    if (map.current.getLayer(fillLayerId)) {
      map.current.removeLayer(fillLayerId);
    }
    if (map.current.getLayer(outlineLayerId)) {
      map.current.removeLayer(outlineLayerId);
    }
    if (map.current.getSource(sourceId)) {
      map.current.removeSource(sourceId);
    }

    // Add source and layers
    map.current.addSource(sourceId, {
      type: 'geojson',
      data: heatZonesGeoJSON,
    });

    map.current.addLayer({
      id: fillLayerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': [
          'match',
          ['get', 'severity'],
          'extreme',
          '#7f1d1d',
          'high',
          '#dc2626',
          'moderate',
          '#f97316',
          '#facc15',
        ],
        'fill-opacity': 0.3,
      },
    });

    map.current.addLayer({
      id: outlineLayerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': [
          'match',
          ['get', 'severity'],
          'extreme',
          '#7f1d1d',
          'high',
          '#dc2626',
          'moderate',
          '#f97316',
          '#facc15',
        ],
        'line-width': 2,
      },
    });

    // Add click handler
    const handleClick = (e: any) => {
      if (e.features?.[0]) {
        const zoneId = e.features[0].properties?.id;
        const zone = heatZones.find((z) => z.id === zoneId);
        if (zone) {
          setSelectedHeatZone(zone);
        }
      }
    };

    const handleMouseEnter = () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = 'pointer';
      }
    };

    const handleMouseLeave = () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = '';
      }
    };

    map.current.on('click', fillLayerId, handleClick);
    map.current.on('mouseenter', fillLayerId, handleMouseEnter);
    map.current.on('mouseleave', fillLayerId, handleMouseLeave);

    return () => {
      if (map.current) {
        map.current.off('click', fillLayerId, handleClick);
        map.current.off('mouseenter', fillLayerId, handleMouseEnter);
        map.current.off('mouseleave', fillLayerId, handleMouseLeave);
      }
    };
  }, [heatZonesGeoJSON, activeLayers, heatZones, setSelectedHeatZone]);

  // Add recommendation markers
  useEffect(() => {
    if (!map.current || !activeLayers.includes('recommendations')) return;

    const markers: any[] = [];

    // Dynamically import mapbox-gl for markers
    import('mapbox-gl').then((mapboxgl) => {
      // Remove existing markers
      const existingMarkers = document.querySelectorAll('.recommendation-marker');
      existingMarkers.forEach((marker) => {
        marker.remove();
      });

      // Add new markers
      recommendations.forEach((rec) => {
        const el = document.createElement('div');
        el.className = 'recommendation-marker';
        el.style.width = '16px';
        el.style.height = '16px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = getPriorityColor(rec.priority);
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        el.style.cursor = 'pointer';

        el.addEventListener('click', () => {
          setSelectedRecommendation(rec);
        });

        const marker = new mapboxgl.default.Marker(el)
          .setLngLat([rec.location[1], rec.location[0]])
          .addTo(map.current!);

        markers.push(marker);
      });
    });

    return () => {
      markers.forEach((marker) => {
        marker.remove();
      });
    };
  }, [recommendations, activeLayers, setSelectedRecommendation]);

  const handleRotationChange = (values: number[]) => {
    const newBearing = values[0];
    isDraggingSlider.current = true;
    setBearing(newBearing);
    if (map.current) {
      map.current.rotateTo(newBearing, { duration: 0 });
    }
  };

  const handleRotationCommit = () => {
    isDraggingSlider.current = false;
  };

  const handleTiltChange = (values: number[]) => {
    const newPitch = values[0];
    isDraggingSlider.current = true;
    setPitch(newPitch);
    if (map.current) {
      map.current.setPitch(newPitch, { duration: 0 });
    }
  };

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

      {/* Rotation Slider */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
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

      {/* Tilt Control */}
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

      {/* Map Controls Overlay */}
      <div className="absolute bottom-16 left-4 z-[1000] flex flex-col gap-2">
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
