/**
 * NASA POWER API Integration
 * https://power.larc.nasa.gov/docs/services/api/
 *
 * Provides solar and meteorological data including temperature
 */

export interface NASAPowerResponse {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    parameter: Record<string, Record<string, number>>;
  };
}

export interface TemperatureData {
  date: string;
  temperature: number;
  maxTemperature: number;
  minTemperature: number;
}

/**
 * Fetch temperature data from NASA POWER API
 * Parameters:
 * - T2M: Temperature at 2 meters (°C)
 * - T2M_MAX: Maximum temperature at 2 meters
 * - T2M_MIN: Minimum temperature at 2 meters
 */
export async function fetchNASATemperatureData(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string,
): Promise<TemperatureData[]> {
  const params = 'T2M,T2M_MAX,T2M_MIN';
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${params}&community=RE&longitude=${lon}&latitude=${lat}&start=${startDate}&end=${endDate}&format=JSON`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data: NASAPowerResponse = await response.json();
    const temperatures: TemperatureData[] = [];

    const t2m = data.properties.parameter.T2M || {};
    const t2mMax = data.properties.parameter.T2M_MAX || {};
    const t2mMin = data.properties.parameter.T2M_MIN || {};

    for (const [date, temp] of Object.entries(t2m)) {
      if (temp !== -999) {
        // -999 indicates missing data
        temperatures.push({
          date,
          temperature: temp,
          maxTemperature: t2mMax[date] !== -999 ? t2mMax[date] : temp,
          minTemperature: t2mMin[date] !== -999 ? t2mMin[date] : temp,
        });
      }
    }

    return temperatures;
  } catch (error) {
    console.error('Error fetching NASA data:', error);
    throw error;
  }
}

/**
 * Fetch monthly temperature averages from NASA POWER
 */
export async function fetchNASAMonthlyData(
  lat: number,
  lon: number,
  year: number,
): Promise<{ month: string; avgTemp: number; maxTemp: number; minTemp: number }[]> {
  const params = 'T2M,T2M_MAX,T2M_MIN';
  const url = `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=${params}&community=RE&longitude=${lon}&latitude=${lat}&start=${year}&end=${year}&format=JSON`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data: NASAPowerResponse = await response.json();
    const monthly: { month: string; avgTemp: number; maxTemp: number; minTemp: number }[] = [];

    const t2m = data.properties.parameter.T2M || {};
    const t2mMax = data.properties.parameter.T2M_MAX || {};
    const t2mMin = data.properties.parameter.T2M_MIN || {};

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    for (const [yearMonth, temp] of Object.entries(t2m)) {
      if (temp !== -999) {
        const monthIndex = parseInt(yearMonth.slice(4), 10) - 1;
        monthly.push({
          month: monthNames[monthIndex],
          avgTemp: temp,
          maxTemp: t2mMax[yearMonth] !== -999 ? t2mMax[yearMonth] : temp,
          minTemp: t2mMin[yearMonth] !== -999 ? t2mMin[yearMonth] : temp,
        });
      }
    }

    return monthly;
  } catch (error) {
    console.error('Error fetching NASA monthly data:', error);
    throw error;
  }
}

/**
 * Format date for NASA API (YYYYMMDD)
 */
export function formatNASADate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Point in a heat grid with temperature from NASA POWER
 */
export interface NASAHeatGridPoint {
  lat: number;
  lng: number;
  temperature: number;
  maxTemperature: number;
  minTemperature: number;
}

/**
 * Fetch temperature for a grid of points around a center (for heatmap).
 * Uses NASA POWER daily API; one request per point. Grid size 3x3 = 9 requests, 5x5 = 25.
 */
export async function fetchNASAHeatGrid(
  centerLat: number,
  centerLng: number,
  dateStr: string,
  gridSize: number = 5,
): Promise<NASAHeatGridPoint[]> {
  const spread = 0.04; // ~4km per degree at mid-latitudes; grid spans ~spread * (gridSize-1) degrees
  const half = (gridSize - 1) / 2;
  const points: { lat: number; lng: number }[] = [];

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const lat = centerLat + (i - half) * (spread / half);
      const lng = centerLng + (j - half) * (spread / half) * 1.2;
      points.push({ lat, lng });
    }
  }

  const results = await Promise.all(
    points.map(async (p) => {
      try {
        const data = await fetchNASATemperatureData(p.lat, p.lng, dateStr, dateStr);
        const day = data[0];
        const temp = day?.temperature ?? 20;
        const maxT = day?.maxTemperature ?? day?.temperature ?? temp;
        const minT = day?.minTemperature ?? day?.temperature ?? temp;
        return {
          lat: p.lat,
          lng: p.lng,
          temperature: temp !== -999 ? temp : 20,
          maxTemperature: maxT !== -999 ? maxT : temp,
          minTemperature: minT !== -999 ? minT : temp,
        };
      } catch {
        return { lat: p.lat, lng: p.lng, temperature: 20, maxTemperature: 22, minTemperature: 18 };
      }
    }),
  );

  return results;
}
