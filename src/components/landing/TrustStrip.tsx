"use client";

// TrustStrip — closing section. Three trust signals:
//   1. Open-source (MCP + docs + radar)
//   2. Auditable precision (precision per tier, links to /v1/predictions/{mint})
//   3. Public, no-auth API
// Note: the precision wording follows the canonical reframe locked
// 2026-05-13 (see internal/codex/21_PITCH_LEARNINGS_CRITICAL_FP.md).

import Link from "next/link";
import { GitBranch, ShieldCheck, Globe } from "lucide-react";
import type { LandingCopy } from "@/lib/i18n-landing";

interface Props {
  copy: LandingCopy;
}

export function TrustStrip({ copy }: Props) {
  return (
    <section
      className="landing-section landing-trust"
      aria-labelledby="trust-title"
    >
      <header className="landing-section__head">
        <h2 id="trust-title" className="landing-section__title">
          {copy.trustTitle}
        </h2>
      </header>

      <ul className="landing-trust__grid">
        <li>
          <GitBranch size={18} aria-hidden />
          <p>{copy.trustOss}</p>
          <a
            href="https://github.com/solsentry"
            target="_blank"
            rel="noreferrer"
          >
            github.com/solsentry ↗
          </a>
        </li>
        <li>
          <ShieldCheck size={18} aria-hidden />
          <p>{copy.trustAudit}</p>
          <span className="landing-trust__note">{copy.trustAuditNote}</span>
        </li>
        <li>
          <Globe size={18} aria-hidden />
          <p>
            <code>curl api.solsentry.app/v1/stats</code>
          </p>
          <Link href="/about">{copy.trustAbout}</Link>
        </li>
      </ul>
    </section>
  );
}
