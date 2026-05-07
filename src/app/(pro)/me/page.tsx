import { MeProfile } from "@/components/MeProfile";

export const metadata = {
  title: "My profile",
  description:
    "Connect your Solana wallet to see if SolSentry has profiled you as an operator. Self-check for false positives, see your deployment history.",
};

export default function MePage() {
  return (
    <>
      <main>
        <section className="hero" style={{ padding: "80px 0 32px" }}>
          <div className="container">
            <span className="hero-eyebrow">Self-check · wallet</span>
            <h1
              className="hero-title"
              style={{ fontSize: "clamp(32px, 5vw, 64px)" }}
            >
              Are you flagged?
            </h1>
            <p className="hero-sub">
              Connect your Solana wallet to see if SolSentry has profiled it as
              an operator. Useful for devs verifying their own deployer wallet,
              or checking false-positive risk before launching a token.
            </p>
          </div>
        </section>

        <section style={{ padding: "0 0 80px" }}>
          <div className="container">
            <MeProfile />
          </div>
        </section>
      </main>
    </>
  );
}
