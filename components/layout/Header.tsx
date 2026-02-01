'use client';

import { Download, Info, Menu, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CANADIAN_CITIES } from '@/lib/data';
import { useDashboardStore } from '@/lib/store';

export function Header() {
  const {
    selectedCity,
    setSelectedCity,
    sidebarOpen,
    setSidebarOpen,
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
