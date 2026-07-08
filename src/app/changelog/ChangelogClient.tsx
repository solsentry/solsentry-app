"use client";

// /changelog — bilingual client body (PT/EN from saved pref or
// navigator.language; see useLang / B8.4a). The server wrapper (page.tsx)
// keeps EN metadata + fetches the live CRITICAL precision, passed as
// `criticalPct` so there's no client "…%" flash on this CTA page.
//
// Endpoint paths, package names and code identifiers stay verbatim in both
// languages (backtick segments render as <code>). Plan is closed/invite-only
// — "Closed beta", consistent with the topbar + the launch thread.

import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { useLang } from "@/lib/use-lang";
import type { Lang } from "@/lib/i18n-landing";

interface Bi {
  en: string;
  pt: string;
}

interface Entry {
  lead: Bi;
  body: Bi;
}

interface Month {
  label: Bi;
  title: Bi;
  entries: Entry[];
}

const MONTHS: Month[] = [
  {
    label: { en: "July 2026", pt: "Julho de 2026" },
    title: {
      en: "Agent payments, provider redundancy & attribution close-out",
      pt: "Pagamentos para agentes, redundância de provider e fechamento de atribuição",
    },
    entries: [
      {
        lead: {
          en: "Agent-native payments live on mainnet.",
          pt: "Pagamentos nativos para agentes ao vivo na mainnet.",
        },
        body: {
          en: "`/x402/v1/*` — autonomous agents pay per-call in USDC, no signup, no key. Curated endpoints exposed via the x402 standard; submitted to Solana's `pay-skills` registry.",
          pt: "`/x402/v1/*` — agentes autônomos pagam por chamada em USDC, sem cadastro, sem chave. Endpoints curados expostos via o padrão x402; submetido ao registry `pay-skills` da Solana.",
        },
      },
      {
        lead: {
          en: "Provider redundancy + failover.",
          pt: "Redundância de provider + failover.",
        },
        body: {
          en: "Multi-provider RPC routing with automatic failover and a metered budget guard across providers — resilience and lower latency on hot-wallet reads.",
          pt: "Roteamento RPC multi-provider com failover automático e um budget guard medido entre providers — resiliência e menor latência nas leituras de hot wallet.",
        },
      },
      {
        lead: {
          en: "Public Telegram channel + alert bot.",
          pt: "Canal público no Telegram + bot de alertas.",
        },
        body: {
          en: "`t.me/solsentryai` — CRITICAL alerts and an on-demand `/scan` command; invite-based DM onboarding.",
          pt: "`t.me/solsentryai` — alertas CRITICAL e um comando `/scan` sob demanda; onboarding por DM via convite.",
        },
      },
      {
        lead: {
          en: "Attribution correction complete.",
          pt: "Correção de atribuição concluída.",
        },
        body: {
          en: "The multi-source re-verification of historical dev-wallet attributions is finished and deployed; inflated legacy counts corrected. Honest data over big numbers.",
          pt: "A re-verificação multi-fonte das atribuições históricas de dev wallets está concluída e deployada; contagens legadas infladas corrigidas. Dados honestos acima de números grandes.",
        },
      },
    ],
  },
  {
    label: { en: "June 2026", pt: "Junho de 2026" },
    title: {
      en: "Hardening, low-latency layer & launch prep",
      pt: "Hardening, camada de baixa latência e preparação de lançamento",
    },
    entries: [
      {
        lead: { en: "Public site live.", pt: "Site oficialmente no ar." },
        body: {
          en: "The SolSentry site went officially online — about, changelog, public API reference, and a live operator lookup, with every accuracy claim linking straight to `/v1/stats`.",
          pt: "O site do SolSentry entrou oficialmente no ar — about, changelog, referência da API pública e uma consulta de operador ao vivo, com toda afirmação de precisão linkando direto para `/v1/stats`.",
        },
      },
      {
        lead: { en: "Attribution audit complete.", pt: "Auditoria de atribuição concluída." },
        body: {
          en: "Full multi-source re-verification of historical dev-wallet attributions, cross-checked across independent on-chain datasets. Honest data over big numbers.",
          pt: "Re-verificação multi-fonte completa das atribuições históricas de dev wallets, cruzada com datasets on-chain independentes. Dados honestos acima de números grandes.",
        },
      },
      {
        lead: { en: "Classifier self-correction.", pt: "Autocorreção do classificador." },
        body: {
          en: "Found and fixed a false-positive class (position-NFTs read as tokens); backfilled affected predictions. CRITICAL-tier precision now {criticalPct}, auditable per-mint at `/v1/predictions/{mint}`.",
          pt: "Encontrou e corrigiu uma classe de falso positivo (position-NFTs lidos como tokens); predições afetadas preenchidas retroativamente. Precisão CRITICAL agora em {criticalPct}, auditável por mint em `/v1/predictions/{mint}`.",
        },
      },
      {
        lead: { en: "Shadow detectors wired.", pt: "Detectores shadow conectados." },
        body: {
          en: "Forensic detectors (cashout tracing, CEX-attribution, sybil-evasion patterns) now run in shadow mode — observing, not yet scoring — to validate signal before going live.",
          pt: "Detectores forenses (rastreamento de cashout, atribuição CEX, padrões de evasão sybil) agora rodam em modo shadow — observando, ainda sem pontuar — para validar o sinal antes de entrar em produção.",
        },
      },
      {
        lead: { en: "Cost-control & reliability.", pt: "Controle de custos e confiabilidade." },
        body: {
          en: "Self-detecting waste guardrail (a misconfigured webhook burned credits overnight → velocity gate + event-type filter + daily reconcile). Self-healer fixed to run on schedule. Redis-backed rate limiting + Postgres auth layer landed ahead of launch.",
          pt: "Guardrail auto-detectável de desperdício (um webhook mal configurado queimou créditos durante a noite → velocity gate + filtro de tipo de evento + reconciliação diária). Self-healer corrigido para rodar no schedule. Rate limiting com Redis + camada de auth Postgres entregues antes do lançamento.",
        },
      },
      {
        lead: { en: "`/v1/contract-analysis`", pt: "`/v1/contract-analysis`" },
        body: {
          en: "— program/contract analysis via the API.",
          pt: "— análise de programa/contrato via API.",
        },
      },
    ],
  },
  {
    label: { en: "May 2026", pt: "Maio de 2026" },
    title: {
      en: "Case machine, dataset-first architecture & product surface",
      pt: "Máquina de casos, arquitetura dataset-first e superfície de produto",
    },
    entries: [
      {
        lead: { en: "Dataset-first architecture.", pt: "Arquitetura dataset-first." },
        body: {
          en: "Unified waterfall resolver (dataset-first → RPC fallback) + RPC-level cache, cutting repeated on-chain spend on re-queried mints.",
          pt: "Waterfall resolver unificado (dataset-first → fallback RPC) + cache no nível RPC, cortando gasto on-chain repetido em mints re-consultados.",
        },
      },
      {
        lead: {
          en: "Bidirectional tracer + SNS deep-trace.",
          pt: "Rastreador bidirecional + deep-trace SNS.",
        },
        body: {
          en: "Full Solana Name Service ownership graph; multi-hop fund-flow investigator following outflow to its terminus.",
          pt: "Grafo completo de ownership do Solana Name Service; investigador de fluxo de fundos multi-hop seguindo o outflow até o destino final.",
        },
      },
      {
        lead: { en: "`/v1/external-history`", pt: "`/v1/external-history`" },
        body: {
          en: "— unified endpoint aggregating transaction history across providers.",
          pt: "— endpoint unificado agregando histórico de transações entre provedores.",
        },
      },
      {
        lead: {
          en: "Adversarial monitor + narrative generator.",
          pt: "Monitor adversarial + gerador de narrativa.",
        },
        body: {
          en: 'Autonomous prose from investigation data; 7 alert types; structured-deposit ("smurfing") cluster detection.',
          pt: 'Prosa autônoma a partir de dados de investigação; 7 tipos de alerta; detecção de clusters de depósitos estruturados ("smurfing").',
        },
      },
      {
        lead: { en: "`@solsentry/guard` SDK v0", pt: "`@solsentry/guard` SDK v0" },
        body: {
          en: "— pre-signing risk client published to NPM (MIT, examples, CI template).",
          pt: "— cliente de risco pré-assinatura publicado no NPM (MIT, exemplos, template CI).",
        },
      },
      {
        lead: { en: "Next.js 15 public site MVP", pt: "MVP do site público Next.js 15" },
        body: { en: "+ documentation scaffold.", pt: "+ scaffold de documentação." },
      },
      {
        lead: { en: "Submitted to Colosseum Frontier", pt: "Submetido ao Colosseum Frontier" },
        body: { en: "(May 12).", pt: "(12 de maio)." },
      },
    ],
  },
  {
    label: { en: "April 2026", pt: "Abril de 2026" },
    title: {
      en: "Operator graph, ALife brain & public API",
      pt: "Grafo de operadores, cérebro ALife e API pública",
    },
    entries: [
      {
        lead: {
          en: "Public API launch + `@solsentry/mcp` on NPM.",
          pt: "Lançamento da API pública + `@solsentry/mcp` no NPM.",
        },
        body: {
          en: "Free REST API and an MCP server exposing operator risk as a composable primitive. Open-core surface live (MIT SDK, SECURITY policy, public roadmap).",
          pt: "API REST gratuita e servidor MCP expondo risco de operadores como primitiva composável. Superfície open-core ativa (SDK MIT, política SECURITY, roadmap público).",
        },
      },
      {
        lead: { en: "ALife autonomous brain ships.", pt: "Cérebro autônomo ALife entregue." },
        body: {
          en: "Evolutionary agents on live mainnet: signal feedback loop, retraction engine, anomaly seeker, and a self-healer for autonomous data-integrity repair.",
          pt: "Agentes evolutivos na mainnet em produção: loop de feedback de sinais, motor de retração, anomaly seeker e self-healer para reparo autônomo de integridade de dados.",
        },
      },
      {
        lead: {
          en: "Operator graph + investigation graph.",
          pt: "Grafo de operadores + grafo de investigação.",
        },
        body: {
          en: "Operator → token → wallet relationships connected; `/v1/graph` (named nodes, roles), `/v1/drain-trace/{wallet}` fund-flow tracing, ring detector.",
          pt: "Relações operador → token → wallet conectadas; `/v1/graph` (nós nomeados, papéis), `/v1/drain-trace/{wallet}` rastreamento de fluxo de fundos, detector de anéis.",
        },
      },
      {
        lead: {
          en: "Token-2022 support + launchpad detection.",
          pt: "Suporte a Token-2022 + detecção de launchpad.",
        },
        body: {
          en: "Native Token-2022 handling; 12 launch platforms recognized; King-of-the-Hill pattern detection.",
          pt: "Suporte nativo a Token-2022; 12 plataformas de lançamento reconhecidas; detecção de padrão King-of-the-Hill.",
        },
      },
      {
        lead: { en: "Multi-window outcome resolution.", pt: "Resolução de outcome multi-janela." },
        body: {
          en: "24h / 3d / 7d resolution windows + fast-track; accuracy feedback wired end-to-end. Live accuracy auditable at `/v1/stats`.",
          pt: "Janelas de resolução 24h / 3d / 7d + fast-track; feedback de acurácia conectado de ponta a ponta. Acurácia ao vivo auditável em `/v1/stats`.",
        },
      },
    ],
  },
  {
    label: { en: "March 2026", pt: "Março de 2026" },
    title: {
      en: "Accuracy feedback loop & operator profiling",
      pt: "Loop de feedback de acurácia e perfilamento de operadores",
    },
    entries: [
      {
        lead: {
          en: "Outcome tracker wired — accuracy feedback loop active.",
          pt: "Outcome tracker conectado — loop de feedback de acurácia ativo.",
        },
        body: {
          en: "Resolved predictions feed back into the classifier; first build with a live, self-correcting accuracy metric.",
          pt: "Predições resolvidas alimentam de volta o classificador; primeiro build com métrica de acurácia viva e autocorretiva.",
        },
      },
      {
        lead: { en: "Hunter auto-scan pipeline.", pt: "Pipeline de auto-scan do Hunter." },
        body: {
          en: "Automated high-risk detection routed without manual trigger.",
          pt: "Detecção automatizada de alto risco roteada sem trigger manual.",
        },
      },
      {
        lead: {
          en: "Operator profiling + KOL cross-reference.",
          pt: "Perfilamento de operadores + referência cruzada de KOLs.",
        },
        body: {
          en: "Per-wallet context and holder-confidence tiers in scan output; evolutionary feedback persists across restarts.",
          pt: "Contexto por wallet e tiers de confiança de holders no output do scan; feedback evolutivo persiste entre restarts.",
        },
      },
    ],
  },
  {
    label: { en: "February 2026", pt: "Fevereiro de 2026" },
    title: {
      en: "First scanner, agents & on-chain monitoring",
      pt: "Primeiro scanner, agentes e monitoramento on-chain",
    },
    entries: [
      {
        lead: { en: "First public commit", pt: "Primeiro commit público" },
        body: {
          en: "(Feb 8) — token scanner, outcome tracker, baseline intelligence pipeline.",
          pt: "(8 de fev) — token scanner, outcome tracker, pipeline de inteligência baseline.",
        },
      },
      {
        lead: {
          en: "Autonomous Hunter & Sentinel agents.",
          pt: "Agentes autônomos Hunter e Sentinel.",
        },
        body: {
          en: "Watch for new deploys, large transfers, and liquidity removals; first evolutionary genome module.",
          pt: "Vigiam novos deploys, transferências grandes e remoções de liquidez; primeiro módulo de genoma evolutivo.",
        },
      },
      {
        lead: { en: "RPC pool with failover", pt: "Pool RPC com failover" },
        body: {
          en: "+ holder-distribution analysis.",
          pt: "+ análise de distribuição de holders.",
        },
      },
      {
        lead: {
          en: "Known-entities + wallet-alias registry.",
          pt: "Entidades conhecidas + registro de alias de wallets.",
        },
        body: {
          en: "Seeded registry of known programs/protocols to suppress false positives and add context; operator-to-alias mapping.",
          pt: "Registro pré-populado de programas/protocolos conhecidos para suprimir falsos positivos e adicionar contexto; mapeamento operador-alias.",
        },
      },
    ],
  },
];

