"use client";

// /api — bilingual client body. The server wrapper (page.tsx) keeps EN
// metadata + fetches live /v1/stats (runtime), then hands it here. Endpoint
// paths, curl examples, and HTTP methods stay verbatim in both languages.
//
// Endpoint count is derived from the documented list (ENDPOINT_COUNT) so the
// headline can never drift from what the page actually lists. The duplicate
// "Health" group was removed (B8.6) — /health + /health/invariants live once,
// under "Stats & health".

import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { useLang } from "@/lib/use-lang";
import type { Lang } from "@/lib/i18n-landing";
import type { NetworkStats } from "@/lib/api";

interface Endpoint {
  method: "GET";
  path: string;
  desc: { en: string; pt: string };
  example: string;
  tier?: "public" | "x402";
}

const ENDPOINTS: { group: { en: string; pt: string }; items: Endpoint[] }[] = [
  {
    group: { en: "Stats & health", pt: "Stats e saúde" },
    items: [
      {
        method: "GET",
        path: "/v1/stats",
        desc: {
          en: "Global network counters — scans, accuracy, resolve rate, runtime, alerts.",
          pt: "Contadores globais da rede — scans, acurácia, taxa de resolução, runtime, alertas.",
        },
        example: "curl https://api.solsentry.app/v1/stats",
      },
      {
        method: "GET",
        path: "/health",
        desc: {
          en: "Liveness check. Returns 200 OK with a version string and uptime.",
          pt: "Verificação de liveness. Retorna 200 OK com string de versão e uptime.",
        },
        example: "curl https://api.solsentry.app/health",
      },
      {
        method: "GET",
        path: "/health/invariants",
        desc: {
          en: "Data invariants check — resolves vs predictions, accuracy floor, data freshness.",
          pt: "Verificação de invariantes de dados — resoluções vs predições, piso de acurácia, frescor dos dados.",
        },
        example: "curl https://api.solsentry.app/health/invariants",
      },
    ],
  },
  {
    group: { en: "Operators", pt: "Operadores" },
    items: [
      {
        method: "GET",
        path: "/v1/operator/{wallet}",
        desc: {
          en: "Full operator profile — known flag, risk level, confirmed rugs, total tokens, rug rate, tags, patterns.",
          pt: "Perfil completo do operador — flag known, nível de risco, rugs confirmados, total de tokens, taxa de rug, tags, padrões.",
        },
        example: "curl https://api.solsentry.app/v1/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1",
      },
      {
        method: "GET",
        path: "/v1/operator/{wallet}/timeline",
        desc: {
          en: "Token-by-token deployment timeline for an operator. Each entry: mint, deployed_at, final outcome, time-to-rug.",
          pt: "Timeline de deploy token a token do operador. Cada entrada: mint, deployed_at, outcome final, time-to-rug.",
        },
        example: "curl https://api.solsentry.app/v1/operator/{wallet}/timeline",
      },
      {
        method: "GET",
        path: "/v1/operator/{wallet}/network",
        desc: {
          en: "Bounded operator graph (alts, bot clusters, KOLs). Tunable via tokens, clusters, peers query params.",
          pt: "Grafo de operador delimitado (alts, clusters de bots, KOLs). Ajustável via query params tokens, clusters, peers.",
        },
        example: "curl 'https://api.solsentry.app/v1/operator/{wallet}/network?tokens=14&clusters=5&peers=3'",
      },

    ],
  },
  {
    group: { en: "Tokens", pt: "Tokens" },
    items: [
      {
        method: "GET",
        path: "/v1/token/{mint}",
        desc: {
          en: "Token-level analysis — risk score, flags, dev wallet, bot cluster links, outcome if resolved.",
          pt: "Análise no nível do token — score de risco, flags, dev wallet, links de cluster de bots, outcome se resolvido.",
        },
        example: "curl https://api.solsentry.app/v1/token/Bz4UpUmp...tRTwZv",
      },
    ],
  },
  {
    group: { en: "Stream (live)", pt: "Stream (ao vivo)" },
    items: [
      {
        method: "GET",
        path: "/v1/alerts/recent?limit=20",
        desc: {
          en: "Latest HIGH + CRITICAL alerts. Includes mint, risk score, age, dev wallet, and flag list.",
          pt: "Alertas HIGH + CRITICAL mais recentes. Inclui mint, score de risco, idade, dev wallet e lista de flags.",
        },
        example: "curl https://api.solsentry.app/v1/alerts/recent?limit=50",
      },
      {
        method: "GET",
        path: "/v1/resolutions/recent?limit=20",
        desc: {
          en: "Outcome stream — was_correct flag, final classification, resolution latency.",
          pt: "Stream de outcomes — flag was_correct, classificação final, latência de resolução.",
        },
        example: "curl https://api.solsentry.app/v1/resolutions/recent?limit=50",
      },
    ],
  },
  {
    group: { en: "Clusters & drain", pt: "Clusters e drain" },
    items: [
      {
        method: "GET",
        path: "/v1/clusters?limit=20",
        desc: {
          en: "Coordinated bot cluster list. Each cluster has a size, funding source, associated rugs.",
          pt: "Lista de clusters de bots coordenados. Cada cluster tem tamanho, fonte de funding e rugs associados.",
        },
        example: "curl https://api.solsentry.app/v1/clusters?limit=40",
      },
      {
        method: "GET",
        path: "/v1/cluster/{cluster_id}",
        desc: {
          en: "Cluster detail — sample wallets, linked operators, tags, risk score.",
          pt: "Detalhe do cluster — wallets de amostra, operadores vinculados, tags, score de risco.",
        },
        example: "curl https://api.solsentry.app/v1/cluster/{cluster_id}",
      },
      {
        method: "GET",
        path: "/v1/drain-trace/{wallet}",
        desc: {
          en: "10-hop SOL drain trace with bridge + CEX classification. Fresh or cached 60s.",
          pt: "Rastreamento de drain SOL de 10 hops com classificação de bridge + CEX. Novo ou em cache de 60s.",
        },
        example: "curl https://api.solsentry.app/v1/drain-trace/{wallet}",
      },
    ],
  },
  {
    group: { en: "x402 payments (preview)", pt: "Pagamentos x402 (preview)" },
    items: [
      {
        method: "GET",
        path: "/v1/x402/stats",
        desc: {
          en: "x402 payment ledger stats — total queries billed, USDC billed, unique clients, by-tool breakdown.",
          pt: "Stats do ledger de pagamentos x402 — total de queries cobradas, USDC cobrado, clientes únicos, breakdown por ferramenta.",
        },
        example: "curl https://api.solsentry.app/v1/x402/stats",
        tier: "x402",
      },
    ],
  },
];

