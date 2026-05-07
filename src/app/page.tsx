import { fetchStats } from "@/lib/api";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StatsGrid } from "@/components/StatsGrid";
import { CaseStudy } from "@/components/CaseStudy";
import { InstallCarousel } from "@/components/InstallCarousel";
import { PillarGrid } from "@/components/PillarGrid";
import { FeatureSurface } from "@/components/FeatureSurface";
import { HeroScan } from "@/components/HeroScan";
import Link from "next/link";

export const revalidate = 60;

export default async function Home() {
  const stats = await fetchStats();

  return (
    <>
      <Nav />
      <main>
        <section className="hero">
          <div className="container">
            <span className="hero-eyebrow">
              Solana security intelligence · operator-centric
            </span>
            <h1 className="hero-title">
              RugCheck tells you a fire is burning.
              <br />
              <em>SolSentry</em> tells you who lit it.
            </h1>
            <p className="hero-sub">
              Autonomous threat intelligence for Solana. Detects serial rug
              operators, bot clusters, and malicious launches before your users
              lose funds. 559+ hours continuous mainnet. 87.5% accuracy. Zero
              confirmed false positives at CRITICAL risk.
            </p>

            <HeroScan />

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 28,
                flexWrap: "wrap",
              }}
            >
              <Link href="/telegram" className="btn-primary">
                Try the bot →
              </Link>
              <Link href="/compare" className="btn-ghost">
                How it compares
              </Link>
              <Link href="/partners" className="btn-ghost">
                For partners
              </Link>
            </div>

            <div style={{ marginTop: 40 }}>
              <InstallCarousel />
              <p className="hero-tagline">
                Telegram bot · REST API · MCP server — same intelligence layer.
              </p>
            </div>
          </div>
        </section>

        <StatsGrid stats={stats} />
        <PillarGrid />
        <CaseStudy />
        <FeatureSurface />
      </main>
      <Footer />
    </>
  );
}
