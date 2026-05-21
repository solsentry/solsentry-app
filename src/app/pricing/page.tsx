// /pricing — public pricing page.
// 3 tiers (Free / Pro / B2B) + credit top-up packs + FAQ.
// Spec: internal/marketing/strategy/WIREFRAME_v5.md §2.9
// TODO: switch hardcoded values to /v1/pricing endpoint when backend ships.

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PricingCard } from "@/components/pricing/PricingCard";
import { CreditPackCard } from "@/components/pricing/CreditPackCard";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";

export const metadata = {
  title: "Pricing — Free · Pro $39.99 · B2B",
  description:
    "Pricing simples, transparente, sem token. Free tier, Pro $39.99/mês, B2B contact. Pay-as-you-go credit packs via USDC (x402).",
  openGraph: {
    title: "SolSentry Pricing",
    description:
      "Free · Pro $39.99/mo · B2B contact. Pay-as-you-go credit packs via USDC.",
    images: ["/og/og-default.png"],
  },
};

const FREE_FEATURES = [
  { label: "50 credits / day", included: true },
  { label: "All FREE-class endpoints", included: true },
  { label: "/v1/operator hop-1 preview", included: true },
  { label: "Drain-trace: 1/day", included: true },
  { label: "AI search: 1 query/day", included: true },
  { label: "Deep operator hop-N", included: false },
  { label: "Webhooks & SLA", included: false },
];

const PRO_FEATURES = [
  { label: "4,000 credits / month", included: true },
  { label: "All FREE-class endpoints", included: true },
  { label: "Deep operator hop-N", included: true },
  { label: "Drain-trace: 50/day", included: true },
  { label: "AI search: 50/day", included: true },
  { label: "Dossier export: 10/month", included: true },
  { label: "Email support", included: true },
];

const B2B_FEATURES = [
  { label: "Unlimited credits", included: true },
  { label: "All Pro features", included: true },
  { label: "External-history (Nansen)", included: true },
  { label: "Webhooks (real-time alerts)", included: true },
  { label: "Custom SLA", included: true },
  { label: "Dedicated support channel", included: true },
  { label: "Volume discounts", included: true },
];

