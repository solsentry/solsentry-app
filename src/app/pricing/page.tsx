// /pricing — public pricing page.
// Live tiers and credit top-up packs from /v1/pricing.
// Spec: internal/marketing/strategy/WIREFRAME_v5.md §2.9

import { SiteTopbar } from "@/components/SiteTopbar";
import { Footer } from "@/components/Footer";
import { PricingCard } from "@/components/pricing/PricingCard";
import { CreditPackCard } from "@/components/pricing/CreditPackCard";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import {
  fetchPricing,
  type PricingCreditPack,
  type PricingPlan,
  type PricingResponse,
} from "@/lib/api";

export const revalidate = 300;

export const metadata = {
  title: "Pricing — SolSentry",
  description:
    "Pricing simples e transparente. Free tier, Pro e B2B. Pay-as-you-go credit packs via USDC (x402).",
  openGraph: {
    title: "SolSentry Pricing",
    description: "Free · Pro · B2B contact. Pay-as-you-go credit packs via USDC.",
    images: ["/og/og-default.png"],
  },
};

const FAQ_ITEMS = [
  {
    q: "Como funcionam credits?",
    a: "Cada endpoint pode consumir uma quantidade diferente de credits. Os limites e top-ups exibidos nesta página vêm do endpoint público /v1/pricing.",
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
    a: "Contact sales para discutir volume, endpoints habilitados, SLA e suporte.",
  },
  {
    q: "Open-core, certo?",
    a: "Sim. MCP client (@solsentry/mcp) é MIT open-source. Core data e AI features ficam atrás do paywall, sustentando o desenvolvimento e a infraestrutura.",
  },
];

function findPlan(
  pricing: PricingResponse | null,
  key: "free" | "pro" | "b2b",
): PricingPlan | null {
  // Live /v1/pricing serves `tiers` as an object keyed by free/pro/b2b.
  const tiers = pricing?.tiers;
  if (tiers && !Array.isArray(tiers)) {
    const fromTiers = key === "b2b" ? (tiers.b2b ?? tiers.enterprise) : tiers[key];
    if (fromTiers) return fromTiers;
  }

  // Defensive: tolerate top-level keys (alternate shape).
  const direct =
    key === "b2b" ? (pricing?.b2b ?? pricing?.enterprise) : (pricing?.[key] as PricingPlan | null);
  if (direct) return direct;

  // Defensive: tolerate an array of plans (alternate shape).
  const plans = pricing?.plans ?? (Array.isArray(tiers) ? tiers : []);
  return (
    plans.find((plan) => {
      const identifier = `${plan.id ?? ""} ${plan.slug ?? ""} ${plan.name ?? ""}`.toLowerCase();
      return key === "b2b"
        ? identifier.includes("b2b") || identifier.includes("enterprise")
        : identifier.includes(key);
    }) ?? null
  );
}

function numericValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function formatCount(value: unknown): string {
  const number = numericValue(value);
  return number === null ? "—" : number.toLocaleString("en-US");
}

function formatMoney(value: unknown, currency = "USD"): string {
  const number = numericValue(value);
  if (number === null) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: number % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(number);
  } catch {
    return `${number.toLocaleString("en-US")} ${currency.toUpperCase()}`;
  }
}

function limit(plan: PricingPlan | null, key: string, direct: unknown): unknown {
  return direct ?? plan?.limits?.[key];
}

function formatCountOrUnlimited(value: unknown): string {
  const number = numericValue(value);
  if (number === -1) return "Unlimited";
  return formatCount(value);
}

function planFeatures(plan: PricingPlan | null, cadence: "day" | "month") {
  const features: { label: string; included: boolean }[] = [];

  // Live tiers carry credits_per_period + period; fall back to the
  // per-day/per-month aliases only when the canonical field is absent.
  const periodicCredits =
    plan?.credits_per_period ?? (cadence === "day" ? plan?.credits_per_day : plan?.credits_per_month);
  if (periodicCredits !== null && periodicCredits !== undefined) {
    const creditCadence = plan?.period ?? cadence;
    features.push({
      label: `Credits / ${creditCadence}: ${formatCountOrUnlimited(periodicCredits)}`,
      included: true,
    });
  }

  // Structured per-limit rows — only render when the value is actually
  // present in the payload (live tiers omit them; their `features` strings
  // already carry the human-readable limits).
  const structured: Array<[string, string, unknown]> = [
    ["Drain-trace / day", "drain_trace_per_day", plan?.drain_trace_per_day],
    ["AI search / day", "ai_search_per_day", plan?.ai_search_per_day],
    ["Dossier exports / month", "dossier_exports_per_month", plan?.dossier_exports_per_month],
  ];
  for (const [label, key, direct] of structured) {
    const value = limit(plan, key, direct);
    if (value !== null && value !== undefined) {
      features.push({ label: `${label}: ${formatCountOrUnlimited(value)}`, included: true });
    }
  }

  for (const feature of plan?.features ?? []) {
    if (feature.trim()) features.push({ label: feature, included: true });
  }
  return features;
}

