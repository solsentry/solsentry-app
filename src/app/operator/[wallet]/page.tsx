import { notFound } from "next/navigation";
import { fetchOperator } from "@/lib/api";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { OperatorSearchForm } from "@/components/OperatorSearchForm";
import { RiskCard } from "@/components/RiskCard";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ wallet: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { wallet } = await params;
  const truncated = `${wallet.slice(0, 6)}…${wallet.slice(-4)}`;
  return {
    title: `Operator ${truncated}`,
    description: `SolSentry risk profile for Solana operator ${wallet}. Confirmed rugs, total tokens, risk level.`,
  };
}

export default async function OperatorPage({ params }: PageProps) {
  const { wallet } = await params;

  if (wallet.length < 32 || wallet.length > 44) {
    notFound();
  }

  const operator = await fetchOperator(wallet);

  return (
    <>
      <Nav />
      <main>
        <section className="hero" style={{ padding: "80px 0 32px" }}>
          <div className="container">
            <span className="hero-eyebrow">Operator profile</span>
            <h1
              className="hero-title"
              style={{
                fontSize: "clamp(20px, 3vw, 32px)",
                wordBreak: "break-all",
              }}
            >
              <code
                style={{
                  color: "var(--brand-orange)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {wallet}
              </code>
            </h1>
          </div>
        </section>

        <section style={{ padding: "0 0 64px" }}>
          <div className="container">
            <RiskCard wallet={wallet} operator={operator} />
          </div>
        </section>

        <section
          style={{
            padding: "32px 0 80px",
            borderTop: "1px solid var(--border-soft)",
          }}
        >
          <div className="container">
            <h2
              className="section-title"
              style={{ marginBottom: 24, fontSize: 24 }}
            >
              Check another operator
            </h2>
            <OperatorSearchForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
