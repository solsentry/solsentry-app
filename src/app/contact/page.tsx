import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Contact — talk to us",
  description: "Email, X, Telegram, GitHub. Direct lines to the SolSentry team. We answer fast.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Contact · fast response"
          title={
            <>
              Reach us where you <span style={{ color: "var(--brand-orange)" }}>already are</span>.
            </>
          }
          sub="Email is fastest. Telegram is second. We read every message. No bots on our end — the founder answers."
        />

        <Section>
          <div className="grid-2">
            <div className="panel" style={{ padding: 32 }}>
              <div className="label-tag" style={{ marginBottom: 12 }}>
                Email
              </div>
              <a
                href="mailto:hello@solsentry.app"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 24,
                  color: "var(--brand-orange)",
                  display: "block",
                }}
              >
                hello@solsentry.app
              </a>
              <p style={{ color: "var(--fg-2)", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
                Partnership inquiries, bug reports, false-positive disputes, enterprise integration —
                everything goes here. Response time: under 24 hours on business days.
              </p>
            </div>

            <div className="panel" style={{ padding: 32 }}>
              <div className="label-tag" style={{ marginBottom: 12 }}>
                Telegram
              </div>
              <a
                href="https://t.me/solsentryai"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 24,
                  color: "var(--brand-orange)",
                  display: "block",
                }}
              >
                @solsentryai
              </a>
              <p style={{ color: "var(--fg-2)", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
                Use the bot for scans. DM the founder for anything else. Response time: fast during Brazil
                business hours.
              </p>
            </div>

            <div className="panel" style={{ padding: 32 }}>
              <div className="label-tag" style={{ marginBottom: 12 }}>
                X / Twitter
              </div>
              <a
                href="https://x.com/solsentryai"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 24,
                  color: "var(--brand-orange)",
                  display: "block",
                }}
              >
                @solsentryai
              </a>
              <p style={{ color: "var(--fg-2)", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
                Product updates, weekly traction numbers, threat-intel call-outs. DM open.
              </p>
            </div>

            <div className="panel" style={{ padding: 32 }}>
              <div className="label-tag" style={{ marginBottom: 12 }}>
                GitHub
              </div>
              <a
                href="https://github.com/solsentry"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 24,
                  color: "var(--brand-orange)",
                  display: "block",
                }}
              >
                github.com/solsentry
              </a>
              <p style={{ color: "var(--fg-2)", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
                Public repos:{" "}
                <a href="https://github.com/solsentry/solsentry-mcp" target="_blank" rel="noreferrer">
                  solsentry-mcp
                </a>
                ,{" "}
                <a href="https://github.com/solsentry/solsentry-app" target="_blank" rel="noreferrer">
                  solsentry-app
                </a>
                ,{" "}
                <a href="https://github.com/solsentry/solsentry-docs" target="_blank" rel="noreferrer">
                  solsentry-docs
                </a>
                . Issues welcome.
              </p>
            </div>
          </div>
        </Section>

        <Section
          eyebrow="Context"
          title="Who we are"
        >
          <div className="panel" style={{ borderLeft: "3px solid var(--brand-orange)" }}>
            <p style={{ color: "var(--fg-2)", fontSize: 15, lineHeight: 1.8 }}>
              SolSentry is built by <strong style={{ color: "var(--fg-1)" }}>Crash Diniz</strong>, solo,
              based in São Paulo, Brazil. Started learning Python a year before Colosseum 2026. Shipped the
              system to mainnet in ~60 days. Every line of code, every API endpoint, every alert payload —
              one person, public work, verifiable commits.
            </p>
            <p style={{ color: "var(--fg-2)", fontSize: 15, lineHeight: 1.8, marginTop: 16 }}>
              If you are a partner, investor, security team, or a judge — we actively want to hear from you.
              This page exists because we want that conversation to start, not because it&rsquo;s boilerplate.
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
