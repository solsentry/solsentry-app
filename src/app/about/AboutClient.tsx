"use client";

// /about — bilingual client body. The server wrapper (page.tsx) keeps the
// EN metadata for SEO + fetches live /v1/stats, then hands the stats here.
// Language resolves from the saved pref or navigator.language (see useLang).

import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { useLang } from "@/lib/use-lang";
import type { Lang } from "@/lib/i18n-landing";
import type { NetworkStats } from "@/lib/api";
import Link from "next/link";

function fmtInt(n: number | undefined | null): string {
  if (n == null) return "—";
  return n.toLocaleString();
}

function fmtPct(n: number | undefined | null, d = 1): string {
  if (n == null) return "—";
  return `${n.toFixed(d)}%`;
}

function fmtHours(lang: Lang, n: number | undefined | null): string {
  if (n == null) return "—";
  if (n >= 1000) return `${(n / 24).toFixed(0)} ${lang === "pt" ? "dias" : "days"}`;
  return `${Math.round(n)}h`;
}

interface Comparison {
  dim: string;
  others: string;
  us: string;
}

interface AboutCopy {
  // §1 hero
  heroEyebrow: string;
  heroTitleA: string;
  heroTitleEm: string;
  heroSub: string;
  statContinuous: string;
  statPredictions: string;
  statCritical: string;
  statAccuracy: string;
  statsFootnote: string;
  // §2 origin
  originTitle: string;
  originP1: string;
  originP2Strong: string;
  originP2Rest: string;
  originP3Pre: string;
  originP3Post: string;
  // §3 differentiation
  diffTitle: string;
  othersLabel: string;
  usLabel: string;
  comparisons: Comparison[];
  // §4 methodology
  methTitle: string;
  methP1: string;
  methP2A: string;
  methP2B: string;
  methP2C: string;
  methP3A: string;
  methP3B: string;
  methP3C: string;
  layers: { n: string; title: string; status: string; text: string }[];
  // §5 honest numbers
  honestTitle: string;
  honestPre: string;
  honestPost: string;
  honestAccuracyA: string;
  honestAccuracyB: string;
  // §6 trust
  trustTitle: string;
  trust: { label: string; detail: string; href: string }[];
  // §7 team
  teamTitle: string;
  teamCrashPre: string;
  teamCrashPost: string;
  teamSena: string;
  teamAck: string;
  // §8 never
  neverTitle: string;
  never: string[];
  // §9 get involved
  involvedTitle: string;
  involved: { audience: string; cta: string; href: string; text: string }[];
}

