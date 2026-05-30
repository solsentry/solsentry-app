"use client";

import * as React from "react";
import { Search, ArrowRight, X, Bot, MapPin, Tag, Gem, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Kbd } from "@/components/ui/kbd";

// ============================================================================
// TYPES
// ============================================================================

type SearchVariant = "hero" | "nav" | "dashboard";
type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE";
type DetectionType = "sns" | "address" | "symbol" | "ai" | null;

interface AutocompleteItem {
  id: string;
  type: "operator" | "token";
  name: string;
  address: string;
  risk: RiskLevel;
  tags?: string[];
}

interface SolSentrySearchProps {
  variant?: SearchVariant;
  defaultValue?: string;
  forcedState?: "empty" | "typing-address" | "typing-ai" | "loading" | "error";
  onSearch?: (query: string, detectionType: DetectionType) => void;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PLACEHOLDERS = [
  "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
  "qual operador rodou mais rug essa semana?",
  "vagrant.sol",
  "compare 4kxscute com 7ZqRsT em 14 dias",
  "USDC",
  "que tokens este cluster lançou nas últimas 24h?",
];

const MOCK_AUTOCOMPLETE: AutocompleteItem[] = [
  {
    id: "1",
    type: "operator",
    name: "RugFactory_Alpha",
    address: "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
    risk: "CRITICAL",
    tags: ["serial_deployer", "fast_deployer"],
  },
  {
    id: "2",
    type: "operator",
    name: "ShadyDeployer_42",
    address: "7ZqRsT8vNmK2pLwXqYtH9jD3sFgB6kCzA5mE1nR4wUiV",
    risk: "HIGH",
    tags: ["bundle_dumper"],
  },
  {
    id: "3",
    type: "operator",
    name: "LegitBuilder.sol",
    address: "9FwPqR3mXnK7bL2sYtH8jD4sFgB5kCzA6mE2nR3wUiP",
    risk: "SAFE",
    tags: ["verified"],
  },
  {
    id: "4",
    type: "token",
    name: "SCAM_TOKEN",
    address: "ScAmT0k3nXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
    risk: "CRITICAL",
  },
  {
    id: "5",
    type: "token",
    name: "SAFE_COIN",
    address: "SaFeCo1nYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy",
    risk: "SAFE",
  },
];

const RISK_COLORS: Record<RiskLevel, string> = {
  CRITICAL: "bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30",
  HIGH: "bg-primary/20 text-primary border-primary/30",
  MEDIUM: "bg-[#eab308]/20 text-[#eab308] border-[#eab308]/30",
  LOW: "bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30",
  SAFE: "bg-[#14b8a6]/20 text-[#14b8a6] border-[#14b8a6]/30",
};

const VARIANT_STYLES: Record<SearchVariant, { container: string; input: string }> = {
  hero: {
    container: "w-full sm:w-[640px] sm:max-w-full",
    input: "h-14 text-sm px-3 sm:h-16 sm:text-base sm:px-5",
  },
  nav: {
    container: "w-full sm:w-[320px]",
    input: "h-10 text-sm px-3",
  },
  dashboard: {
    container: "w-full",
    input: "h-11 text-sm px-3 sm:h-12 sm:px-4",
  },
};

// ============================================================================
// DETECTION LOGIC
// ============================================================================

function detectInputType(value: string): DetectionType {
  if (!value.trim()) return null;

  // SNS domain
  if (/\.sol$/i.test(value)) return "sns";

  // Solana address (Base58, 32-44 chars)
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)) return "address";

  // Token symbol (2-10 uppercase alphanumeric)
  if (/^[A-Z0-9]{2,10}$/.test(value)) return "symbol";

  // Natural language (2+ words or contains question mark)
  if (value.includes("?") || value.trim().split(/\s+/).length >= 2) return "ai";

  return null;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function DetectionChip({ type, compact = false }: { type: DetectionType; compact?: boolean }) {
  if (!type) return null;

  const chips: Record<
    NonNullable<DetectionType>,
    { icon: React.ReactNode; label: string; labelShort: string; className: string }
  > = {
    sns: {
      icon: <Tag className="size-3 shrink-0" />,
      label: "SNS",
      labelShort: "SNS",
      className: "bg-[#14b8a6]/20 text-[#14b8a6] border-[#14b8a6]/30",
    },
    address: {
      icon: <MapPin className="size-3 shrink-0" />,
      label: "address",
      labelShort: "addr",
      className: "bg-[#B8B0A0]/20 text-muted-foreground border-[#B8B0A0]/30",
    },
    symbol: {
      icon: <Gem className="size-3 shrink-0" />,
      label: "symbol",
      labelShort: "sym",
      className: "bg-primary/20 text-primary border-primary/30",
    },
    ai: {
      icon: <Bot className="size-3 shrink-0" />,
      label: "AI · ~2 cred",
      labelShort: "AI ~2",
      className: "bg-primary/20 text-primary border-primary/30",
    },
  };

  const chip = chips[type];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap",
        chip.className,
      )}
    >
      {chip.icon}
      <span className={compact ? "hidden" : "hidden sm:inline"}>{chip.label}</span>
      <span className={compact ? "inline" : "sm:hidden"}>{chip.labelShort}</span>
    </span>
  );
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        RISK_COLORS[risk],
      )}
    >
      {risk}
    </span>
  );
}