function planPrice(plan: PricingPlan | null, fallback: "—" | "Contact" = "—"): string {
  if (!plan) return fallback;
  const value =
    plan.price_usd_monthly ??
    plan.monthly_price_usd ??
    plan.monthly_price ??
    plan.price_usd ??
    plan.price;
  return value === null || value === undefined
    ? fallback
    : formatMoney(value, plan.currency ?? "USD");
}

// Billing cadence for the price suffix. Live tiers bill monthly; `period`
// on the tier describes credit refresh cadence, not billing, so we only
// surface "/mo" when there is an actual positive monthly price.
function priceSuffix(plan: PricingPlan | null): string | undefined {
  if (!plan) return undefined;
  if (plan.interval) return plan.interval;
  const monthly = numericValue(plan.price_usd_monthly ?? plan.monthly_price_usd);
  return monthly && monthly > 0 ? "/mo" : undefined;
}

function creditPacks(pricing: PricingResponse | null): PricingCreditPack[] {
  return pricing?.credit_packs ?? pricing?.packs ?? pricing?.topups ?? [];
}

export default async function PricingPage() {
  const pricing = await fetchPricing();
  const free = findPlan(pricing, "free");
  const pro = findPlan(pricing, "pro");
  const b2b = findPlan(pricing, "b2b");
  const packs = creditPacks(pricing);

  return (
    <>
      <SiteTopbar />
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
              Free para builders. Pro para power users. B2B para protocolos e wallets. Pague em USDC
              — sem cartão, sem token, sem surpresa.
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
              tier={free?.name || "Free"}
              price={planPrice(free)}
              priceSuffix={priceSuffix(free)}
              description={free?.description || "Para builders, devs e curious users testando o stack."}
              features={planFeatures(free, "day")}
              ctaLabel="Get started"
              ctaHref="/login"
            />
            <PricingCard
              tier={pro?.name || "Pro"}
              price={planPrice(pro)}
              priceSuffix={priceSuffix(pro)}
              description={pro?.description || "Para power users, traders e analistas que precisam de profundidade."}
              features={planFeatures(pro, "month")}
              ctaLabel="Upgrade"
              ctaHref="/login"
              highlighted
              badge="Most popular"
            />
            <PricingCard
              tier={b2b?.name || "B2B"}
              price={planPrice(b2b, "Contact")}
              priceSuffix={priceSuffix(b2b)}
              description={b2b?.description || "Para protocolos, wallets, bots e exchanges. Volume + SLA + webhooks."}
              features={planFeatures(b2b, "month")}
              ctaLabel="Contact sales"
              ctaHref="mailto:sales@solsentry.app"
            />
          </div>
        </section>

        {/* ───────────── CREDIT PACKS ───────────── */}
        <section style={{ padding: "40px 0", borderTop: "1px solid var(--border-soft)" }}>
          <div className="container" style={{ maxWidth: 1080, margin: "0 auto" }}>
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
                Pague USDC via x402, credits liquidados on-chain em segundos. Não expiram.
              </p>
            </div>
            {packs.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 18,
                  maxWidth: 800,
                  margin: "0 auto",
                }}
              >
                {packs.map((pack, index) => (
                  <CreditPackCard
                    key={pack.id ?? pack.name ?? index}
                    price={formatMoney(
                      pack.price_usd ?? pack.amount_usd ?? pack.price,
                      pack.currency ?? "USD",
                    )}
                    credits={formatCount(pack.credits)}
                    bonusPct={numericValue(pack.bonus_pct) ?? undefined}
                  />
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "var(--fg-3)", margin: 0 }}>
                Credit pack pricing is currently unavailable.
              </p>
            )}
          </div>
        </section>

        {/* ───────────── FAQ ───────────── */}
        <section style={{ padding: "60px 0", borderTop: "1px solid var(--border-soft)" }}>
          <div className="container" style={{ maxWidth: 760, margin: "0 auto" }}>
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
