import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DayClickEventHandler } from "react-day-picker";

interface DatePickerProps {
  value?: Date | null;
  onChange: (date?: Date | null) => void;
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
  // Handler for the date selection
  const handleSelect = React.useCallback(
    (date: Date | undefined) => {
      onChange(date);
    },
    [onChange]
  );

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
          <CalendarComponent
            mode="single"
            selected={value || undefined}
            onSelect={handleSelect}
            disabled={disabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}