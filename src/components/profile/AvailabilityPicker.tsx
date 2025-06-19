
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Slot {
  day: string;
  slots: string[];
}

interface Props {
  value: Slot[];
  onChange: (val: Slot[]) => void;
}

const DEFAULT_TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export default function AvailabilityPicker({ value, onChange }: Props) {
  const [selectedDay, setSelectedDay] = useState<string>("monday");

  const handleSlotToggle = (day: string, time: string) => {
    const prev = value.find(d => d.day === day);
    let next: Slot[];
    
    if (!prev) {
      next = [...value, { day, slots: [time] }];
    } else if (prev.slots.includes(time)) {
      next = value.map(d =>
        d.day === day
          ? { ...d, slots: d.slots.filter(t => t !== time) }
          : d
      );
    } else {
      next = value.map(d =>
        d.day === day
          ? { ...d, slots: [...d.slots, time] }
          : d
      );
    }
    
    // Remove days with no slots
    next = next.filter(d => d.slots.length > 0);
    onChange(next);
  };

  const getSelectedSlotsForDay = (day: string) => {
    return value.find(d => d.day === day)?.slots || [];
  };

  const getTotalSelectedSlots = () => {
    return value.reduce((total, day) => total + day.slots.length, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Select your available time slots for each day of the week.
        </p>
        {getTotalSelectedSlots() > 0 && (
          <Badge variant="secondary" className="text-xs">
            {getTotalSelectedSlots()} slots selected
          </Badge>
        )}
      </div>
      
      {/* Day Selection */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Select Day</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map(day => {
            const daySlots = getSelectedSlotsForDay(day.key);
            return (
              <Button
                key={day.key}
                size="sm"
                type="button"
                variant={selectedDay === day.key ? "default" : "outline"}
                onClick={() => setSelectedDay(day.key)}
                className="flex flex-col items-center p-2 h-auto relative"
              >
                <span className="text-xs font-medium">{day.label}</span>
                {daySlots.length > 0 && (
                  <Badge variant="secondary" className="mt-1 text-xs px-1 py-0">
                    {daySlots.length}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">
            Available Times - {DAYS_OF_WEEK.find(d => d.key === selectedDay)?.label}
          </h4>
          {getSelectedSlotsForDay(selectedDay).length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const next = value.map(d =>
                  d.day === selectedDay
                    ? { ...d, slots: [] }
                    : d
                ).filter(d => d.slots.length > 0);
                onChange(next);
              }}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Clear all
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md bg-muted/20">
          {DEFAULT_TIME_SLOTS.map(time => {
            const isSelected = getSelectedSlotsForDay(selectedDay).includes(time);
            return (
              <Button
                key={time}
                size="sm"
                type="button"
                variant={isSelected ? "default" : "outline"}
                onClick={() => handleSlotToggle(selectedDay, time)}
                className="text-xs h-8"
              >
                {time}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {value.length > 0 && (
        <div className="space-y-2 p-3 border rounded-md bg-muted/20">
          <h5 className="font-medium text-sm">Availability Summary</h5>
          <div className="space-y-1">
            {value.map(day => (
              <div key={day.day} className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-medium min-w-20">
                  {DAYS_OF_WEEK.find(d => d.key === day.day)?.label}:
                </span>
                <div className="flex flex-wrap gap-1">
                  {day.slots.sort().map(slot => (
                    <Badge key={slot} variant="outline" className="text-xs px-1 py-0">
                      {slot}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
