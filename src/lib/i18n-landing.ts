// Lightweight i18n dictionary for the v4 native landing page.
// PT/EN only. Client-side toggle, persisted to localStorage.
//
// Why this lives alone (not a global provider): the landing is the only
// page wired to bilingual copy today. When the next page needs i18n we
// promote this to a real provider. Keeping scope tight on purpose.

export type Lang = "en" | "pt";

export const DEFAULT_LANG: Lang = "en";
export const LANG_STORAGE_KEY = "solsentry-lang";

export interface LandingCopy {
  // nav
  navAbout: string;
  navPro: string;
  navDev: string;

  // hero
  heroEyebrow: string;
  heroTitle: string;
  heroTitleEm: string;
  heroSub: string;
  heroScanPlaceholder: string;
  heroScanCta: string;
  heroTrySample: string;

  // tagline + sub-tagline
  tagline: string;
  taglineSub: string;

  // stats
  statsLabelScans: string;
  statsLabelAccuracy: string;
  statsLabelUptime: string;
  statsLabelOperators: string;
  statsLabelRugs: string;
  statsFootnote: string;
  statsOffline: string;

  // 4 layers
  layersEyebrow: string;
  layersTitle: string;
  layersSub: string;
  layer1Name: string;
  layer1Tag: string;
  layer1Desc: string;
  layer2Name: string;
  layer2Tag: string;
  layer2Desc: string;
  layer3Name: string;
  layer3Tag: string;
  layer3Desc: string;
  layer4Name: string;
  layer4Tag: string;
  layer4Desc: string;

  // how it works
  howEyebrow: string;
  howTitle: string;
  howStep1Title: string;
  howStep1Body: string;
  howStep2Title: string;
  howStep2Body: string;
  howStep3Title: string;
  howStep3Body: string;

  // operator of the day
  opEyebrow: string;
  opTitle: string;
  opSub: string;
  opRugs: string;
  opTokens: string;
  opRate: string;
  opCta: string;
  opUnavailable: string;

  // sena teaser
  senaEyebrow: string;
  senaTitle: string;
  senaSub: string;
  senaSample: string;
  senaCta: string;
  senaHint: string;

  // builder panel
  buildEyebrow: string;
  buildTitle: string;
  buildTgTitle: string;
  buildTgBody: string;
  buildMcpTitle: string;
  buildMcpBody: string;
  buildApiTitle: string;
  buildApiBody: string;
  buildCta: string;

  // trust strip
  trustTitle: string;
  trustOss: string;
  trustAudit: string;
  trustAuditNote: string;
  trustAbout: string;

  // toggles
  toggleLang: string;
  toggleTheme: string;
  themeDark: string;
  themeLight: string;

  // easy homepage (ultra-lean paste-to-scan hero — LandingClient)
  easyEyebrow: string;
  easyTitleA: string;
  easyTitleB: string;
  easyTitleEm: string;
  easySub: string;
  easyPlaceholder: string;
  easyScanCta: string;
  easyEmptyHint: string;
  easyProDev: string;
  sampleOperator: string;
  sampleToken: string;
  sampleDevWallet: string;

  // easy result card
  cardLiveFrom: string;
  cardConfirmedRugs: string;
  cardTokens: string;
  cardRugRate: string;
  cardRiskScore: string;
  cardPending: string;
  cardOutcome: string;
  cardType: string;
  cardKnownAs: string;
  cardSymbol: string;
  cardOperator: string;
  cardDevWallet: string;
  cardScansUsed: string;
  cardRateLimited: string;
  cardFullReport: string;
  cardUnknownBody: string;
  outcomeRug: string;
  outcomeNoRug: string;
  outcomePending: string;
  verdictNotIndex: string;
  verdictInconclusive: string;
  verdictNoRiskFlags: string;
  verdictNoMajorFlags: string;
  verdictNotFlagged: string;

  // closed-beta note (homepage, below the scanner)
  betaNote: string;
  betaFollow: string;
}

