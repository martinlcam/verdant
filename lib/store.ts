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
  implementedRecommendations: string[]; // IDs of implemented recommendations
  toggleImplementedRecommendation: (recId: string) => void;

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

  // 3D Visualization
  enable3D: boolean;
  setEnable3D: (enable: boolean) => void;
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
        implementedRecommendations: [], // Clear implemented recommendations when city changes
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
    implementedRecommendations: [],
    toggleImplementedRecommendation: (recId) =>
      set((state) => ({
        implementedRecommendations: state.implementedRecommendations.includes(recId)
          ? state.implementedRecommendations.filter((id) => id !== recId)
          : [...state.implementedRecommendations, recId],
      })),

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

    // 3D Visualization
    enable3D: false,
    setEnable3D: (enable) => set({ enable3D: enable }),
  };
});