function AutocompleteDropdown({
  items,
  selectedIndex,
  onSelect,
  isVisible,
}: {
  items: AutocompleteItem[];
  selectedIndex: number;
  onSelect: (item: AutocompleteItem) => void;
  isVisible: boolean;
}) {
  if (!isVisible || items.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
      {items.slice(0, 5).map((item, index) => (
        <button
          key={item.id}
          type="button"
          className={cn(
            "flex w-full items-center gap-3 px-4 py-3 text-left transition-all",
            index === selectedIndex
              ? "bg-secondary shadow-[0_0_20px_rgba(245,158,11,0.15)]"
              : "hover:bg-popover",
          )}
          onClick={() => onSelect(item)}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary">
            {item.type === "operator" ? (
              <MapPin className="size-4 text-muted-foreground" />
            ) : (
              <Gem className="size-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-medium text-foreground">{item.name}</span>
            <span className="truncate font-mono text-xs text-muted-foreground/60">
              {item.address.slice(0, 8)}...{item.address.slice(-6)}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <RiskBadge risk={item.risk} />
            <ArrowRight className="size-4 text-muted-foreground/60" />
          </div>
        </button>
      ))}
    </div>
  );
}

function LoadingState({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <Loader2 className="size-4 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">Analisando...</span>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        Cancelar
      </button>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-0.5 py-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-1.5 sm:gap-y-0 sm:py-2">
      <span className="shrink-0 text-xs text-[#ef4444] sm:text-sm">Não entendi.</span>
      <span className="truncate text-xs text-muted-foreground sm:text-sm">
        <span className="hidden sm:inline">Cole wallet ou tente: </span>
        <span className="sm:hidden">Tente: </span>
        <span className="font-mono text-muted-foreground/60">vagrant.sol</span>
        <span className="text-muted-foreground/60">{" / "}</span>
        <span className="font-mono text-muted-foreground/60">USDC</span>
      </span>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function SolSentrySearch({
  variant = "dashboard",
  defaultValue = "",
  forcedState,
  onSearch,
  className,
}: SolSentrySearchProps) {
  const [value, setValue] = React.useState(defaultValue);
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(forcedState === "loading");
  const [hasError, setHasError] = React.useState(forcedState === "error");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Apply forced state
  React.useEffect(() => {
    if (forcedState === "typing-address") {
      setValue("4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1");
      setIsFocused(true);
    } else if (forcedState === "typing-ai") {
      setValue("qual operador rodou mais rug essa semana?");
      setIsFocused(true);
    } else if (forcedState === "loading") {
      setValue("4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1");
      setIsLoading(true);
    } else if (forcedState === "error") {
      setValue("asdfghjkl");
      setHasError(true);
      setIsFocused(true);
    } else if (forcedState === "empty") {
      setValue("");
      setIsFocused(true);
    }
  }, [forcedState]);

  // Rotating placeholder
  React.useEffect(() => {
    if (value || forcedState) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [value, forcedState]);

  // Cmd+K / Ctrl+K shortcut
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const detectionType = detectInputType(value);
  const showAutocomplete =
    isFocused &&
    value.length > 0 &&
    !isLoading &&
    !hasError &&
    (detectionType === "address" || detectionType === "symbol" || detectionType === "sns");

  const filteredItems = React.useMemo(() => {
    if (!showAutocomplete) return [];
    const query = value.toLowerCase();
    return MOCK_AUTOCOMPLETE.filter(
      (item) =>
        item.name.toLowerCase().includes(query) || item.address.toLowerCase().includes(query),
    );
  }, [showAutocomplete, value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setValue("");
      setHasError(false);
      inputRef.current?.blur();
      return;
    }

    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      if (showAutocomplete && filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      } else {
        handleSearch();
      }
      return;
    }

    if (e.key === "Tab" && showAutocomplete && filteredItems.length > 0) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      return;
    }

    if (e.key === "ArrowDown" && showAutocomplete) {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
      return;
    }

    if (e.key === "ArrowUp" && showAutocomplete) {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleSearch = () => {
    if (!value.trim()) return;
    console.log("[SolSentry] Search:", { query: value, detectionType });
    onSearch?.(value, detectionType);
  };

  const handleSelect = (item: AutocompleteItem) => {
    setValue(item.address);
    console.log("[SolSentry] Selected:", item);
    onSearch?.(item.address, "address");
  };

  const handleCancel = () => {
    setIsLoading(false);
    setValue("");
  };

  const styles = VARIANT_STYLES[variant];

  return (
    <div className={cn("relative", styles.container, className)}>
      <div
        className={cn(
          "relative flex items-center overflow-hidden rounded-lg border border-border bg-card transition-all",
          isFocused && "border-primary/50 ring-2 ring-primary/20",
          hasError && "border-[#ef4444]/50 ring-2 ring-[#ef4444]/20",
        )}
      >
        <div className="flex shrink-0 items-center justify-center pl-4">
          <Search className="size-4 text-muted-foreground/60" />
        </div>

        {isLoading ? (
          <div className={cn("flex flex-1 items-center", styles.input)}>
            <LoadingState onCancel={handleCancel} />
          </div>
        ) : hasError ? (
          <div
            className={cn(
              "flex flex-1 items-center px-3",
              styles.input.replace("px-5", "").replace("px-4", "").replace("px-3", ""),
            )}
          >
            <ErrorState />
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setHasError(false);
              setSelectedIndex(0);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay to allow click on autocomplete
              setTimeout(() => setIsFocused(false), 150);
            }}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDERS[placeholderIndex]}
            aria-label="Buscar wallet, token ou fazer pergunta"
            aria-autocomplete="list"
            aria-expanded={showAutocomplete}
            className={cn(
              "min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none",
              "truncate font-mono placeholder:font-mono",
              styles.input,
            )}
          />
        )}

        <div className="flex shrink-0 items-center gap-1.5 pr-2 sm:gap-2 sm:pr-3">
          {/* Detection chip */}
          {!isLoading && !hasError && value && (
            <DetectionChip type={detectionType} compact={variant === "nav"} />
          )}

          {/* AI CTA for natural language */}
          {!isLoading && !hasError && detectionType === "ai" && (
            <button
              type="button"
              onClick={handleSearch}
              className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[10px] font-medium text-[#100E0A] transition-all hover:bg-primary/90 sm:gap-1.5 sm:px-2.5 sm:text-xs"
            >
              <Bot className="size-3" />
              <span className="hidden sm:inline">perguntar</span>
              <span className="sm:hidden">ask</span>
            </button>
          )}

          {/* Clear button when there's content */}
          {!isLoading && value && !hasError && detectionType !== "ai" && (
            <button
              type="button"
              onClick={() => {
                setValue("");
                setHasError(false);
                inputRef.current?.focus();
              }}
              className="rounded p-1 text-muted-foreground/60 transition-colors hover:bg-secondary hover:text-muted-foreground"
              aria-label="Limpar busca"
            >
              <X className="size-4" />
            </button>
          )}

          {/* Keyboard shortcut hint for nav variant */}
          {variant === "nav" && !value && !isFocused && (
            <Kbd className="bg-secondary text-muted-foreground/60">⌘K</Kbd>
          )}
        </div>
      </div>

      {/* Autocomplete dropdown */}
      <AutocompleteDropdown
        items={filteredItems}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        isVisible={showAutocomplete}
      />
    </div>
  );
}
