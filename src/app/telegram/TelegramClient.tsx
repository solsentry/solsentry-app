"use client";

// /telegram — bilingual client body (PT/EN from saved pref or
// navigator.language; see useLang / B8.4a). Command names, args, pillars and
// the illustrative flag codes stay verbatim in both languages.
//
// Admin/internal commands are intentionally NOT listed here (B8.5). Because
// this is a Client Component, the command data ships in the client JS payload
// — so admin entries are removed from the source array entirely, not merely
// filtered at render. The header count is derived (PUBLIC_COUNT) so it can
// never drift from the list.

import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { useLang } from "@/lib/use-lang";
import type { Lang } from "@/lib/i18n-landing";

interface Cmd {
  cmd: string;
  args?: string;
  desc: { en: string; pt: string };
  tier?: "new";
  pillar?: "PREVENT" | "TRACK" | "EXPLAIN" | "EVOLVE";
}

const COMMANDS: { group: { en: string; pt: string }; items: Cmd[] }[] = [
  {
    group: { en: "Scan & analyze", pt: "Scan e análise" },
    items: [
      {
        cmd: "/scan",
        args: "<addr>",
        desc: {
          en: "Full token or wallet analysis. Risk score, flag list, operator history, holder distribution, bot cluster links. Returns in ~2s.",
          pt: "Análise completa de token ou wallet. Score de risco, lista de flags, histórico do operador, distribuição de holders, links de cluster de bots. Retorna em ~2s.",
        },
        pillar: "PREVENT",
      },
      {
        cmd: "/drain",
        args: "<addr>",
        desc: {
          en: "Trace SOL drain through up to 10 hops. Identifies bridges, DEXes, CEX endpoints, and final cash-out wallets.",
          pt: "Rastreia drain de SOL em até 10 hops. Identifica bridges, DEXes, endpoints CEX e wallets finais de cash-out.",
        },
        pillar: "TRACK",
      },
      {
        cmd: "/crossref",
        desc: {
          en: "Cross-reference watched wallets against the operator database. Surface hidden relationships.",
          pt: "Referência cruzada de wallets monitoradas contra o banco de dados de operadores. Revela relações ocultas.",
        },
        pillar: "TRACK",
      },
      {
        cmd: "/whois",
        args: "<addr>",
        desc: {
          en: "Look up wallet alias + operator profile if known. Fast context lookup.",
          pt: "Consulta alias da wallet + perfil do operador se conhecido. Busca rápida de contexto.",
        },
        pillar: "TRACK",
      },
      {
        cmd: "/probe",
        args: "<addr>",
        desc: {
          en: "Sherlock-mode investigation — 7-phase forensic sweep covering funding, deploys, social graph, drain endpoints. Slower than /scan, deeper insight.",
          pt: "Investigação modo Sherlock — varredura forense de 7 fases cobrindo funding, deploys, grafo social, endpoints de drain. Mais lento que /scan, insight mais profundo.",
        },
        pillar: "TRACK",
        tier: "new",
      },
      {
        cmd: "/investigate",
        args: "<addr>",
        desc: {
          en: "Full investigation report — combines /probe + /drain + cluster analysis into a single dossier.",
          pt: "Relatório completo de investigação — combina /probe + /drain + análise de clusters em um único dossiê.",
        },
        pillar: "TRACK",
        tier: "new",
      },
      {
        cmd: "/intel",
        args: "<addr>",
        desc: {
          en: "Threat intel summary — known tags, source attributions, related operators, last seen activity.",
          pt: "Resumo de threat intel — tags conhecidas, atribuições de fonte, operadores relacionados, última atividade vista.",
        },
        pillar: "TRACK",
      },
      {
        cmd: "/recover",
        desc: {
          en: "Drain recovery wizard — guided flow for victims to compile evidence packet for CEX/exchange recovery requests.",
          pt: "Wizard de recuperação de drain — fluxo guiado para vítimas compilarem pacote de evidências para pedidos de recuperação em CEX/exchanges.",
        },
        pillar: "EXPLAIN",
        tier: "new",
      },
      {
        cmd: "/me",
        desc: {
          en: "Your profile — usage stats, watchlist count, custom labels, subscription tier.",
          pt: "Seu perfil — stats de uso, contagem de watchlist, labels customizados, tier de assinatura.",
        },
        pillar: "EXPLAIN",
      },
      {
        cmd: "/labels",
        desc: {
          en: "Manage custom wallet labels (private, per-user). Override default operator names with your own.",
          pt: "Gerencie labels de wallet customizados (privados, por usuário). Sobrescreva nomes padrão de operadores com os seus.",
        },
        pillar: "EXPLAIN",
      },
      {
        cmd: "/lang",
        args: "pt | en",
        desc: {
          en: "Toggle bot language (Portuguese / English).",
          pt: "Alterne o idioma do bot (Português / Inglês).",
        },
        pillar: "EXPLAIN",
      },
      {
        cmd: "/subscribe",
        args: "CRITICAL | HIGH",
        desc: {
          en: "Subscribe to push alerts at the chosen severity threshold.",
          pt: "Inscreva-se para alertas push no limiar de severidade escolhido.",
        },
        pillar: "PREVENT",
      },
    ],
  },
  {
    group: { en: "Status & monitoring", pt: "Status e monitoramento" },
    items: [
      {
        cmd: "/status",
        desc: {
          en: "System status — runtime, scans processed, accuracy, agent count, RPC pool health.",
          pt: "Status do sistema — runtime, scans processados, acurácia, contagem de agentes, saúde do pool RPC.",
        },
        pillar: "PREVENT",
      },
      {
        cmd: "/alerts",
        desc: {
          en: "Latest HIGH / CRITICAL risk alerts, newest first.",
          pt: "Alertas de risco HIGH / CRITICAL mais recentes, novos primeiro.",
        },
        pillar: "PREVENT",
      },
      {
        cmd: "/report",
        desc: {
          en: "Daily intelligence report — top operators flagged, rugs resolved, new serial deployers identified.",
          pt: "Relatório diário de inteligência — principais operadores flagrados, rugs resolvidos, novos deployers seriais identificados.",
        },
        pillar: "EXPLAIN",
      },
      {
        cmd: "/watchlist",
        desc: {
          en: "List wallets you have under active watch. Per-user state.",
          pt: "Liste as wallets que você tem sob monitoramento ativo. Estado por usuário.",
        },
        pillar: "TRACK",
      },
      {
        cmd: "/discover",
        desc: {
          en: "Trigger an immediate discovery check against pump.fun / Raydium recent deploys.",
          pt: "Dispare uma verificação imediata de descoberta contra deploys recentes do pump.fun / Raydium.",
        },
        pillar: "PREVENT",
      },
    ],
  },
  {
    group: { en: "ALife hunters", pt: "Hunters ALife" },
    items: [
      {
        cmd: "/hunters",
        desc: {
          en: "Show all active hunter agents. Each hunter tracks a wallet and reports state changes.",
          pt: "Mostra todos os agentes hunter ativos. Cada hunter rastreia uma wallet e reporta mudanças de estado.",
        },
        pillar: "EVOLVE",
      },
      {
        cmd: "/hunter",
        args: "<id>",
        desc: {
          en: "Hunter detail — DNA, generation, age, target wallet, observations count.",
          pt: "Detalhe do hunter — DNA, geração, idade, wallet alvo, contagem de observações.",
        },
        pillar: "EVOLVE",
      },
      {
        cmd: "/follow",
        args: "<addr>",
        desc: {
          en: "Assign a hunter to a specific wallet. Hunter will report deploys, drains, bot cluster formation.",
          pt: "Atribua um hunter a uma wallet específica. O hunter vai reportar deploys, drains, formação de cluster de bots.",
        },
        pillar: "EVOLVE",
      },
      {
        cmd: "/sentinels",
        desc: {
          en: "Show sentinel watchdogs (long-lived guards over known high-value targets).",
          pt: "Mostra sentinelas watchdog (guardiões de longa duração sobre alvos conhecidos de alto valor).",
        },
        pillar: "EVOLVE",
      },
      {
        cmd: "/name",
        args: "<addr> <alias>",
        desc: {
          en: "Name a wallet for future reference. Alias is private and per-user.",
          pt: "Nomeie uma wallet para referência futura. Alias é privado e por usuário.",
        },
        pillar: "EXPLAIN",
      },
    ],
  },
  {
    group: { en: "Entities & KOLs", pt: "Entidades e KOLs" },
    items: [
      {
        cmd: "/entity",
        args: "<addr>",
        desc: {
          en: "Entity info — check if a wallet is a known CEX, mixer, bridge, or KOL.",
          pt: "Info de entidade — verifique se uma wallet é CEX, mixer, bridge ou KOL conhecido.",
        },
        pillar: "TRACK",
      },
      {
        cmd: "/entities",
        desc: {
          en: "List summary of all known entity categories in SolSentry's database.",
          pt: "Resumo de todas as categorias de entidades conhecidas no banco de dados do SolSentry.",
        },
        pillar: "TRACK",
      },
    ],
  },
  {
    group: { en: "Bulk import", pt: "Importação em massa" },
    items: [
      {
        cmd: "/import",
        desc: {
          en: "Bulk import wallets from paste (up to 50 at once).",
          pt: "Importação em massa de wallets via paste (até 50 por vez).",
        },
        pillar: "PREVENT",
      },
    ],
  },
  {
    group: { en: "Content", pt: "Conteúdo" },
    items: [
      {
        cmd: "/post",
        args: "<type>",
        desc: {
          en: "Generate a ready-to-paste X/Twitter post from the latest data. Useful for daily updates.",
          pt: "Gera um post pronto para colar no X/Twitter a partir dos dados mais recentes. Útil para atualizações diárias.",
        },
        pillar: "EXPLAIN",
      },
    ],
  },
];

