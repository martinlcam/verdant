import type {
  City,
  CityStats,
  GreenInfrastructureRecommendation,
  HeatDataPoint,
  HeatZone,
  TemperatureRecord,
} from '@/types';

// Canadian cities with their coordinates
export const CANADIAN_CITIES: City[] = [
  {
    id: 'toronto',
    name: 'Toronto',
    province: 'Ontario',
    coordinates: [43.6532, -79.3832],
    population: 2794356,
    area: 630.2,
  },
  {
    id: 'montreal',
    name: 'Montreal',
    province: 'Quebec',
    coordinates: [45.5017, -73.5673],
    population: 1780000,
    area: 431.5,
  },
  {
    id: 'vancouver',
    name: 'Vancouver',
    province: 'British Columbia',
    coordinates: [49.2827, -123.1207],
    population: 662248,
    area: 115.0,
  },
  {
    id: 'calgary',
    name: 'Calgary',
    province: 'Alberta',
    coordinates: [51.0447, -114.0719],
    population: 1336000,
    area: 825.3,
  },
  {
    id: 'ottawa',
    name: 'Ottawa',
    province: 'Ontario',
    coordinates: [45.4215, -75.6972],
    population: 1017449,
    area: 2790.3,
  },
  {
    id: 'edmonton',
    name: 'Edmonton',
    province: 'Alberta',
    coordinates: [53.5461, -113.4938],
    population: 1010899,
    area: 684.4,
  },
  {
    id: 'winnipeg',
    name: 'Winnipeg',
    province: 'Manitoba',
    coordinates: [49.8951, -97.1384],
    population: 749607,
    area: 464.1,
  },
  {
    id: 'quebec-city',
    name: 'Quebec City',
    province: 'Quebec',
    coordinates: [46.8139, -71.208],
    population: 549459,
    area: 454.1,
  },
  {
    id: 'hamilton',
    name: 'Hamilton',
    province: 'Ontario',
    coordinates: [43.2557, -79.8711],
    population: 569353,
    area: 1138.1,
  },
  {
    id: 'halifax',
    name: 'Halifax',
    province: 'Nova Scotia',
    coordinates: [44.6488, -63.5752],
    population: 439819,
    area: 5490.3,
  },
];

// Generate mock heat zones for a city
export function generateHeatZones(city: City): HeatZone[] {
  const zones: HeatZone[] = [];
  const baseTemp = 28 + Math.random() * 8;

  const zoneNames = [
    'Downtown Core',
    'Industrial District',
    'Shopping District',
    'Transit Hub',
    'Residential East',
    'Waterfront Area',
    'University District',
    'Business Park',
  ];

  const severities: Array<'low' | 'moderate' | 'high' | 'extreme'> = [
    'low',
    'moderate',
    'high',
    'extreme',
  ];

  for (let i = 0; i < 6; i++) {
    const offset = 0.02 + Math.random() * 0.03;
    const lat = city.coordinates[0] + (Math.random() - 0.5) * offset * 2;
    const lng = city.coordinates[1] + (Math.random() - 0.5) * offset * 2;
    const temp = baseTemp + Math.random() * 10 - 2;

    zones.push({
      id: `zone-${city.id}-${i}`,
      name: zoneNames[i % zoneNames.length],
      severity: severities[Math.min(3, Math.floor((temp - 28) / 4))],
      avgTemperature: temp,
      maxTemperature: temp + 2 + Math.random() * 3,
      area: 0.5 + Math.random() * 2,
      coordinates: generatePolygon(lat, lng, 0.01 + Math.random() * 0.01),
      vulnerabilityScore: 30 + Math.random() * 60,
    });
  }

  return zones.sort((a, b) => b.avgTemperature - a.avgTemperature);
}

function generatePolygon(centerLat: number, centerLng: number, radius: number): [number, number][] {
  const points: [number, number][] = [];
  const numPoints = 6;

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const r = radius * (0.8 + Math.random() * 0.4);
    points.push([centerLat + Math.cos(angle) * r, centerLng + Math.sin(angle) * r * 1.5]);
  }

  return points;
}

// Generate temperature history for a city
export function generateTemperatureHistory(_city: City, months: number = 12): TemperatureRecord[] {
  const records: TemperatureRecord[] = [];
  const today = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);

    // Seasonal variation
    const month = date.getMonth();
    const seasonalFactor = Math.sin(((month - 1) * Math.PI) / 6) * 15;

    const baseUrban = 15 + seasonalFactor + (Math.random() - 0.5) * 5;
    const baseRural = baseUrban - 3 - Math.random() * 4;

    records.push({
      date: date.toISOString().slice(0, 7),
      urban: Math.round(baseUrban * 10) / 10,
      rural: Math.round(baseRural * 10) / 10,
      differential: Math.round((baseUrban - baseRural) * 10) / 10,
    });
  }

  return records;
}

