import { fetchStats } from "@/lib/api";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StatsGrid } from "@/components/StatsGrid";
import { CaseStudy } from "@/components/CaseStudy";
import { InstallCarousel } from "@/components/InstallCarousel";

export const revalidate = 60;

export default async function Home() {
  const stats = await fetchStats();

  return (
    <>
      <Nav />
      <main>
        <section className="hero">
          <div className="container">
            <span className="hero-eyebrow">Post-deploy · Solana threat intel</span>
            <h1 className="hero-title">
              What Pyth is to prices,<br />
              <em>SolSentry</em> is to operator risk.
            </h1>
            <p className="hero-sub">
              Real-time threat intelligence on Solana. Detect serial rug pull operators,
              bot clusters, and malicious launches before your users lose funds.
            </p>

            <InstallCarousel />
            <p className="hero-tagline">
              No login. No waiting. MCP server, TypeScript SDK, and Claude skills — same package.
            </p>
          </div>
        </section>

        <StatsGrid stats={stats} />
        <CaseStudy />
      </main>
      <Footer />
    </>
  );
}
