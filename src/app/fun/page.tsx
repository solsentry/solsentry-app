import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Fun mode — is this wallet safe?",
  description:
    "Paste a Solana wallet or token. Get an emoji + plain-English verdict in seconds. Three modes — Easy, Pro, Dev — share one API. Consumer-facing entry point.",
};

export default function FunPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Fun mode · consumer-facing"
          title={
            <>
              Is this wallet{" "}
              <span style={{ color: "var(--brand-amber)" }}>safe</span>?
            </>
          }
          sub={
            <>
              Easy mode: paste an address, see emoji + plain-English verdict.
              Three modes — Easy, Pro (dashboard), Dev (endpoints + code) —
              switcher in the bottom-left of the app. Same intelligence layer as
              the Telegram bot and REST API, different persona.
            </>
          }
        >
          <div
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}
          >
            <a
              href="/references/solsentry-fun.html"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Open fullscreen →
            </a>
            <a href="/telegram" className="btn-ghost">
              Prefer Telegram? →
            </a>
          </div>
        </PageHeader>

        <Section>
          <div
            className="panel"
            style={{
              padding: 0,
              overflow: "hidden",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <iframe
              src="/references/solsentry-fun.html"
              title="SolSentry — fun mode"
              style={{
                width: "100%",
                height: "min(900px, 85vh)",
                border: "none",
                display: "block",
                background: "var(--bg)",
              }}
              loading="lazy"
            />
          </div>
          <p
            style={{
              color: "var(--fg-3)",
              fontSize: 12,
              marginTop: 12,
              fontFamily: "var(--font-mono)",
              textAlign: "center",
            }}
          >
            embedded app · live against{" "}
            <a
              href="https://api.solsentry.app/v1/stats"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--brand-amber)" }}
            >
              api.solsentry.app
            </a>{" "}
            · mode switcher sits at the bottom-left of the app
          </p>
        </Section>

        <Section eyebrow="3 modes · 1 API" title="One layout per audience">
          <div className="grid-3">
            {[
              {
                t: "Easy",
                d: "Big emoji, one-line verdict, plain-English explanation. Built for people who have never opened a token scanner before.",
                tag: "Default · consumers",
                color: "var(--brand-amber)",
              },
              {
                t: "Pro",
                d: "Dashboard with a stats bar, top operators, and live alerts. Same data as our internal v2 dashboard, served public.",
                tag: "Traders · analysts",
                color: "var(--brand-teal)",
              },
              {
                t: "Dev",
                d: "Endpoints, curl samples, response shapes. Compact version of /api — for devs who want to integrate in two minutes.",
                tag: "Developers",
                color: "var(--brand-purple)",
              },
            ].map((m) => (
              <div
                key={m.t}
                className="panel"
                style={{ borderTop: `2px solid ${m.color}` }}
              >
                <div
                  style={{
                    color: m.color,
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    marginBottom: 10,
                    textTransform: "uppercase",
                  }}
                >
                  {m.tag}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    marginBottom: 8,
                    color: "var(--fg-1)",
                  }}
                >
                  {m.t} mode
                </h3>
                <p
                  style={{
                    color: "var(--fg-2)",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {m.d}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Why this is on the site"
          title="Consumer surface · judges + investors love this"
          sub="The Telegram bot and REST API are developer-first. The fun mode proves the same intelligence layer also works for end users — no jargon, no wallet connect, just an emoji and a verdict. This is the B2C wedge: wallets, CEX integrations, and consumer apps can embed this mode to make their users safer without asking them to learn operator risk theory."
        >
          <div className="grid-2">
            <div className="panel">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 17,
                  marginBottom: 10,
                }}
              >
                For integrators
              </h3>
              <p
                style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6 }}
              >
                This HTML is embeddable. Drop it in an iframe, set the API base,
                and you have a consumer-grade risk check in any language. Wallet
                apps, trading frontends, and CEX listings can offer it as a
                read-only check.
              </p>
            </div>
            <div className="panel">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 17,
                  marginBottom: 10,
                }}
              >
                For judges + investors
              </h3>
              <p
                style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.6 }}
              >
                Same data, three personas — technical, prosumer, consumer. The
                TAM for operator risk intelligence is not just devs. It&rsquo;s
                every wallet user who has been rugged or knows someone who has.
              </p>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