const COPY: Record<Lang, AboutCopy> = {
  en: {
    heroEyebrow: "About SolSentry",
    heroTitleA: "Operator threat intelligence for ",
    heroTitleEm: "Solana",
    heroSub:
      "Solo-built. Free. Open-core. Live mainnet since April 2026 — tracking the wallets behind serial rug deployments before they catch the next buyer.",
    statContinuous: "Continuous mainnet",
    statPredictions: "Predictions issued",
    statCritical: "CRITICAL precision",
    statAccuracy: "Accuracy (resolved)",
    statsFootnote: "All numbers live. Click any stat to verify against the public API.",
    originTitle: "Why SolSentry exists",
    originP1:
      "A single operator can rug, rename, and redeploy across many wallets and tokens. Retail traders see unrelated tokens; existing tools score each one in isolation — by the time they flag a pattern, the operator has already rotated to a fresh wallet.",
    originP2Strong: "The unit of analysis is wrong.",
    originP2Rest:
      " The token is disposable. The operator is the persistent identity. SolSentry is the operator graph that didn’t exist — a cross-token, cross-wallet database of who deploys what on Solana, computed live from the chain, free for retail.",
    originP3Pre: "Started January 2025. First mainnet write April 8, 2026. A tracked operator wallet (",
    originP3Post: ") remains a live sample for public verification.",
    diffTitle: "What makes it different",
    othersLabel: "Others",
    usLabel: "SolSentry",
    comparisons: [
      { dim: "Unit of analysis", others: "One token at a time", us: "Cross-token operator graph" },
      { dim: "Discovery latency", others: "Post-rug (after the drain)", us: "Pre-rug (at deploy time)" },
      { dim: "Architecture", others: "Static rules engine", us: "ALife agents that evolve" },
      { dim: "Audience", others: "Enterprise / English-only", us: "Free retail + PT-BR consumer-first" },
      { dim: "Audit trail", others: "Black box / proprietary scores", us: "Reproducible from public outcome_predictions.json" },
      { dim: "Cost", others: "Enterprise contracts", us: "Free + per-call x402 (no subscription required)" },
    ],
    methTitle: "How the brain works",
    methP1:
      "Three-stage progressive scan (account info → DAS metadata + holder concentration → bot-cluster forensics + Token-2022 extension scoring) drives a multi-signal resolver with parallel resolution windows.",
    methP2A: "An autonomous brain layer — ",
    methP2B: ", plus stablecoin-flow and CEX-deposit tracers — runs investigation pipelines at roughly zero LLM tokens per call, replacing manual analysis.",
    methP2C: "",
    methP3A: "A self-tuning ",
    methP3B: " system snapshots scanner DNA at every prediction, waits for outcome, and feeds accuracy back via ",
    methP3C: " every 20 ticks. The system tunes itself.",
    layers: [
      { n: "Layer 1", title: "Known detectors", status: "✅ production", text: "sham, drain, cluster, ring, privacy, first-funder — patterns pre-defined by humans" },
      { n: "Layer 2", title: "Anomaly memory", status: "🟡 stub demo-ready", text: "stores unclassified patterns · feature vector + wallet context · emits candidate when N similar accumulate" },
      { n: "Layer 3", title: "Research agent", status: "🔴 P0 next sprint", text: "autonomous detector breeder · LLM-generated detector code · backtest gate · admit if precision ≥70%" },
    ],
    honestTitle: "The honest numbers",
    honestPre: "Aggregate metrics on this page refresh from ",
    honestPost: " every 60 seconds.",
    honestAccuracyA: "Aggregate accuracy ",
    honestAccuracyB: " across ",
    trustTitle: "Trust & transparency",
    trust: [
      { label: "Public REST API", detail: "No auth required for /v1/stats, /v1/operator, /v1/predictions", href: "https://api.solsentry.app/v1/stats" },
      { label: "Open source MCP", detail: "@solsentry/mcp on NPM · source on GitHub", href: "https://www.npmjs.com/package/@solsentry/mcp" },
      { label: "Open source docs", detail: "solsentry/solsentry-docs · audit logs reproducible", href: "https://github.com/solsentry/solsentry-docs" },
      { label: "Open source frontend", detail: "solsentry/solsentry-app · this site's code", href: "https://github.com/solsentry/solsentry-app" },
      { label: "Live health", detail: "api.solsentry.app/health · invariants checked daily", href: "https://api.solsentry.app/health" },
    ],
    teamTitle: "Team",
    teamCrashPre: " — founder, sole developer. Self-taught since the early 2000s: Slackware, Unix, Oracle networking. No university, no bootcamp. Started learning Python in January 2025. Currently: ",
    teamCrashPost:
      "+ mainnet predictions, full async architecture, and live precision metrics from the public API — solo, in Brazil.",
    teamSena:
      " — the AI persona. Surfaces operator threat context in human language, in PT-BR or EN. Powered by Anthropic. Tone: senior security analyst, evidence-first, no sensationalism.",
    teamAck:
      "Acknowledgments: Mert Mumtaz (Helius CEO) for the open-source Haradrim patterns we credit in our graph viz. Pedro Marafiotti (Superteam BR · The Garage). Every contributor to the public MCP + docs repos.",
    neverTitle: "What we'll never do",
    never: [
      "Issue a token. Sem token. Ever.",
      "Multi-chain dilution — Solana depth is the moat",
      "Gate basic operator verdict behind paywall",
      "Sensationalize — every claim auditable from the API",
      "Sell user data — we don't collect it",
      "Replace RugCheck or competitors — we complement",
    ],
    involvedTitle: "Get involved",
    involved: [
      { audience: "Traders", cta: "Try the Telegram bot", href: "/telegram", text: "Free alerts on CRITICAL operators · PT-BR + EN" },
      { audience: "Builders", cta: "MCP + REST", href: "/mcp", text: "Zero-install MCP server for AI agents · public REST API" },
      { audience: "Researchers", cta: "API + docs", href: "/api", text: "14 documented endpoints · reproducible audit logs · open data" },
      { audience: "Partners", cta: "hello@solsentry.app", href: "mailto:hello@solsentry.app", text: "Integration · data partnership · investor inquiries" },
    ],
  },
  pt: {
    heroEyebrow: "Sobre o SolSentry",
    heroTitleA: "Threat intelligence de operadores para ",
    heroTitleEm: "Solana",
    heroSub:
      "Construído solo. Gratuito. Open-core. Mainnet ao vivo desde abril de 2026 — rastreando as wallets por trás de rugs seriais antes que peguem o próximo comprador.",
    statContinuous: "Mainnet contínua",
    statPredictions: "Predições emitidas",
    statCritical: "Precisão CRITICAL",
    statAccuracy: "Acurácia (resolvidas)",
    statsFootnote: "Todos os números são ao vivo. Clique em qualquer stat para verificar na API pública.",
    originTitle: "Por que o SolSentry existe",
    originP1:
      "Um único operador pode dar rug, renomear e redeployar usando diversas wallets e tokens. Traders de varejo veem tokens sem relação; ferramentas existentes pontuam cada um isoladamente — quando flagram um padrão, o operador já rotacionou para uma wallet nova.",
    originP2Strong: "A unidade de análise está errada.",
    originP2Rest:
      " O token é descartável. O operador é a identidade persistente. O SolSentry é o grafo de operadores que não existia — um banco de dados cross-token, cross-wallet de quem deploya o quê na Solana, computado ao vivo da chain, gratuito para o varejo.",
    originP3Pre:
      "Iniciado em janeiro de 2025. Primeira escrita na mainnet em 8 de abril de 2026. Uma wallet de operador rastreada (",
    originP3Post: ") continua como amostra ao vivo para verificação pública.",
    diffTitle: "O que o torna diferente",
    othersLabel: "Outros",
    usLabel: "SolSentry",
    comparisons: [
      { dim: "Unidade de análise", others: "Um token por vez", us: "Grafo de operadores cross-token" },
      { dim: "Latência de descoberta", others: "Pós-rug (depois do drain)", us: "Pré-rug (no momento do deploy)" },
      { dim: "Arquitetura", others: "Motor de regras estáticas", us: "Agentes ALife que evoluem" },
      { dim: "Público-alvo", others: "Enterprise / só inglês", us: "Varejo gratuito + consumidor PT-BR em primeiro lugar" },
      { dim: "Trilha de auditoria", others: "Caixa preta / scores proprietários", us: "Reproduzível a partir do outcome_predictions.json público" },
      { dim: "Custo", others: "Contratos enterprise", us: "Gratuito + x402 por chamada (sem assinatura necessária)" },
    ],
    methTitle: "Como o cérebro funciona",
    methP1:
      "Scan progressivo de três estágios (info da conta → metadata DAS + concentração de holders → forense de cluster de bots + scoring de extensão Token-2022) alimenta um resolver multi-sinal com janelas de resolução paralelas.",
    methP2A: "Uma camada autônoma de cérebro — ",
    methP2B: ", mais rastreadores de fluxo de stablecoins e depósitos CEX — roda pipelines de investigação com praticamente zero tokens de LLM por chamada, substituindo análise manual.",
    methP2C: "",
    methP3A: "Um sistema ",
    methP3B: " auto-ajustável faz snapshot do DNA do scanner a cada predição, espera o outcome e alimenta a acurácia de volta via ",
    methP3C: " a cada 20 ticks. O sistema se ajusta sozinho.",
    layers: [
      { n: "Layer 1", title: "Detectores conhecidos", status: "✅ produção", text: "sham, drain, cluster, ring, privacy, first-funder — padrões pré-definidos por humanos" },
      { n: "Layer 2", title: "Memória de anomalias", status: "🟡 stub pronto para demo", text: "armazena padrões não classificados · feature vector + contexto da wallet · emite candidato quando N similares acumulam" },
      { n: "Layer 3", title: "Agente de pesquisa", status: "🔴 P0 próximo sprint", text: "criador autônomo de detectores · código de detector gerado por LLM · gate de backtest · admite se precisão ≥70%" },
    ],
    honestTitle: "Os números honestos",
    honestPre: "As métricas agregadas nesta página são atualizadas de ",
    honestPost: " a cada 60 segundos.",
    honestAccuracyA: "Acurácia agregada ",
    honestAccuracyB: " em ",
    trustTitle: "Confiança e transparência",
    trust: [
      { label: "API REST pública", detail: "Sem autenticação para /v1/stats, /v1/operator, /v1/predictions", href: "https://api.solsentry.app/v1/stats" },
      { label: "MCP open source", detail: "@solsentry/mcp no NPM · código no GitHub", href: "https://www.npmjs.com/package/@solsentry/mcp" },
      { label: "Documentação open source", detail: "solsentry/solsentry-docs · logs de auditoria reproduzíveis", href: "https://github.com/solsentry/solsentry-docs" },
      { label: "Frontend open source", detail: "solsentry/solsentry-app · o código deste site", href: "https://github.com/solsentry/solsentry-app" },
      { label: "Saúde ao vivo", detail: "api.solsentry.app/health · invariantes verificadas diariamente", href: "https://api.solsentry.app/health" },
    ],
    teamTitle: "Equipe",
    teamCrashPre:
      " — fundador, único desenvolvedor. Autodidata desde o início dos anos 2000: Slackware, Unix, redes Oracle. Sem universidade, sem bootcamp. Começou a aprender Python em janeiro de 2025. Atualmente: ",
    teamCrashPost:
      "+ predições na mainnet, arquitetura totalmente assíncrona e métricas de precisão ao vivo da API pública — solo, no Brasil.",
    teamSena:
      " — a persona de IA. Apresenta contexto de ameaças de operadores em linguagem humana, em PT-BR ou EN. Powered by Anthropic. Tom: analista sênior de segurança, evidência primeiro, sem sensacionalismo.",
    teamAck:
      "Agradecimentos: Mert Mumtaz (CEO da Helius) pelos padrões open-source Haradrim que creditamos na visualização de grafos. Pedro Marafiotti (Superteam BR · The Garage). Cada contribuidor dos repos públicos de MCP + docs.",
    neverTitle: "O que nunca faremos",
    never: [
      "Emitir um token. Sem token. Nunca.",
      "Diluição multi-chain — profundidade na Solana é o fosso",
      "Esconder veredito básico de operador atrás de paywall",
      "Sensacionalizar — toda afirmação é auditável pela API",
      "Vender dados de usuários — não coletamos",
      "Substituir RugCheck ou concorrentes — nós complementamos",
    ],
    involvedTitle: "Participe",
    involved: [
      { audience: "Traders", cta: "Experimente o bot do Telegram", href: "/telegram", text: "Alertas gratuitos sobre operadores CRITICAL · PT-BR + EN" },
      { audience: "Builders", cta: "MCP + REST", href: "/mcp", text: "Servidor MCP sem instalação para agentes de IA · API REST pública" },
      { audience: "Pesquisadores", cta: "API + docs", href: "/api", text: "14 endpoints documentados · logs de auditoria reproduzíveis · dados abertos" },
      { audience: "Parceiros", cta: "hello@solsentry.app", href: "mailto:hello@solsentry.app", text: "Integração · parceria de dados · consultas de investidores" },
    ],
  },
};

