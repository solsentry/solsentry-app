import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { DrainSearchForm } from "@/components/DrainSearchForm";

export const metadata = {
  title: "Drain tracer — follow SOL through 10 hops",
  description: "Paste a wallet, see where the SOL went. 10-hop trace, bridge + CEX detection, final cash-out endpoints. Powers the /drain Telegram command.",
};

export default function DrainPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow="Drain tracer · 10-hop SOL flow"
          title={
            <>
              Where did the <span style={{ color: "var(--brand-orange)" }}>SOL</span> go?
            </>
          }
          sub="Paste any wallet. SolSentry follows up to 10 hops — through bridges, DEXes, and CEX endpoints — and flags whether the funds reached a mixer or a known exchange."
        >
          <DrainSearchForm />
        </PageHeader>

        <Section eyebrow="How the tracer works" title="Graph walk with classification">
          <div className="grid-3">
            {[
              { t: "Hop expansion", d: "Each SOL transfer is a hop. The tracer walks forward from the origin wallet, bounded at 10 hops or a branching limit." },
              { t: "Endpoint classification", d: "Every terminal wallet is classified — CEX deposit, mixer, bridge lock, known operator, or unknown." },
              { t: "Signal summary", d: "Reached CEX or mixer? Total SOL drained? Aggregates surface the intent: cash out, consolidate, or rewash." },
            ].map((c) => (
              <div key={c.t} className="panel">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 8 }}>{c.t}</h3>
                <p style={{ color: "var(--fg-2)", fontSize: 14, lineHeight: 1.55 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