// Derived public command count — keeps the header honest against the list.
const PUBLIC_COUNT = COMMANDS.reduce((n, g) => n + g.items.length, 0);

// Illustrative scan output — placeholder addresses, not a live figure.
const EXAMPLE_OUTPUT: Record<Lang, string> = {
  en: `🚨 HIGH RISK — Serial operator detected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mint:  Bz4UpUmp...tRTwZv
Dev:   7xKpDemo...rug1  (known)
Risk:  CRITICAL

Operator history (illustrative — not a live figure)
  · serial deployer — multiple confirmed rugs
  · Label: serial_rugger

Token-specific flags
  · MINT_AUTHORITY_ENABLED
  · TOP_HOLDER_OWNS_100%
  · VERY_FEW_HOLDERS (4)
  · COORD_BOT_CLUSTER (size 12)

Recommendation
  Avoid. Serial rug operator, active.`,
  pt: `🚨 ALTO RISCO — Operador serial detectado
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mint:  Bz4UpUmp...tRTwZv
Dev:   7xKpDemo...rug1  (known)
Risk:  CRITICAL

Histórico do operador (ilustrativo — não é dado ao vivo)
  · deployer serial — múltiplos rugs confirmados
  · Label: serial_rugger

Flags específicas do token
  · MINT_AUTHORITY_ENABLED
  · TOP_HOLDER_OWNS_100%
  · VERY_FEW_HOLDERS (4)
  · COORD_BOT_CLUSTER (size 12)

Recomendação
  Evitar. Operador de rug serial, ativo.`,
};

