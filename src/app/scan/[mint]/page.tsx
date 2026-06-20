import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Token scan preview — SolSentry",
  description: "Illustrative token scan preview. No live metrics are shown on this route.",
  robots: { index: false, follow: false },
};

export default async function ScanTokenPage({
  params,
}: {
  params: Promise<{ mint: string }>;
}) {
  const { mint } = await params;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fafafa",
        padding: "80px 24px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p style={{ color: "#f59e0b", fontSize: 12, letterSpacing: "0.08em" }}>
          SAMPLE / ILLUSTRATIVE
        </p>
        <h1 style={{ fontSize: 32, margin: "12px 0" }}>Token scan preview</h1>
        <p style={{ color: "#a3a3a3", lineHeight: 1.6 }}>
          This public preview does not display live risk metrics. Use the live token route for
          current API-backed analysis.
        </p>
        <p
          style={{
            color: "#737373",
            fontFamily: "monospace",
            overflowWrap: "anywhere",
            margin: "24px 0",
          }}
        >
          {mint}
        </p>
        <Link href={`/token/${encodeURIComponent(mint)}`} style={{ color: "#f59e0b" }}>
          Open live token analysis →
        </Link>
      </div>
    </main>
  );
}
