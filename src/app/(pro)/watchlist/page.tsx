import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { WatchlistManager } from "@/components/WatchlistManager";

export const metadata = {
  title: "Watchlist — track wallets across sessions",
  description:
    "Paste wallet addresses. SolSentry polls each one against the operator database and surfaces status. Stored locally in your browser, not on any server.",
};

export default function WatchlistPage() {
  return (
    <>
      <main>
        <PageHeader
          eyebrow="Watchlist · private · local-only"
          title={
            <>
              Track the wallets{" "}
              <span style={{ color: "var(--brand-orange)" }}>
                that matter to you
              </span>
              .
            </>
          }
          sub="Add any Solana wallet. SolSentry checks each one against the live operator database and shows their current state — flagged, clean, or unknown. Your list is stored in your browser's localStorage. Never leaves your machine."
        />

        <Section>
          <WatchlistManager />
        </Section>

        <Section
          eyebrow="Why local-only"
          title="Watchlists are the first thing competitors sell"
          sub="Nansen charges for watchlists. Arkham charges for watchlists. We don't. Add 500 wallets — it's your browser. Export the JSON, move it across machines, or share the link. You own the data."
        >
          <div className="grid-3">
            {[
              {
                t: "No signup",
                d: "You never create an account. No email. No wallet signature. No cookie tracking.",
              },
              {
                t: "No server state",
                d: "Your list is written to localStorage. When you clear the browser, it's gone. Nothing to leak.",
              },
              {
                t: "Portable",
                d: "Export JSON any time. Import on another machine. Or paste it into a Telegram /import command.",
              },
            ].map((c) => (
              <div key={c.t} className="panel">
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    marginBottom: 8,
                  }}
                >
                  {c.t}
                </h3>
                <p
                  style={{
                    color: "var(--fg-2)",
                    fontSize: 14,
                    lineHeight: 1.55,
                  }}
                >
                  {c.d}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </>
  );
}
