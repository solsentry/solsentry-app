import { ProShell } from "@/components/ProShell";
import { fetchX402Stats } from "@/lib/api";

export const revalidate = 120;

export const metadata = {
  title: "x402 ledger — paid threat-intel API",
  description:
    "SolSentry is the first Solana threat-intel API on x402. Pay-per-call USDC payments, no API keys, fully on-chain ledger.",
};

export default async function X402Page() {
  const stats = await fetchX402Stats();

  return (
    <ProShell>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <header style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--brand-amber)",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            X402 · PAYMENT LEDGER
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 32,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--fg-1)",
            }}
          >
            First Solana threat-intel API on x402
          </h1>
          <p style={{ color: "var(--fg-2)", fontSize: 14, marginTop: 6, lineHeight: 1.6 }}>
            x402 is the open standard for pay-per-call HTTP. No API keys, no
            subscriptions — your client signs a USDC payment instruction with
            the request and the response includes the on-chain settlement.
            Every call is a row in this ledger.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <Stat
            label="Total queries"
            value={stats?.total_queries?.toLocaleString() ?? "—"}
            accent="amber"
          />
          <Stat
            label="USDC billed"
            value={stats ? `$${stats.total_usdc_billed.toFixed(2)}` : "—"}
          />
          <Stat
            label="Unique clients"
            value={stats?.unique_clients?.toLocaleString() ?? "—"}
          />
          <Stat
            label="Tools monetized"
            value={
              stats ? Object.keys(stats.by_tool ?? {}).length.toString() : "—"
            }
          />
        </div>

        <div
          style={{
            padding: 20,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--fg-1)",
              marginBottom: 12,
              letterSpacing: "-0.01em",
            }}
          >
            Calls by tool
          </div>
          {!stats || Object.keys(stats.by_tool ?? {}).length === 0 ? (
            <div style={{ color: "var(--fg-3)", fontSize: 13 }}>
              No paid calls yet — try{" "}
              <a
                href="https://api.solsentry.app/v1/x402/stats"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--brand-amber)" }}
              >
                /v1/x402/stats
              </a>
              .
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {Object.entries(stats.by_tool)
                .sort((a, b) => b[1] - a[1])
                .map(([tool, count]) => {
                  const max = Math.max(...Object.values(stats.by_tool));
                  const pct = (count / Math.max(max, 1)) * 100;
                  return (
                    <li
                      key={tool}
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid var(--border-soft)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "var(--fg-1)",
                          }}
                        >
                          {tool}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "var(--brand-amber)",
                            fontWeight: 600,
                          }}
                        >
                          {count.toLocaleString()}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 4,
                          background: "var(--surface-2)",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: "var(--brand-amber)",
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>

        <div
          style={{
            padding: 20,
            background: "var(--brand-amber-tint)",
            border: "1px solid var(--brand-amber-line)",
            borderRadius: 8,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--brand-amber)",
              marginBottom: 8,
              letterSpacing: "-0.01em",
            }}
          >
            How to pay-per-call
          </div>
          <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Set the <code style={{ fontFamily: "var(--font-mono)" }}>X-PAYMENT</code>{" "}
            header to a signed Solana USDC transfer to the SolSentry treasury.
            The endpoint replies with the data + a confirmed signature. ATXP,
            MCPay, and any x402 client work out of the box.
          </p>
          <a
            href="https://api.solsentry.app/v1/x402/stats"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              marginTop: 10,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--brand-amber)",
              textDecoration: "none",
            }}
          >
            Live ledger JSON →
          </a>
        </div>
      </div>
    </ProShell>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "amber";
}) {
  return (
    <div
      style={{
        padding: 14,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 6,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          color: "var(--fg-3)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 26,
          fontWeight: 700,
          color: accent === "amber" ? "var(--brand-amber)" : "var(--fg-1)",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}