const FAQ_ITEMS = [
  {
    q: "Como funcionam credits?",
    a: "Cada endpoint consome um número fixo de credits. Endpoints FREE-class (stats, operator hop-1 preview) custam 1 credit. Endpoints pesados (drain-trace, AI search, external-history) custam mais. Free tier reseta 50 credits/dia. Pro inclui 4.000/mês. Top-ups são cumulativos e nunca expiram.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Pro é mensal sem fidelidade — cancele com 1 clique no dashboard. Credits comprados via top-up continuam válidos mesmo após cancelamento.",
  },
  {
    q: "Por que sem token próprio?",
    a: "SolSentry nunca terá token. Pagamento por uso, nada de speculation. Threat intelligence precisa ser previsível e auditável — token tokenomics introduz incentivos errados (pump cycles, holders ≠ users, governance capture). Preferimos USDC.",
  },
  {
    q: "Aceita crypto?",
    a: "Sim, USDC via x402 (Solana). Top-ups são liquidados on-chain em segundos — sem cartão, sem chargeback. Pro também aceita USDC mensal via wallet subscription.",
  },
  {
    q: "B2B mínimo?",
    a: "Contact sales para discutir volume e use case. Pricing é função de QPS, endpoints habilitados (webhooks, external-history), SLA e suporte. Tipicamente $1K-10K/mês para protocolos e wallets.",
  },
  {
    q: "Open-core, certo?",
    a: "Sim. MCP client (@solsentry/mcp) é MIT open-source. Core data e AI features ficam atrás do paywall — o que paga o desenvolvimento solo e o RPC pool de 23 endpoints.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main>
        {/* ───────────── HERO ───────────── */}
        <section style={{ padding: "80px 0 40px" }}>
          <div
            className="container"
            style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 12px",
                background: "var(--brand-amber-tint)",
                border: "1px solid var(--brand-amber-line)",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                color: "var(--brand-amber-400)",
                marginBottom: 24,
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              <span aria-hidden>●</span> Sem token próprio. Ever.
            </div>
            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 700,
                color: "var(--fg-1)",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Pricing simples ·{" "}
              <em
                style={{
                  color: "var(--brand-amber-400)",
                  fontStyle: "normal",
                }}
              >
                transparente
              </em>{" "}
              · sem token
            </h1>
            <p
              style={{
                marginTop: 20,
                fontSize: 18,
                color: "var(--fg-2)",
                lineHeight: 1.5,
              }}
            >
              Free para builders. Pro para power users. B2B para protocolos e
              wallets. Pague em USDC — sem cartão, sem token, sem surpresa.
            </p>
          </div>
        </section>

        {/* ───────────── TIERS ───────────── */}
        <section style={{ padding: "40px 0 60px" }}>
          <div
            className="container"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              maxWidth: 1080,
              margin: "0 auto",
            }}
          >
            <PricingCard
              tier="Free"
              price="$0"
              priceSuffix="/mês"
              description="Para builders, devs e curious users testando o stack."
              features={FREE_FEATURES}
              ctaLabel="Get started"
              ctaHref="/signup"
            />
            <PricingCard
              tier="Pro"
              price="$39.99"
              priceSuffix="/mês"
              description="Para power users, traders e analistas que precisam de profundidade."
              features={PRO_FEATURES}
              ctaLabel="Upgrade"
              ctaHref="/signup?tier=pro"
              highlighted
              badge="Most popular"
            />
            <PricingCard
              tier="B2B"
              price="Contact"
              priceSuffix="sales"
              description="Para protocolos, wallets, bots e exchanges. Volume + SLA + webhooks."
              features={B2B_FEATURES}
              ctaLabel="Contact sales"
              ctaHref="mailto:sales@solsentry.app"
            />
          </div>
        </section>

        {/* ───────────── CREDIT PACKS ───────────── */}
        <section style={{ padding: "40px 0", borderTop: "1px solid var(--border-soft)" }}>
          <div
            className="container"
            style={{ maxWidth: 1080, margin: "0 auto" }}
          >
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--fg-1)",
                  margin: 0,
                }}
              >
                Top-up credits anytime via wallet
              </h2>
              <p
                style={{
                  marginTop: 10,
                  fontSize: 15,
                  color: "var(--fg-2)",
                }}
              >
                Pague USDC via x402, credits liquidados on-chain em segundos.
                Não expiram.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 18,
                maxWidth: 800,
                margin: "0 auto",
              }}
            >
              <CreditPackCard price="$5" credits="500" />
              <CreditPackCard price="$20" credits="2,200" bonusPct={10} />
              <CreditPackCard price="$100" credits="11,500" bonusPct={15} />
            </div>
          </div>
        </section>

        {/* ───────────── FAQ ───────────── */}
        <section style={{ padding: "60px 0", borderTop: "1px solid var(--border-soft)" }}>
          <div
            className="container"
            style={{ maxWidth: 760, margin: "0 auto" }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "var(--fg-1)",
                margin: "0 0 24px",
                textAlign: "center",
              }}
            >
              Perguntas frequentes
            </h2>
            <PricingFAQ items={FAQ_ITEMS} />
          </div>
        </section>

        {/* ───────────── FOOTER CTA ───────────── */}
        <section style={{ padding: "60px 0 100px" }}>
          <div
            className="container"
            style={{
              textAlign: "center",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "var(--fg-1)",
                margin: 0,
              }}
            >
              Ready to start?
            </h2>
            <p style={{ marginTop: 10, color: "var(--fg-2)", fontSize: 15 }}>
              Sem token. Sem cartão. Sem cadastro longo.
            </p>
            <a
              href="/login"
              style={{
                display: "inline-block",
                marginTop: 20,
                padding: "14px 28px",
                background: "var(--brand-amber)",
                color: "var(--fg-on-brand)",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              Connect wallet to start →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
