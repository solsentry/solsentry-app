"use client";

import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { useLang } from "@/lib/use-lang";
import type { Lang } from "@/lib/i18n-landing";

// Code/config blocks stay verbatim in both languages.
const CLAUDE_CONFIG = `{
  "mcpServers": {
    "solsentry": {
      "command": "npx",
      "args": ["-y", "@solsentry/mcp"]
    }
  }
}`;

const CURSOR_CONFIG = `{
  "mcp.servers": {
    "solsentry": {
      "command": "npx",
      "args": ["-y", "@solsentry/mcp"]
    }
  }
}`;

// Illustrative agent prompt — kept in English (code-style example) in both langs.
const EXAMPLE_PROMPT = `Ask your agent:

  "Use solsentry.scan_wallet to check
   4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1,
   then summarize the operator history."

The agent calls the tool, gets back JSON,
and writes you a human answer. No setup
beyond the MCP server install.`;

interface McpCopy {
  heroEyebrow: string;
  heroTitleA: string;
  heroTitleEm: string;
  heroTitleB: string;
  heroSub: string;
  ctaNpm: string;
  ctaSetup: string;
  ctaToolRef: string;
  installEyebrow: string;
  installTitle: string;
  claudeLabel: string;
  claudeAddPre: string;
  claudeAddMid: string;
  claudeAddSuf: string;
  cursorLabel: string;
  cursorAddPre: string;
  cursorAddSuf: string;
  firstUse: string;
  toolsEyebrow: string;
  toolsTitle: string;
  toolsSub: string;
  toolDesc: string[]; // 7, in TOOL order
  whyEyebrow: string;
  whyTitle: string;
  whySub: string;
  cards: { t: string; d: string }[]; // 3
  troubleEyebrow: string;
  troubleTitle: string;
  steps: { t: string; d: string }[]; // 3 simple; step 4 rendered separately
  step4T: string;
  step4Pre: string;
  step4Mid: string;
  step4Suf: string;
}

