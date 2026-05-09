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
              <Link href="/fun" className="btn-primary">
                Open Fun mode →
              </Link>
              <Link href="/telegram" className="btn-ghost">
                Try the bot
              </Link>
              <Link href="/mcp" className="btn-ghost">
                MCP server
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
