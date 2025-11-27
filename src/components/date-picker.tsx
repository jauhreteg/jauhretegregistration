"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  storageKey?: string; // For local storage persistence
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
  storageKey,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Initialize from localStorage or prop value
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    () => {
      // First try prop value (form state)
      if (value) return value;

      // Then try localStorage
      if (storageKey && typeof window !== "undefined") {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          return new Date(stored);
        }
      }
      return undefined;
    }
  );

  // Sync with prop value when it changes
  React.useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date); // Immediate visual feedback

    // Save to localStorage if storageKey provided
    if (storageKey && typeof window !== "undefined") {
      if (date) {
        localStorage.setItem(storageKey, date.toISOString());
      } else {
        localStorage.removeItem(storageKey);
      }
    }

    onChange(date);
    if (date) {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-10 min-w-48 w-auto justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, "PPP")
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0 bg-white border border-gray-200 shadow-lg z-50"
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          captionLayout="dropdown"
          onSelect={handleDateSelect}
          className="bg-white"
        />
      </PopoverContent>
    </Popover>
  );
}
