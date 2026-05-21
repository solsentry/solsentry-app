"use client";

// OperatorOfDay — pulls top operator from /v1/top-operators (RSC-fetched
// and passed in). 4kxscute fallback is intentional: the live API is
// stable enough that this is rarely needed, but we never want a dead
// section if the API is slow.

import Link from "next/link";
import { Skull } from "lucide-react";
import type { LandingCopy } from "@/lib/i18n-landing";

export interface TopOperatorPayload {
  ok: boolean;
  wallet: string;
  confirmedRugs?: number;
  totalTokens?: number;
  rugRatePct?: number;
  tags?: string[];
  isFallback?: boolean;
}

interface Props {
  copy: LandingCopy;
  data: TopOperatorPayload;
}

function shortWallet(w: string): string {
  if (w.length <= 14) return w;
  return `${w.slice(0, 6)}…${w.slice(-4)}`;
}

export function OperatorOfDay({ copy, data }: Props) {
  if (!data.ok) {
    return (
      <section className="landing-section">
        <p className="landing-stats__footnote">{copy.opUnavailable}</p>
      </section>
    );
  }

  return (
    <section
      className="landing-section landing-op"
      aria-labelledby="op-title"
    >
      <header className="landing-section__head">
        <span className="landing-eyebrow">{copy.opEyebrow}</span>
        <h2 id="op-title" className="landing-section__title">
          {copy.opTitle}
        </h2>
        <p className="landing-section__sub">{copy.opSub}</p>
      </header>

      <Link href={`/operator/${data.wallet}`} className="landing-op__card">
        <div className="landing-op__banner">
          <div className="landing-op__id">
            <Skull size={18} aria-hidden />
            <span className="landing-op__wallet">{shortWallet(data.wallet)}</span>
            <span className="landing-op__badge">CRITICAL</span>
          </div>
          {data.tags && data.tags.length > 0 && (
            <div className="landing-op__tags">
              {data.tags.slice(0, 3).map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          )}
        </div>

        <dl className="landing-op__metrics">
          <div>
            <dt>{copy.opRugs}</dt>
            <dd>{data.confirmedRugs?.toLocaleString("en-US") ?? "—"}</dd>
          </div>
          <div>
            <dt>{copy.opTokens}</dt>
            <dd>{data.totalTokens?.toLocaleString("en-US") ?? "—"}</dd>
          </div>
          <div>
            <dt>{copy.opRate}</dt>
            <dd>
              {data.rugRatePct != null ? `${data.rugRatePct.toFixed(1)}%` : "—"}
            </dd>
          </div>
        </dl>

        <span className="landing-op__cta">{copy.opCta}</span>
      </Link>
    </section>
  );
}