interface Anchor {
  label: Bi;
  detail: Bi;
  href: string;
}

const ANCHORS: Anchor[] = [
  {
    label: { en: "Free REST API", pt: "API REST gratuita" },
    detail: {
      en: "No key, no signup. `/v1/operator/{wallet}`: risk level, confirmed rugs, serial-deployer flag, connected bot clusters. Sub-second scan response.",
      pt: "Sem chave, sem cadastro. `/v1/operator/{wallet}`: nível de risco, rugs confirmados, flag de deployer serial, clusters de bots conectados. Resposta de scan em menos de um segundo.",
    },
    href: "https://api.solsentry.app/v1/stats",
  },
  {
    label: { en: "MCP server", pt: "Servidor MCP" },
    detail: {
      en: "`@solsentry/mcp` on NPM. Operator risk as a composable primitive.",
      pt: "`@solsentry/mcp` no NPM. Risco de operadores como primitiva composável.",
    },
    href: "https://www.npmjs.com/package/@solsentry/mcp",
  },
  {
    label: { en: "Auditable", pt: "Auditável" },
    detail: {
      en: "`/v1/predictions/{mint}` and `/v1/operator/{wallet}` are public. Check any claim.",
      pt: "`/v1/predictions/{mint}` e `/v1/operator/{wallet}` são públicos. Verifique qualquer afirmação.",
    },
    href: "https://api.solsentry.app/v1/predictions/So11111111111111111111111111111111111111112",
  },
  {
    label: { en: "Open-core", pt: "Open-core" },
    detail: {
      en: "Open SDK + MCP + free API; the intelligence engine is proprietary.",
      pt: "SDK aberto + MCP + API gratuita; o motor de inteligência é proprietário.",
    },
    href: "https://github.com/solsentry",
  },
];

