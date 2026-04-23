"use client";

import { useState } from "react";

interface Example {
  q: string;
  intent: string;
  tools: string[];
  a: React.ReactNode;
}

const EXAMPLES: Example[] = [
  {
    q: "Is 4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1 a serial rugger?",
    intent: "operator_lookup",
    tools: ["/v1/operator/:wallet"],
    a: (
      <>
        <strong style={{ color: "var(--status-critical)" }}>Yes — CRITICAL risk operator.</strong>
        <br />
        This wallet has <strong>634 tracked deployments</strong> with{" "}
        <strong>343 confirmed rugs</strong>. Rug rate <strong>93.6%</strong>. Tags: <code>serial_rugger</code>,{" "}
        <code>pump_fun_abuser</code>. Last observed deploying 2 days ago. Label in SolSentry: <code>CRITICAL</code>.
      </>
    ),
  },
  {
    q: "Show me the top 5 operators by confirmed rug count",
    intent: "top_operators",
    tools: ["/v1/top-operators?limit=5"],
    a: (
      <>
        <strong>Top 5 confirmed-rug operators</strong> (as of the last refresh):
        <br />
        1. <code>4kxscute...</code> — 343 rugs / 349 tokens (93.6%)
        <br />
        2. <code>9mQsY9...</code> — 38 rugs / 41 tokens (92.7%)
        <br />
        3. <code>BpT1wL...</code> — 31 rugs / 33 tokens (93.9%)
        <br />
        4. <code>7fA3zE...</code> — 26 rugs / 28 tokens (92.8%)
        <br />
        5. <code>CKv2qY...</code> — 22 rugs / 25 tokens (88.0%)
        <br />
        <span style={{ color: "var(--fg-3)", fontSize: 13 }}>
          See the full leaderboard at <code>/leaderboard</code>. Exact numbers shift as new deploys are
          resolved.
        </span>
      </>
    ),
  },
  {
    q: "Trace the SOL drain from wallet X through CEX endpoints",
    intent: "drain_trace",
    tools: ["/v1/drain-trace/:wallet"],
    a: (
      <>
        The tracer walks forward from the input wallet up to <strong>10 hops</strong>. For each terminal, it
        classifies the endpoint: <code>cex_deposit</code>, <code>mixer</code>, <code>bridge_lock</code>,{" "}
        <code>known_operator</code>, or <code>unknown</code>.
        <br />
        The response includes a boolean <code>reached_cex</code> and <code>reached_mixer</code>, plus a full
        hop list with per-hop SOL amounts. Try it live at{" "}
        <a href="/drain">/drain</a>.
      </>
    ),
  },
  {
    q: "Any bot clusters funded from the same wallet as operator X?",
    intent: "cluster_correlation",
    tools: ["/v1/operator/:wallet", "/v1/clusters?funding_source=..."],
    a: (
      <>
        This is a two-step query. First we pull the operator&rsquo;s known funding source from{" "}
        <code>/v1/operator</code>. Then we query <code>/v1/clusters</code> filtered by that funding source
        classification. Matching clusters surface with their associated wallets and rug count — exposing the
        operator&rsquo;s &quot;army&quot; of helper wallets. This is how single-deployer rugs look
        multi-participant.
      </>
    ),
  },
  {
    q: "Qual é a taxa de acerto atual do SolSentry?",
    intent: "network_stats",
    tools: ["/v1/stats"],
    a: (
      <>
        Taxa de acerto (<code>was_correct</code>) está em <strong style={{ color: "var(--brand-orange)" }}>
          86.4%
        </strong>{" "}
        sobre <strong>24,630 previsões resolvidas</strong>. Resolve rate de 97%+. Zero falsos positivos
        confirmados em HIGH+ risk. Os erros são todos stealth-rug (falsos negativos). Feed público em{" "}
        <a href="/resolutions">/resolutions</a>.
      </>
    ),
  },
];

export function AskConsole() {
  const [selected, setSelected] = useState<number>(0);
  const [query, setQuery] = useState("");

  const current = EXAMPLES[selected];

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        style={{ marginBottom: 24 }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={EXAMPLES[selected].q}
            style={{
              flex: "1 1 520px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "14px 18px",
              color: "var(--fg-1)",
              fontFamily: "var(--font-body)",
              fontSize: 15,
              outline: "none",
            }}
          />
          <button type="submit" className="btn-primary" disabled>
            Coming Q3 · try an example →
          </button>
        </div>
      </form>

      <div className="tabs" style={{ flexWrap: "wrap" }}>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            className={`tab ${selected === i ? "active" : ""}`}
            onClick={() => setSelected(i)}
            style={{ fontSize: 11 }}
          >
            {ex.intent.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="panel" style={{ borderLeft: "3px solid var(--brand-orange)" }}>
        <div className="label-tag" style={{ color: "var(--brand-orange)", marginBottom: 8 }}>
          Question
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            color: "var(--fg-1)",
            marginBottom: 20,
            padding: 12,
            background: "var(--surface-2)",
            borderRadius: 4,
          }}
        >
          {current.q}
        </div>

        <div className="label-tag" style={{ marginBottom: 8 }}>
          Intent · {current.intent}
        </div>
        <div style={{ marginBottom: 20, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {current.tools.map((t) => (
            <span key={t} className="hover-chip" style={{ fontSize: 11 }}>
              <span style={{ color: "var(--brand-teal)" }}>GET</span> {t}
            </span>
          ))}
        </div>

        <div className="label-tag" style={{ marginBottom: 8 }}>
          Answer
        </div>
        <div style={{ fontSize: 15, color: "var(--fg-2)", lineHeight: 1.7 }}>{current.a}</div>
      </div>
    </div>
  );
}