interface TgCopy {
  heroEyebrow: string;
  heroTitleA: string;
  heroTitleEm: string;
  heroSubPre: string;
  heroSubPost: string;
  ctaOpen: string;
  ctaAll: string;
  exEyebrow: string;
  exTitle: string;
  exSub: string;
  builtTitle: string;
  steps: { t: string; d: string }[];
  cmdEyebrow: string;
  cmdTitle: string;
  forumEyebrow: string;
  forumTitle: string;
  forumSub: string;
  forumChannels: { t: string; d: string }[];
  nextEyebrow: string;
  nextTitle: string;
  nextSub: string;
  ctaOpenBot: string;
  ctaMcp: string;
  ctaRest: string;
}

const COPY: Record<Lang, TgCopy> = {
  en: {
    heroEyebrow: `Telegram interface · ${PUBLIC_COUNT} commands`,
    heroTitleA: "Paste a wallet.",
    heroTitleEm: "Get the intel back.",
    heroSubPre:
      "SolSentry runs in Telegram first. Every command works on Solana mainnet today. The bot is the fastest way to use the system. Open ",
    heroSubPost: " or tap a command below to jump straight to it.",
    ctaOpen: "Open bot →",
    ctaAll: "All commands",
    exEyebrow: "Live example",
    exTitle: "What a scan looks like",
    exSub:
      "Every /scan returns an operator-aware risk assessment — not just token signals. If the deployer is a known serial, you see it before the token has a single transaction.",
    builtTitle: "How this alert is built",
    steps: [
      { t: "Stage 1 — Fast scan", d: "~2s. RPC fetches mint authority, holder distribution, metadata. Known token mints are short-circuited." },
      { t: "Stage 2 — Deep signals", d: "Holder engine (Helius DAS), DexScreener, InsightX, optional Nansen. Background, non-blocking." },
      { t: "Stage 3 — Bot-cluster forensics", d: "Helius Enhanced TX. Finds coordinated bot clusters mining the same launch." },
      { t: "Operator enrichment", d: "Dev wallet matched against {code}. Serial deployers add +15 to +25 points." },
      { t: "AI explainer", d: "PT-BR and EN. Only fires on risk ≥ 50 (manual) or ≥ 80 (auto). Rate-limited to 10 calls/hr." },
    ],
    cmdEyebrow: "Full command reference",
    cmdTitle: `${PUBLIC_COUNT} commands, grouped by pillar`,
    forumEyebrow: "Forum mode",
    forumTitle: "Dedicated channels per signal type",
    forumSub:
      "In Telegram forum-enabled groups, SolSentry routes output to topic threads — commands, alerts, resolutions, hunter logs — so you never lose signal in noise.",
    forumChannels: [
      { t: "🚨 alerts", d: "HIGH + CRITICAL risk events. Noise-free." },
      { t: "🧬 hunters", d: "Agent births, mutations, deaths, reassignments." },
      { t: "✅ resolutions", d: "Outcomes — was_correct, final classification." },
      { t: "🛠️ commands", d: "Everything else. Your interactive workspace." },
    ],
    nextEyebrow: "Next steps",
    nextTitle: "Use it now",
    nextSub: "No signup, no wallet, no API key for public commands. Message the bot, get intel back.",
    ctaOpenBot: "Open @solsentryai →",
    ctaMcp: "Prefer an AI agent? MCP →",
    ctaRest: "Prefer raw JSON? REST API →",
  },
  pt: {
    heroEyebrow: `Interface Telegram · ${PUBLIC_COUNT} comandos`,
    heroTitleA: "Cole uma wallet.",
    heroTitleEm: "Receba a inteligência de volta.",
    heroSubPre:
      "SolSentry roda no Telegram primeiro. Todo comando funciona na mainnet da Solana hoje. O bot é a forma mais rápida de usar o sistema. Abra ",
    heroSubPost: " ou toque em um comando abaixo para ir direto.",
    ctaOpen: "Abrir bot →",
    ctaAll: "Todos os comandos",
    exEyebrow: "Exemplo ao vivo",
    exTitle: "Como é um scan",
    exSub:
      "Todo /scan retorna uma avaliação de risco ciente do operador — não apenas sinais do token. Se o deployer é serial conhecido, você vê antes do token ter uma única transação.",
    builtTitle: "Como este alerta é construído",
    steps: [
      { t: "Estágio 1 — Scan rápido", d: "~2s. RPC busca mint authority, distribuição de holders, metadata. Mints de tokens conhecidos são curto-circuitados." },
      { t: "Estágio 2 — Sinais profundos", d: "Holder engine (Helius DAS), DexScreener, InsightX, Nansen opcional. Background, não-bloqueante." },
      { t: "Estágio 3 — Forense de cluster de bots", d: "Helius Enhanced TX. Encontra clusters de bots coordenados minerando o mesmo lançamento." },
      { t: "Enriquecimento de operador", d: "Dev wallet comparada contra {code}. Deployers seriais somam +15 a +25 pontos." },
      { t: "Explicador por IA", d: "PT-BR e EN. Dispara apenas com risco ≥ 50 (manual) ou ≥ 80 (auto). Rate-limit de 10 chamadas/hr." },
    ],
    cmdEyebrow: "Referência completa de comandos",
    cmdTitle: `${PUBLIC_COUNT} comandos, agrupados por pilar`,
    forumEyebrow: "Modo fórum",
    forumTitle: "Canais dedicados por tipo de sinal",
    forumSub:
      "Em grupos Telegram com fórum habilitado, o SolSentry roteia a saída para threads de tópicos — comandos, alertas, resoluções, logs de hunters — para que você nunca perca sinal no ruído.",
    forumChannels: [
      { t: "🚨 alertas", d: "Eventos de risco HIGH + CRITICAL. Sem ruído." },
      { t: "🧬 hunters", d: "Nascimentos, mutações, mortes e reatribuições de agentes." },
      { t: "✅ resoluções", d: "Outcomes — was_correct, classificação final." },
      { t: "🛠️ comandos", d: "Todo o resto. Seu workspace interativo." },
    ],
    nextEyebrow: "Próximos passos",
    nextTitle: "Use agora",
    nextSub: "Sem cadastro, sem wallet, sem chave de API para comandos públicos. Mande mensagem para o bot, receba inteligência de volta.",
    ctaOpenBot: "Abrir @solsentryai →",
    ctaMcp: "Prefere um agente de IA? MCP →",
    ctaRest: "Prefere JSON bruto? REST API →",
  },
};

