import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchToken, truncate } from "@/lib/api";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TokenSearchForm } from "@/components/TokenSearchForm";
import { TokenCard } from "@/components/TokenCard";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ mint: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { mint } = await params;
  const truncated = truncate(mint, 6, 4);
  return {
    title: `Token ${truncated}`,
    description: `SolSentry risk profile for Solana token mint ${mint}. Score, flags, deployer, outcome.`,
  };
}

export default async function TokenPage({ params }: PageProps) {
  const { mint } = await params;

  if (mint.length < 32 || mint.length > 44) {
    notFound();
  }

  const token = await fetchToken(mint);

  return (
    <>
      <Nav />
      <main>
        <section className="hero" style={{ padding: "80px 0 32px" }}>
          <div className="container">
            <span className="hero-eyebrow">Token profile</span>
            <h1
              className="hero-title"
              style={{ fontSize: "clamp(20px, 3vw, 32px)", wordBreak: "break-all" }}
            >
              <code style={{ color: "var(--brand-orange)", fontFamily: "var(--font-mono)" }}>
                {mint}
              </code>
            </h1>
          </div>
        </section>

        <section style={{ padding: "0 0 64px" }}>
          <div className="container">
            <TokenCard mint={mint} token={token} />
            {token?.dev_wallet && (
              <p style={{ marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg-3)" }}>
                Deployer: <Link href={`/operator/${token.dev_wallet}`} style={{ color: "var(--brand-orange)" }}>{truncate(token.dev_wallet, 8, 6)}</Link>
              </p>
            )}
          </div>
        </section>

        <section style={{ padding: "32px 0 80px", borderTop: "1px solid var(--border-soft)" }}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: 24, fontSize: 24 }}>
              Check another token
            </h2>
            <TokenSearchForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
