import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { RiskBadge } from "@/components/RiskBadge";
import { ApiError } from "@/components/ApiError";
import { fetchTopOperators, fmtInt, fmtPct, truncate } from "@/lib/api";
import Link from "next/link";
import { ProShell } from "@/components/ProShell";

export const revalidate = 300;

export const metadata = {
  title: "Top operators — leaderboard of confirmed serial deployers",
  description:
    "The 50 highest-risk Solana operators by confirmed rug count and rate. Live data from api.solsentry.app.",
};

export default async function TopOperatorsPage() {
  const ops = await fetchTopOperators(50);

  return (
    <ProShell>
      <main>
        <PageHeader
          eyebrow="Operator leaderboard · top 50"
          title="The Solana rug hall of fame"
          sub="Operators ranked by confirmed rug count. Each row is a wallet that has deployed multiple tokens and ended in rug pulls. Click any row for the full profile."
        >
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <a
              href="https://api.solsentry.app/v1/top-operators?limit=50"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Full JSON ↗
            </a>
          </div>
        </PageHeader>

        <Section eyebrow={`${ops.length} operators`} title="Confirmed serial ruggers">
          {ops.length === 0 ? (
            <ApiError
              endpoint="/v1/top-operators?limit=50"
              message="No operators returned. The endpoint may be temporarily unavailable."
            />
          ) : (
            <div className="lb-table">
              <div className="lb-row lb-head">
                <span>Rank</span>
                <span>Operator</span>
                <span style={{ textAlign: "right" }}>Rugs</span>
                <span style={{ textAlign: "right" }}>Tokens</span>
                <span style={{ textAlign: "right" }}>Rate</span>
                <span>Tags</span>
              </div>
              {ops.map((op) => (
                <Link
                  key={op.wallet}
                  href={`/operator/${op.wallet}`}
                  className="lb-row"
                >
                  <span className="lb-rank">
                    {String(op.rank).padStart(2, "0")}
                  </span>
                  <span className="lb-wallet">
                    <span style={{ fontFamily: "var(--font-mono)" }}>
                      {truncate(op.wallet, 8, 5)}
                    </span>
                    {op.risk_label && (
                      <RiskBadge level={op.risk_label} size="sm" />
                    )}
                  </span>
                  <span className="lb-num lb-rugs">
                    {fmtInt(op.confirmed_rugs)}
                  </span>
                  <span className="lb-num">{fmtInt(op.total_tokens)}</span>
                  <span className="lb-num lb-rate">
                    {fmtPct(op.rug_rate_pct, 1)}
                  </span>
                  <span className="lb-tags">
                    {(op.tags || []).slice(0, 2).map((t) => (
                      <span key={t} className="lb-tag">
                        {t}
                      </span>
                    ))}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Section>

        <Section eyebrow="Read more" title="Methodology">
          <div className="grid-2">
            <div className="panel">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  marginBottom: 8,
                }}
              >
                What counts as a rug
              </h3>
              <p style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6 }}>
                A token is marked <code>RUG</code> when liquidity is pulled,
                holders are dumped on, or trading halts before genuine
                distribution. The resolver waits up to 14 days for safe tokens
                and uses fast-track windows for HIGH/CRITICAL initial signals.
              </p>
            </div>
            <div className="panel">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  marginBottom: 8,
                }}
              >
                Why operator-centric
              </h3>
              <p style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6 }}>
                Token-level scanners can be evaded by deploying again. Operator
                tracking persists across deployments. A wallet with 1,059 rugs
                is unambiguous.
              </p>
            </div>
          </div>
        </Section>
      </main>
    </ProShell>
  );
}
