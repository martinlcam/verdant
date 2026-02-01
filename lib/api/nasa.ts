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
