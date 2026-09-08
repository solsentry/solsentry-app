import Link from "next/link";
import { truncate } from "@/lib/api";

interface Props {
  addr: string;
  href?: string;
  external?: boolean;
  head?: number;
  tail?: number;
}

const KNOWN_ENTITIES: Record<string, { label: string; type: "dex" | "bot" | "cex" }> = {
  "5Q544fKrCoeuSWeuXJ3wYxyH1m7dGk6vW22BvQ7u1eFw": { label: "Raydium Auth V4", type: "dex" },
  "6EF8rrecthR5Dkzon8Nwu78hRvfM2FqPjR1q5f9u2hC": { label: "Pump.fun", type: "dex" },
  "JUP5cG": { label: "Jupiter Worker", type: "bot" },
  "Binance1": { label: "Binance Hot Wallet", type: "cex" },
};

function resolveEntity(addr: string) {
  if (addr.endsWith(".sol")) {
    return { label: addr, type: "sns" };
  }
  for (const [key, val] of Object.entries(KNOWN_ENTITIES)) {
    if (addr.includes(key)) return val;
  }
  return null;
}

export function AddrLink({ addr, href, external = false, head = 6, tail = 4 }: Props) {
  const target = href ?? `/lookup?addr=${addr}`;
  let text = truncate(addr, head, tail);
  
  const entity = resolveEntity(addr);
  if (entity) {
    text = entity.label;
  }

  const linkStyle = {
    fontFamily: "var(--font-mono)",
    color: "var(--brand-amber)",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  };

  const badge = entity && entity.type !== "sns" ? (
    <span style={{ 
      fontSize: 9, 
      padding: "1px 4px", 
      background: "var(--surface-2)", 
      border: "1px solid var(--border)",
      borderRadius: 4,
      color: "var(--fg-2)"
    }}>
      {entity.type.toUpperCase()}
    </span>
  ) : null;

  if (external) {
    return (
      <a href={target} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        {text}
        {badge}
      </a>
    );
  }

  return (
    <Link href={target} style={linkStyle}>
      {text}
      {badge}
    </Link>
  );
}
