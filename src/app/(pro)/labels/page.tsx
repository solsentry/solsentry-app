import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { LabelsManager } from "@/components/LabelsManager";

export const metadata = {
  title: "Labels — your private wallet tags",
  description:
    "Tag any Solana wallet with a private human-readable label. Stored in your browser. Shows up next to the address on every SolSentry page.",
};

export default function LabelsPage() {
  return (
    <>
      <main>
        <PageHeader
          eyebrow="Labels · private · local"
          title={
            <>
              Replace{" "}
              <span style={{ fontFamily: "var(--font-mono)" }}>
                9mQsY9...L5pH1
              </span>{" "}
              with{" "}
              <span style={{ color: "var(--brand-orange)" }}>
                &quot;suspicious dev #3&quot;
              </span>
              .
            </>
          }
          sub="Nansen calls these Custom Labels. Arkham calls them Private Labels. Same idea: tag any wallet with a name only you see. SolSentry does it too — for free, without a login, using your browser as storage."
        />

        <Section>
          <LabelsManager />
        </Section>

        <Section
          eyebrow="How it integrates"
          title="Labels appear everywhere"
          sub="Once labeled, the alias shows next to the wallet on any SolSentry page — operator pages, leaderboard, drain traces, cluster detail. Only visible to you (labels are loaded from your localStorage)."
        >
          <div className="grid-3">
            {[
              {
                t: "Operator pages",
                d: "Your label renders above the wallet header. If the wallet is also in the global entity registry, both labels show side-by-side.",
              },
              {
                t: "Leaderboard",
                d: "Labels replace the address in the rank list. Makes reviewing known-bad-actor lists much faster.",
              },
              {
                t: "Drain traces",
                d: "Hop destinations show your label when matched, so the flow reads like a story instead of a random string of base58.",
              },
            ].map((c) => (
              <div key={c.t} className="panel">
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
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