// Derived so the headline can never disagree with the list below.
export const ENDPOINT_COUNT = ENDPOINTS.reduce((n, g) => n + g.items.length, 0);

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

interface ApiCopy {
  heroEyebrow: string;
  heroTitlePre: string;
  heroTitleEm: string;
  heroTitlePost: string;
  heroSubPre: string;
  heroSubPost: string;
  ctaEndpoints: string;
  ctaSamples: string;
  ctaMcp: string;
  statLive: string;
  statRuntime: string;
  statEndpoints: string;
  statEndpointsSub: string;
  statLatency: string;
  statLatencySub: string;
  statAuth: string;
  statAuthValue: string;
  statAuthSub: string;
  endpointsEyebrow: string;
  endpointsTitle: string;
  samplesEyebrow: string;
  samplesTitle: string;
  x402Eyebrow: string;
  x402Title: string;
  x402Sub: string;
  x402Body: string;
  x402Interested: string;
  slaEyebrow: string;
  slaTitle: string;
  sla: { t: string; d: string }[];
}

const COPY: Record<Lang, ApiCopy> = {
  en: {
    heroEyebrow: "REST API · api.solsentry.app · v1",
    heroTitlePre: `${ENDPOINT_COUNT} endpoints. `,
    heroTitleEm: "No API key",
    heroTitlePost: ". JSON in, JSON out.",
    heroSubPre:
      "Public read tier is free. 30s cache on the edge. Rate-limited per IP for abuse prevention. For high-volume / enterprise access (guaranteed rate, webhooks, SLA), reach out at ",
    heroSubPost: ".",
    ctaEndpoints: "Endpoints",
    ctaSamples: "Code samples",
    ctaMcp: "MCP install",
    statLive: "Live",
    statRuntime: "continuous runtime",
    statEndpoints: "Endpoints",
    statEndpointsSub: "public endpoints",
    statLatency: "Latency",
    statLatencySub: "p95, cached responses",
    statAuth: "Auth",
    statAuthValue: "None",
    statAuthSub: "for public read endpoints",
    endpointsEyebrow: "Endpoint reference",
    endpointsTitle: "Every route, every method",
    samplesEyebrow: "Code samples",
    samplesTitle: "Copy-paste integrations",
    x402Eyebrow: "x402 payments (preview)",
    x402Title: "Per-query micro-payments for premium tools",
    x402Sub:
      "Some MCP tools (high-cost lookups, premium classifications) will be gated by x402 — a Solana-native per-request micropayment protocol. No subscription. You pay only for what you query. Free tier remains free.",
    x402Body:
      "x402 is standardized 402-Payment-Required header signed with SPL USDC on Solana. SolSentry returns a 402 with an x-amount and x-payment-asset header; your client signs a micro-transfer; we return the response and ledger-record the payment. Public aggregates are always free.",
    x402Interested: "Interested in gating a custom dataset? ",
    slaEyebrow: "Status & SLA",
    slaTitle: "What we guarantee today",
    sla: [
      {
        t: "Uptime",
        d: "No contractual SLA on free tier. Current uptime > 99% over the last 30 days. Status page coming. Outages reported on @solsentryai.",
      },
      {
        t: "Data freshness",
        d: "Scans write within ~2s of deploy. Operator profile updates propagate within 30s. Edge cache is 30s.",
      },
      {
        t: "Rate limit",
        d: "Per-IP limit applies to protect infrastructure. Too many requests returns 429 with a Retry-After header. No key for public reads.",
      },
    ],
  },
  pt: {
    heroEyebrow: "REST API · api.solsentry.app · v1",
    heroTitlePre: `${ENDPOINT_COUNT} endpoints. `,
    heroTitleEm: "Sem chave de API",
    heroTitlePost: ". JSON entra, JSON sai.",
    heroSubPre:
      "O tier público de leitura é gratuito. Cache de 30s na edge. Rate-limit por IP para prevenção de abuso. Para acesso de alto volume / enterprise (rate garantido, webhooks, SLA), contate ",
    heroSubPost: ".",
    ctaEndpoints: "Endpoints",
    ctaSamples: "Exemplos de código",
    ctaMcp: "Instalar MCP",
    statLive: "Ao vivo",
    statRuntime: "runtime contínuo",
    statEndpoints: "Endpoints",
    statEndpointsSub: "endpoints públicos",
    statLatency: "Latência",
    statLatencySub: "p95, respostas em cache",
    statAuth: "Auth",
    statAuthValue: "Nenhuma",
    statAuthSub: "para endpoints públicos de leitura",
    endpointsEyebrow: "Referência de endpoints",
    endpointsTitle: "Cada rota, cada método",
    samplesEyebrow: "Exemplos de código",
    samplesTitle: "Integrações copy-paste",
    x402Eyebrow: "Pagamentos x402 (preview)",
    x402Title: "Micro-pagamentos por consulta para ferramentas premium",
    x402Sub:
      "Algumas ferramentas MCP (lookups de alto custo, classificações premium) serão protegidas por x402 — um protocolo de micropagamento por requisição nativo da Solana. Sem assinatura. Você paga apenas pelo que consultar. O tier gratuito continua gratuito.",
    x402Body:
      "x402 é um header padronizado 402-Payment-Required assinado com SPL USDC na Solana. O SolSentry retorna 402 com headers x-amount e x-payment-asset; seu client assina uma micro-transferência; retornamos a resposta e registramos o pagamento no ledger. Agregados públicos são sempre gratuitos.",
    x402Interested: "Interesse em monetizar um dataset customizado? ",
    slaEyebrow: "Status e SLA",
    slaTitle: "O que garantimos hoje",
    sla: [
      {
        t: "Uptime",
        d: "Sem SLA contratual no tier gratuito. Uptime atual > 99% nos últimos 30 dias. Página de status em breve. Quedas reportadas em @solsentryai.",
      },
      {
        t: "Frescor dos dados",
        d: "Scans são escritos em ~2s após o deploy. Atualizações de perfil de operador propagam em 30s. Cache na edge é de 30s.",
      },
      {
        t: "Rate limit",
        d: "Limite por IP aplica-se para proteger a infraestrutura. Requisições em excesso retornam 429 com header Retry-After. Sem chave para leituras públicas.",
      },
    ],
  },
};

