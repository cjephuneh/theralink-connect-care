
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Slot {
  date: string;
  slots: string[];
}

interface Props {
  value: Slot[];
  onChange: (val: Slot[]) => void;
}

const DEFAULT_TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

// Minimal calendar for next 7 days for simplicity
function getNextNDates(n: number) {
  const arr: string[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

export default function AvailabilityPicker({ value, onChange }: Props) {
  const dates = getNextNDates(7);

  const handleSlotToggle = (date: string, time: string) => {
    const prev = value.find(day => day.date === date);
    let next: Slot[];
    if (!prev) {
      next = [...value, { date, slots: [time] }];
    } else if (prev.slots.includes(time)) {
      next = value.map(day =>
        day.date === date
          ? { ...day, slots: day.slots.filter(t => t !== time) }
          : day
      );
    } else {
      next = value.map(day =>
        day.date === date
          ? { ...day, slots: [...day.slots, time] }
          : day
      );
    }
    // Remove empty slots
    next = next.filter(day => day.slots.length > 0);
    onChange(next);
  };

  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">
        Select available time slots for the next 7 days.
      </p>
      <div className="flex flex-col gap-4">
        {dates.map(date => (
          <div key={date}>
            <div className="mb-1 font-medium">{date}</div>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_TIME_SLOTS.map(time => {
                const enabled = value.find(day => day.date === date)?.slots.includes(time) ?? false;
                return (
                  <Button
                    key={time}
                    size="sm"
                    type="button"
                    variant={enabled ? "default" : "outline"}
                    onClick={() => handleSlotToggle(date, time)}
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
