"use client"

import * as React from "react"
import { format } from "date-fns"
import { hu } from 'date-fns/locale'
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
  // Ensure `date` is a valid Date object or undefined.
  // This handles cases where `date` might be a string (from localStorage) or an invalid date.
  const validDate = date ? new Date(date) : undefined;
  const selected = validDate && !isNaN(validDate.getTime()) ? validDate : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP", { locale: hu }) : <span>Válassz dátumot</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setDate}
          initialFocus
          locale={hu}
        />
      </PopoverContent>
    </Popover>
  )
}
