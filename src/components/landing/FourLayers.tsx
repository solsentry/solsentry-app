"use client";

// FourLayers — the v4 canonical replacement for the v3 "4 Pillars" section.
// Layers stack bottom-up visually: protocol at top of the slab, consumer
// app at the foundation — matches the way 12_BRAND.md draws them
// (Layer 4 = Protocol on top of Layer 1 = Consumer App). Each row is
// equal height; tag on the left, body on the right.

import type { LandingCopy } from "@/lib/i18n-landing";

interface Props {
  copy: LandingCopy;
}

export function FourLayers({ copy }: Props) {
  const layers = [
    { name: copy.layer4Name, tag: copy.layer4Tag, desc: copy.layer4Desc },
    { name: copy.layer3Name, tag: copy.layer3Tag, desc: copy.layer3Desc },
    { name: copy.layer2Name, tag: copy.layer2Tag, desc: copy.layer2Desc },
    { name: copy.layer1Name, tag: copy.layer1Tag, desc: copy.layer1Desc },
  ];

  return (
    <section className="landing-section landing-layers" aria-labelledby="layers-title">
      <header className="landing-section__head">
        <span className="landing-eyebrow">{copy.layersEyebrow}</span>
        <h2 id="layers-title" className="landing-section__title">
          {copy.layersTitle}
        </h2>
        <p className="landing-section__sub">{copy.layersSub}</p>
      </header>

      <ol className="landing-layers__stack">
        {layers.map((l) => (
          <li key={l.tag} className="landing-layers__row">
            <span className="landing-layers__tag">{l.tag}</span>
            <div className="landing-layers__body">
              <h3>{l.name}</h3>
              <p>{l.desc}</p>
            </div>
            <span className="landing-layers__rule" aria-hidden />
          </li>
        ))}
      </ol>
    </section>
  );
}
