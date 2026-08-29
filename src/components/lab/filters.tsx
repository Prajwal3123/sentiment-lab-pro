import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant"
      />
      <input
        type="search"
        value={value}
        aria-label={label ?? placeholder}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded-lg border border-outline-variant bg-surface-lowest pl-9 pr-3 font-mono text-label-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus-visible:outline-none"
      />
    </div>
  );
}

export interface FilterOption {
  value: string;
  label: string;
}

export function FilterSelect({
  value,
  onChange,
  options,
  label,
  className,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  label: string;
  className?: string;
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          "h-9 min-w-[9rem] rounded-lg border-outline-variant bg-surface-lowest font-mono text-label-md text-on-surface",
          className,
        )}
      >
        <SelectValue placeholder={placeholder ?? label} />
      </SelectTrigger>
      <SelectContent className="border-outline-variant bg-surface-low font-mono text-label-md">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-label-md">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function FilterBar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>
  );
}