// Generate green infrastructure recommendations
export function generateRecommendations(city: City): GreenInfrastructureRecommendation[] {
  const types: GreenInfrastructureRecommendation['type'][] = [
    'urban_park',
    'green_roof',
    'tree_planting',
    'cool_pavement',
    'bioswale',
    'permeable_surface',
    'water_feature',
  ];

  const priorities: Array<'low' | 'medium' | 'high' | 'critical'> = [
    'low',
    'medium',
    'high',
    'critical',
  ];

  const recommendations: GreenInfrastructureRecommendation[] = [];

  const names = [
    'Central Business District Green Corridor',
    'Industrial Area Tree Buffer',
    'Shopping Mall Green Roof Initiative',
    'Transit Station Cool Pavement',
    'Residential Neighborhood Park Expansion',
    'Downtown Water Feature Installation',
    'Highway Corridor Green Belt',
    'School Zone Tree Planting Program',
    'Community Garden Development',
    'Parking Lot Conversion Project',
  ];

  const descriptions = [
    'Strategic placement of native trees and vegetation to create cooling corridors.',
    'Installation of green roof systems on commercial buildings to reduce heat absorption.',
    'Comprehensive tree planting initiative targeting high-heat zones.',
    'Replacement of traditional asphalt with reflective cool pavement materials.',
    'Creation of bioswales for stormwater management and urban cooling.',
    'Installation of permeable surfaces to reduce heat island effect.',
    'Development of water features for evaporative cooling benefits.',
  ];

  for (let i = 0; i < 8; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];

    recommendations.push({
      id: `rec-${city.id}-${i}`,
      type,
      location: [
        city.coordinates[0] + (Math.random() - 0.5) * 0.06,
        city.coordinates[1] + (Math.random() - 0.5) * 0.08,
      ],
      name: names[i % names.length],
      priority,
      estimatedCost: Math.round((500000 + Math.random() * 4500000) / 10000) * 10000,
      estimatedCoolingEffect: 0.5 + Math.random() * 2.5,
      area: Math.round(1000 + Math.random() * 49000),
      benefitScore: Math.round(40 + Math.random() * 55),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

// Generate city statistics
export function generateCityStats(city: City): CityStats {
  const baseTemp = 20 + Math.random() * 10;
  const ruralTemp = baseTemp - 4 - Math.random() * 3;

  return {
    avgUrbanTemp: Math.round(baseTemp * 10) / 10,
    avgRuralTemp: Math.round(ruralTemp * 10) / 10,
    heatIslandIntensity: Math.round((baseTemp - ruralTemp) * 10) / 10,
    hotspotCount: Math.floor(5 + Math.random() * 15),
    greenCoverage: Math.round((15 + Math.random() * 25) * 10) / 10,
    vulnerablePopulation: Math.round(city.population * (0.08 + Math.random() * 0.12)),
    projectedTempIncrease: Math.round((1.5 + Math.random() * 2) * 10) / 10,
  };
}

// Generate heat data points for the map
export function generateHeatMapData(city: City, resolution: number = 20): HeatDataPoint[] {
  const points: HeatDataPoint[] = [];
  const centerLat = city.coordinates[0];
  const centerLng = city.coordinates[1];
  const spread = 0.08; // Increased spread for better coverage

  const landUses: HeatDataPoint['landUse'][] = [
    'residential',
    'commercial',
    'industrial',
    'park',
    'water',
    'forest',
    'agricultural',
    'bare',
  ];

  // Create a smooth gradient with higher density in center
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      // Normalized position (-1 to 1)
      const normalizedI = (i / resolution - 0.5) * 2;
      const normalizedJ = (j / resolution - 0.5) * 2;
      
      // Small jitter to break up perfect grid (much smaller)
      const jitterLat = (Math.random() - 0.5) * (spread / resolution) * 0.3;
      const jitterLng = (Math.random() - 0.5) * (spread / resolution) * 0.3;
      
      const lat = centerLat + normalizedI * spread + jitterLat;
      const lng = centerLng + normalizedJ * spread * 1.2 + jitterLng;

      // Distance from center (0 to ~1.4 for corners)
      const distFromCenter = Math.sqrt(normalizedI ** 2 + normalizedJ ** 2);
      
      // Create smooth gradient: hot in center, cooler at edges
      // Use exponential decay for more realistic heat island effect
      const gradientFactor = Math.exp(-distFromCenter * 1.2);
      
      // Base temperature: 35°C in center, ~22°C at edges
      const baseTemp = 22 + gradientFactor * 13;
      
      // Add natural variation (smaller range to maintain gradient)
      const variation = (Math.random() - 0.5) * 3;
      const finalTemp = Math.max(18, Math.min(38, baseTemp + variation));
      
      // Surface temp is typically higher
      const surfaceTemp = finalTemp + 3 + Math.random() * 4;

      // Vegetation index inversely related to temperature
      const ndvi = Math.max(-0.2, Math.min(0.8, 0.5 - (finalTemp - 25) * 0.05 + (Math.random() - 0.5) * 0.2));

      points.push({
        lat,
        lng,
        temperature: Math.round(finalTemp * 10) / 10,
        surfaceTemperature: Math.round(surfaceTemp * 10) / 10,
        ndvi: Math.round(ndvi * 100) / 100,
        albedo: 0.15 + Math.random() * 0.3,
        landUse: landUses[Math.floor(Math.random() * landUses.length)],
      });
    }
  }

  return points;
}

// Time series data for charts
export function generateDailyTemperatures(
  days: number = 30,
): { date: string; high: number; low: number; avg: number }[] {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const baseTemp = 25 + Math.sin(i / 5) * 5 + Math.random() * 8;
    const high = baseTemp + 3 + Math.random() * 5;
    const low = baseTemp - 5 - Math.random() * 3;

    data.push({
      date: date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }),
      high: Math.round(high * 10) / 10,
      low: Math.round(low * 10) / 10,
      avg: Math.round(baseTemp * 10) / 10,
    });
  }

  return data;
}
