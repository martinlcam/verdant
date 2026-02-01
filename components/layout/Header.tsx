'use client';

import { Download, FileImage, FileSpreadsheet, FileText, Info, Menu } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CANADIAN_CITIES, generateCityStats, generateHeatZones, generateRecommendations } from '@/lib/data';
import { useDashboardStore } from '@/lib/store';

export function Header() {
  const { selectedCity, setSelectedCity, sidebarOpen, setSidebarOpen } = useDashboardStore();

  const handleCityChange = (cityId: string) => {
    const city = CANADIAN_CITIES.find((c) => c.id === cityId);
    if (city) {
      setSelectedCity(city);
    }
  };

  const handleExport = async (format: 'csv' | 'json' | 'png') => {
    const stats = generateCityStats(selectedCity);
    const zones = generateHeatZones(selectedCity);
    const recommendations = generateRecommendations(selectedCity);

    if (format === 'csv') {
      // Generate CSV content
      const csvContent = [
        ['Heat Zone Report for', selectedCity.name, selectedCity.province].join(','),
        '',
        [
          'Zone Name',
          'Severity',
          'Avg Temperature',
          'Max Temperature',
          'Area (km²)',
          'Vulnerability Score',
        ].join(','),
        ...zones.map((z) =>
          [
            z.name,
            z.severity,
            z.avgTemperature.toFixed(1),
            z.maxTemperature.toFixed(1),
            z.area.toFixed(2),
            z.vulnerabilityScore.toFixed(0),
          ].join(','),
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      downloadBlob(blob, `verdant-${selectedCity.id}-report.csv`);
    } else if (format === 'json') {
      const report = {
        city: selectedCity,
        stats,
        heatZones: zones,
        recommendations,
        generatedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `verdant-${selectedCity.id}-data.json`);
    } else if (format === 'png') {
      // For PNG, we'd capture the map - simplified here
      alert(
        'Map screenshot feature would capture the current view. This requires additional setup with html2canvas.',
      );
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9">
            <Image
              src="/favicons/LIGHT-GREEN-LOGO.svg"
              alt="Verdant Logo"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Verdant</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Urban Heat Intelligence</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select value={selectedCity.id} onValueChange={handleCityChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {CANADIAN_CITIES.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}, {city.province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="hidden sm:flex">
              <Download className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              <span>CSV Report</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('json')} className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
              <span>JSON Data</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('png')} className="cursor-pointer">
              <FileImage className="mr-2 h-4 w-4" />
              <span>Map Image</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
