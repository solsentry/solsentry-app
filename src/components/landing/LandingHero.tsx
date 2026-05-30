"use client";

// LandingHero — eyebrow + headline + AI search bar + sample chips.
// v1 swap: replaces the old single-mode scan form with <AISearchBar>
// (address-routing only — NL stays disabled until /v1/playground lands).
//
// Spec: internal/marketing/strategy/WIREFRAME_v5.md §3.1

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LandingCopy } from "@/lib/i18n-landing";
import { SolSentrySearch } from "@/components/SolSentrySearch";
import { detectKind, routeFor } from "@/components/AISearchBar";

const SAMPLES = [
  {
    labelKey: "top",
    label: { en: "Top operator", pt: "Top operador" },
    value: "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
    kind: "operator" as const,
  },
  {
    labelKey: "wsol",
    label: { en: "Wrapped SOL", pt: "SOL wrapeado" },
    value: "So11111111111111111111111111111111111111112",
    kind: "operator" as const,
  },
];

interface Props {
  copy: LandingCopy;
  lang: "en" | "pt";
}

export function LandingHero({ copy, lang }: Props) {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);

  function go(value: string) {
    const v = value.trim();
    if (v.length < 32) {
      setErr(
        lang === "pt"
          ? "Endereço muito curto. Cole o endereço Solana completo."
          : "Address too short. Paste the full Solana address.",
      );
      return;
    }
    setErr(null);
    // Sample buttons defer to /lookup — server-side disambiguation.
    router.push(`/lookup?addr=${encodeURIComponent(v)}`);
  }

  return (
    <section className="landing-hero" aria-labelledby="landing-hero-title">
      <span className="landing-eyebrow">{copy.heroEyebrow}</span>
      <h1 id="landing-hero-title" className="landing-hero__title">
        {copy.heroTitle} <em>{copy.heroTitleEm}</em>
      </h1>
      <p className="landing-hero__sub">{copy.heroSub}</p>

      <SolSentrySearch
        variant="hero"
        onSearch={(value) => {
          const target = routeFor(detectKind(value), value);
          if (target) router.push(target);
        }}
      />

      {err && (
        <p role="alert" className="landing-scan__err">
          {err}
        </p>
      )}

      <div className="landing-scan__samples">
        <span className="landing-scan__samples-label">{copy.heroTrySample}</span>
        {SAMPLES.map((s) => (
          <button key={s.value} type="button" onClick={() => go(s.value)}>
            {s.label[lang]}
          </button>
        ))}
      </div>

      <p className="landing-tagline">
        {copy.tagline}
        <span> {copy.taglineSub}</span>
      </p>
    </section>
  );
}
