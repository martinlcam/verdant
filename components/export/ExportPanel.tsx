'use client';

import { useState } from 'react';
import { Download, FileImage, FileSpreadsheet, FileText, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/lib/store';
import { generateCityStats, generateHeatZones, generateRecommendations } from '@/lib/data';

type ExportFormat = 'png' | 'csv' | 'json';

export function ExportPanel() {
  const { selectedCity } = useDashboardStore();
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [exported, setExported] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setExporting(format);
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const stats = generateCityStats(selectedCity);
    const zones = generateHeatZones(selectedCity);
    const recommendations = generateRecommendations(selectedCity);

    if (format === 'csv') {
      // Generate CSV content
      const csvContent = [
        ['Heat Zone Report for', selectedCity.name, selectedCity.province].join(','),
        '',
        ['Zone Name', 'Severity', 'Avg Temperature', 'Max Temperature', 'Area (km²)', 'Vulnerability Score'].join(','),
        ...zones.map(z => [
          z.name,
          z.severity,
          z.avgTemperature.toFixed(1),
          z.maxTemperature.toFixed(1),
          z.area.toFixed(2),
          z.vulnerabilityScore.toFixed(0)
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      downloadBlob(blob, `verdant-${selectedCity.id}-report.csv`);
    } else if (format === 'json') {
      const report = {
        city: selectedCity,
        stats,
        heatZones: zones,
        recommendations,
        generatedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `verdant-${selectedCity.id}-data.json`);
    } else if (format === 'png') {
      // For PNG, we'd capture the map - simplified here
      alert('Map screenshot feature would capture the current view. This requires additional setup with html2canvas.');
    }

    setExporting(null);
    setExported(format);
    setTimeout(() => setExported(null), 2000);
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

  const exportOptions = [
    {
      format: 'csv' as ExportFormat,
      icon: <FileSpreadsheet className="h-5 w-5" />,
      title: 'CSV Report',
      description: 'Heat zones & statistics',
    },
    {
      format: 'json' as ExportFormat,
      icon: <FileText className="h-5 w-5" />,
      title: 'JSON Data',
      description: 'Full data export',
    },
    {
      format: 'png' as ExportFormat,
      icon: <FileImage className="h-5 w-5" />,
      title: 'Map Image',
      description: 'Current view snapshot',
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Download className="h-4 w-4 text-emerald-500" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {exportOptions.map((option) => (
            <Button
              key={option.format}
              variant="outline"
              className="h-auto flex-col gap-1 p-3"
              onClick={() => handleExport(option.format)}
              disabled={exporting !== null}
            >
              {exporting === option.format ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              ) : exported === option.format ? (
                <Check className="h-5 w-5 text-emerald-500" />
              ) : (
                <span className="text-gray-600 dark:text-gray-400">{option.icon}</span>
              )}
              <span className="text-xs font-medium">{option.title}</span>
              <span className="text-[10px] text-gray-400">{option.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