export const COPY: Record<Lang, LandingCopy> = {
  en: {
    navAbout: "About",
    navPro: "Pro mode →",
    navDev: "Dev mode →",

    heroEyebrow: "Operator threat intelligence · Solana",
    heroTitle: "Know who's behind the token",
    heroTitleEm: "before you sign.",
    heroSub:
      "Paste a Solana wallet or token mint. SolSentry tells you if the operator behind it has a history of rug pulls — across every token they ever deployed.",
    heroScanPlaceholder: "Paste any Solana wallet — live scan in 50ms",
    heroScanCta: "Scan",
    heroTrySample: "Try",

    tagline: "RugCheck tells you a fire is burning. SolSentry tells you who lit it.",
    taglineSub: "And where they're going next. Operator-centric, not token-centric.",

    statsLabelScans: "Scans · live mainnet",
    statsLabelAccuracy: "Accuracy · resolved",
    statsLabelUptime: "Continuous mainnet",
    statsLabelOperators: "Operators tracked",
    statsLabelRugs: "Confirmed rugs",
    statsFootnote:
      "All numbers live. Refreshed every 60s from api.solsentry.app/v1/stats. Click any cell to audit.",
    statsOffline:
      "Live metrics offline. Try again in a few seconds — the API is rate-limited or restarting.",

    layersEyebrow: "Architecture",
    layersTitle: "Four layers of operator intelligence",
    layersSub:
      "Each layer composes the next. The consumer app sits on top of a social graph that protects builders, agents and protocols underneath.",
    layer1Name: "Consumer app",
    layer1Tag: "Layer 1",
    layer1Desc:
      "Token search · wallet check · drain trace · contract explain. Sena translates risk into human language.",
    layer2Name: "Social graph",
    layer2Tag: "Layer 2",
    layer2Desc:
      "Wallets ↔ ruggers ↔ callers ↔ bot clusters ↔ shill networks. A map of organized crime on Solana.",
    layer3Name: "Ecosystem",
    layer3Tag: "Layer 3",
    layer3Desc:
      "Wallets, DEXes, launchpads consume API and MCP. AI agents verify operators before they execute x402 payments.",
    layer4Name: "Protocol",
    layer4Tag: "Layer 4",
    layer4Desc:
      "ProtocolSentinel watches Drift, Jupiter, Meteora. Detects anomalous operator behavior before the exploit lands.",

    howEyebrow: "How it works",
    howTitle: "30 seconds, three steps",
    howStep1Title: "A token deploys",
    howStep1Body:
      "Anyone can launch a token on Solana. Most of them rug. The deployer wallet is the only persistent unit.",
    howStep2Title: "We check the deployer",
    howStep2Body:
      "SolSentry looks up that wallet in our operator graph — every token it ever deployed, every confirmed rug, every cluster it belongs to.",
    howStep3Title: "Verdict in under 50ms",
    howStep3Body:
      "If the wallet has prior rugs, you get a CRITICAL alert before the buy button is clicked. If it's clean, you also know that — with audit trail.",

    opEyebrow: "Operator of the day",
    opTitle: "The top serial deployer right now",
    opSub:
      "Updates every five minutes. Click through for the full timeline and Sena-narrated investigation.",
    opRugs: "Confirmed rugs",
    opTokens: "Total tokens",
    opRate: "Rug rate",
    opCta: "Investigate operator →",
    opUnavailable: "Top-operator feed temporarily unavailable.",

    senaEyebrow: "Sena · the AI persona",
    senaTitle: "Ask Sena anything about an operator",
    senaSub:
      "Sena is the face of our autonomous brain. She explains risk in plain language — direct, evidence-first, never sensationalized.",
    senaSample:
      "“This operator has 2,898 confirmed rugs across 3,110 tokens. Tags: rebrand_artist, fast_deployer. Want me to show the last five deployments?”",
    senaCta: "Open Sena on a live operator →",
    senaHint: "Free preview — three messages per session before sign-in is required.",

    buildEyebrow: "For builders",
    buildTitle: "Three free entry points",
    buildTgTitle: "Telegram bot",
    buildTgBody: "Drop a wallet or mint in chat. Get a verdict back in seconds. Free.",
    buildMcpTitle: "MCP server",
    buildMcpBody:
      "Zero-install plug-in for AI agents. npx @solsentry/mcp — your agent now checks operators before x402 payouts.",
    buildApiTitle: "REST API",
    buildApiBody:
      "Public endpoints with no auth required. x402-metered for deep tools. Open the docs and try a curl.",
    buildCta: "Open",

    trustTitle: "Trust by design",
    trustOss: "Open-source MCP, docs and Birdeye Radar integration",
    trustAudit: "97.7% CRITICAL precision · 95.6% HIGH precision — auditable per mint",
    trustAuditNote: "Verify any prediction at /v1/predictions/{mint}. No metric is hand-tuned.",
    trustAbout: "Read the full About →",

    toggleLang: "Language",
    toggleTheme: "Theme",
    themeDark: "Dark",
    themeLight: "Light",

    easyEyebrow: "EASY • FREE • INSTANT",
    easyTitleA: "Paste wallet or token.",
    easyTitleB: "See the ",
    easyTitleEm: "risk",
    easySub: "No signup. No wallet connect.",
    easyPlaceholder: "Paste wallet or token (e.g. 4kxscute… or So1111…)",
    easyScanCta: "Scan",
    easyEmptyHint: "Paste any address or click a sample above.",
    easyProDev: "Full history, graphs and alerts live in Pro / Dev.",
    sampleOperator: "Tracked operator",
    sampleToken: "Wrapped SOL",
    sampleDevWallet: "Known dev wallet",

    cardLiveFrom: "LIVE FROM API",
    cardConfirmedRugs: "CONFIRMED RUGS",
    cardTokens: "TOKENS",
    cardRugRate: "RUG RATE",
    cardRiskScore: "RISK SCORE",
    cardPending: "PENDING",
    cardOutcome: "OUTCOME",
    cardType: "TYPE",
    cardKnownAs: "KNOWN AS",
    cardSymbol: "SYMBOL",
    cardOperator: "OPERATOR",
    cardDevWallet: "DEV WALLET",
    cardScansUsed: "scans used",
    cardRateLimited: "rate limited",
    cardFullReport: "Full report →",
    cardUnknownBody:
      "Not in the tracked database, and live analysis returned no signal. This is not a safety verdict.",
    outcomeRug: "rug confirmed",
    outcomeNoRug: "no rug on record",
    outcomePending: "pending",
    verdictNotIndex: "NOT IN INDEX",
    verdictInconclusive: "INCONCLUSIVE",
    verdictNoRiskFlags: "NO RISK FLAGS",
    verdictNoMajorFlags: "NO MAJOR FLAGS",
    verdictNotFlagged: "NOT FLAGGED",

    betaNote: "Closed beta in July. Stay tuned.",
    betaFollow: "Follow",
  },

  pt: {
    navAbout: "Sobre",
    navPro: "Modo Pro →",
    navDev: "Modo Dev →",

    heroEyebrow: "Inteligência de operador · Solana",
    heroTitle: "Saiba quem está do outro lado do token",
    heroTitleEm: "antes de assinar.",
    heroSub:
      "Cole uma carteira ou um mint Solana. O SolSentry diz se o operador por trás dele já fez rug — em todos os tokens que ele já deployou.",
    heroScanPlaceholder: "Cole qualquer wallet Solana — scan em 50ms",
    heroScanCta: "Escanear",
    heroTrySample: "Tente",

    tagline: "O RugCheck te avisa que tem um incêndio. O SolSentry te diz quem ateou fogo.",
    taglineSub: "E pra onde ele tá indo agora. Foco no operador, não no token.",

    statsLabelScans: "Scans · mainnet live",
    statsLabelAccuracy: "Acurácia · resolvido",
    statsLabelUptime: "Mainnet contínuo",
    statsLabelOperators: "Operadores rastreados",
    statsLabelRugs: "Rugs confirmados",
    statsFootnote:
      "Tudo ao vivo. Atualizado a cada 60s a partir de api.solsentry.app/v1/stats. Clique em qualquer célula pra auditar.",
    statsOffline:
      "Métricas ao vivo indisponíveis. Tente em alguns segundos — a API pode estar reiniciando.",

    layersEyebrow: "Arquitetura",
    layersTitle: "Quatro camadas de inteligência de operador",
    layersSub:
      "Cada camada sustenta a seguinte. O app de consumidor está em cima de um social graph que protege builders, agentes e protocolos por baixo.",
    layer1Name: "App de consumidor",
    layer1Tag: "Camada 1",
    layer1Desc:
      "Token search · wallet check · drain trace · contrato explica. A Sena traduz risco pra linguagem humana.",
    layer2Name: "Social graph",
    layer2Tag: "Camada 2",
    layer2Desc:
      "Wallets ↔ ruggers ↔ callers ↔ clusters de bot ↔ redes de shill. O mapa do crime organizado em Solana.",
    layer3Name: "Ecossistema",
    layer3Tag: "Camada 3",
    layer3Desc:
      "Wallets, DEXes, launchpads consomem API e MCP. Agentes de IA verificam operadores antes de executar pagamentos x402.",
    layer4Name: "Protocolo",
    layer4Tag: "Camada 4",
    layer4Desc:
      "ProtocolSentinel monitora Drift, Jupiter, Meteora. Detecta comportamento anômalo do operador antes do exploit.",

    howEyebrow: "Como funciona",
    howTitle: "30 segundos, três passos",
    howStep1Title: "Um token é deployado",
    howStep1Body:
      "Qualquer um pode lançar token em Solana. A maioria dá rug. A wallet do deployer é a única unidade persistente.",
    howStep2Title: "A gente checa o deployer",
    howStep2Body:
      "O SolSentry busca essa wallet no nosso grafo de operador — cada token que já deployou, cada rug confirmado, cada cluster a que pertence.",
    howStep3Title: "Veredito em menos de 50ms",
    howStep3Body:
      "Se a wallet tem rugs anteriores, você recebe alerta CRITICAL antes do botão de compra. Se for clean, você também sabe — com trilha auditável.",

    opEyebrow: "Operador do dia",
    opTitle: "O deployer serial em destaque agora",
    opSub:
      "Atualizado a cada cinco minutos. Clique pra ver o timeline completo + investigação narrada pela Sena.",
    opRugs: "Rugs confirmados",
    opTokens: "Total de tokens",
    opRate: "Taxa de rug",
    opCta: "Investigar operador →",
    opUnavailable: "Feed do top-operator temporariamente indisponível.",

    senaEyebrow: "Sena · a IA do SolSentry",
    senaTitle: "Pergunte qualquer coisa à Sena sobre um operador",
    senaSub:
      "A Sena é a face do nosso cérebro autônomo. Explica risco em linguagem direta — baseada em dados, sem sensacionalismo.",
    senaSample:
      "“Esse operador tem 2.898 rugs confirmados em 3.110 tokens. Tags: rebrand_artist, fast_deployer. Quer que eu mostre os últimos cinco deploys?”",
    senaCta: "Abrir Sena num operador ao vivo →",
    senaHint: "Preview gratuito — três mensagens por sessão antes do login.",

    buildEyebrow: "Para builders",
    buildTitle: "Três pontos de entrada gratuitos",
    buildTgTitle: "Bot do Telegram",
    buildTgBody: "Cole uma wallet ou mint no chat. Veredito em segundos. De graça.",
    buildMcpTitle: "Servidor MCP",
    buildMcpBody:
      "Plug-in zero-install pra agentes de IA. npx @solsentry/mcp — seu agente passa a checar operador antes de pagar via x402.",
    buildApiTitle: "API REST",
    buildApiBody:
      "Endpoints públicos sem autenticação. x402-metered nas tools mais pesadas. Abra os docs e teste um curl.",
    buildCta: "Abrir",

    trustTitle: "Confiança por design",
    trustOss: "MCP, docs e integração Birdeye Radar — tudo open-source",
    trustAudit: "97,7% de precisão em CRITICAL · 95,6% em HIGH — auditável por mint",
    trustAuditNote:
      "Verifique qualquer predição em /v1/predictions/{mint}. Nenhuma métrica é ajustada manualmente.",
    trustAbout: "Ler o Sobre completo →",

    toggleLang: "Idioma",
    toggleTheme: "Tema",
    themeDark: "Escuro",
    themeLight: "Claro",

    easyEyebrow: "FÁCIL • GRÁTIS • NA HORA",
    easyTitleA: "Cole a wallet ou o token.",
    easyTitleB: "Veja o ",
    easyTitleEm: "risco",
    easySub: "Sem cadastro. Sem conectar wallet.",
    easyPlaceholder: "Cole wallet ou token (ex.: 4kxscute… ou So1111…)",
    easyScanCta: "Escanear",
    easyEmptyHint: "Cole qualquer endereço ou clique num exemplo acima.",
    easyProDev: "Histórico completo, gráficos e alertas no Pro / Dev.",
    sampleOperator: "Operador rastreado",
    sampleToken: "Wrapped SOL",
    sampleDevWallet: "Dev wallet conhecida",

    cardLiveFrom: "AO VIVO DA API",
    cardConfirmedRugs: "RUGS CONFIRMADOS",
    cardTokens: "TOKENS",
    cardRugRate: "TAXA DE RUG",
    cardRiskScore: "ÍNDICE DE RISCO",
    cardPending: "PENDENTES",
    cardOutcome: "DESFECHO",
    cardType: "TIPO",
    cardKnownAs: "CONHECIDO COMO",
    cardSymbol: "SÍMBOLO",
    cardOperator: "OPERADOR",
    cardDevWallet: "DEV WALLET",
    cardScansUsed: "scans usados",
    cardRateLimited: "limitado",
    cardFullReport: "Relatório completo →",
    cardUnknownBody:
      "Fora da base rastreada, e a análise ao vivo não retornou sinal. Isto não é um veredito de segurança.",
    outcomeRug: "rug confirmado",
    outcomeNoRug: "sem rug no registro",
    outcomePending: "pendente",
    verdictNotIndex: "FORA DO ÍNDICE",
    verdictInconclusive: "INCONCLUSIVO",
    verdictNoRiskFlags: "SEM FLAGS DE RISCO",
    verdictNoMajorFlags: "SEM FLAGS RELEVANTES",
    verdictNotFlagged: "NÃO SINALIZADO",

    betaNote: "Closed beta em julho. Fica ligado.",
    betaFollow: "Acompanhe",
  },
};

export function detectLang(stored: string | null): Lang {
  // A saved preference always wins.
  if (stored === "pt" || stored === "en") return stored;
  // No preference yet — fall back to the browser's language (pt-* → PT).
  if (typeof navigator !== "undefined" && typeof navigator.language === "string") {
    if (navigator.language.toLowerCase().startsWith("pt")) return "pt";
  }
  return DEFAULT_LANG;
}
