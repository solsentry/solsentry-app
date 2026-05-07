import { OperatorSearchForm } from "@/components/OperatorSearchForm";

export const metadata = {
  title: "Operator lookup",
  description:
    "Check any Solana wallet against SolSentry's operator history. See confirmed rugs, total tokens deployed, and risk level.",
};

export default function OperatorIndex() {
  return (
    <>
      <main>
        <section className="hero" style={{ padding: "96px 0 48px" }}>
          <div className="container">
            <span className="hero-eyebrow">Operator lookup</span>
            <h1
              className="hero-title"
              style={{ fontSize: "clamp(32px, 5vw, 64px)" }}
            >
              Who deployed this?
            </h1>
            <p className="hero-sub">
              Paste any Solana wallet to see its rug history, total tokens
              deployed, and risk level. Free. No login. Live data from{" "}
              <code style={{ color: "var(--brand-orange)" }}>
                api.solsentry.app
              </code>
              .
            </p>
            <OperatorSearchForm />
            <p className="hero-tagline" style={{ marginTop: 24 }}>
              Try:{" "}
              <a href="/operator/4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1">
                4kxscuteRLQdNiTXA33YYsvywAPNA6DQTifswxjL5pH1
              </a>{" "}
              · 1,968 confirmed rugs
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
