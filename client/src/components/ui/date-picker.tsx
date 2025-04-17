import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean | ((date: Date) => boolean);
}

export function DatePicker({ 
  value, 
  onChange, 
  placeholder = "Pick a date", 
  label,
  disabled
}: DatePickerProps) {
  return (
    <div className="flex flex-col">
      {label && <FormLabel>{label}</FormLabel>}
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "pl-3 text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              {value ? (
                format(value, "PPP")
              ) : (
                <span>{placeholder}</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => onChange(date || undefined)}
            disabled={disabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}