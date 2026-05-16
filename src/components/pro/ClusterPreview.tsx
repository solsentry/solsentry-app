import Link from "next/link";
import type { Cluster } from "@/lib/api";
import { fmtInt } from "@/lib/api";

export function ClusterPreview({ clusters }: { clusters: Cluster[] }) {
  const top = clusters.slice(0, 6);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 18 }}>
      <MiniGraph count={top.length} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 8,
        }}
      >
        {top.map((c) => (
          <Link
            key={c.cluster_id}
            href={`/clusters/${c.cluster_id}`}
            style={{
              padding: "10px 12px",
              border: "1px solid var(--border-soft)",
              borderRadius: 6,
              background: "var(--bg-elev-1)",
              textDecoration: "none",
              color: "var(--fg-1)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--fg-3)",
                marginBottom: 4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {c.cluster_id}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "var(--fg-1)",
              }}
            >
              {fmtInt(c.size)}
            </div>
            <div
              style={{
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                color: "var(--fg-3)",
              }}
            >
              wallets · {fmtInt(c.associated_rugs ?? 0)} rugs
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MiniGraph({ count }: { count: number }) {
  // Static decorative node-link mock — real graph lives at /clusters/[id]
  const nodes = Array.from({ length: Math.max(count, 4) }, (_, i) => i);
  return (
    <div
      style={{
        border: "1px solid var(--border-soft)",
        borderRadius: 6,
        background: "var(--bg-elev-1)",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--fg-3)",
          letterSpacing: "0.06em",
        }}
      >
        CLUSTER MAP · preview
      </div>
      <svg viewBox="0 0 200 140" style={{ width: "100%", height: 140 }}>
        <g stroke="var(--border)" strokeWidth="1" fill="none" opacity="0.7">
          {nodes.map((i) => {
            const x = 100 + Math.cos((i / nodes.length) * Math.PI * 2) * 50;
            const y = 70 + Math.sin((i / nodes.length) * Math.PI * 2) * 50;
            return <line key={`l-${i}`} x1="100" y1="70" x2={x} y2={y} />;
          })}
        </g>
        <circle cx="100" cy="70" r="5" fill="var(--brand-amber)" />
        {nodes.map((i) => {
          const x = 100 + Math.cos((i / nodes.length) * Math.PI * 2) * 50;
          const y = 70 + Math.sin((i / nodes.length) * Math.PI * 2) * 50;
          return <circle key={`n-${i}`} cx={x} cy={y} r="3" fill="var(--fg-2)" />;
        })}
      </svg>
      <Link
        href="/clusters"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--brand-amber)",
          textDecoration: "none",
        }}
      >
        Open full graph →
      </Link>
    </div>
  );
}
