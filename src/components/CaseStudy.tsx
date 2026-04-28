export function CaseStudy() {
  return (
    <section className="case">
      <div className="container">
        <span className="section-kicker">Case study · 2026-03-12</span>
        <h2 className="section-title" style={{ marginBottom: 40 }}>
          19 minutes of warning
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
              <span className="mono" style={{ color: "var(--brand-orange)" }}>
                4kxscute...
              </span>{" "}
              had already rugged 61 tokens. On deployment #62, SolSentry flagged
              it as HIGH RISK four minutes after launch. The operator executed
              the rug 19 minutes later.
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
              <code style={{ color: "var(--brand-orange)", userSelect: "all" }}>
                curl
                https://api.solsentry.app/v1/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1
              </code>
            </p>
          </div>

          <dl className="case-timeline">
            <dt>T+0:00</dt>
            <dd>Token #62 deployed by 4kxscute</dd>
            <dt>T+0:04</dt>
            <dd>SolSentry HIGH RISK alert · score 100/100</dd>
            <dt>T+0:23</dt>
            <dd style={{ color: "var(--status-critical)" }}>
              Operator executes rug pull
            </dd>
            <dt style={{ marginTop: 20, color: "var(--brand-teal)" }}>
              Lead time
            </dt>
            <dd style={{ color: "var(--fg-1)", fontSize: 20, fontWeight: 600 }}>
              19 minutes
            </dd>
            <dt style={{ color: "var(--brand-teal)" }}>
              Operator lifetime (live)
            </dt>
            <dd style={{ color: "var(--fg-1)" }}>
              766 confirmed rugs · 834 tokens · 91.8% rug rate · CRITICAL
            </dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
