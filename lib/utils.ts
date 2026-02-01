import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTemperature(temp: number): string {
  return `${temp.toFixed(1)}°C`;
}

export function formatTemperatureDifference(temp: number): string {
  return `${temp.toFixed(1)}°C`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-CA').format(num);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(area: number): string {
  if (area >= 1000000) {
    return `${(area / 1000000).toFixed(2)} km²`;
  }
  if (area >= 1000) {
    return `${(area / 1000).toFixed(2)} ha`;
  }
  return `${area.toFixed(0)} m²`;
}

export function getHeatSeverityColor(temperature: number): string {
  if (temperature >= 40) return '#7f1d1d'; // extreme - red-900
  if (temperature >= 35) return '#dc2626'; // high - red-600
  if (temperature >= 30) return '#f97316'; // moderate - orange-500
  if (temperature >= 25) return '#facc15'; // low - yellow-400
  return '#22c55e'; // cool - green-500
}

export function getHeatSeverityLabel(temperature: number): string {
  if (temperature >= 40) return 'Extreme';
  if (temperature >= 35) return 'High';
  if (temperature >= 30) return 'Moderate';
  if (temperature >= 25) return 'Low';
  return 'Cool';
}

export function getPriorityColor(priority: 'low' | 'medium' | 'high' | 'critical'): string {
  switch (priority) {
    case 'critical':
      return '#dc2626';
    case 'high':
      return '#f97316';
    case 'medium':
      return '#facc15';
    case 'low':
      return '#22c55e';
  }
}

export function getInfrastructureIcon(type: string): string {
  switch (type) {
    case 'urban_park':
      return '🌳';
    case 'green_roof':
      return '🏢';
    case 'tree_planting':
      return '🌲';
    case 'cool_pavement':
      return '🛤️';
    case 'bioswale':
      return '💧';
    case 'permeable_surface':
      return '⬛';
    case 'water_feature':
      return '⛲';
    default:
      return '📍';
  }
}

export function calculateHeatIslandIntensity(urban: number, rural: number): number {
  return urban - rural;
}

export function generateDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function interpolateColor(value: number, min: number, max: number): string {
  const normalized = (value - min) / (max - min);

  // Color gradient from green (cool) to yellow to red (hot)
  if (normalized < 0.5) {
    const ratio = normalized * 2;
    const r = Math.round(34 + (250 - 34) * ratio);
    const g = Math.round(197 + (204 - 197) * ratio);
    const b = Math.round(94 + (21 - 94) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const ratio = (normalized - 0.5) * 2;
    const r = Math.round(250 + (220 - 250) * ratio);
    const g = Math.round(204 + (38 - 204) * ratio);
    const b = Math.round(21 + (38 - 21) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  }
}
