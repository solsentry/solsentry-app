import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { fetchStats } from "@/lib/api";

export const revalidate = 60;

export const metadata = {
  title: "API reference — SolSentry REST + MCP",
  description: "Complete REST API for SolSentry. 11 endpoints covering operators, tokens, alerts, resolutions, bot clusters, drain traces, and network stats. Free public tier. No API key for read endpoints.",
};

interface Endpoint {
  method: "GET";
  path: string;
  desc: string;
  example: string;
  response?: string;
  tier?: "public" | "x402";
}

const ENDPOINTS: { group: string; items: Endpoint[] }[] = [
  {
    group: "Stats & health",
    items: [
      {
        method: "GET",
        path: "/v1/stats",
        desc: "Global network counters — scans, accuracy, resolve rate, runtime, alerts, operator count.",
        example: "curl https://api.solsentry.app/v1/stats",
      },
      {
        method: "GET",
        path: "/health",
        desc: "Liveness check. Returns 200 OK with a version string and uptime.",
        example: "curl https://api.solsentry.app/health",
      },
      {
        method: "GET",
        path: "/health/invariants",
        desc: "Data invariants check — resolves vs predictions, accuracy floor, data freshness.",
        example: "curl https://api.solsentry.app/health/invariants",
      },
    ],
  },
  {
    group: "Operators",
    items: [
      {
        method: "GET",
        path: "/v1/operator/{wallet}",
        desc: "Full operator profile — known flag, risk level, confirmed rugs, total tokens, rug rate, tags, patterns.",
        example:
          "curl https://api.solsentry.app/v1/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
      },
      {
        method: "GET",
        path: "/v1/operator/{wallet}/timeline",
        desc: "Token-by-token deployment timeline for an operator. Each entry: mint, deployed_at, final outcome, time-to-rug.",
        example: "curl https://api.solsentry.app/v1/operator/{wallet}/timeline",
      },
      {
        method: "GET",
        path: "/v1/top-operators?limit=10",
        desc: "Ranked list of the highest-risk operators by confirmed rugs.",
        example: "curl https://api.solsentry.app/v1/top-operators?limit=20",
      },
    ],
  },
  {
    group: "Tokens",
    items: [
      {
        method: "GET",
        path: "/v1/token/{mint}",
        desc: "Token-level analysis — risk score, flags, dev wallet, bot cluster links, outcome if resolved.",
        example: "curl https://api.solsentry.app/v1/token/Bz4UpUmp...tRTwZv",
      },
    ],
  },
  {
    group: "Stream (live)",
    items: [
      {
        method: "GET",
        path: "/v1/alerts/recent?limit=20",
        desc: "Latest HIGH + CRITICAL alerts. Includes mint, risk score, age, dev wallet, and flag list.",
        example: "curl https://api.solsentry.app/v1/alerts/recent?limit=50",
      },
      {
        method: "GET",
        path: "/v1/resolutions/recent?limit=20",
        desc: "Outcome stream — was_correct flag, final classification, resolution latency.",
        example: "curl https://api.solsentry.app/v1/resolutions/recent?limit=50",
      },
    ],
  },
  {
    group: "Clusters & drain",
    items: [
      {
        method: "GET",
        path: "/v1/clusters?limit=20",
        desc: "Coordinated bot cluster list. Each cluster has a size, funding source, associated rugs.",
        example: "curl https://api.solsentry.app/v1/clusters?limit=40",
      },
      {
        method: "GET",
        path: "/v1/cluster/{cluster_id}",
        desc: "Cluster detail — sample wallets, linked operators, tags, risk score.",
        example: "curl https://api.solsentry.app/v1/cluster/cluster_04812",
      },
      {
        method: "GET",
        path: "/v1/drain-trace/{wallet}",
        desc: "10-hop SOL drain trace with bridge + CEX classification. Fresh or cached 60s.",
        example: "curl https://api.solsentry.app/v1/drain-trace/{wallet}",
      },
    ],
  },
  {
    group: "x402 payments (preview)",
    items: [
      {
        method: "GET",
        path: "/v1/x402/stats",
        desc: "x402 payment ledger stats — total queries billed, USDC billed, unique clients, by-tool breakdown.",
        example: "curl https://api.solsentry.app/v1/x402/stats",
        tier: "x402",
      },
    ],
  },
];

const JS_SAMPLE = `// TypeScript
const res = await fetch(
  "https://api.solsentry.app/v1/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1"
);
const op = await res.json();

if (op.known && op.risk_level === "CRITICAL") {
  console.log(
    \`Warning: \${op.confirmed_rugs} rugs / \${op.total_tokens} tokens\`
  );
}`;

const PY_SAMPLE = `# Python
import requests

wallet = "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1"
r = requests.get(f"https://api.solsentry.app/v1/operator/{wallet}")
op = r.json()

if op["known"] and op.get("risk_level") == "CRITICAL":
    print(f"Rugs: {op['confirmed_rugs']} / {op['total_tokens']}")`;

const RUST_SAMPLE = `// Rust
use reqwest;

let wallet = "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1";
let url = format!("https://api.solsentry.app/v1/operator/{}", wallet);
let op: serde_json::Value = reqwest::get(&url).await?.json().await?;
println!("Risk: {}", op["risk_level"]);`;