interface CLCopy {
  heroEyebrow: string;
  heroTitleA: string;
  heroSince: string;
  heroTitleEm: string;
  heroSubPre: string;
  heroSubPost: string;
  anchorsTitle: string;
}

const COPY: Record<Lang, CLCopy> = {
  en: {
    heroEyebrow: "Changelog",
    heroTitleA: "What shipped —",
    heroSince: "since ",
    heroTitleEm: "day one",
    heroSubPre:
      "Every significant build milestone, from the first public commit (Feb 8, 2026) to today. Data-first, no hype. All accuracy claims auditable at ",
    heroSubPost: ".",
    anchorsTitle: "Capability anchors",
  },
  pt: {
    heroEyebrow: "Changelog",
    heroTitleA: "O que foi entregue —",
    heroSince: "desde o ",
    heroTitleEm: "primeiro dia",
    heroSubPre:
      "Cada marco significativo de build, do primeiro commit público (8 de fev de 2026) até hoje. Dados primeiro, sem hype. Toda afirmação de precisão é auditável em ",
    heroSubPost: ".",
    anchorsTitle: "Âncoras de capacidade",
  },
};

// Render text where backtick segments become <code> and {criticalPct} is
// substituted with the live value. {wallet}/{mint} inside code stay literal.
function renderRich(text: string, criticalPct: string, codeClass?: string): React.ReactNode {
  const segs = text.split("`");
  return segs.map((seg, i) =>
    i % 2 === 1 ? (
      <code key={i} className={codeClass}>
        {seg}
      </code>
    ) : (
      <span key={i}>{seg.split("{criticalPct}").join(criticalPct)}</span>
    ),
  );
}

