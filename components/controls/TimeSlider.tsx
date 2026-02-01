'use client';

import { useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, SkipBack, SkipForward, Calendar } from 'lucide-react';
import { useDashboardStore } from '@/lib/store';
import { format, subMonths, addMonths } from 'date-fns';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function TimeSlider() {
  const { timeSliderValue, setTimeSliderValue, setSelectedDate } = useDashboardStore();

  const dateRange = useMemo(() => {
    const end = new Date();
    const start = subMonths(end, 11);
    return { start, end };
  }, []);

  const currentMonth = useMemo(() => {
    const monthIndex = Math.floor((timeSliderValue / 100) * 11);
    const date = addMonths(dateRange.start, monthIndex);
    return format(date, 'MMMM yyyy');
  }, [timeSliderValue, dateRange]);

  const handleSliderChange = (value: number[]) => {
    setTimeSliderValue(value[0]);
    const monthIndex = Math.floor((value[0] / 100) * 11);
    const newDate = addMonths(dateRange.start, monthIndex);
    setSelectedDate(newDate);
  };

  const skipBack = () => {
    const newValue = Math.max(0, timeSliderValue - 100 / 11);
    setTimeSliderValue(newValue);
    handleSliderChange([newValue]);
  };

  const skipForward = () => {
    const newValue = Math.min(100, timeSliderValue + 100 / 11);
    setTimeSliderValue(newValue);
    handleSliderChange([newValue]);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Time Period</span>
        </div>
        <span className="text-sm font-semibold text-emerald-600">{currentMonth}</span>
      </div>

      <div className="mb-3">
        <Slider
          value={[timeSliderValue]}
          onValueChange={handleSliderChange}
          max={100}
          step={100 / 11}
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipBack}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Play className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipForward}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1 text-xs text-gray-500">
          {months.map((month, index) => (
            <span
              key={month}
              className={`px-1 ${
                Math.floor((timeSliderValue / 100) * 11) === index
                  ? 'font-semibold text-emerald-600'
                  : ''
              }`}
            >
              {month.charAt(0)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
