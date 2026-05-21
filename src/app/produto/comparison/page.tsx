// /produto/comparison — G2/Capterra-style competitor matrix.
// Spec: internal/marketing/strategy/WIREFRAME_v5.md §2.8
// Data: internal/docs/competitive_landscape_2026-05-18.md → app/src/data/comparison-matrix.json
//
// Honest matrix: includes features we lose at (cross-chain, compliance/AML,
// self-hostable, audit services) and is explicit about partial vs full.

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ComparisonMatrix } from "@/components/produto/ComparisonMatrix";
import matrix from "@/data/comparison-matrix.json";

export const metadata = {
  title: "Compare SolSentry — operator intelligence vs token scanners & compliance suites",
  description:
    "Side-by-side comparison of SolSentry against 9 alternatives across 33 features: operator-graph, drain trace, MCP, x402, compliance, cross-chain. Every cell sourced.",
  openGraph: {
    title: "Compare SolSentry",
    description:
      "Operator intelligence vs token-level scanners and compliance suites. 10 products × 33 features, every cell sourced.",
    images: ["/og/og-default.png"],
  },
};

export default function ComparisonPage() {
  const competitorCount = matrix.competitors.length;
  const featureCount = matrix.features.length;
  const updated = matrix.updated;

  return (
    <>
      <Nav />
      <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 24px 80px" }}>
          <header style={{ marginBottom: 28 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--brand-amber)",
                letterSpacing: "0.08em",
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              Produto · Comparison · updated {updated}
            </div>
            <h1
              style={{
                fontSize: 38,
                lineHeight: 1.1,
                fontWeight: 600,
                margin: 0,
                color: "var(--fg-1)",
              }}
            >
              Compare SolSentry
            </h1>
            <p
              style={{
                marginTop: 12,
                color: "var(--fg-2)",
                fontSize: 17,
                maxWidth: 720,
              }}
            >
              Operator intelligence vs token-level scanners and compliance suites.{" "}
              <strong style={{ color: "var(--fg-1)" }}>
                {competitorCount} products × {featureCount} features
              </strong>
              . Every cell links to its source. Honest: we mark partial as ◐ and we include features
              where we lose.
            </p>
          </header>

          <ComparisonMatrix />

          <section style={{ marginTop: 40 }}>
            <h2
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.08em",
                color: "var(--brand-amber)",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Method note
            </h2>
            <div style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6, maxWidth: 820 }}>
              <p style={{ margin: "0 0 12px" }}>
                Cells are based on each product&apos;s public surface as of {updated}: documentation,
                pricing pages, GitHub repos, and public API endpoints. Each verdict links to the
                source consulted. Hover for context.
              </p>
              <p style={{ margin: "0 0 12px" }}>
                <strong style={{ color: "var(--fg-1)" }}>Verdict scale.</strong>{" "}
                <span style={{ color: "var(--brand-amber)" }}>✓</span> = full support and a core
                product feature.{" "}
                <span style={{ color: "var(--fg-2)" }}>◐</span> = partial — limited scope,
                early-stage, or feature exists but is not primary.{" "}
                <span style={{ color: "var(--fg-4)" }}>✗</span> = not supported / explicitly out of
                scope.
              </p>
              <p style={{ margin: "0 0 12px" }}>
                <strong style={{ color: "var(--fg-1)" }}>Honesty disclosure.</strong> SolSentry
                does <em>not</em> ship cross-chain, compliance/AML, audit services, or self-hostable
                — all marked <span style={{ color: "var(--fg-4)" }}>✗</span> on our row. Cross-chain
                is Q3 roadmap. Compliance is explicitly out of scope.
              </p>
              <p style={{ margin: 0 }}>
                Found an error?{" "}
                <a
                  href="https://github.com/solsentry/solsentry-docs/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--brand-amber)" }}
                >
                  Open an issue
                </a>{" "}
                — we update this matrix quarterly.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
