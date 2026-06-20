import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not public — SolSentry",
  description: "This page is not publicly available.",
  robots: { index: false, follow: false },
};

export default function PrivateCasePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "var(--bg)",
        color: "var(--fg-1)",
      }}
    >
      <div style={{ maxWidth: 560, textAlign: "center" }}>
        <p className="eyebrow">NOT PUBLIC</p>
        <h1 style={{ fontFamily: "var(--font-display)", marginBottom: 12 }}>
          This investigation is not publicly available.
        </h1>
        <p style={{ color: "var(--fg-2)", lineHeight: 1.6, marginBottom: 24 }}>
          Return to the published investigations index.
        </p>
        <Link href="/casos" className="btn-ghost">
          View public investigations →
        </Link>
      </div>
    </main>
  );
}
