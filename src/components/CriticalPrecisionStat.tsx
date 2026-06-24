"use client";

import { useEffect, useState } from "react";

const FALLBACK = "97.7";

export function CriticalPrecisionStat() {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.solsentry.app/v1/stats")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        // Canonical: top-level critical_precision_pct. Fallback to the
        // per-tier schema (precision_by_tier.CRITICAL.precision_pct); the
        // deprecated top-level high/medium fields are null now (C1, 24/06).
        const pct =
          data?.critical_precision_pct ??
          data?.precision_by_tier?.CRITICAL?.precision_pct;
        if (typeof pct === "number") {
          setValue(pct.toFixed(1));
        } else {
          setValue(FALLBACK);
        }
      })
      .catch(() => {
        if (!cancelled) setValue(FALLBACK);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const display = loading ? "…" : (value ?? FALLBACK);

  return (
    <span
      style={{ color: "var(--brand-amber)", fontWeight: 700 }}
      title="Live from api.solsentry.app/v1/stats"
    >
      {display}%
    </span>
  );
}