const COPY: Record<Lang, McpCopy> = {
  en: {
    heroEyebrow: "MCP server · @solsentry/mcp v0.2.3",
    heroTitleA: "SolSentry in your ",
    heroTitleEm: "AI agent",
    heroTitleB: ".",
    heroSub:
      "Install once, query forever. Seven tools. Works in Claude Code, Cursor, Windsurf, Zed, or anything that speaks the Model Context Protocol. Your AI now knows every known Solana rug operator and can cite them by wallet.",
    ctaNpm: "npm install →",
    ctaSetup: "Setup guide",
    ctaToolRef: "Tool reference",
    installEyebrow: "Install",
    installTitle: "One command. Two config lines.",
    claudeLabel: "Claude Code / Claude Desktop",
    claudeAddPre: "Add to ",
    claudeAddMid: " or your project’s ",
    claudeAddSuf: ":",
    cursorLabel: "Cursor",
    cursorAddPre: "Add to ",
    cursorAddSuf: " or workspace settings:",
    firstUse: "First use",
    toolsEyebrow: "7 tools · all public",
    toolsTitle: "What the MCP exposes",
    toolsSub:
      "Every tool hits the production API at api.solsentry.app. Data is live, not cached beyond 30 seconds. No API key required for public tools.",
    toolDesc: [
      "Lookup operator profile — known flag, risk level, confirmed rugs, total tokens, rug rate, tags.",
      "Token analysis — risk, flags, dev wallet, bot cluster links, outcome if resolved.",
      "Ranked list of the highest-risk operators by confirmed rugs and rate.",
      "Latest HIGH and CRITICAL alerts with mint, dev, and flag list.",
      "Outcome stream — which predictions were validated and which missed.",
      "SOL flow trace, up to 10 hops, with bridge + CEX classifications.",
      "Global counters — total scans, accuracy, runtime, confirmed rugs.",
    ],
    whyEyebrow: "Why MCP matters",
    whyTitle: "Your AI already has context. Give it intel.",
    whySub:
      "Claude, ChatGPT, and Cursor now drive most dev workflows. MCP is how you plug live on-chain intelligence into them. SolSentry sits next to any general-purpose agent and answers the question it can't answer alone: who deployed this token, and what did they do last time?",
    cards: [
      {
        t: "For traders",
        d: "Paste a wallet in Claude, ask 'is this a serial rugger?', get back confirmed_rugs + rug_rate + recent alerts. No tab switching.",
      },
      {
        t: "For security researchers",
        d: "Ask your agent to trace a drain, then summarize the cash-out path and flag any known CEX endpoints. 10 hops, one call.",
      },
      {
        t: "For builders",
        d: "Embed SolSentry intel into code-gen workflows. Your agent validates operator risk before suggesting a swap path or listing integration.",
      },
    ],
    troubleEyebrow: "Troubleshooting",
    troubleTitle: "If the tool does not appear",
    steps: [
      {
        t: "Restart the agent",
        d: "MCP servers load at startup. Re-launch Claude Code / Cursor after editing the config.",
      },
      {
        t: "Verify Node is available",
        d: "{npx} needs Node 18+. Run {npxver} in a terminal to confirm the binary installs.",
      },
      {
        t: "Check the API is reachable",
        d: "{curl} should return {ok}. If not, the MCP will surface a network error on first tool call.",
      },
    ],
    step4T: "Still stuck?",
    step4Pre: "Reach out — ",
    step4Mid: " or ",
    step4Suf: ". MCP is early — bug reports are welcome.",
  },
  pt: {
    heroEyebrow: "MCP server · @solsentry/mcp v0.2.3",
    heroTitleA: "SolSentry no seu ",
    heroTitleEm: "agente de IA",
    heroTitleB: ".",
    heroSub:
      "Instale uma vez, consulte para sempre. Sete ferramentas. Funciona no Claude Code, Cursor, Windsurf, Zed ou qualquer coisa que fale Model Context Protocol. Sua IA agora conhece todo operador de rug conhecido na Solana e pode citá-los por wallet.",
    ctaNpm: "npm install →",
    ctaSetup: "Guia de instalação",
    ctaToolRef: "Referência de ferramentas",
    installEyebrow: "Instalação",
    installTitle: "Um comando. Duas linhas de config.",
    claudeLabel: "Claude Code / Claude Desktop",
    claudeAddPre: "Adicione ao ",
    claudeAddMid: " ou ao ",
    claudeAddSuf: " do seu projeto:",
    cursorLabel: "Cursor",
    cursorAddPre: "Adicione ao ",
    cursorAddSuf: " ou nas configurações do workspace:",
    firstUse: "Primeiro uso",
    toolsEyebrow: "7 ferramentas · todas públicas",
    toolsTitle: "O que o MCP expõe",
    toolsSub:
      "Cada ferramenta acessa a API de produção em api.solsentry.app. Dados ao vivo, sem cache além de 30 segundos. Sem chave de API para ferramentas públicas.",
    toolDesc: [
      "Consulta de perfil do operador — flag known, nível de risco, rugs confirmados, total de tokens, taxa de rug, tags.",
      "Análise de token — risco, flags, dev wallet, links de cluster de bots, outcome se resolvido.",
      "Lista ranqueada dos operadores de maior risco por rugs e taxa confirmados.",
      "Alertas HIGH e CRITICAL mais recentes com mint, dev e lista de flags.",
      "Stream de outcomes — quais predições foram validadas e quais falharam.",
      "Rastreamento de fluxo SOL, até 10 hops, com classificações de bridge + CEX.",
      "Contadores globais — total de scans, acurácia, runtime, rugs confirmados.",
    ],
    whyEyebrow: "Por que o MCP importa",
    whyTitle: "Sua IA já tem contexto. Dê inteligência a ela.",
    whySub:
      "Claude, ChatGPT e Cursor já conduzem a maioria dos workflows de desenvolvimento. MCP é como você conecta inteligência on-chain ao vivo neles. O SolSentry fica ao lado de qualquer agente de propósito geral e responde à pergunta que ele não responde sozinho: quem deployou esse token e o que fez da última vez?",
    cards: [
      {
        t: "Para traders",
        d: "Cole uma wallet no Claude, pergunte 'este é um rugger serial?', receba confirmed_rugs + rug_rate + alertas recentes. Sem trocar de aba.",
      },
      {
        t: "Para pesquisadores de segurança",
        d: "Peça ao seu agente para rastrear um drain, depois resuma o caminho de cash-out e sinalize endpoints CEX conhecidos. 10 hops, uma chamada.",
      },
      {
        t: "Para builders",
        d: "Integre inteligência do SolSentry em workflows de code-gen. Seu agente valida o risco do operador antes de sugerir um caminho de swap ou integração de listagem.",
      },
    ],
    troubleEyebrow: "Solução de problemas",
    troubleTitle: "Se a ferramenta não aparecer",
    steps: [
      {
        t: "Reinicie o agente",
        d: "Servidores MCP carregam na inicialização. Reinicie o Claude Code / Cursor após editar o config.",
      },
      {
        t: "Verifique se o Node está disponível",
        d: "{npx} precisa do Node 18+. Rode {npxver} em um terminal para confirmar que o binário instala.",
      },
      {
        t: "Verifique se a API está acessível",
        d: "{curl} deve retornar {ok}. Se não, o MCP vai mostrar um erro de rede na primeira chamada de ferramenta.",
      },
    ],
    step4T: "Ainda travado?",
    step4Pre: "Entre em contato — ",
    step4Mid: " ou ",
    step4Suf: ". O MCP é novo — relatos de bugs são bem-vindos.",
  },
};

