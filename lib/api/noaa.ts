/**
 * NOAA Climate Data Online (CDO) API Integration
 * https://www.ncdc.noaa.gov/cdo-web/webservices/v2
 *
 * Note: Requires a free API token from https://www.ncdc.noaa.gov/cdo-web/token
 * For the MVP, we'll use the public weather.gov API which doesn't require auth
 */

export interface NOAAStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface NOAAForecast {
  temperature: number;
  temperatureUnit: string;
  shortForecast: string;
  detailedForecast: string;
  startTime: string;
  endTime: string;
}

export interface WeatherGridPoint {
  gridId: string;
  gridX: number;
  gridY: number;
  forecastUrl: string;
  forecastHourlyUrl: string;
}

/**
 * Get the weather grid point for a location
 * This is required to get forecasts from weather.gov
 */
export async function getWeatherGridPoint(lat: number, lon: number): Promise<WeatherGridPoint> {
  const url = `https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Verdant Climate Dashboard (contact@example.com)',
        Accept: 'application/geo+json',
      },
    });

    if (!response.ok) {
      throw new Error(`Weather.gov API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      gridId: data.properties.gridId,
      gridX: data.properties.gridX,
      gridY: data.properties.gridY,
      forecastUrl: data.properties.forecast,
      forecastHourlyUrl: data.properties.forecastHourly,
    };
  } catch (error) {
    console.error('Error fetching weather grid point:', error);
    throw error;
  }
}

/**
 * Get current weather forecast from weather.gov
 * Note: Only works for US locations
 */
export async function getWeatherForecast(forecastUrl: string): Promise<NOAAForecast[]> {
  try {
    const response = await fetch(forecastUrl, {
      headers: {
        'User-Agent': 'Verdant Climate Dashboard (contact@example.com)',
        Accept: 'application/geo+json',
      },
    });

    if (!response.ok) {
      throw new Error(`Weather.gov forecast API error: ${response.status}`);
    }

    const data = await response.json();

    return data.properties.periods.map(
      (period: {
        temperature: number;
        temperatureUnit: string;
        shortForecast: string;
        detailedForecast: string;
        startTime: string;
        endTime: string;
      }) => ({
        temperature: period.temperature,
        temperatureUnit: period.temperatureUnit,
        shortForecast: period.shortForecast,
        detailedForecast: period.detailedForecast,
        startTime: period.startTime,
        endTime: period.endTime,
      }),
    );
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
}

/**
 * Environment Canada Weather API for Canadian cities
 * https://dd.weather.gc.ca/
 */
export interface CanadaWeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  observationTime: string;
}

// Environment Canada city codes for major cities
export const CANADA_CITY_CODES: Record<string, string> = {
  toronto: 's0000458',
  montreal: 's0000635',
  vancouver: 's0000141',
  calgary: 's0000047',
  ottawa: 's0000623',
  edmonton: 's0000045',
  winnipeg: 's0000193',
  'quebec-city': 's0000620',
  hamilton: 's0000456',
  halifax: 's0000318',
};

/**
 * Fetch current weather from Environment Canada
 * Returns XML data that needs parsing
 */
export async function fetchCanadaWeather(cityCode: string): Promise<CanadaWeatherData | null> {
  // Environment Canada provides data via XML
  // For simplicity, we'll use a CORS proxy or server-side fetch in production
  const url = `https://dd.weather.gc.ca/citypage_weather/xml/ON/${cityCode}_e.xml`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Environment Canada API unavailable for ${cityCode}`);
      return null;
    }

    const xmlText = await response.text();
    // Parse XML - in production, use a proper XML parser
    // For now, extract basic data with regex
    const tempMatch = xmlText.match(/<temperature.*?>([-\d.]+)<\/temperature>/);
    const humidityMatch = xmlText.match(/<relativeHumidity.*?>([\d]+)<\/relativeHumidity>/);
    const conditionMatch = xmlText.match(/<condition>(.*?)<\/condition>/);

    return {
      temperature: tempMatch ? parseFloat(tempMatch[1]) : 0,
      humidity: humidityMatch ? parseInt(humidityMatch[1], 10) : 0,
      windSpeed: 0,
      condition: conditionMatch ? conditionMatch[1] : 'Unknown',
      observationTime: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching Canada weather:', error);
    return null;
  }
}
