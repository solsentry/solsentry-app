import Link from "next/link";
import { ProShell } from "@/components/ProShell";

export const metadata = {
  title: "Casos — Investigações forenses on-chain | SolSentry",
  description:
    "Investigações forenses publicadas pela SolSentry. Cada caso é reproduzível via API pública, com dados live e trilha de auditoria.",
};

interface CaseCard {
  slug: string;
  href: string;
  title: string;
  kicker: string;
  readingTime: string;
  date: string;
  status: "live" | "soon";
  accent: string;
}

const CASES: CaseCard[] = [
  {
    slug: "4kxscute",
    href: "/casos/4kxscute",
    title: "1 operador. 3.212 tokens. 2.953 rugs em 14 dias.",
    kicker:
      "Um único wallet observado ao vivo na mainnet, 40 dias de cobertura, taxa de rug de 96,7%. Cada mint auditável.",
    readingTime: "8 min de leitura",
    date: "2026-05-18",
    status: "live",
    accent: "#C17D0E",
  },
  {
    slug: "foundation-watch",
    href: "/casos",
    title: "Foundation watch",
    kicker:
      "Monitoramento contínuo de carteiras de fundações e disbursements de grants públicos. Em breve.",
    readingTime: "—",
    date: "TBD",
    status: "soon",
    accent: "#2A7A7A",
  },
];

function Thumbnail({ accent, status }: { accent: string; status: "live" | "soon" }) {
  const safeId = accent.replace("#", "");
  return (
    <div
      aria-hidden
      style={{
        width: "100%",
        height: 160,
        background: "var(--bg-elev-1)",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg viewBox="0 0 320 160" preserveAspectRatio="none" width="100%" height="100%">
        <defs>
          <linearGradient id={`grad-${safeId}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity={status === "live" ? 0.22 : 0.08} />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
          <pattern id={`grid-${safeId}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <path
              d="M 16 0 L 0 0 0 16"
              fill="none"
              stroke={accent}
              strokeOpacity="0.08"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="320" height="160" fill={`url(#grid-${safeId})`} />
        <rect width="320" height="160" fill={`url(#grad-${safeId})`} />
        <circle cx="80" cy="80" r="6" fill={accent} opacity={status === "live" ? 0.9 : 0.3} />
        <line x1="80" y1="80" x2="180" y2="56" stroke={accent} strokeOpacity="0.5" />
        <line x1="80" y1="80" x2="200" y2="100" stroke={accent} strokeOpacity="0.5" />
        <line x1="80" y1="80" x2="160" y2="120" stroke={accent} strokeOpacity="0.5" />
        <circle cx="180" cy="56" r="3" fill={accent} opacity="0.8" />
        <circle cx="200" cy="100" r="3" fill={accent} opacity="0.8" />
        <circle cx="160" cy="120" r="3" fill={accent} opacity="0.8" />
      </svg>
      {status === "soon" && (
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--fg-3)",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            padding: "3px 8px",
          }}
        >
          em breve
        </span>
      )}
    </div>
  );
}

function Card({ c }: { c: CaseCard }) {
  const isSoon = c.status === "soon";
  const inner = (
    <article
      style={{
        border: "1px solid var(--border)",
        background: "var(--bg-elev-1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        opacity: isSoon ? 0.6 : 1,
      }}
    >
      <Thumbnail accent={c.accent} status={c.status} />
      <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--fg-3)",
            marginBottom: 12,
            letterSpacing: "0.04em",
          }}
        >
          <span>{c.date}</span>
          <span style={{ color: "var(--fg-4)" }}>·</span>
          <span>{c.readingTime}</span>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.015em",
            color: "var(--fg-1)",
            margin: "0 0 12px",
            lineHeight: 1.25,
          }}
        >
          {c.title}
        </h2>
        <p
          style={{
            color: "var(--fg-2)",
            fontSize: 14,
            lineHeight: 1.55,
            margin: 0,
            flex: 1,
          }}
        >
          {c.kicker}
        </p>
        {!isSoon && (
          <div
            style={{
              marginTop: 16,
              color: "var(--brand-amber)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              borderTop: "1px solid var(--border-soft)",
              paddingTop: 12,
            }}
          >
            Ler caso →
          </div>
        )}
      </div>
    </article>
  );
  if (isSoon) return inner;
  return (
    <Link href={c.href} style={{ textDecoration: "none", color: "inherit" }}>
      {inner}
    </Link>
  );
}

export default function CasosIndex() {
  return (
    <ProShell>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <header style={{ marginBottom: 32 }}>
          <span
            className="eyebrow"
            style={{
              color: "var(--brand-amber)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            SolSentry · evidências
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--fg-1)",
              margin: "10px 0 14px",
            }}
          >
            Casos
          </h1>
          <p
            style={{
              color: "var(--fg-2)",
              fontSize: 17,
              lineHeight: 1.55,
              maxWidth: 680,
              margin: 0,
            }}
          >
            Investigações forenses on-chain. Cada caso é reproduzível via API pública — dados live,
            trilha de auditoria, sem caixa-preta.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {CASES.map((c) => (
            <Card key={c.slug} c={c} />
          ))}
        </div>
      </div>
    </ProShell>
  );
}