const TOOLS = [
  { name: "scan_wallet", args: "wallet: string" },
  { name: "scan_token", args: "mint: string" },
  { name: "top_operators", args: "limit?: number" },
  { name: "recent_alerts", args: "limit?: number" },
  { name: "recent_resolutions", args: "limit?: number" },
  { name: "drain_trace", args: "wallet: string" },
  { name: "network_stats", args: "—" },
];

// Render a step body, substituting {token} placeholders with inline <code>.
function StepBody({ d }: { d: string }) {
  const codeFor: Record<string, React.ReactNode> = {
    npx: <code>npx</code>,
    npxver: <code>npx @solsentry/mcp --version</code>,
    curl: <code>curl https://api.solsentry.app/health</code>,
    ok: <code>200 OK</code>,
  };
  const parts = d.split(/(\{[a-z]+\})/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\{([a-z]+)\}$/);
        return m && codeFor[m[1]] ? <span key={i}>{codeFor[m[1]]}</span> : <span key={i}>{p}</span>;
      })}
    </>
  );
}

export function McpClient() {
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
              <span style={{ color: "var(--brand-amber)" }}>{t.heroTitleEm}</span>
              {t.heroTitleB}
            </>
          }
          sub={<>{t.heroSub}</>}
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <a
              href="https://www.npmjs.com/package/@solsentry/mcp"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              {t.ctaNpm}
            </a>
            <a href="#install" className="btn-ghost">
              {t.ctaSetup}
            </a>
            <a href="#tools" className="btn-ghost">
              {t.ctaToolRef}
            </a>
          </div>
        </PageHeader>

        <Section eyebrow={t.installEyebrow} title={t.installTitle} id="install">
          <div className="grid-2" style={{ alignItems: "start" }}>
            <div>
              <div className="label-tag" style={{ marginBottom: 10 }}>
                {t.claudeLabel}
              </div>
              <p style={{ color: "var(--fg-2)", fontSize: 14, marginBottom: 10, lineHeight: 1.6 }}>
                {t.claudeAddPre}
                <code style={{ color: "var(--brand-amber)" }}>
                  ~/.claude/claude_desktop_config.json
                </code>
                {t.claudeAddMid}
                <code style={{ color: "var(--brand-amber)" }}>.mcp.json</code>
                {t.claudeAddSuf}
              </p>
              <div className="code-block">{CLAUDE_CONFIG}</div>
            </div>
            <div>
              <div className="label-tag" style={{ marginBottom: 10 }}>
                {t.cursorLabel}
              </div>
              <p style={{ color: "var(--fg-2)", fontSize: 14, marginBottom: 10, lineHeight: 1.6 }}>
                {t.cursorAddPre}
                <code style={{ color: "var(--brand-amber)" }}>~/.cursor/mcp.json</code>
                {t.cursorAddSuf}
              </p>
              <div className="code-block">{CURSOR_CONFIG}</div>
            </div>
          </div>

          <div className="panel" style={{ marginTop: 24, borderLeft: "3px solid var(--brand-amber)" }}>
            <div className="label-tag" style={{ color: "var(--brand-amber)", marginBottom: 10 }}>
              {t.firstUse}
            </div>
            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--fg-2)",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {EXAMPLE_PROMPT}
            </pre>
          </div>
        </Section>

        <Section eyebrow={t.toolsEyebrow} title={t.toolsTitle} sub={t.toolsSub} id="tools">
          {TOOLS.map((tool, i) => (
            <div key={tool.name} className="cmd-row">
              <div>
                <code>solsentry.{tool.name}</code>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--fg-3)",
                    marginTop: 4,
                  }}
                >
                  ({tool.args})
                </div>
              </div>
              <div className="desc">{t.toolDesc[i]}</div>
            </div>
          ))}
        </Section>

        <Section eyebrow={t.whyEyebrow} title={t.whyTitle} sub={t.whySub}>
          <div className="grid-3">
            {t.cards.map((c) => (
              <div key={c.t} className="panel panel-hover">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 8 }}>
                  {c.t}
                </h3>
                <p style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.55 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow={t.troubleEyebrow} title={t.troubleTitle}>
          <ol className="step-list">
            {t.steps.map((s) => (
              <li key={s.t}>
                <strong>{s.t}</strong>
                <StepBody d={s.d} />
              </li>
            ))}
            <li>
              <strong>{t.step4T}</strong>
              {t.step4Pre}
              <a href="mailto:hello@solsentry.app">hello@solsentry.app</a>
              {t.step4Mid}
              <a href="https://t.me/solsentryai" target="_blank" rel="noreferrer">
                @solsentryai
              </a>
              {t.step4Suf}
            </li>
          </ol>
        </Section>
      </main>
      <Footer />
    </>
  );
}
