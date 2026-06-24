import Link from "next/link";
import { ProShell } from "@/components/ProShell";
import {
  ForensicReport,
  ReportHero,
  ReportSection,
  VerdictBox,
  Mono,
  CodeBlock,
} from "@/components/casos/ForensicReport";

export const metadata = {
  title: "Caso 4kxscute — operador serial | SolSentry",
  description:
    "Investigação forense de um operador serial observado live na mainnet Solana. Cada mint auditável via API pública.",
  // Holding noindex pending Crash "go" on 4kxscute-as-public-hero (product
  // gate, MASTER §4) + live re-check of operator-level numbers (LOCK-01;
  // hardcoded 3.212/2.953/96,7% are stale per CLAUDE.local.md). Reversible.
  robots: { index: false, follow: false },
};

const WALLET = "4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.solsentry.app";

interface OperatorPayload {
  wallet: string;
  known: boolean;
  operator_id?: string;
  risk_level?: string;
  risk_score?: number;
  total_tokens?: number;
  confirmed_rugs?: number;
  confirmed_safe?: number;
  pending?: number;
  rug_rate_pct?: number;
  tags?: string[];
  patterns?: string[];
}

async function fetchOperator(): Promise<OperatorPayload | null> {
  try {
    const res = await fetch(`${API}/v1/operator/${WALLET}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as OperatorPayload;
  } catch {
    return null;
  }
}

function fmt(n: number | undefined): string {
  if (n === undefined || n === null) return "—";
  return n.toLocaleString("pt-BR");
}

function LiveOperatorCard({ data }: { data: OperatorPayload | null }) {
  if (!data || !data.known) {
    return (
      <div
        style={{
          border: "1px solid var(--border)",
          background: "var(--bg-elev-1)",
          padding: 20,
          margin: "24px 0",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "var(--fg-3)",
        }}
      >
        Live data unavailable (snapshot only). Tente novamente em alguns minutos ou consulte{" "}
        <Mono>{`GET ${API}/v1/operator/${WALLET}`}</Mono>.
      </div>
    );
  }
  const stats: Array<[string, string]> = [
    ["total_tokens", fmt(data.total_tokens)],
    ["confirmed_rugs", fmt(data.confirmed_rugs)],
    ["rug_rate_pct", `${data.rug_rate_pct ?? "—"}%`],
    ["pending", fmt(data.pending)],
    ["risk_level", data.risk_level ?? "—"],
    ["operator_id", data.operator_id ?? "—"],
  ];
  return (
    <div
      style={{
        border: "1px solid var(--brand-amber)",
        borderLeftWidth: 4,
        background: "var(--bg-elev-1)",
        padding: 20,
        margin: "28px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--brand-amber)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Live · {API.replace(/^https?:\/\//, "")}/v1/operator
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--fg-4)",
          }}
        >
          cache: 5 min
        </div>
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--fg-3)",
          marginBottom: 16,
          wordBreak: "break-all",
        }}
      >
        {WALLET}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
        }}
      >
        {stats.map(([k, v]) => (
          <div key={k}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--fg-3)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 4,
              }}
            >
              {k}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--fg-1)",
              }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
      {data.tags && data.tags.length > 0 && (
        <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {data.tags.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                background: "var(--brand-amber-tint)",
                border: "1px solid var(--brand-amber-line)",
                color: "var(--brand-amber)",
                padding: "3px 8px",
                borderRadius: 2,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: Array<string[]> }) {
  return (
    <div style={{ overflowX: "auto", margin: "20px 0" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
        }}
      >
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  borderBottom: "1px solid var(--border-strong)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--fg-3)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid var(--border-soft)",
                    color: j === 0 ? "var(--fg-3)" : "var(--fg-1)",
                    fontFamily: j === 0 ? "var(--font-mono)" : "inherit",
                    fontSize: j === 0 ? 12 : 14,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function Case4kxscutePage() {
  const live = await fetchOperator();

  return (
    <ProShell>
      <ReportHero
        eyebrow="Caso · investigação forense · evidência live"
        title="1 operador. 3.212 tokens. 2.953 rugs em 14 dias."
        byline="SolSentry"
        readingTime="8 min de leitura"
        date="2026-05-18"
      />

      <ForensicReport>
        <p
          style={{
            fontSize: 19,
            lineHeight: 1.65,
            color: "var(--fg-1)",
            marginTop: 0,
            marginBottom: 32,
          }}
        >
          Um único wallet Solana, observado ao vivo na mainnet por 40 dias, deployou mais de 3.200
          tokens e ruggou aproximadamente 97% deles. Este caso documenta como o SolSentry capturou
          cada mint em tempo real, atribuiu ao mesmo <Mono>operator_id</Mono>, e tornou toda a
          trilha auditável via uma chamada de API pública.
        </p>

        <ReportSection number="1" title="Como descobrimos">
          <p>
            O SolSentry mantém um extrator de <Mono>dev_wallet</Mono> que, a cada novo scan, resolve
            a autoridade de deploy de um mint para uma carteira de origem. Quando essa carteira já
            existe no grafo de operadores (<Mono>intelligence.json</Mono>), o mint herda o{" "}
            <Mono>operator_id</Mono> e todo o histórico — incluindo confirmed_rugs anteriores.
          </p>
          <p>
            Em <strong style={{ color: "var(--fg-1)" }}>8 de abril de 2026, 16:27 UTC</strong>, um
            scan rotineiro de um mint recém-deployado resolveu pela primeira vez para o endereço{" "}
            <Mono>{WALLET}</Mono>. A partir desse momento, cada novo deploy desse wallet foi
            capturado em deploy-time — não reconstruído depois.
          </p>
        </ReportSection>

        <ReportSection number="2" title="A wallet">
          <p>
            A carteira sob investigação é única e pública. Não é um cluster, não é uma proxy
            detectada — é um único endereço com uma única chave de assinatura que opera uma pipeline
            de deployment.
          </p>
          <LiveOperatorCard data={live} />
          <p style={{ fontSize: 13, color: "var(--fg-3)" }}>
            Os números acima vêm direto do endpoint live em cache de 5 minutos. Se divergirem do
            texto desta página, o endpoint é a fonte autoritativa.
          </p>
        </ReportSection>

        <ReportSection number="3" title="Os números — janela de 14 dias">
          <p>
            Entre <strong style={{ color: "var(--fg-1)" }}>29 de abril e 13 de maio de 2026</strong>
            , snapshots canônicos da carteira foram registrados no CODEX interno do SolSentry. A
            tabela abaixo mostra a progressão verificável:
          </p>
          <Table
            headers={["Data", "total_tokens", "confirmed_rugs"]}
            rows={[
              ["2026-04-29", "1.768", "1.647"],
              ["2026-05-13", "3.212", "2.953"],
              ["Δ (14 dias)", "+1.444", "+1.306"],
            ]}
          />
          <p>
            A média sustentada foi de aproximadamente{" "}
            <strong style={{ color: "var(--fg-1)" }}>93 rugs por dia</strong>, por 14 dias
            consecutivos, em um único wallet, ao vivo. Não é um pico isolado — é cadência de
            pipeline.
          </p>
        </ReportSection>

        <ReportSection number="4" title="O padrão: fast_deployer + rebrand_artist">
          <p>
            O campo <Mono>tags</Mono> no <Mono>OperatorProfile</Mono> não é cosmético. Cada tag é
            setada por uma regra determinística em{" "}
            <Mono>core/social_graph/operator_profile.py</Mono>:
          </p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 12 }}>
              <strong style={{ color: "var(--fg-1)" }}>fast_deployer</strong> — o operador deploya
              ≥3 tokens em janelas rolantes de 24h, com delta-mediano entre deploys abaixo de 6h.
              Não é uma launch — é uma pipeline. Para este wallet, a cadência média é de
              aproximadamente 80 deploys/dia.
            </li>
            <li>
              <strong style={{ color: "var(--fg-1)" }}>rebrand_artist</strong> — o operador re-usa
              padrões de nome, ticker, ou links sociais (handle no Twitter, link no Telegram,
              fingerprint de descrição) entre mints. Cada novo token é um rebrand cosmético do
              anterior. A tag dispara quando o similarity score de metadata DAS-fetched ultrapassa o
              threshold configurado em ≥10 deployments.
            </li>
          </ul>
          <p>
            Quando o SolSentry escaneia um <em>novo</em> mint e o <Mono>dev_wallet</Mono> resolve
            para este operador, o pipeline de risk aplica um{" "}
            <strong style={{ color: "var(--fg-1)" }}>boost serial-deployer de +25</strong> (
            <Mono>runtime/orchestrator/stage_callback.py</Mono>), empurrando o{" "}
            <Mono>risk_score</Mono> para a banda CRITICAL e disparando o alerta Telegram antes mesmo
            da adição de liquidez. A decisão é operator-graph driven, não token-pattern driven.
          </p>
        </ReportSection>

        <ReportSection number="5" title="Cobertura — onde mora a honestidade">
          <p>
            A extração de <Mono>dev_wallet</Mono> para este wallet começou em{" "}
            <strong style={{ color: "var(--fg-1)" }}>8 de abril de 2026 16:27 UTC</strong>. Esse é o
            primeiro match verificável em tempo real. Tudo antes desse timestamp é <em>backfill</em>{" "}
            — reconstruído retroativamente via forensics on-chain (Helius Enhanced TX walkback).
          </p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>
              <strong style={{ color: "var(--fg-1)" }}>Backfill pré-cobertura:</strong> ~887 tokens
              atribuídos a esta carteira.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong style={{ color: "var(--fg-1)" }}>Confiabilidade:</strong> alta para os ~250
              tokens mais recentes antes de 8/abr; decai progressivamente conforme o walkback recua
              (cache de RPC eviction, fetches de metadata degradam, atribuição de liquidity-pool
              joins fica mais difícil).
            </li>
            <li>
              <strong style={{ color: "var(--fg-1)" }}>O que defendemos:</strong> a janela live de
              40 dias a partir de 8 de abril, onde cada deployment foi capturado em deploy-time, não
              reconstruído.
            </li>
          </ul>
          <p>
            Esta nota está aqui antes do due-diligence dos investidores chegar nela. O caso se
            sustenta na cobertura live, não no prólogo de backfill.
          </p>
        </ReportSection>

        <ReportSection number="6" title="Conclusão">
          <VerdictBox>
            <strong style={{ color: "var(--fg-1)", display: "block", marginBottom: 8 }}>
              Veredicto
            </strong>
            Um wallet. Mais de 3.000 rugs confirmados. Indexados em tempo real. Cada mint auditável
            via <Mono>/v1/predictions/{`{mint}`}</Mono>. Cada novo deploy desse wallet entra no risk
            pipeline como CRITICAL antes da adição de liquidez, por herança via grafo de operadores
            — não por re-análise de padrão de token.
            <br />
            <br />
            <span style={{ color: "var(--fg-2)" }}>
              É a camada que Chainalysis não tem, que RugCheck não tem, que integrity.molt não tem,
              e que Helius Orb não tem. É a camada que o SolSentry foi construído para ser.
            </span>
          </VerdictBox>
        </ReportSection>

        <ReportSection number="7" title="Como verificar você mesmo">
          <p>Três comandos. Sem credenciais. Tudo público.</p>
          <CodeBlock>{`# 1. Snapshot live do operador
curl -s ${API}/v1/operator/${WALLET} | jq

# 2. Contexto sistêmico (runtime, accuracy, total predictions)
curl -s ${API}/v1/stats | jq '{runtime_hours, total_predictions, accuracy_pct, resolve_rate_pct}'

# 3. Qualquer mint suspeito deployado por este operador
curl -s ${API}/v1/predictions/{mint} | jq`}</CodeBlock>
          <p>Ou via MCP:</p>
          <CodeBlock>{`npm i -g @solsentry/mcp
# Depois, em qualquer agente MCP-compatível:
operator_lookup wallet="${WALLET}"`}</CodeBlock>
        </ReportSection>

        <div
          style={{
            margin: "48px 0 32px",
            textAlign: "center",
            borderTop: "1px solid var(--border)",
            paddingTop: 32,
          }}
        >
          <Link
            href={`/operator/${WALLET}`}
            style={{
              display: "inline-block",
              padding: "12px 24px",
              border: "1px solid var(--brand-amber)",
              color: "var(--brand-amber)",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Investigar você mesmo →
          </Link>
          <div
            style={{
              marginTop: 16,
              fontSize: 12,
              color: "var(--fg-3)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <Link href="/casos" style={{ color: "var(--fg-3)", textDecoration: "underline" }}>
              ← voltar para todos os casos
            </Link>
          </div>
        </div>
      </ForensicReport>
    </ProShell>
  );
}
