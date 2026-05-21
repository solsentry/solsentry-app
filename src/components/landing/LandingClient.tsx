"use client";

// LandingClient — root client component for the landing page.
// Owns lang + theme via LandingShell render-prop, then composes every
// section in canonical reading order.

import { LandingShell } from "./LandingShell";
import { LandingChrome } from "./LandingChrome";
import { LandingHero } from "./LandingHero";
import { LiveStatsBar, type LiveStatsPayload } from "./LiveStatsBar";
import { FourLayers } from "./FourLayers";
import { HowItWorks } from "./HowItWorks";
import { OperatorOfDay, type TopOperatorPayload } from "./OperatorOfDay";
import { SenaTeaser } from "./SenaTeaser";
import { BuilderPanel } from "./BuilderPanel";
import { TrustStrip } from "./TrustStrip";

interface Props {
  stats: LiveStatsPayload;
  topOperator: TopOperatorPayload;
}

export function LandingClient({ stats, topOperator }: Props) {
  return (
    <LandingShell>
      {({ copy, lang, theme, setLang, setTheme }) => (
        <>
          <LandingChrome
            copy={copy}
            lang={lang}
            theme={theme}
            onLang={setLang}
            onTheme={setTheme}
          />
          <main className="landing-main" id="main">
            <div className="landing-container">
              <LandingHero copy={copy} lang={lang} />
              <LiveStatsBar copy={copy} lang={lang} stats={stats} />
              <FourLayers copy={copy} />
              <HowItWorks copy={copy} />
              <OperatorOfDay copy={copy} data={topOperator} />
              <SenaTeaser copy={copy} targetWallet={topOperator.wallet} />
              <BuilderPanel copy={copy} />
              <TrustStrip copy={copy} />
            </div>
          </main>
        </>
      )}
    </LandingShell>
  );
}
