import { useMemo, useState } from "react";
import { format, parse } from "date-fns";
import { CalendarDays } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DISPLAY = "d MMM yyyy";

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function parsePart(value: string): Date | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = parse(trimmed, DISPLAY, new Date());
  if (!Number.isNaN(parsed.getTime())) return parsed;
  const fallback = new Date(trimmed);
  return Number.isNaN(fallback.getTime()) ? undefined : fallback;
}

export function parseDateRange(value: string): DateRange | undefined {
  if (!value?.trim()) return undefined;
  const [start, end] = value.split(/\s+[–-]\s+/);
  const from = parsePart(start);
  if (!from) return undefined;
  const to = end ? parsePart(end) : undefined;
  return { from, to };
}

export function formatDateRange(range?: DateRange): string {
  if (!range?.from) return "";
  const from = format(range.from, DISPLAY);
  if (!range.to) return from;
  return `${from} – ${format(range.to, DISPLAY)}`;
}

type DateRangeFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
};

export default function DateRangeField({
  label,
  value,
  onChange,
  error,
  hint = "Select arrival, then departure",
}: DateRangeFieldProps) {
  const [open, setOpen] = useState(false);
  const today = useMemo(() => startOfToday(), []);
  const selected = parseDateRange(value);
  const floated = open || Boolean(value);

  return (
    <div className="relative mt-6 pt-4">
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={label}
            aria-invalid={Boolean(error)}
            className={cn(
              "peer flex w-full items-center justify-between gap-3 bg-transparent border-b border-border/50 py-2 text-left font-sans outline-none transition-colors rounded-none",
              open && "border-transparent",
            )}
          >
            <span className={cn("truncate", value ? "text-foreground" : "text-transparent")}>
              {value || "Select dates"}
            </span>
            <CalendarDays className="size-4 shrink-0 text-accent" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="z-[80] w-[min(calc(100vw-2rem),20.5rem)] border-accent/30 bg-background p-3 shadow-xl"
        >
          <Calendar
            mode="range"
            selected={selected}
            onSelect={(range) => {
              onChange(formatDateRange(range));
              if (range?.from && range?.to) setOpen(false);
            }}
            disabled={{ before: today }}
            captionLayout="dropdown"
            startMonth={today}
            endMonth={new Date(today.getFullYear() + 3, 11)}
            defaultMonth={selected?.from ?? today}
            className="w-full [--cell-size:2.15rem]"
          />
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-border/60 pt-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {hint}
            </p>
            {value ? (
              <button
                type="button"
                className="text-[10px] font-bold uppercase tracking-wider text-accent hover:text-primary"
                onClick={() => onChange("")}
              >
                Clear
              </button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
      <label
        className={cn(
          "absolute left-0 pointer-events-none transition-all duration-300",
          floated
            ? "top-0 text-[10px] font-bold uppercase text-accent"
            : "top-6 text-sm text-muted-foreground",
        )}
      >
        {label}
      </label>
      <div
        className={cn(
          "absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent transition-transform duration-300",
          open ? "scale-x-100" : "scale-x-0",
        )}
      />
      {error ? (
        <p className="text-destructive text-[10px] font-bold uppercase mt-1 absolute -bottom-4 animate-shake">
          {error}
        </p>
      ) : null}
    </div>
  );
}