export function ChangelogClient({ criticalPct }: { criticalPct: string }) {
  const lang = useLang();
  const t = COPY[lang];

  return (
    <>
      <SiteTopbar />
      <main>
        {/* ───────────── HERO ───────────── */}
        {/* No beta banner here — the closed-beta CTA now lives centered on the
            homepage, below the scanner. This page mirrors /about exactly. */}
        <section className="hero">
          <div className="container">
            <span className="hero-eyebrow">{t.heroEyebrow}</span>
            <h1 className="hero-title">
              {t.heroTitleA}
              <br />
              {t.heroSince}
              <em>{t.heroTitleEm}</em>.
            </h1>
            <p className="hero-sub">
              {t.heroSubPre}
              <a
                href="https://api.solsentry.app/v1/stats"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--brand-amber)",
                  textDecoration: "none",
                  borderBottom: "1px dashed var(--brand-amber)",
                }}
              >
                /v1/stats
              </a>
              {t.heroSubPost}
            </p>
          </div>
        </section>

        {/* ───────────── CHANGELOG ENTRIES ───────────── */}
        <section className="container" style={{ paddingBottom: 40 }}>
          <div className="changelog-timeline">
            {MONTHS.map((m) => (
              <div className="changelog-month" key={m.label.en}>
                <div className="changelog-month-label">{m.label[lang]}</div>
                <div className="changelog-month-title">{m.title[lang]}</div>
                <ul className="changelog-list">
                  {m.entries.map((e) => (
                    <li key={e.lead.en}>
                      <strong>{renderRich(e.lead[lang], criticalPct)}</strong>{" "}
                      {renderRich(e.body[lang], criticalPct)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ───────────── CAPABILITY ANCHORS ───────────── */}
        <section
          className="container"
          style={{ paddingTop: 60, paddingBottom: 80, borderTop: "1px solid var(--border-soft)" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 700,
              color: "var(--fg-1)",
              marginBottom: 24,
              letterSpacing: "-0.01em",
            }}
          >
            {t.anchorsTitle}
          </h2>
          <div className="anchors-grid">
            {ANCHORS.map((a) => (
              <AnchorCard
                key={a.label.en}
                label={a.label[lang]}
                detail={renderRich(a.detail[lang], criticalPct, "anchor-code")}
                href={a.href}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        .changelog-timeline {
          max-width: 760px;
          padding-top: 48px;
        }
        .changelog-month {
          margin-bottom: 56px;
        }
        .changelog-month-label {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--brand-amber);
          margin-bottom: 6px;
        }
        .changelog-month-title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          color: var(--fg-1);
          margin-bottom: 20px;
          letter-spacing: -0.01em;
        }
        .changelog-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .changelog-list li {
          font-size: 15px;
          line-height: 1.7;
          color: var(--fg-2);
          padding-left: 20px;
          position: relative;
          margin-bottom: 8px;
        }
        .changelog-list li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: var(--brand-amber);
          font-size: 12px;
          top: 2px;
        }
        .changelog-list code,
        .anchor-code {
          background: var(--surface-2, rgba(242,237,228,0.05));
          padding: 1px 5px;
          border-radius: 3px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--brand-amber);
        }
        .anchors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
        }
      `}</style>
    </>
  );
}

function AnchorCard({
  label,
  detail,
  href,
}: {
  label: string;
  detail: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        padding: 16,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        textDecoration: "none",
        display: "block",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-amber)", marginBottom: 6 }}>
        {label} ↗
      </div>
      <div style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.55 }}>{detail}</div>
    </a>
  );
}
