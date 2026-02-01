'use client';

import { addMonths, format, differenceInMonths, startOfMonth } from 'date-fns';
import { Calendar } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { useDashboardStore } from '@/lib/store';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function TimeSlider() {
  const { selectedDate, timeSliderValue, setTimeSliderValue, setSelectedDate } = useDashboardStore();

  // Calculate date range: 12 months (0-11 months ago to current month)
  const dateRange = useMemo(() => {
    const now = new Date();
    const end = startOfMonth(now);
    const start = startOfMonth(addMonths(now, -11));
    // Ensure dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      const fallback = startOfMonth(new Date());
      return { start: fallback, end: fallback };
    }
    return { start, end };
  }, []);

  // Calculate slider value from selectedDate on mount and when selectedDate changes externally
  useEffect(() => {
    if (!dateRange.start || isNaN(dateRange.start.getTime()) || !selectedDate || isNaN(selectedDate.getTime())) {
      return;
    }
    const monthsDiff = differenceInMonths(startOfMonth(selectedDate), dateRange.start);
    const calculatedValue = Math.min(100, Math.max(0, (monthsDiff / 11) * 100));
    // Only update if there's a meaningful difference to avoid loops
    // Use functional update to get current timeSliderValue without adding it to deps
    setTimeSliderValue((currentValue) => {
      if (Math.abs(calculatedValue - currentValue) > 0.1) {
        return calculatedValue;
      }
      return currentValue;
    });
  }, [selectedDate, dateRange.start]); // Removed timeSliderValue to keep deps constant

  // Calculate current month from slider value
  const currentMonth = useMemo(() => {
    if (!dateRange.start || isNaN(dateRange.start.getTime())) {
      return format(new Date(), 'MMMM yyyy');
    }
    const monthIndex = Math.round((timeSliderValue / 100) * 11);
    const clampedIndex = Math.min(11, Math.max(0, monthIndex));
    const date = addMonths(dateRange.start, clampedIndex);
    if (isNaN(date.getTime())) {
      return format(new Date(), 'MMMM yyyy');
    }
    return format(date, 'MMMM yyyy');
  }, [timeSliderValue, dateRange]);

  // Calculate which month is selected for highlighting
  const selectedMonthIndex = useMemo(() => {
    const monthIndex = Math.round((timeSliderValue / 100) * 11);
    return Math.min(11, Math.max(0, monthIndex));
  }, [timeSliderValue]);

  // Get the actual selected month (0-11, where 0=Jan, 11=Dec)
  const selectedCalendarMonth = useMemo(() => {
    if (!dateRange.start || isNaN(dateRange.start.getTime())) {
      return new Date().getMonth();
    }
    const monthIndex = Math.round((timeSliderValue / 100) * 11);
    const clampedIndex = Math.min(11, Math.max(0, monthIndex));
    const date = addMonths(dateRange.start, clampedIndex);
    if (isNaN(date.getTime())) {
      return new Date().getMonth();
    }
    return date.getMonth(); // 0-11 (Jan-Dec)
  }, [timeSliderValue, dateRange]);

  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    setTimeSliderValue(newValue);
    
    if (!dateRange.start || isNaN(dateRange.start.getTime())) {
      return;
    }
    
    const monthIndex = Math.round((newValue / 100) * 11);
    const clampedIndex = Math.min(11, Math.max(0, monthIndex));
    const newDate = startOfMonth(addMonths(dateRange.start, clampedIndex));
    
    if (!isNaN(newDate.getTime())) {
      setSelectedDate(newDate);
    }
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

      <div className="flex items-center justify-end">
        <div className="flex gap-1 text-xs text-gray-500">
          {months.map((month, index) => {
            // index here is the calendar month (0=Jan, 1=Feb, ..., 11=Dec)
            // Check if this calendar month matches the selected month
            const isSelected = selectedCalendarMonth === index;
            return (
              <span
                key={`${month}-${index}`}
                className={`px-1 ${
                  isSelected ? 'font-semibold text-emerald-600' : ''
                }`}
              >
                {month.charAt(0)}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
