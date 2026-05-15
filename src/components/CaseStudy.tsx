export function CaseStudy() {
  return (
    <section className="case">
      <div className="container">
        <span className="section-kicker">Case study · live operator</span>
        <h2 className="section-title" style={{ marginBottom: 40 }}>
          One operator, 2,939 tokens, 90.6% rug rate
        </h2>

        <div className="case-grid">
          <div>
            <p
              style={{
                color: "var(--fg-2)",
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              Operator{" "}
              <span className="mono" style={{ color: "var(--brand-amber)" }}>
                4kxscute...
              </span>{" "}
              has deployed 2,939 tokens to date — 2,662 confirmed rugs, 1
              confirmed safe, 276 pending. Since coverage start on April 8, 2026
              (first dev_wallet match), every subsequent deployment triggers a
              sub-50ms CRITICAL classification at scan time, before any on-chain
              rug signal exists.
            </p>
            <p
              style={{
                color: "var(--fg-2)",
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              Downstream integrators who monitor SolSentry alerts received a{" "}
              <strong style={{ color: "var(--status-critical)" }}>
                CRITICAL
              </strong>{" "}
              signal before a single token was actually drained. No real-time
              transaction analysis was needed — the operator&rsquo;s historical
              pattern was the signal.
            </p>
            <p
              style={{
                color: "var(--fg-3)",
                fontSize: 13,
                fontFamily: "var(--font-mono)",
              }}
            >
              Verify yourself:
              <br />
              <code style={{ color: "var(--brand-amber)", userSelect: "all" }}>
                curl
                https://api.solsentry.app/v1/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1
              </code>
            </p>
          </div>

          <dl className="case-timeline">
            <dt>Coverage start</dt>
            <dd>April 8, 2026 · 16:27 UTC — first dev_wallet match</dd>
            <dt>Detection</dt>
            <dd>Sub-50ms cached operator lookup · CRITICAL at scan time</dd>
            <dt style={{ color: "var(--status-critical)" }}>Verdict</dt>
            <dd style={{ color: "var(--status-critical)" }}>
              Every subsequent deployment by this wallet → CRITICAL before any on-chain rug signal exists
            </dd>
            <dt style={{ marginTop: 20, color: "var(--brand-teal)" }}>
              Detection mode
            </dt>
            <dd style={{ color: "var(--fg-1)", fontSize: 18, fontWeight: 600 }}>
              Operator-history-driven (no per-token narrative)
            </dd>
            <dt style={{ color: "var(--brand-teal)" }}>
              Operator lifetime (live · May 14)
            </dt>
            <dd style={{ color: "var(--fg-1)" }}>
              2,662 confirmed rugs · 2,939 tokens · 90.6% rug rate (99.96% over resolved) · CRITICAL
            </dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
