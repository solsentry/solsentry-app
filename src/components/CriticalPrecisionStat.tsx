"use client";

import { useEffect, useState } from "react";

const FALLBACK = "96.6";

export function CriticalPrecisionStat() {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.solsentry.app/v1/stats")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        // Field may be critical_precision_pct or nested under accuracy_by_tier
        const pct =
          data?.critical_precision_pct ??
          data?.accuracy_by_tier?.CRITICAL ??
          data?.accuracy_by_tier?.critical;
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
