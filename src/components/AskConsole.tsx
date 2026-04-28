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
        <strong style={{ color: "var(--status-critical)" }}>
          Yes — CRITICAL risk operator.
        </strong>
        <br />
        This wallet has <strong>834 tracked deployments</strong> with{" "}
        <strong>766 confirmed rugs</strong>. Rug rate <strong>91.8%</strong>.
        Tags: <code>fast_deployer</code>, <code>rebrand_artist</code>. Label in
        SolSentry: <code>serial_rugger</code>. Risk level: <code>CRITICAL</code>
        .
      </>
    ),
  },
  {
    q: "Show me the top operators by confirmed rug count",
    intent: "top_operators",
    tools: ["/v1/top-operators?limit=10"],
    a: (
      <>
        <strong>Top confirmed-rug operator (live):</strong>
        <br />
        <code>4kxscute...L5pH1</code> — 766 rugs / 834 tokens (91.8%). Active
        today.
        <br />
        <br />
        Across the full leaderboard, SolSentry currently tracks{" "}
        <strong>408 serial ruggers</strong> (operators with multiple confirmed
        rugs) out of <strong>1,345 total deployer wallets</strong> profiled.
        <br />
        <span style={{ color: "var(--fg-3)", fontSize: 13 }}>
          See the live ranking at <a href="/leaderboard">/leaderboard</a>.
          Numbers shift as new deploys are resolved.
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
        The tracer walks forward from the input wallet up to{" "}
        <strong>10 hops</strong>. For each terminal, it classifies the endpoint:{" "}
        <code>cex_deposit</code>, <code>mixer</code>, <code>bridge_lock</code>,{" "}
        <code>known_operator</code>, or <code>unknown</code>.
        <br />
        The response includes a boolean <code>reached_cex</code> and{" "}
        <code>reached_mixer</code>, plus a full hop list with per-hop SOL
        amounts. Try it live at <a href="/drain">/drain</a>.
      </>
    ),
  },
  {
    q: "Any bot clusters funded from the same wallet as operator X?",
    intent: "cluster_correlation",
    tools: ["/v1/operator/:wallet", "/v1/clusters?funding_source=..."],
    a: (
      <>
        This is a two-step query. First we pull the operator&rsquo;s known
        funding source from <code>/v1/operator</code>. Then we query{" "}
        <code>/v1/clusters</code> filtered by that funding source
        classification. Matching clusters surface with their associated wallets
        and rug count — exposing the operator&rsquo;s &quot;army&quot; of helper
        wallets. This is how single-deployer rugs look multi-participant.
      </>
    ),
  },
  {
    q: "Qual é a taxa de acerto atual do SolSentry?",
    intent: "network_stats",
    tools: ["/v1/stats"],
    a: (
      <>
        Taxa de acerto (<code>was_correct</code>) está em{" "}
        <strong style={{ color: "var(--brand-orange)" }}>86.4%</strong> sobre{" "}
        <strong>24,630 previsões resolvidas</strong>. Resolve rate de 95.5%.
        Zero falsos positivos confirmados em CRITICAL risk. Os erros são todos
        stealth-rug (falsos negativos). Feed público em{" "}
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

      <div
        className="panel"
        style={{ borderLeft: "3px solid var(--brand-orange)" }}
      >
        <div
          className="label-tag"
          style={{ color: "var(--brand-orange)", marginBottom: 8 }}
        >
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
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {current.tools.map((t) => (
            <span key={t} className="hover-chip" style={{ fontSize: 11 }}>
              <span style={{ color: "var(--brand-teal)" }}>GET</span> {t}
            </span>
          ))}
        </div>

        <div className="label-tag" style={{ marginBottom: 8 }}>
          Answer
        </div>
        <div style={{ fontSize: 15, color: "var(--fg-2)", lineHeight: 1.7 }}>
          {current.a}
        </div>
      </div>
    </div>
  );
}
