import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TokenSearchForm } from "@/components/TokenSearchForm";

export const metadata = {
  title: "Token risk lookup",
  description:
    "Check any Solana token mint against SolSentry's risk scoring. See flags, deployer history, and outcome verdict.",
};

export default function TokenIndex() {
  return (
    <>
      <Nav />
      <main>
        <section className="hero" style={{ padding: "96px 0 48px" }}>
          <div className="container">
            <span className="hero-eyebrow">Token lookup</span>
            <h1 className="hero-title" style={{ fontSize: "clamp(32px, 5vw, 64px)" }}>
              Is this token a rug?
            </h1>
            <p className="hero-sub">
              Paste any Solana mint address to see its risk score, flags, deployer
              history, and current outcome verdict. Free. No login.
            </p>
            <TokenSearchForm />
            <p className="hero-tagline" style={{ marginTop: 24 }}>
              Try:{" "}
              <a href="/token/So11111111111111111111111111111111111111112">
                wSOL
              </a>{" "}
              · CLEAN · score 10/100
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
