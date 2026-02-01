// Core types for UrbanHeat Climate Resilience Dashboard

export interface City {
  id: string;
  name: string;
  province: string;
  coordinates: [number, number]; // [lat, lng]
  population: number;
  area: number; // km²
}

export interface HeatDataPoint {
  lat: number;
  lng: number;
  temperature: number; // °C
  surfaceTemperature: number; // °C
  ndvi: number; // Normalized Difference Vegetation Index (-1 to 1)
  albedo: number; // Surface reflectivity (0 to 1)
  landUse: LandUseType;
}

export type LandUseType = 
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'park'
  | 'water'
  | 'forest'
  | 'agricultural'
  | 'bare';

export interface HeatZone {
  id: string;
  name: string;
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  avgTemperature: number;
  maxTemperature: number;
  area: number; // km²
  coordinates: [number, number][];
  vulnerabilityScore: number; // 0-100
}

export interface TemperatureRecord {
  date: string;
  urban: number;
  rural: number;
  differential: number;
}

export interface GreenInfrastructureRecommendation {
  id: string;
  type: GreenInfrastructureType;
  location: [number, number];
  name: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: number;
  estimatedCoolingEffect: number; // °C reduction
  area: number; // m²
  benefitScore: number; // 0-100
  description: string;
}

export type GreenInfrastructureType = 
  | 'urban_park'
  | 'green_roof'
  | 'tree_planting'
  | 'cool_pavement'
  | 'bioswale'
  | 'permeable_surface'
  | 'water_feature';

export interface CityStats {
  avgUrbanTemp: number;
  avgRuralTemp: number;
  heatIslandIntensity: number;
  hotspotCount: number;
  greenCoverage: number; // percentage
  vulnerablePopulation: number;
  projectedTempIncrease: number; // by 2050
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface MapViewState {
  center: [number, number];
  zoom: number;
}

export interface DashboardState {
  selectedCity: City | null;
  selectedDate: Date;
  timeRange: TimeRange;
  mapView: MapViewState;
  selectedLayers: LayerType[];
  showRecommendations: boolean;
}

export type LayerType = 
  | 'heat'
  | 'vegetation'
  | 'infrastructure'
  | 'recommendations'
  | 'sensors';

export interface ExportOptions {
  format: 'png' | 'csv' | 'pdf';
  includeRecommendations: boolean;
  includeAnalytics: boolean;
  timeRange: TimeRange;
}
