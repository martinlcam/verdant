import { create } from 'zustand';
import type { City, GreenInfrastructureRecommendation, HeatZone, LayerType } from '@/types';
import { CANADIAN_CITIES } from './data';

interface DashboardStore {
  // City selection
  selectedCity: City;
  setSelectedCity: (city: City) => void;

  // Date selection
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;

  // Map view
  mapCenter: [number, number];
  mapZoom: number;
  setMapView: (center: [number, number], zoom: number) => void;

  // Layer visibility
  activeLayers: LayerType[];
  toggleLayer: (layer: LayerType) => void;
  setActiveLayers: (layers: LayerType[]) => void;

  // Recommendations panel
  showRecommendations: boolean;
  setShowRecommendations: (show: boolean) => void;
  selectedRecommendation: GreenInfrastructureRecommendation | null;
  setSelectedRecommendation: (rec: GreenInfrastructureRecommendation | null) => void;

  // Heat zones
  selectedHeatZone: HeatZone | null;
  setSelectedHeatZone: (zone: HeatZone | null) => void;

  // Time slider
  timeSliderValue: number;
  setTimeSliderValue: (value: number) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Temperature unit
  temperatureUnit: 'C' | 'F';
  setTemperatureUnit: (unit: 'C' | 'F') => void;
}

export const useDashboardStore = create<DashboardStore>((set) => {
  // Find Vancouver as default city
  const vancouver = CANADIAN_CITIES.find((city) => city.id === 'vancouver') || CANADIAN_CITIES[0];

  return {
    // City selection - default to Vancouver
    selectedCity: vancouver,
    setSelectedCity: (city) =>
      set({
        selectedCity: city,
        mapCenter: city.coordinates,
        mapZoom: 12,
      }),

    // Date selection
    selectedDate: new Date(),
    setSelectedDate: (date) => set({ selectedDate: date }),

    // Map view
    mapCenter: vancouver.coordinates,
    mapZoom: 12,
    setMapView: (center, zoom) => set({ mapCenter: center, mapZoom: zoom }),

    // Layer visibility
    activeLayers: ['heat', 'recommendations'],
    toggleLayer: (layer) =>
      set((state) => ({
        activeLayers: state.activeLayers.includes(layer)
          ? state.activeLayers.filter((l) => l !== layer)
          : [...state.activeLayers, layer],
      })),
    setActiveLayers: (layers) => set({ activeLayers: layers }),

    // Recommendations panel
    showRecommendations: true,
    setShowRecommendations: (show) => set({ showRecommendations: show }),
    selectedRecommendation: null,
    setSelectedRecommendation: (rec) => set({ selectedRecommendation: rec }),

    // Heat zones
    selectedHeatZone: null,
    setSelectedHeatZone: (zone) => set({ selectedHeatZone: zone }),

    // Time slider
    timeSliderValue: 100,
    setTimeSliderValue: (value) => set({ timeSliderValue: value }),

    // Sidebar
    sidebarOpen: true,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    // Temperature unit
    temperatureUnit: 'C',
    setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
  };
});
