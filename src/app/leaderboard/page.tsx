import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { fetchTopOperators, fmtInt, fmtPct, truncate } from "@/lib/api";

export const revalidate = 300;

export const metadata = {
  title: "Leaderboard — Worst serial ruggers",
  description:
    "Live ranking of Solana wallets with the most confirmed rug pull deployments. Updated every 5 minutes from api.solsentry.app.",
};

export default async function LeaderboardPage() {
  const operators = await fetchTopOperators(50);

  return (
    <>
      <Nav />
      <main>
        <section className="hero" style={{ padding: "80px 0 32px" }}>
          <div className="container">
            <span className="hero-eyebrow">Leaderboard · live</span>
            <h1 className="hero-title" style={{ fontSize: "clamp(32px, 5vw, 64px)" }}>
              Worst serial ruggers on Solana
            </h1>
            <p className="hero-sub">
              Wallets ranked by confirmed rug deployments. Click any wallet to inspect
              full operator profile and deployment timeline.
            </p>
          </div>
        </section>

        <section style={{ padding: "0 0 80px" }}>
          <div className="container">
            {operators.length === 0 ? (
              <div className="empty-state">
                Failed to load leaderboard. The API may be temporarily unavailable.
              </div>
            ) : (
              <div className="lb-table">
                <div className="lb-row lb-head">
                  <span>#</span>
                  <span>Wallet</span>
                  <span className="lb-num">Rugs</span>
                  <span className="lb-num">Tokens</span>
                  <span className="lb-num">Rug rate</span>
                  <span>Tags</span>
                </div>
                {operators.map((op) => (
                  <Link key={op.wallet} href={`/operator/${op.wallet}`} className="lb-row">
                    <span className="lb-rank">#{op.rank}</span>
                    <span className="lb-wallet mono">{truncate(op.wallet, 8, 6)}</span>
                    <span className="lb-num lb-rugs">{fmtInt(op.confirmed_rugs)}</span>
                    <span className="lb-num">{fmtInt(op.total_tokens)}</span>
                    <span className="lb-num lb-rate">{fmtPct(op.rug_rate_pct)}</span>
                    <span className="lb-tags">
                      {(op.tags ?? []).slice(0, 3).map((t) => (
                        <span key={t} className="lb-tag">{t}</span>
                      ))}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
