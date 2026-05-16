import Link from "next/link";

export const metadata = {
  title: "SolSentry — Solana threat intel · operator-centric",
  description:
    "Paste a Solana token or wallet. SolSentry shows who's behind it — serial rug operators, bot clusters, drain history. Live mainnet operator threat intelligence.",
};

export default function HomePage() {
  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      <iframe
        src="/references/solsentry-fun.html"
        title="SolSentry — Easy mode"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
          background: "var(--bg)",
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 14,
          left: 16,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(16, 14, 10, 0.78)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          padding: "8px 12px",
          borderRadius: 10,
          border: "1px solid var(--border)",
        }}
      >
        <Link
          href="/about"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "var(--fg-1)",
            textDecoration: "none",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "-0.01em",
          }}
          aria-label="About SolSentry"
        >
          <img
            src="/logo-3d.webp"
            alt=""
            width={24}
            height={24}
            style={{ display: "block", borderRadius: 4 }}
          />
          SolSentry
        </Link>
      </div>

      <div
        style={{
          position: "fixed",
          top: 14,
          right: 16,
          zIndex: 10,
          display: "flex",
          gap: 8,
          background: "rgba(16, 14, 10, 0.78)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          padding: 6,
          borderRadius: 10,
          border: "1px solid var(--border)",
        }}
      >
        <Link
          href="/about"
          style={{
            padding: "6px 10px",
            color: "var(--fg-2)",
            textDecoration: "none",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            borderRadius: 6,
          }}
        >
          About
        </Link>
        <Link
          href="/pro"
          style={{
            padding: "6px 12px",
            background: "var(--brand-amber-tint)",
            color: "var(--brand-amber)",
            textDecoration: "none",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            borderRadius: 6,
            border: "1px solid var(--brand-amber-line)",
          }}
        >
          Pro mode →
        </Link>
        <Link
          href="/api"
          style={{
            padding: "6px 12px",
            color: "var(--fg-2)",
            textDecoration: "none",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            borderRadius: 6,
            border: "1px solid var(--border)",
          }}
        >
          Dev mode →
        </Link>
      </div>
    </main>
  );
}
