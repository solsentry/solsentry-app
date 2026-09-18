// /dossier/[wallet] — deployer-wallet identity dossier.
//
// The report itself is fetched client-side with the viewer's session cookie
// (DossierClient): /v1/dossier is tier-gated server-side (Free → 403
// dossier_requires_pro, Pro 10/month, B2B unlimited), so a server-component
// fetch would always land on the anonymous 403. The page renders what the
// report carries and says so when it carries nothing: an empty `sources` list
// is shown as an empty report, never dressed up as a clean bill of health.

import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { DossierClient } from "@/components/DossierClient";
import { truncate } from "@/lib/api";
import Link from "next/link";

interface PageProps {
  params: Promise<{ wallet: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { wallet } = await params;
  return {
    title: `Dossier ${truncate(wallet, 6, 4)}`,
    description: `SolSentry identity dossier for ${wallet}: genesis, funders, CEX exits, identity signals.`,
  };
}

export default async function DossierPage({ params }: PageProps) {
  const { wallet } = await params;

  return (
    <>
      <SiteTopbar />
      <main>
        <PageHeader
          eyebrow="Dossier · deployer identity"
          title={
            <>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.55em",
                  color: "var(--brand-amber)",
                  display: "block",
                  wordBreak: "break-all",
                  letterSpacing: 0,
                  marginBottom: 8,
                }}
              >
                {wallet}
              </span>
              Who is behind this wallet
            </>
          }
          sub="Genesis funding, first and second funder, CEX exits and cross-token identity signals, assembled from on-chain history. Every field below is what the report carries — nothing is inferred on this page. Pro feature: 10 dossiers a month."
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <Link href={`/operator/${wallet}`} className="btn-ghost">
              Operator profile →
            </Link>
            <Link href={`/network/${wallet}`} className="btn-ghost">
              Network tree →
            </Link>
            <Link href={`/drain/${wallet}`} className="btn-ghost">
              Trace drain
            </Link>
            <a
              href={`https://api.solsentry.app/v1/dossier/${wallet}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Full JSON ↗
            </a>
          </div>
        </PageHeader>

        <Section>
          <DossierClient wallet={wallet} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