export default async function ApiPage() {
  const stats = await fetchStats();

  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow={`REST API · api.solsentry.app · v1`}
          title={
            <>
              11 endpoints. <span style={{ color: "var(--brand-orange)" }}>No API key</span>. JSON in, JSON out.
            </>
          }
          sub={
            <>
              Public read tier is free. 30s cache on the edge. Rate-limited per IP for abuse prevention. For
              high-volume / enterprise access (guaranteed rate, webhooks, SLA), reach out at{" "}
              <a href="mailto:hello@solsentry.app">hello@solsentry.app</a>.
            </>
          }
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <a href="#endpoints" className="btn-primary">
              Endpoints
            </a>
            <a href="#samples" className="btn-ghost">
              Code samples
            </a>
            <a href="/mcp" className="btn-ghost">
              MCP install
            </a>
          </div>
        </PageHeader>

        <Section>
          <div className="grid-4">
            <div className="panel">
              <div className="label-tag">
                <span className="status-dot live" />
                Live
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginTop: 8 }}>
                {(stats?.runtime_hours ?? 0).toLocaleString()}h
              </div>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>continuous runtime</div>
            </div>
            <div className="panel">
              <div className="label-tag">Endpoints</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginTop: 8 }}>
                11
              </div>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>public v1 routes</div>
            </div>
            <div className="panel">
              <div className="label-tag">Latency</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginTop: 8 }}>
                &lt; 50ms
              </div>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>p95, cached responses</div>
            </div>
            <div className="panel">
              <div className="label-tag">Auth</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginTop: 8 }}>
                None
              </div>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>for public read endpoints</div>
            </div>
          </div>
        </Section>

        <Section eyebrow="Endpoint reference" title="Every route, every method" id="endpoints">
          {ENDPOINTS.map((group) => (
            <div key={group.group} style={{ marginBottom: 36 }}>
              <div
                className="label-tag"
                style={{
                  color: "var(--brand-orange)",
                  letterSpacing: "0.2em",
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--border)",
                  marginBottom: 4,
                }}
              >
                {group.group}
              </div>
              {group.items.map((e) => (
                <div key={e.path} className="cmd-row">
                  <div>
                    <span className={`http-method ${e.method.toLowerCase()}`}>{e.method}</span>
                    <div style={{ marginTop: 6 }}>
                      <code>{e.path}</code>
                    </div>
                    {e.tier === "x402" && (
                      <span className="cmd-meta" style={{ background: "var(--brand-purple-tint)", color: "var(--brand-purple)", marginTop: 6, display: "inline-block", marginLeft: 0 }}>
                        x402
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="desc">{e.desc}</div>
                    <div className="code-block" style={{ marginTop: 10, fontSize: 12 }}>
                      {e.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </Section>

        <Section eyebrow="Code samples" title="Copy-paste integrations" id="samples">
          <div className="grid-3">
            <div>
              <div className="label-tag" style={{ marginBottom: 10 }}>
                TypeScript / Node
              </div>
              <div className="code-block" style={{ fontSize: 12 }}>{JS_SAMPLE}</div>
            </div>
            <div>
              <div className="label-tag" style={{ marginBottom: 10 }}>
                Python
              </div>
              <div className="code-block" style={{ fontSize: 12 }}>{PY_SAMPLE}</div>
            </div>
            <div>
              <div className="label-tag" style={{ marginBottom: 10 }}>
                Rust
              </div>
              <div className="code-block" style={{ fontSize: 12 }}>{RUST_SAMPLE}</div>
            </div>
          </div>
        </Section>

        <Section
          eyebrow="x402 payments (preview)"
          title="Per-query micro-payments for premium tools"
          sub="Some MCP tools (high-cost lookups, premium classifications) will be gated by x402 — a Solana-native per-request micropayment protocol. No subscription. You pay only for what you query. Free tier remains free."
        >
          <div className="panel" style={{ borderLeft: "3px solid var(--brand-purple)" }}>
            <p style={{ color: "var(--fg-2)", fontSize: 15, lineHeight: 1.7 }}>
              x402 is standardized 402-Payment-Required header signed with SPL USDC on Solana. SolSentry
              returns a 402 with an x-amount and x-payment-asset header; your client signs a micro-transfer;
              we return the response and ledger-record the payment. Public aggregates are always free.
            </p>
            <p style={{ color: "var(--fg-3)", fontSize: 13, marginTop: 12 }}>
              Interested in gating a custom dataset? <a href="mailto:hello@solsentry.app">hello@solsentry.app</a>
            </p>
          </div>
        </Section>

        <Section
          eyebrow="Status & SLA"
          title="What we guarantee today"
        >
          <div className="grid-3">
            {[
              { t: "Uptime", d: "No contractual SLA on free tier. Current uptime > 99% over the last 30 days. Status page coming. Outages reported on @solsentryai." },
              { t: "Data freshness", d: "Scans write within ~2s of deploy. Operator profile updates propagate within 30s. Edge cache is 30s." },
              { t: "Rate limit", d: "Per-IP limit applies to protect infrastructure. Too many requests returns 429 with a Retry-After header. No key for public reads." },
            ].map((c) => (
              <div key={c.t} className="panel">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, marginBottom: 8 }}>{c.t}</h3>
                <p style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.55 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
