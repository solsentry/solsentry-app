"use client";

// SenaTeaser — inline preview of what Sena sounds like, with a CTA that
// deep-links to /operator/{topWallet}?sena=1 so the drawer pops open on
// arrival. The full drawer lives there; this is just enough to show
// voice and texture without rebuilding it twice.

import Link from "next/link";
import type { LandingCopy } from "@/lib/i18n-landing";

interface Props {
  copy: LandingCopy;
  targetWallet: string;
}

export function SenaTeaser({ copy, targetWallet }: Props) {
  return (
    <section className="landing-section landing-sena" aria-labelledby="sena-title">
      <header className="landing-section__head">
        <span className="landing-eyebrow">{copy.senaEyebrow}</span>
        <h2 id="sena-title" className="landing-section__title">
          {copy.senaTitle}
        </h2>
        <p className="landing-section__sub">{copy.senaSub}</p>
      </header>

      <div className="landing-sena__panel">
        <div className="landing-sena__avatar" aria-hidden>
          <span className="landing-sena__core" />
          <span className="landing-sena__line landing-sena__line--a" />
          <span className="landing-sena__line landing-sena__line--b" />
          <span className="landing-sena__line landing-sena__line--c" />
        </div>

        <div className="landing-sena__body">
          <p className="landing-sena__bubble">{copy.senaSample}</p>
          <Link href={`/operator/${targetWallet}?sena=1`} className="landing-sena__cta">
            {copy.senaCta}
          </Link>
          <p className="landing-sena__hint">{copy.senaHint}</p>
        </div>
      </div>
    </section>
  );
}
