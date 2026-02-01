'use client';

import { Sun, Moon, Menu, Download, Info, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDashboardStore } from '@/lib/store';
import { CANADIAN_CITIES } from '@/lib/data';
import { useState } from 'react';

export function Header() {
  const { 
    selectedCity, 
    setSelectedCity, 
    sidebarOpen, 
    setSidebarOpen,
    temperatureUnit,
    setTemperatureUnit
  } = useDashboardStore();
  
  const [isDark, setIsDark] = useState(false);

  const handleCityChange = (cityId: string) => {
    const city = CANADIAN_CITIES.find((c) => c.id === cityId);
    if (city) {
      setSelectedCity(city);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
            <Thermometer className="h-5 w-5 text-white" />
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

        <div className="hidden items-center gap-1 rounded-lg border border-gray-200 p-1 dark:border-gray-700 sm:flex">
          <Button
            variant={temperatureUnit === 'C' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTemperatureUnit('C')}
            className="h-7 w-8 px-0"
          >
            °C
          </Button>
          <Button
            variant={temperatureUnit === 'F' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTemperatureUnit('F')}
            className="h-7 w-8 px-0"
          >
            °F
          </Button>
        </div>

        <Button variant="outline" size="icon" className="hidden sm:flex">
          <Download className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