export function AboutClient({ stats }: { stats: NetworkStats | null }) {
  const lang = useLang();
  const t = COPY[lang];

  return (
    <>
      <SiteTopbar />
      <main>
        {/* ───────────── §1 HERO ───────────── */}
        <section className="hero">
          <div className="container">
            <span className="hero-eyebrow">{t.heroEyebrow}</span>
            <h1 className="hero-title">
              {t.heroTitleA}
              <br />
              <em>{t.heroTitleEm}</em>.
            </h1>
            <p className="hero-sub">{t.heroSub}</p>

            <div className="about-stat-grid">
              <AboutStat label={t.statContinuous} value={fmtHours(lang, stats?.runtime_hours)} href="https://api.solsentry.app/v1/stats" />
              <AboutStat label={t.statPredictions} value={fmtInt(stats?.total_predictions)} href="https://api.solsentry.app/v1/stats" />
              <AboutStat label={t.statCritical} value={fmtPct(stats?.critical_precision_pct)} href="https://api.solsentry.app/v1/stats" />
              <AboutStat label={t.statAccuracy} value={fmtPct(stats?.accuracy_pct)} href="https://api.solsentry.app/v1/stats" />
            </div>

            <p style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", marginTop: 12 }}>
              {t.statsFootnote}
            </p>
          </div>
        </section>

        {/* ───────────── §2 ORIGIN STORY ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">{t.originTitle}</h2>
          <div className="about-prose">
            <p>{t.originP1}</p>
            <p>
              <strong>{t.originP2Strong}</strong>
              {t.originP2Rest}
            </p>
            <p>
              {t.originP3Pre}
              <a
                href="https://api.solsentry.app/v1/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                4kxscute…
              </a>
              {t.originP3Post}
            </p>
          </div>
        </section>

        {/* ───────────── §3 WHAT MAKES IT DIFFERENT ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">{t.diffTitle}</h2>
          <div className="comparison-grid">
            {t.comparisons.map((c) => (
              <ComparisonCard
                key={c.dim}
                dim={c.dim}
                others={c.others}
                us={c.us}
                othersLabel={t.othersLabel}
                usLabel={t.usLabel}
              />
            ))}
          </div>
        </section>

        {/* ───────────── §4 METHODOLOGY ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">{t.methTitle}</h2>
          <div className="about-prose">
            <p>{t.methP1}</p>
            <p>
              {t.methP2A}
              <code>investigator</code>, <code>retract_engine</code>, <code>anomaly_seeker</code>
              {t.methP2B}
            </p>
            <p>
              {t.methP3A}
              <code>MetaLearning</code>
              {t.methP3B}
              <code>auto_adjust()</code>
              {t.methP3C}
            </p>
          </div>

          <div className="layer-grid">
            {t.layers.map((l) => (
              <LayerCard key={l.n} n={l.n} title={l.title} status={l.status} text={l.text} />
            ))}
          </div>
        </section>

        {/* ───────────── §5 HONEST NUMBERS ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">{t.honestTitle}</h2>
          <div className="about-prose">
            <p>
              {t.honestPre}
              <a
                href="https://api.solsentry.app/v1/stats"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                <code>api.solsentry.app/v1/stats</code>
              </a>
              {t.honestPost}
            </p>
            <ul style={{ lineHeight: 1.8, color: "var(--fg-2)" }}>
              <li>
                <strong>
                  {t.honestAccuracyA}
                  {fmtPct(stats?.accuracy_pct)}
                </strong>
                {t.honestAccuracyB}
                {fmtInt(stats?.total_predictions)}{" "}
                {lang === "pt" ? "predições" : "predictions"}
              </li>
            </ul>
          </div>
        </section>

        {/* ───────────── §6 TRUST & TRANSPARENCY ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">{t.trustTitle}</h2>
          <div className="trust-grid">
            {t.trust.map((it) => (
              <TrustItem key={it.label} label={it.label} detail={it.detail} href={it.href} />
            ))}
          </div>
        </section>

        {/* ───────────── §7 TEAM ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">{t.teamTitle}</h2>
          <div className="about-prose">
            <p>
              <strong>Crash Diniz</strong>
              {t.teamCrashPre}
              {fmtInt(stats?.total_predictions)}
              {t.teamCrashPost}
            </p>
            <p>
              <strong>Sena</strong>
              {t.teamSena}
            </p>
            <p style={{ fontSize: 13, color: "var(--fg-3)" }}>{t.teamAck}</p>
          </div>
        </section>

        {/* ───────────── §8 WHAT WE'LL NEVER DO ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">{t.neverTitle}</h2>
          <div className="commitments-grid">
            {t.never.map((text) => (
              <Commitment key={text} text={text} />
            ))}
          </div>
        </section>

        {/* ───────────── §9 GET INVOLVED ───────────── */}
        <section className="container" style={sectionStyle}>
          <h2 className="section-title">{t.involvedTitle}</h2>
          <div className="get-involved-grid">
            {t.involved.map((c) => (
              <GetInvolvedCard key={c.audience} audience={c.audience} cta={c.cta} href={c.href} text={c.text} />
            ))}
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        .about-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-top: 32px;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 700;
          color: var(--fg-1);
          margin-bottom: 24px;
          letter-spacing: -0.01em;
        }
        .about-prose {
          max-width: 720px;
          line-height: 1.7;
          color: var(--fg-2);
          font-size: 15px;
        }
        .about-prose p {
          margin-bottom: 16px;
        }
        .about-prose code {
          background: var(--surface-2, rgba(242,237,228,0.05));
          padding: 1px 6px;
          border-radius: 3px;
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--brand-amber);
        }
        .inline-link {
          color: var(--brand-amber);
          text-decoration: none;
          border-bottom: 1px dashed var(--brand-amber);
        }
        .inline-link:hover {
          opacity: 0.8;
        }
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
        }
        .layer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
          margin-top: 24px;
        }
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
        }
        .commitments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 8px;
        }
        .get-involved-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
        }
      `}</style>
    </>
  );
}

const sectionStyle: React.CSSProperties = {
  paddingTop: 60,
  paddingBottom: 20,
};

function AboutStat({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--brand-amber)", letterSpacing: "-0.01em" }}>
        {value}
      </div>
    </>
  );

  const styleProps: React.CSSProperties = {
    padding: 20,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    display: "block",
    textDecoration: "none",
  };

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" style={styleProps}>
      {inner}
    </a>
  ) : (
    <div style={styleProps}>{inner}</div>
  );
}

function ComparisonCard({
  dim,
  others,
  us,
  othersLabel,
  usLabel,
}: {
  dim: string;
  others: string;
  us: string;
  othersLabel: string;
  usLabel: string;
}) {
  return (
    <div style={{ padding: 16, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6 }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", marginBottom: 12 }}>
        {dim}
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: "var(--fg-3)", marginBottom: 4 }}>{othersLabel}</div>
        <div style={{ fontSize: 13, color: "var(--fg-2)" }} dangerouslySetInnerHTML={{ __html: others }} />
      </div>
      <div>
        <div style={{ fontSize: 10, color: "var(--brand-amber)", marginBottom: 4 }}>{usLabel}</div>
        <div style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: us }} />
      </div>
    </div>
  );
}

function LayerCard({ n, title, status, text }: { n: string; title: string; status: string; text: string }) {
  return (
    <div style={{ padding: 16, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6 }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--brand-amber)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
        {n} · {status}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg-1)", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 12, color: "var(--fg-2)", lineHeight: 1.5 }}>{text}</div>
    </div>
  );
}

function TrustItem({ label, detail, href }: { label: string; detail: string; href: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{ padding: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, textDecoration: "none", display: "block" }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-amber)", marginBottom: 4 }}>{label} ↗</div>
      <div style={{ fontSize: 12, color: "var(--fg-2)", lineHeight: 1.5 }}>{detail}</div>
    </a>
  );
}

function Commitment({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--brand-amber)",
        borderRadius: 4,
        fontSize: 13,
        color: "var(--fg-1)",
      }}
    >
      ❌ {text}
    </div>
  );
}

function GetInvolvedCard({ audience, cta, href, text }: { audience: string; cta: string; href: string; text: string }) {
  return (
    <Link href={href} style={{ padding: 20, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, textDecoration: "none", display: "block" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", marginBottom: 8 }}>{audience}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--brand-amber)", marginBottom: 8 }}>{cta} →</div>
      <div style={{ fontSize: 12, color: "var(--fg-2)", lineHeight: 1.5 }}>{text}</div>
    </Link>
  );
}
