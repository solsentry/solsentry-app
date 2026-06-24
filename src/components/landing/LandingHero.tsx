"use client";

// LandingHero — eyebrow + headline + live inline scan (HeroScan).
// v2: the hero search now runs a REAL inline operator scan (HeroScan) instead
// of routing to a detail page, and carries no mock autocomplete. Natural-language
// search stays deferred until /v1/playground lands.
//
// Spec: internal/marketing/strategy/WIREFRAME_v5.md §3.1

import type { LandingCopy } from "@/lib/i18n-landing";
import { HeroScan } from "@/components/HeroScan";

interface Props {
  copy: LandingCopy;
  lang: "en" | "pt";
}

export function LandingHero({ copy }: Props) {
  return (
    <section className="landing-hero" aria-labelledby="landing-hero-title">
      <span className="landing-eyebrow">{copy.heroEyebrow}</span>
      <h1 id="landing-hero-title" className="landing-hero__title">
        {copy.heroTitle} <em>{copy.heroTitleEm}</em>
      </h1>
      <p className="landing-hero__sub">{copy.heroSub}</p>

      <HeroScan />

      <p className="landing-tagline">
        {copy.tagline}
        <span> {copy.taglineSub}</span>
      </p>
    </section>
  );
}
