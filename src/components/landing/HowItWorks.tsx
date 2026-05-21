"use client";

// HowItWorks — three-step explainer. Numbered list with progressive
// disclosure. Static content; no live data.

import type { LandingCopy } from "@/lib/i18n-landing";

interface Props {
  copy: LandingCopy;
}

export function HowItWorks({ copy }: Props) {
  const steps = [
    { title: copy.howStep1Title, body: copy.howStep1Body },
    { title: copy.howStep2Title, body: copy.howStep2Body },
    { title: copy.howStep3Title, body: copy.howStep3Body },
  ];

  return (
    <section
      className="landing-section landing-how"
      aria-labelledby="how-title"
    >
      <header className="landing-section__head">
        <span className="landing-eyebrow">{copy.howEyebrow}</span>
        <h2 id="how-title" className="landing-section__title">
          {copy.howTitle}
        </h2>
      </header>

      <ol className="landing-how__grid">
        {steps.map((s, i) => (
          <li key={i} className="landing-how__card">
            <span className="landing-how__num" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
