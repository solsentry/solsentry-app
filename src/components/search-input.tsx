"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search wallet...",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full pl-9 pr-3 py-1.5 rounded-md text-xs font-mono",
          "bg-popover text-foreground placeholder:text-muted-foreground/60",
          "border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
          "outline-none transition-all",
        )}
      />
    </div>
  );
}