// Render a step body, substituting {code} with the operator_profiles.json
// inline code reference.
function StepBody({ d }: { d: string }) {
  const parts = d.split(/(\{code\})/g);
  return (
    <>
      {parts.map((p, i) =>
        p === "{code}" ? <code key={i}>operator_profiles.json</code> : <span key={i}>{p}</span>,
      )}
    </>
  );
}

export function TelegramClient() {
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
              {t.heroTitleA}
              <br />
              <span style={{ color: "var(--brand-amber)" }}>{t.heroTitleEm}</span>
            </>
          }
          sub={
            <>
              {t.heroSubPre}
              <a href="https://t.me/solsentryai" target="_blank" rel="noreferrer">
                @solsentryai
              </a>
              {t.heroSubPost}
            </>
          }
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <a href="https://t.me/solsentryai" target="_blank" rel="noreferrer" className="btn-primary">
              {t.ctaOpen}
            </a>
            <a href="#commands" className="btn-ghost">
              {t.ctaAll}
            </a>
          </div>
        </PageHeader>

        <Section eyebrow={t.exEyebrow} title={t.exTitle} sub={t.exSub}>
          <div className="grid-2" style={{ alignItems: "start" }}>
            <div className="code-block" style={{ background: "#050505", lineHeight: 1.55, fontSize: 12 }}>
              {EXAMPLE_OUTPUT[lang]}
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 12 }}>
                {t.builtTitle}
              </h3>
              <ol className="step-list" style={{ marginTop: 0 }}>
                {t.steps.map((s) => (
                  <li key={s.t}>
                    <strong>{s.t}</strong>
                    <StepBody d={s.d} />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Section>

        <Section eyebrow={t.cmdEyebrow} title={t.cmdTitle} id="commands">
          {COMMANDS.map((group) => (
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
              {group.items.map((c) => (
                <div key={c.cmd} className="cmd-row">
                  <div>
                    <code>
                      {c.cmd}
                      {c.args ? " " + c.args : ""}
                    </code>
                    {c.tier === "new" && <span className="cmd-meta new">new</span>}
                  </div>
                  <div className="desc">
                    {c.desc[lang]}
                    {c.pillar && (
                      <span
                        className={`pillar-chip ${c.pillar.toLowerCase()}`}
                        style={{ marginLeft: 10, verticalAlign: "middle", fontSize: 9 }}
                      >
                        {c.pillar}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </Section>

        <Section eyebrow={t.forumEyebrow} title={t.forumTitle} sub={t.forumSub}>
          <div className="grid-4">
            {t.forumChannels.map((c) => (
              <div key={c.t} className="panel panel-hover">
                <div style={{ fontFamily: "var(--font-display)", fontSize: 16, marginBottom: 6, color: "var(--fg-1)" }}>
                  {c.t}
                </div>
                <div style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.55 }}>{c.d}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow={t.nextEyebrow} title={t.nextTitle} sub={t.nextSub}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="https://t.me/solsentryai" target="_blank" rel="noreferrer" className="btn-primary">
              {t.ctaOpenBot}
            </a>
            <a href="/mcp" className="btn-ghost">
              {t.ctaMcp}
            </a>
            <a href="/api" className="btn-ghost">
              {t.ctaRest}
            </a>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