export function ApiClient({ stats }: { stats: NetworkStats | null }) {
  const lang = useLang();
  const t = COPY[lang];

  return (
    <>
      <SiteTopbar />
      <main>
        <PageHeader
          eyebrow={t.heroEyebrow}
          title={
            <>
              {t.heroTitlePre}
              <span style={{ color: "var(--brand-amber)" }}>{t.heroTitleEm}</span>
              {t.heroTitlePost}
            </>
          }
          sub={
            <>
              {t.heroSubPre}
              <a href="mailto:hello@solsentry.app">hello@solsentry.app</a>
              {t.heroSubPost}
            </>
          }
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <a href="#endpoints" className="btn-primary">
              {t.ctaEndpoints}
            </a>
            <a href="#samples" className="btn-ghost">
              {t.ctaSamples}
            </a>
            <a href="/mcp" className="btn-ghost">
              {t.ctaMcp}
            </a>
          </div>
        </PageHeader>

        <Section>
          <div className="grid-4">
            <div className="panel">
              <div className="label-tag">
                <span className="status-dot live" />
                {t.statLive}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginTop: 8 }}>
                {(stats?.runtime_hours ?? 0).toLocaleString()}h
              </div>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{t.statRuntime}</div>
            </div>
            <div className="panel">
              <div className="label-tag">{t.statEndpoints}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginTop: 8 }}>
                {ENDPOINT_COUNT}
              </div>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{t.statEndpointsSub}</div>
            </div>
            <div className="panel">
              <div className="label-tag">{t.statLatency}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginTop: 8 }}>
                &lt; 1s
              </div>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{t.statLatencySub}</div>
            </div>
            <div className="panel">
              <div className="label-tag">{t.statAuth}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginTop: 8 }}>
                {t.statAuthValue}
              </div>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{t.statAuthSub}</div>
            </div>
          </div>
        </Section>

        <Section eyebrow={t.endpointsEyebrow} title={t.endpointsTitle} id="endpoints">
          {ENDPOINTS.map((group) => (
            <div key={group.group.en} style={{ marginBottom: 36 }}>
              <div
                className="label-tag"
                style={{
                  color: "var(--brand-amber)",
                  letterSpacing: "0.2em",
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--border)",
                  marginBottom: 4,
                }}
              >
                {group.group[lang]}
              </div>
              {group.items.map((e) => (
                <div key={e.path} className="cmd-row">
                  <div>
                    <span className={`http-method ${e.method.toLowerCase()}`}>{e.method}</span>
                    <div style={{ marginTop: 6 }}>
                      <code>{e.path}</code>
                    </div>
                    {e.tier === "x402" && (
                      <span
                        className="cmd-meta"
                        style={{
                          background: "var(--brand-purple-tint)",
                          color: "var(--brand-purple)",
                          marginTop: 6,
                          display: "inline-block",
                          marginLeft: 0,
                        }}
                      >
                        x402
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="desc">{e.desc[lang]}</div>
                    <div className="code-block" style={{ marginTop: 10, fontSize: 12 }}>
                      {e.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </Section>

        <Section eyebrow={t.samplesEyebrow} title={t.samplesTitle} id="samples">
          <div className="grid-3">
            <div>
              <div className="label-tag" style={{ marginBottom: 10 }}>
                TypeScript / Node
              </div>
              <div className="code-block" style={{ fontSize: 12 }}>
                {JS_SAMPLE}
              </div>
            </div>
            <div>
              <div className="label-tag" style={{ marginBottom: 10 }}>
                Python
              </div>
              <div className="code-block" style={{ fontSize: 12 }}>
                {PY_SAMPLE}
              </div>
            </div>
            <div>
              <div className="label-tag" style={{ marginBottom: 10 }}>
                Rust
              </div>
              <div className="code-block" style={{ fontSize: 12 }}>
                {RUST_SAMPLE}
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow={t.x402Eyebrow} title={t.x402Title} sub={t.x402Sub}>
          <div className="panel" style={{ borderLeft: "3px solid var(--brand-purple)" }}>
            <p style={{ color: "var(--fg-2)", fontSize: 15, lineHeight: 1.7 }}>{t.x402Body}</p>
            <p style={{ color: "var(--fg-3)", fontSize: 13, marginTop: 12 }}>
              {t.x402Interested}
              <a href="mailto:hello@solsentry.app">hello@solsentry.app</a>
            </p>
          </div>
        </Section>

        <Section eyebrow={t.slaEyebrow} title={t.slaTitle}>
          <div className="grid-3">
            {t.sla.map((c) => (
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
